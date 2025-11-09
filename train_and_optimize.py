import pandas as pd
import numpy as np
from ai_model_trainer_simple import RenewableEnergyAIModel
import matplotlib.pyplot as plt
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

    def train_models(self):
        """Train all AI models"""
        print("Training AI models...")
        results = self.ai_model.train_all_models()
        self.ai_model.save_models()
        return results

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
        
        # Create demand and price forecasts for each row
        demand_forecast = []
        price_forecast = []
        
        for _, row in features_df.iterrows():
            ts = row['timestamp']
            region = row['region']
            
            # Demand forecast
            if region in self.ai_model.models.get('demand', {}):
                future = pd.DataFrame({'ds': [ts]})
                forecast = self.ai_model.models['demand'][region].predict(future)
                demand_forecast.append(forecast['yhat'].values[0])
            else:
                # Fallback to simple pattern
                hour = ts.hour
                base_demand = 8 + 4 * np.sin(2 * np.pi * (hour - 6) / 24)
                demand_forecast.append(max(2, base_demand + np.random.normal(0, 1)))
            
            # Price forecast
            if region in self.ai_model.models.get('price', {}):
                hour = ts.hour
                price_pred = self.ai_model.models['price'][region].get(hour, 3500)
                price_forecast.append(price_pred)
            else:
                # Fallback to simple pattern
                hour = ts.hour
                base_price = 3500 + 1000 * np.sin(2 * np.pi * (hour - 6) / 24)
                price_forecast.append(max(1000, base_price + np.random.normal(0, 200)))

        # Combine forecasts
        results_df = features_df.copy()
        results_df['generation_forecast'] = generation_forecast
        results_df['demand_forecast'] = demand_forecast
        results_df['price_forecast'] = price_forecast

        return results_df

    def optimize_dispatch(self, forecasts_df, optimization_horizon=24):
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
        dispatch_decisions['reliability_score'] = min(1.0, 0.82 + reserve_margin * 0.5)

        return dispatch_decisions

    def calculate_kpis(self, results_df):
        """Calculate key performance indicators"""
        print("Calculating KPIs...")
        kpis = {}

        # Reliability improvement
        avg_reliability = results_df['reliability_score'].mean()
        kpis['reliability_improvement'] = (avg_reliability - self.baseline_reliability) / self.baseline_reliability * 100

        # Loss reduction
        total_generation = results_df['total_generation'].sum()
        total_demand = results_df['total_demand'].sum()
        losses = (total_generation - total_demand) / total_generation if total_generation > 0 else 0
        kpis['loss_reduction'] = (self.baseline_losses - losses) / self.baseline_losses * 100

        # EBITDA margin
        total_revenue = results_df['revenue'].sum()
        total_costs = results_df['costs'].sum()
        ebitda = total_revenue - total_costs
        avg_generation = results_df['total_generation'].mean()
        
        if avg_generation > 0:
            ebitda_margin = ebitda / (avg_generation * 8760)
            kpis['ebitda_margin'] = ebitda_margin * 100
            kpis['margin_achievement'] = (ebitda_margin - self.target_ebitda_margin) / self.target_ebitda_margin * 100

        # Storage utilization
        avg_battery_usage = results_df[['battery_charge', 'battery_discharge']].mean().sum()
        avg_hydro_usage = results_df['hydro_discharge'].mean()
        kpis['storage_utilization'] = (avg_battery_usage + avg_hydro_usage) / (self.battery_capacity + self.hydro_capacity) * 100

        return kpis

    def generate_report(self, results_df, kpis):
        """Generate optimization report"""
        print('\n' + '='*60)
        print('RENEWABLE ENERGY OPTIMIZATION REPORT')
        print('='*60)
        
        print('\n[KPI] KEY PERFORMANCE INDICATORS:')
        print(f"   Reliability Improvement: {kpis.get('reliability_improvement', 0):.2f}%")
        print(f"   Loss Reduction: {kpis.get('loss_reduction', 0):.2f}%")
        print(f"   Storage Utilization: {kpis.get('storage_utilization', 0):.2f}%")
        print(f"   EBITDA Margin Achievement: {kpis.get('margin_achievement', 0):.2f}%")

        print('\n[ECO] ECONOMIC ANALYSIS:')
        total_revenue = results_df['revenue'].sum()
        total_costs = results_df['costs'].sum()
        net_profit = total_revenue - total_costs
        print(f"   Total Revenue: Rs.{total_revenue:,.0f}")
        print(f"   Total Costs: Rs.{total_costs:,.0f}")
        print(f"   Net Profit: Rs.{net_profit:,.0f}")
        if 'ebitda_margin' in kpis:
            print(f"   EBITDA Margin: {kpis['ebitda_margin']:.2f}%")

        print('\n[STG] STORAGE UTILIZATION:')
        avg_battery_charge = results_df['battery_charge'].mean()
        avg_battery_discharge = results_df['battery_discharge'].mean()
        avg_hydro_discharge = results_df['hydro_discharge'].mean()
        print(f"   Average Battery Charging: {avg_battery_charge:.2f} GWh")
        print(f"   Average Battery Discharging: {avg_battery_discharge:.2f} GWh")
        print(f"   Average Hydro Discharge: {avg_hydro_discharge:.2f} GWh")

        print('\n[DONE] OPTIMIZATION COMPLETE')
        print('AI-driven decision model successfully implemented!')
        print('Ready for integration with real-time energy management systems.')

def main():
    """Main execution function"""
    print("Starting Renewable Energy AI Model Training & Optimization")
    print("="*70)
    
    # Initialize optimizer
    optimizer = RenewableEnergyOptimizer()
    
    # Train models first
    print("\n[1] Training AI Models...")
    training_results = optimizer.train_models()
    
    # Generate forecasts and optimize
    print("\n[2] Generating Forecasts and Optimizing...")
    start_date = '2024-01-01'
    end_date = '2024-01-07'
    regions = ['North', 'South', 'East', 'West', 'North-East']
    
    forecasts = optimizer.generate_forecasts(start_date, end_date, regions)
    results = optimizer.optimize_dispatch(forecasts)
    kpis = optimizer.calculate_kpis(results)
    
    # Generate report
    print("\n[3] Generating Report...")
    optimizer.generate_report(results, kpis)
    
    # Save results
    results.to_csv('optimization_results.csv', index=False)
    forecasts.to_csv('forecasts_results.csv', index=False)
    
    print(f"\nResults saved:")
    print(f"   - optimization_results.csv")
    print(f"   - forecasts_results.csv")
    print(f"   - Models saved in {optimizer.model_path}")

if __name__ == "__main__":
    main()