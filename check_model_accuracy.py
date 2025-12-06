import pandas as pd
import numpy as np
from ai_model_trainer_simple import RenewableEnergyAIModel
import joblib
import xgboost as xgb
from sklearn.metrics import mean_absolute_percentage_error, mean_squared_error

def check_model_accuracy():
    """Check the accuracy of the trained models"""
    print("Checking trained model accuracy...")
    
    # Load the trained model
    ai_model = RenewableEnergyAIModel()
    
    # Load the saved models
    try:
        ai_model.models['generation'] = xgb.XGBRegressor()
        ai_model.models['generation'].load_model('models/generation_model.json')
        ai_model.scalers['generation'] = joblib.load('models/generation_scaler.pkl')
        ai_model.encoders['region'] = joblib.load('models/region_encoder.pkl')
        print("Models loaded successfully!")
    except Exception as e:
        print(f"Error loading models: {e}")
        return
    
    # Test with a small sample of data
    sample_data = ai_model.df.head(1000)  # Use first 1000 rows for testing
    
    # Prepare features for generation model
    features = ['hour', 'month', 'weekday', 'temperature', 'wind_speed',
               'solar_irradiance', 'humidity', 'region_encoded']
    
    gen_data = sample_data.dropna(subset=['generation'] + features).copy()
    if len(gen_data) > 0:
        X = gen_data[features]
        y_true = gen_data['generation']
        
        # Clean data: replace inf/nan values
        X = X.replace([np.inf, -np.inf], np.nan)
        X = X.fillna(X.mean())
        
        # Scale and predict
        X_scaled = ai_model.scalers['generation'].transform(X)
        y_pred = ai_model.models['generation'].predict(X_scaled)
        
        # Calculate accuracy metrics
        mape = mean_absolute_percentage_error(y_true, y_pred)
        rmse = np.sqrt(mean_squared_error(y_true, y_pred))
        
        print(f"\nGeneration Model Accuracy:")
        print(f"  MAPE: {mape:.4f} ({mape*100:.2f}%)")
        print(f"  RMSE: {rmse:.4f}")
        
        # Show some sample predictions
        print(f"\nSample Predictions:")
        for i in range(min(5, len(y_true))):
            print(f"  Actual: {y_true.iloc[i]:.3f}, Predicted: {y_pred[i]:.3f}")
    else:
        print("No valid data for generation model testing")
    
    # Test demand model
    print(f"\nDemand Model Accuracy:")
    print(f"  Using statistical model with assumed MAPE: 15%")
    
    # Test price model
    print(f"\nPrice Model Accuracy:")
    print(f"  Using statistical model with assumed MAPE: 29%")

if __name__ == "__main__":
    check_model_accuracy()