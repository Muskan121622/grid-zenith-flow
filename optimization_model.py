import pandas as pd
import numpy as np
from ai_model_trainer_simple import RenewableEnergyAIModel
import matplotlib.pyplot as plt
import seaborn as sns
import warnings
warnings.filterwarnings('ignore')

class RenewableEnergyOptimizer:
    def __init__(self, model_path='models/'):
        self.ai_model = RenewableEnergyAIModel()
        self.model_path = model_path

        # System parameters
        self.total_capacity = 12  # GW
        self.wind_capacity = 7.2  # GW (60%)
        self.solar_capacity = 4.8  # GW (40%)
        self.battery_capacity = 1  # GWh
        self.hydro_capacity = 2  # GWh
        self.reserve_requirement = 0.05  # 5%
        self.efficiency_battery = 0.88
        self.efficiency_hydro = 0.80

        # Economic parameters
        self.target_ebitda_margin = 0.15
        self.baseline_reliability = 0.82
        self.target_reliability = 0.94
        self.baseline_losses = 0.11
        self.target_losses = 0.088

    def load_trained_models(self):
        """Load pre-trained AI models"""
        try:
            import joblib
            import xgboost as xgb

            # Load XGBoost generation model
            self.ai_model.models['generation'] = xgb.XGBRegressor()
            self.ai_model.models['generation'].load_model(f'{self.model_path}generation_model.json')

            # Load scalers
            self.ai_model.scalers['generation'] = joblib.load(f'{self.model_path}generation_scaler.pkl')
            self.ai_model.encoders['region'] = joblib.load(f'{self.model_path}region_encoder.pkl')

            print("AI models loaded successfully")
            return True
        except Exception as e:
            print(f"Error loading models: {e}")
            return False

    def generate_forecasts(self, start_date, end_date, regions):
        """Generate forecasts for the optimization period"""
        print(f"Generating forecasts from {start_date} to {end_date}")

        # Create timestamps
        timestamps = pd.date_range(start_date, end_date, freq='H')

        # Create feature DataFrame for forecasting
        forecast_data = []
        for ts in timestamps:
            for region in regions:
                forecast_data.append({
                    'timestamp': ts,
                    'region': region,
                    'hour': ts.hour,
                    'month': ts.month,
                    'weekday': ts.weekday(),
                    'temperature': 25 + 10 * np.sin(2 * np.pi * ts.dayofyear / 365) + np.random.normal(0, 3),
                    'wind_speed': max(0, 5 + 3 * np.sin(2 * np.pi * ts.hour / 24) + np.random.normal(0, 1.5)),
                    'solar_irradiance': max(0, 600 * max(0, np.sin(np.pi * ts.hour / 12)) + np.random.normal(0, 50)),
                    'humidity': 60 + 20 * np.sin(2 * np.pi * ts.dayofyear / 365) + np.random.normal(0, 5)
                })

        features_df = pd.DataFrame(forecast_data)
        features_df['region_encoded'] = self.ai_model.encoders['region'].transform(features_df['region'])

        # Generate forecasts
        generation_forecast = self.ai_model.forecast_generation(features_df)
        demand_forecast = self.ai_model.forecast_demand(timestamps, features_df['region'])
        price_forecast = self.ai_model.forecast_price(timestamps, features_df['region'])

        # Combine forecasts
        results_df = features_df.copy()
        results_df['generation_forecast'] = generation_forecast
        results_df['demand_forecast'] = demand_forecast
        results_df['price_forecast'] = price_forecast

        return results_df

    def optimize_dispatch(self, forecasts_df):
        """Optimize energy dispatch using MPC approach"""
        print("Running optimization...")

        # Group by timestamp for optimization
        time_groups = forecasts_df.groupby('timestamp')
        optimization_results = []

        for timestamp, group in time_groups:
            # Aggregate across regions for simplicity
            total_generation = group['generation_forecast'].sum()
            total_demand = group['demand_forecast'].sum()
            avg_price = group['price_forecast'].mean()

            # Current storage state (simplified)
            battery_soc = 50  # Starting SoC
            hydro_soc = 60   # Starting SoC

            # Optimization for this hour
            result = self._optimize_single_hour(
                total_generation, total_demand, avg_price,
                battery_soc, hydro_soc, timestamp
            )

            optimization_results.append(result)

        results_df = pd.DataFrame(optimization_results)
        return results_df

    def _optimize_single_hour(self, generation, demand, price, battery_soc, hydro_soc, timestamp):
        """Optimize dispatch for a single hour"""
        # Calculate net demand
        net_demand = demand - generation

        # Initialize decision variables
        dispatch_decisions = {
            'timestamp': timestamp,
            'total_generation': generation,
            'total_demand': demand,
            'net_demand': net_demand,
            'price': price,
            'battery_charge': 0,
            'battery_discharge': 0,
            'hydro_discharge': 0,
            'grid_import': 0,
            'grid_export': 0,
            'final_soc_battery': battery_soc,
            'final_soc_hydro': hydro_soc,
            'revenue': 0,
            'costs': 0,
            'reliability_score': 0.94
        }

        # Price-based storage strategy
        if price > 4500:  # High price - discharge storage
            max_discharge_battery = min(battery_soc * 0.1, 0.5)
            dispatch_decisions['battery_discharge'] = max_discharge_battery

            if net_demand > max_discharge_battery:
                max_discharge_hydro = min(hydro_soc * 0.15, net_demand - max_discharge_battery)
                dispatch_decisions['hydro_discharge'] = max_discharge_hydro

            excess = generation + max_discharge_battery + max_discharge_hydro - demand
            if excess > 0:
                dispatch_decisions['grid_export'] = excess

        elif price < 3000:  # Low price - charge storage
            max_charge_battery = min((100 - battery_soc) * 0.1, 0.5)
            dispatch_decisions['battery_charge'] = max_charge_battery

            excess = generation - demand
            if excess > 0:
                actual_charge = min(excess, max_charge_battery)
                dispatch_decisions['battery_charge'] = actual_charge

        else:  # Normal price - balance supply and demand
            if net_demand > 0:  # Deficit
                storage_available = battery_soc * 0.1 + hydro_soc * 0.15
                storage_used = min(storage_available, net_demand * 0.5)

                dispatch_decisions['battery_discharge'] = min(battery_soc * 0.1, storage_used * 0.6)
                dispatch_decisions['hydro_discharge'] = min(hydro_soc * 0.15, storage_used * 0.4)

                remaining_deficit = net_demand - dispatch_decisions['battery_discharge'] - dispatch_decisions['hydro_discharge']
                dispatch_decisions['grid_import'] = max(0, remaining_deficit)

            else:  # Surplus
                surplus = -net_demand
                max_charge = min((100 - battery_soc) * 0.1, surplus * 0.7)
                dispatch_decisions['battery_charge'] = max_charge
                dispatch_decisions['grid_export'] = surplus - max_charge

        # Update SoC
        dispatch_decisions['final_soc_battery'] = battery_soc + dispatch_decisions['battery_charge'] - dispatch_decisions['battery_discharge']
        dispatch_decisions['final_soc_hydro'] = hydro_soc - dispatch_decisions['hydro_discharge']

        # Calculate economics
        dispatch_decisions['revenue'] = dispatch_decisions['grid_export'] * price
        dispatch_decisions['costs'] = dispatch_decisions['grid_import'] * price * 1.1

        # Calculate reliability
        total_supply = (generation + dispatch_decisions['battery_discharge'] + 
                       dispatch_decisions['hydro_discharge'] + dispatch_decisions['grid_import'])
        reserve_margin = (total_supply - demand) / demand if demand > 0 else 0
        dispatch_decisions['reliability_score'] = min(0.99, 0.85 + reserve_margin * 0.1)

        return dispatch_decisions

    def run_optimization(self, start_date='2024-01-01', end_date='2024-01-02', regions=['North', 'South']):
        """Run complete optimization workflow"""
        print(f"Running optimization from {start_date} to {end_date}")
        
        # Load trained models
        if not self.load_trained_models():
            print("Training models first...")
            self.ai_model.train_all_models()
            self.ai_model.save_models()
            self.load_trained_models()
        
        # Generate forecasts
        forecasts = self.generate_forecasts(start_date, end_date, regions)
        
        # Run optimization
        results = self.optimize_dispatch(forecasts)
        
        # Calculate summary metrics
        summary = self.calculate_summary_metrics(results)
        
        return results, summary
    
    def calculate_summary_metrics(self, results_df):
        """Calculate optimization summary metrics"""
        summary = {
            'total_revenue': results_df['revenue'].sum(),
            'total_costs': results_df['costs'].sum(),
            'net_profit': results_df['revenue'].sum() - results_df['costs'].sum(),
            'avg_reliability': results_df['reliability_score'].mean(),
            'total_battery_cycles': (results_df['battery_charge'].sum() + results_df['battery_discharge'].sum()) / 2,
            'grid_import_total': results_df['grid_import'].sum(),
            'grid_export_total': results_df['grid_export'].sum()
        }
        return summary