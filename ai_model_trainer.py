import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.metrics import mean_absolute_percentage_error, mean_squared_error
import xgboost as xgb
from prophet import Prophet
import tensorflow as tf
from tensorflow import keras
from tensorflow.keras import layers
import matplotlib.pyplot as plt
import seaborn as sns
import warnings
warnings.filterwarnings('ignore')

class RenewableEnergyAIModel:
    def __init__(self, data_path='renewable_5yr_hourly.csv'):
        self.data_path = data_path
        self.models = {}
        self.scalers = {}
        self.encoders = {}
        self.load_and_preprocess_data()

    def load_and_preprocess_data(self):
        """Load and preprocess the dataset"""
        print("Loading dataset...")
        self.df = pd.read_csv(self.data_path)
        self.df['timestamp'] = pd.to_datetime(self.df['timestamp'])

        # Create additional time features
        self.df['hour'] = self.df['timestamp'].dt.hour
        self.df['day_of_year'] = self.df['timestamp'].dt.dayofyear
        self.df['month'] = self.df['timestamp'].dt.month
        self.df['weekday'] = self.df['timestamp'].dt.weekday

        # Encode region
        self.encoders['region'] = LabelEncoder()
        self.df['region_encoded'] = self.encoders['region'].fit_transform(self.df['region'])

        print(f"Dataset loaded: {self.df.shape}")
        print(f"Date range: {self.df['timestamp'].min()} to {self.df['timestamp'].max()}")
        print(f"Regions: {self.df['region'].unique()}")

    def create_sequences(self, data, seq_length=24):
        """Create sequences for LSTM input"""
        X, y = [], []
        for i in range(len(data) - seq_length):
            X.append(data[i:i+seq_length])
            y.append(data[i+seq_length])
        return np.array(X), np.array(y)

    def train_generation_forecast_model(self):
        """Train XGBoost model for renewable generation forecasting"""
        print("\nTraining Generation Forecast Model (XGBoost)...")

        # Features for generation forecasting
        features = ['hour', 'month', 'weekday', 'temperature', 'wind_speed',
                   'solar_irradiance', 'humidity', 'region_encoded']

        # Prepare data
        gen_data = self.df.dropna(subset=['generation'] + features).copy()
        X = gen_data[features]
        y = gen_data['generation']

        # Split data
        X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

        # Scale features
        self.scalers['generation'] = StandardScaler()
        X_train_scaled = self.scalers['generation'].fit_transform(X_train)
        X_test_scaled = self.scalers['generation'].transform(X_test)

        # Train XGBoost model
        self.models['generation'] = xgb.XGBRegressor(
            n_estimators=100,
            max_depth=6,
            learning_rate=0.1,
            random_state=42
        )
        self.models['generation'].fit(X_train_scaled, y_train)

        # Evaluate
        y_pred = self.models['generation'].predict(X_test_scaled)
        mape = mean_absolute_percentage_error(y_test, y_pred)
        rmse = np.sqrt(mean_squared_error(y_test, y_pred))

        print(".2f")
        print(".2f")

        return mape, rmse

    def train_demand_forecast_model(self):
        """Train Prophet model for demand forecasting"""
        print("\nTraining Demand Forecast Model (Prophet)...")

        # Prepare data for Prophet (needs 'ds' and 'y' columns)
        demand_data = self.df[['timestamp', 'demand', 'region']].dropna()

        # Group by region and train separate models
        self.models['demand'] = {}

        total_mape = 0
        region_count = 0

        for region in demand_data['region'].unique():
            region_data = demand_data[demand_data['region'] == region].copy()
            region_data = region_data.rename(columns={'timestamp': 'ds', 'demand': 'y'})
            region_data = region_data[['ds', 'y']]

            # Split data
            train_size = int(len(region_data) * 0.8)
            train_data = region_data[:train_size]

            # Train Prophet model
            model = Prophet(
                yearly_seasonality=True,
                weekly_seasonality=True,
                daily_seasonality=True,
                seasonality_mode='multiplicative'
            )
            model.fit(train_data)

            self.models['demand'][region] = model

            # Evaluate
            test_data = region_data[train_size:]
            forecast = model.predict(test_data[['ds']])
            mape = mean_absolute_percentage_error(test_data['y'], forecast['yhat'])
            total_mape += mape
            region_count += 1

        avg_mape = total_mape / region_count
        print(".2f")

        return avg_mape

    def train_price_forecast_model(self):
        """Train LSTM model for price forecasting"""
        print("\nTraining Price Forecast Model (LSTM)...")

        # Prepare data
        price_data = self.df[['timestamp', 'price', 'hour', 'month', 'weekday']].dropna()
        price_values = price_data['price'].values.reshape(-1, 1)

        # Scale data
        self.scalers['price'] = StandardScaler()
        price_scaled = self.scalers['price'].fit_transform(price_values)

        # Create sequences
        seq_length = 24  # 24 hours
        X, y = self.create_sequences(price_scaled, seq_length)

        # Split data
        train_size = int(len(X) * 0.8)
        X_train, X_test = X[:train_size], X[train_size:]
        y_train, y_test = y[:train_size], y[train_size:]

        # Build LSTM model
        model = keras.Sequential([
            layers.LSTM(50, activation='relu', input_shape=(seq_length, 1), return_sequences=True),
            layers.Dropout(0.2),
            layers.LSTM(50, activation='relu'),
            layers.Dropout(0.2),
            layers.Dense(1)
        ])

        model.compile(optimizer='adam', loss='mse')
        self.models['price'] = model

        # Train model
        history = model.fit(
            X_train, y_train,
            epochs=20,
            batch_size=32,
            validation_split=0.2,
            verbose=1
        )

        # Evaluate
        y_pred_scaled = model.predict(X_test)
        y_pred = self.scalers['price'].inverse_transform(y_pred_scaled)
        y_test_actual = self.scalers['price'].inverse_transform(y_test)

        mape = mean_absolute_percentage_error(y_test_actual, y_pred)
        rmse = np.sqrt(mean_squared_error(y_test_actual, y_pred))

        print(".2f")
        print(".2f")

        return mape, rmse, history

    def train_all_models(self):
        """Train all forecasting models"""
        print("Starting AI Model Training Pipeline...")

        results = {}

        # Train generation forecast
        results['generation'] = self.train_generation_forecast_model()

        # Train demand forecast
        results['demand'] = self.train_demand_forecast_model()

        # Train price forecast
        results['price'] = self.train_price_forecast_model()

        print("\n" + "="*50)
        print("MODEL TRAINING COMPLETE")
        print("="*50)
        print(".2f")
        print(".2f")
        print(".2f")

        return results

    def forecast_generation(self, features_df):
        """Generate renewable generation forecasts"""
        if 'generation' not in self.models:
            raise ValueError("Generation model not trained")

        # Prepare features
        feature_cols = ['hour', 'month', 'weekday', 'temperature', 'wind_speed',
                       'solar_irradiance', 'humidity', 'region_encoded']
        X = features_df[feature_cols]

        # Scale and predict
        X_scaled = self.scalers['generation'].transform(X)
        predictions = self.models['generation'].predict(X_scaled)

        return predictions

    def forecast_demand(self, timestamps, regions):
        """Generate demand forecasts using Prophet"""
        if 'demand' not in self.models:
            raise ValueError("Demand model not trained")

        predictions = []

        for ts, region in zip(timestamps, regions):
            if region in self.models['demand']:
                future = pd.DataFrame({'ds': [ts]})
                forecast = self.models['demand'][region].predict(future)
                predictions.append(forecast['yhat'].values[0])
            else:
                predictions.append(np.nan)

        return np.array(predictions)

    def forecast_price(self, historical_prices, steps=24):
        """Generate price forecasts using LSTM"""
        if 'price' not in self.models:
            raise ValueError("Price model not trained")

        # Scale historical data
        prices_scaled = self.scalers['price'].transform(historical_prices.reshape(-1, 1))

        # Create sequence for prediction
        seq_length = 24
        if len(prices_scaled) < seq_length:
            # Pad with last value if needed
            pad_length = seq_length - len(prices_scaled)
            pad_values = np.repeat(prices_scaled[0], pad_length).reshape(-1, 1)
            prices_scaled = np.vstack([pad_values, prices_scaled])

        input_seq = prices_scaled[-seq_length:].reshape(1, seq_length, 1)

        # Predict next steps
        predictions = []
        current_seq = input_seq.copy()

        for _ in range(steps):
            pred = self.models['price'].predict(current_seq, verbose=0)
            predictions.append(pred[0, 0])

            # Update sequence
            current_seq = np.roll(current_seq, -1, axis=1)
            current_seq[0, -1, 0] = pred[0, 0]

        # Inverse transform
        predictions = np.array(predictions).reshape(-1, 1)
        predictions_actual = self.scalers['price'].inverse_transform(predictions)

        return predictions_actual.flatten()

    def save_models(self, path='models/'):
        """Save trained models"""
        import os
        os.makedirs(path, exist_ok=True)

        # Save XGBoost model
        if 'generation' in self.models:
            self.models['generation'].save_model(f'{path}generation_model.json')

        # Save scalers and encoders
        import joblib
        for name, scaler in self.scalers.items():
            joblib.dump(scaler, f'{path}{name}_scaler.pkl')

        for name, encoder in self.encoders.items():
            joblib.dump(encoder, f'{path}{name}_encoder.pkl')

        print(f"Models saved to {path}")

    def plot_forecasts(self, save_path='forecast_plots/'):
        """Generate forecast visualization plots"""
        import os
        os.makedirs(save_path, exist_ok=True)

        # Sample data for plotting
        sample_data = self.df.head(168)  # One week

        plt.figure(figsize=(15, 10))

        # Generation forecast
        plt.subplot(2, 2, 1)
        plt.plot(sample_data['timestamp'], sample_data['generation'], label='Actual', alpha=0.7)
        plt.title('Renewable Generation Forecast')
        plt.xlabel('Time')
        plt.ylabel('Generation (GW)')
        plt.xticks(rotation=45)
        plt.legend()

        # Demand forecast
        plt.subplot(2, 2, 2)
        plt.plot(sample_data['timestamp'], sample_data['demand'], label='Actual', alpha=0.7)
        plt.title('Demand Forecast')
        plt.xlabel('Time')
        plt.ylabel('Demand (GW)')
        plt.xticks(rotation=45)
        plt.legend()

        # Price forecast
        plt.subplot(2, 2, 3)
        plt.plot(sample_data['timestamp'], sample_data['price'], label='Actual', alpha=0.7)
        plt.title('Price Forecast')
        plt.xlabel('Time')
        plt.ylabel('Price (INR/MWh)')
        plt.xticks(rotation=45)
        plt.legend()

        # Storage SoC
        plt.subplot(2, 2, 4)
        plt.plot(sample_data['timestamp'], sample_data['storage_soc'], label='Storage SoC', alpha=0.7)
        plt.title('Storage State of Charge')
        plt.xlabel('Time')
        plt.ylabel('SoC (%)')
        plt.xticks(rotation=45)
        plt.legend()

        plt.tight_layout()
        plt.savefig(f'{save_path}forecast_overview.png', dpi=300, bbox_inches='tight')
        plt.show()

        print(f"Plots saved to {save_path}")

if __name__ == "__main__":
    # Install required packages if not available
    try:
        import xgboost
        import prophet
    except ImportError:
        print("Installing required packages...")
        import subprocess
        subprocess.check_call(['pip', 'install', 'xgboost', 'prophet', 'tensorflow', 'matplotlib', 'seaborn', 'joblib'])

    # Train the AI models
    ai_model = RenewableEnergyAIModel()
    results = ai_model.train_all_models()

    # Save models
    ai_model.save_models()

    # Generate plots
    ai_model.plot_forecasts()

    print("\nAI Model training and evaluation complete!")
    print("Models saved and ready for integration with optimization framework.")
