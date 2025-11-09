import pandas as pd
import numpy as np
import os
from glob import glob
import warnings
warnings.filterwarnings('ignore')

class NLDCDataProcessor:
    def __init__(self, data_folder='public'):
        self.data_folder = data_folder
        self.processed_data = {}
        
    def process_nldc_files(self):
        """Process NLDC files from the public folder"""
        print("Processing NLDC data files...")
        
        # Get all NLDC files
        nldc_files = glob(os.path.join(self.data_folder, "*NLDC*.pdf"))
        xls_files = glob(os.path.join(self.data_folder, "*.xls"))
        xlsx_files = glob(os.path.join(self.data_folder, "*.xlsx"))
        
        print(f"Found {len(nldc_files)} NLDC PDF files")
        print(f"Found {len(xls_files)} XLS files")
        print(f"Found {len(xlsx_files)} XLSX files")
        
        # Process Excel files (these contain the actual data)
        for file_path in xls_files + xlsx_files:
            try:
                self._process_excel_file(file_path)
            except Exception as e:
                print(f"Error processing {file_path}: {e}")
                
        return self.processed_data
    
    def _process_excel_file(self, file_path):
        """Process individual Excel file"""
        filename = os.path.basename(file_path)
        print(f"Processing: {filename}")
        
        try:
            # Try to read the Excel file
            if filename.endswith('.xlsx'):
                df = pd.read_excel(file_path, engine='openpyxl')
            else:
                df = pd.read_excel(file_path, engine='xlrd')
                
            # Store the data
            self.processed_data[filename] = df
            print(f"Successfully processed {filename} - Shape: {df.shape}")
            
        except Exception as e:
            print(f"Could not process {filename}: {e}")
    
    def generate_synthetic_data(self, start_date='2019-01-01', end_date='2023-12-31'):
        """Generate synthetic renewable energy data based on NLDC patterns"""
        print("Generating synthetic renewable energy dataset...")
        
        # Create date range
        date_range = pd.date_range(start=start_date, end=end_date, freq='H')
        
        # Define regions
        regions = ['Northern', 'Southern', 'Eastern', 'Western', 'North-Eastern']
        
        data = []
        
        for timestamp in date_range:
            for region in regions:
                # Generate realistic patterns
                hour = timestamp.hour
                day_of_year = timestamp.dayofyear
                
                # Temperature (seasonal variation)
                base_temp = 25 + 10 * np.sin(2 * np.pi * day_of_year / 365)
                daily_temp_var = 8 * np.sin(2 * np.pi * hour / 24)
                temperature = base_temp + daily_temp_var + np.random.normal(0, 2)
                
                # Wind speed (varies by time and season)
                base_wind = 6 + 3 * np.sin(2 * np.pi * day_of_year / 365)
                daily_wind_var = 2 * np.sin(2 * np.pi * hour / 24)
                wind_speed = max(0, base_wind + daily_wind_var + np.random.normal(0, 1.5))
                
                # Solar irradiance (daylight hours only)
                if 6 <= hour <= 18:
                    solar_base = 800 * np.sin(np.pi * (hour - 6) / 12)
                    seasonal_factor = 0.8 + 0.4 * np.sin(2 * np.pi * day_of_year / 365)
                    solar_irradiance = max(0, solar_base * seasonal_factor + np.random.normal(0, 50))
                else:
                    solar_irradiance = 0
                
                # Generation (based on renewable capacity and weather)
                wind_generation = min(1.5, wind_speed * 0.2 + np.random.normal(0, 0.1))  # GW
                solar_generation = solar_irradiance * 0.002 + np.random.normal(0, 0.05)  # GW
                total_generation = max(0, wind_generation + solar_generation)
                
                # Demand (follows typical daily and seasonal patterns)
                base_demand = 2.0 + 0.5 * np.sin(2 * np.pi * day_of_year / 365)
                daily_demand_pattern = 0.8 + 0.4 * (np.sin(2 * np.pi * (hour - 6) / 24) + 1)
                demand = base_demand * daily_demand_pattern + np.random.normal(0, 0.1)
                
                # Market price (influenced by demand-supply balance)
                supply_demand_ratio = total_generation / demand if demand > 0 else 1
                base_price = 3500  # Rs/MWh
                price_factor = 1.5 - supply_demand_ratio
                price = max(1000, base_price * price_factor + np.random.normal(0, 200))
                
                # Storage SoC (simplified)
                storage_soc = 50 + 30 * np.sin(2 * np.pi * hour / 24) + np.random.normal(0, 5)
                storage_soc = np.clip(storage_soc, 10, 90)
                
                data.append({
                    'timestamp': timestamp,
                    'region': region,
                    'temperature': round(temperature, 2),
                    'wind_speed': round(wind_speed, 2),
                    'solar_irradiance': round(solar_irradiance, 2),
                    'wind_generation': round(wind_generation, 3),
                    'solar_generation': round(solar_generation, 3),
                    'total_generation': round(total_generation, 3),
                    'demand': round(demand, 3),
                    'price': round(price, 2),
                    'storage_soc': round(storage_soc, 1),
                    'hour': hour,
                    'month': timestamp.month,
                    'weekday': timestamp.weekday()
                })
        
        df = pd.DataFrame(data)
        
        # Save the dataset
        output_file = 'renewable_5yr_hourly.csv'
        df.to_csv(output_file, index=False)
        print(f"Synthetic dataset saved as: {output_file}")
        print(f"Dataset shape: {df.shape}")
        print(f"Date range: {df['timestamp'].min()} to {df['timestamp'].max()}")
        
        return df
    
    def get_summary_statistics(self, df):
        """Generate summary statistics for the dataset"""
        print("\n=== DATASET SUMMARY ===")
        print(f"Total records: {len(df):,}")
        print(f"Date range: {df['timestamp'].min()} to {df['timestamp'].max()}")
        print(f"Regions: {df['region'].unique()}")
        
        print("\n=== GENERATION STATISTICS (GW) ===")
        print(f"Wind Generation - Mean: {df['wind_generation'].mean():.3f}, Max: {df['wind_generation'].max():.3f}")
        print(f"Solar Generation - Mean: {df['solar_generation'].mean():.3f}, Max: {df['solar_generation'].max():.3f}")
        print(f"Total Generation - Mean: {df['total_generation'].mean():.3f}, Max: {df['total_generation'].max():.3f}")
        
        print("\n=== DEMAND STATISTICS (GW) ===")
        print(f"Demand - Mean: {df['demand'].mean():.3f}, Max: {df['demand'].max():.3f}, Min: {df['demand'].min():.3f}")
        
        print("\n=== MARKET STATISTICS ===")
        print(f"Price (Rs/MWh) - Mean: {df['price'].mean():.0f}, Max: {df['price'].max():.0f}, Min: {df['price'].min():.0f}")
        
        print("\n=== WEATHER STATISTICS ===")
        print(f"Temperature (°C) - Mean: {df['temperature'].mean():.1f}, Range: {df['temperature'].min():.1f} to {df['temperature'].max():.1f}")
        print(f"Wind Speed (m/s) - Mean: {df['wind_speed'].mean():.1f}, Max: {df['wind_speed'].max():.1f}")
        print(f"Solar Irradiance (W/m²) - Mean: {df['solar_irradiance'].mean():.0f}, Max: {df['solar_irradiance'].max():.0f}")

def main():
    # Initialize processor
    processor = NLDCDataProcessor()
    
    # Process existing NLDC files
    processed_files = processor.process_nldc_files()
    
    # Generate synthetic dataset
    synthetic_data = processor.generate_synthetic_data()
    
    # Show summary statistics
    processor.get_summary_statistics(synthetic_data)
    
    print("\n=== DATA PROCESSING COMPLETE ===")
    print("Files ready for optimization model:")
    print("1. renewable_5yr_hourly.csv - Main dataset for training")
    print("2. Processed NLDC files available in memory")

if __name__ == "__main__":
    main()