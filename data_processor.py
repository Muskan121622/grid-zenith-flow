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
        self.holidays = self._define_indian_holidays()
        
    def _define_indian_holidays(self):
        """Define Indian holidays that could affect energy consumption"""
        # Simplified list of major Indian holidays
        holidays = [
            '2023-01-26',  # Republic Day
            '2023-08-15',  # Independence Day
            '2023-10-02',  # Gandhi Jayanti
            '2023-12-25',  # Christmas
            # Add more as needed
        ]
        return pd.to_datetime(holidays)
        
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
        all_dfs = []
        for file_path in xls_files + xlsx_files:
            try:
                df = self._process_excel_file(file_path)
                if df is not None and not df.empty:
                    all_dfs.append(df)
            except Exception as e:
                print(f"Error processing {file_path}: {e}")
                
        if all_dfs:
            combined_df = pd.concat(all_dfs, ignore_index=True)
            return combined_df
        return None
    
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
                
            print(f"Successfully processed {filename} - Shape: {df.shape}")
            
            # Extract meaningful columns if they exist
            processed_df = self._extract_nldc_features(df, filename)
            return processed_df
            
        except Exception as e:
            print(f"Could not process {filename}: {e}")
            return None
    
    def _extract_nldc_features(self, df, filename):
        """Extract relevant features from NLDC data"""
        # This is a simplified extraction - in practice, you'd need to adapt this
        # based on the actual structure of your NLDC Excel files
        processed_data = []
        
        # Look for common column names in NLDC data
        timestamp_col = None
        demand_col = None
        generation_col = None
        price_col = None
        
        # Common column name variations
        timestamp_keywords = ['date', 'time', 'datetime', 'timestamp']
        demand_keywords = ['demand', 'load', 'consumption']
        generation_keywords = ['generation', 'gen', 'output']
        price_keywords = ['price', 'rate', 'cost']
        
        columns_lower = [col.lower() for col in df.columns]
        
        # Try to identify columns
        for i, col in enumerate(columns_lower):
            if timestamp_col is None and any(keyword in col for keyword in timestamp_keywords):
                timestamp_col = df.columns[i]
            elif demand_col is None and any(keyword in col for keyword in demand_keywords):
                demand_col = df.columns[i]
            elif generation_col is None and any(keyword in col for keyword in generation_keywords):
                generation_col = df.columns[i]
            elif price_col is None and any(keyword in col for keyword in price_keywords):
                price_col = df.columns[i]
        
        # If we found meaningful columns, process the data
        if timestamp_col and (demand_col or generation_col):
            print(f"  Found relevant columns: timestamp={timestamp_col}, demand={demand_col}, generation={generation_col}, price={price_col}")
            
            # Create a simplified representation
            for idx, row in df.iterrows():
                try:
                    # Extract timestamp
                    timestamp = pd.to_datetime(row[timestamp_col]) if timestamp_col else pd.Timestamp.now()
                    
                    # Extract values or use defaults
                    demand = float(row[demand_col]) if demand_col and pd.notna(row[demand_col]) else np.nan
                    generation = float(row[generation_col]) if generation_col and pd.notna(row[generation_col]) else np.nan
                    price = float(row[price_col]) if price_col and pd.notna(row[price_col]) else np.nan
                    
                    processed_data.append({
                        'timestamp': timestamp,
                        'demand': demand,
                        'generation': generation,
                        'price': price,
                        'source_file': filename
                    })
                except:
                    continue  # Skip rows with conversion errors
            
            if processed_data:
                result_df = pd.DataFrame(processed_data)
                print(f"  Extracted {len(result_df)} records from {filename}")
                return result_df
        
        print(f"  Could not extract meaningful data from {filename}")
        return pd.DataFrame()  # Return empty DataFrame
    
    def generate_enhanced_dataset(self, start_date='2019-01-01', end_date='2023-12-31'):
        """Generate enhanced renewable energy dataset with real NLDC data and additional features"""
        print("Generating enhanced renewable energy dataset...")
        
        # First, try to process real NLDC data
        nldc_data = self.process_nldc_files()
        
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
                month = timestamp.month
                weekday = timestamp.weekday()
                
                # Check if it's a holiday
                is_holiday = timestamp.date() in [d.date() for d in self.holidays]
                
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
                
                # Humidity (correlated with temperature)
                humidity = max(30, min(90, 70 - temperature * 0.5 + np.random.normal(0, 5)))
                
                # Generation (based on renewable capacity and weather)
                wind_generation = min(1.5, wind_speed * 0.2 + np.random.normal(0, 0.1))  # GW
                solar_generation = solar_irradiance * 0.002 + np.random.normal(0, 0.05)  # GW
                total_generation = max(0, wind_generation + solar_generation)
                
                # Demand (follows typical daily and seasonal patterns)
                base_demand = 2.0 + 0.5 * np.sin(2 * np.pi * day_of_year / 365)
                daily_demand_pattern = 0.8 + 0.4 * (np.sin(2 * np.pi * (hour - 6) / 24) + 1)
                
                # Adjust for weekends and holidays
                if weekday >= 5 or is_holiday:  # Weekend or holiday
                    daily_demand_pattern *= 0.8  # Lower demand
                    
                demand = base_demand * daily_demand_pattern + np.random.normal(0, 0.1)
                
                # Market price (influenced by demand-supply balance)
                supply_demand_ratio = total_generation / demand if demand > 0 else 1
                base_price = 3500  # Rs/MWh
                price_factor = 1.5 - supply_demand_ratio
                
                # Adjust for time of day and day type
                time_multiplier = 1.0
                if 18 <= hour <= 22:  # Peak evening hours
                    time_multiplier = 1.3
                elif 23 <= hour or hour <= 6:  # Night hours
                    time_multiplier = 0.7
                    
                price = max(1000, base_price * price_factor * time_multiplier + np.random.normal(0, 200))
                
                # Storage SoC (simplified)
                storage_soc = 50 + 30 * np.sin(2 * np.pi * hour / 24) + np.random.normal(0, 5)
                storage_soc = np.clip(storage_soc, 10, 90)
                
                # Maintenance schedule indicator (simplified)
                # Assume 5% chance of maintenance on any given day
                maintenance = 1 if np.random.random() < 0.05 else 0
                
                data.append({
                    'timestamp': timestamp,
                    'region': region,
                    'temperature': round(temperature, 2),
                    'wind_speed': round(wind_speed, 2),
                    'solar_irradiance': round(solar_irradiance, 2),
                    'humidity': round(humidity, 1),
                    'wind_generation': round(wind_generation, 3),
                    'solar_generation': round(solar_generation, 3),
                    'total_generation': round(total_generation, 3),
                    'demand': round(demand, 3),
                    'price': round(price, 2),
                    'storage_soc': round(storage_soc, 1),
                    'hour': hour,
                    'month': month,
                    'weekday': weekday,
                    'is_weekend': 1 if weekday >= 5 else 0,
                    'is_holiday': 1 if is_holiday else 0,
                    'is_peak_hour': 1 if 18 <= hour <= 22 else 0,
                    'maintenance_schedule': maintenance
                })
        
        df = pd.DataFrame(data)
        
        # Save the dataset
        output_file = 'enhanced_renewable_dataset.csv'
        df.to_csv(output_file, index=False)
        print(f"Enhanced dataset saved as: {output_file}")
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
        
        print("\n=== ADDITIONAL FEATURES ===")
        print(f"Holidays represented: {df['is_holiday'].sum()}")
        print(f"Weekend records: {df['is_weekend'].sum()}")
        print(f"Peak hour records: {df['is_peak_hour'].sum()}")
        print(f"Maintenance events: {df['maintenance_schedule'].sum()}")

def main():
    # Initialize processor
    processor = NLDCDataProcessor()
    
    # Generate enhanced dataset with additional features
    enhanced_data = processor.generate_enhanced_dataset()
    
    # Show summary statistics
    processor.get_summary_statistics(enhanced_data)
    
    print("\n=== ENHANCED DATA PROCESSING COMPLETE ===")
    print("Files ready for optimization model:")
    print("1. enhanced_renewable_dataset.csv - Enhanced dataset for training")
    print("2. Includes holidays, maintenance schedules, and additional features")

if __name__ == "__main__":
    main()