import pandas as pd
import numpy as np
import os

def create_synthetic_dataset():
    """Create a synthetic 5-year renewable energy dataset"""
    print("Creating synthetic 5-year renewable energy dataset...")

    # Define parameters
    regions = ['North', 'South', 'East', 'West', 'North-East']
    start_date = pd.Timestamp('2019-01-01')
    end_date = pd.Timestamp('2023-12-31')

    # Create hourly timestamps for 5 years
    timestamps = pd.date_range(start_date, end_date, freq='H')
    n_hours = len(timestamps)

    print(f"Generating {n_hours} hourly records for {len(regions)} regions...")

    # Initialize data storage
    data = []

    # Generate data for each region
    for region in regions:
        print(f"Processing region: {region}")

        # Base parameters for each region (simulating different characteristics)
        region_params = {
            'North': {'gen_base': 6, 'gen_var': 2, 'demand_base': 8, 'demand_var': 3, 'price_base': 3000},
            'South': {'gen_base': 8, 'gen_var': 3, 'demand_base': 10, 'demand_var': 4, 'price_base': 3500},
            'East': {'gen_base': 5, 'gen_var': 2, 'demand_base': 7, 'demand_var': 3, 'price_base': 2800},
            'West': {'gen_base': 7, 'gen_var': 2.5, 'demand_base': 9, 'demand_var': 3.5, 'price_base': 3200},
            'North-East': {'gen_base': 4, 'gen_var': 1.5, 'demand_base': 6, 'demand_var': 2.5, 'price_base': 2600}
        }

        params = region_params[region]

        # Generate time series data
        for i, ts in enumerate(timestamps):
            hour = ts.hour
            month = ts.month
            day_of_year = ts.dayofyear

            # Seasonal generation patterns (higher in summer for solar, variable for wind)
            if region == 'South':  # Solar-heavy
                seasonal_factor = 1 + 0.5 * np.sin(2 * np.pi * (day_of_year - 80) / 365)  # Peak in summer
            elif region == 'North':  # Wind-heavy
                seasonal_factor = 1 + 0.3 * np.sin(2 * np.pi * day_of_year / 365)
            else:
                seasonal_factor = 1 + 0.2 * np.sin(2 * np.pi * day_of_year / 365)

            # Hourly patterns (peak generation during day, peak demand during evening)
            if region == 'South':  # Solar pattern
                hourly_gen_factor = max(0, np.sin(np.pi * hour / 12)) if 6 <= hour <= 18 else 0.1
            else:  # Wind pattern (more consistent)
                hourly_gen_factor = 0.5 + 0.5 * np.sin(2 * np.pi * hour / 24)

            # Generation
            base_gen = params['gen_base'] * seasonal_factor * hourly_gen_factor
            generation = max(0, base_gen + np.random.normal(0, params['gen_var']))

            # Demand patterns (peak in evening)
            demand_factor = 0.7 + 0.6 * (1 / (1 + np.exp(-(hour - 12) / 2)))  # Sigmoid for evening peak
            demand = params['demand_base'] * demand_factor + np.random.normal(0, params['demand_var'])
            demand = max(0, demand)

            # Price patterns (higher during peak demand)
            price_volatility = 0.1 + 0.2 * demand_factor  # Higher volatility during peak hours
            price = params['price_base'] * (1 + np.random.normal(0, price_volatility))
            price = max(1000, min(8000, price))  # Clamp to reasonable range

            # Storage SoC (simulated battery patterns)
            soc_base = 50
            # Charge during low price hours, discharge during high price hours
            if hour >= 22 or hour <= 6:  # Night hours - charge
                soc_trend = np.random.uniform(0.5, 2.0)
            elif 10 <= hour <= 16:  # Peak hours - discharge
                soc_trend = np.random.uniform(-1.5, -0.5)
            else:
                soc_trend = np.random.normal(0, 0.3)

            storage_soc = soc_base + soc_trend * 10  # Scale the trend
            storage_soc = np.clip(storage_soc, 10, 90)  # Keep within battery limits

            # Weather data (simplified)
            temperature = 25 + 10 * np.sin(2 * np.pi * day_of_year / 365) + np.random.normal(0, 5)
            wind_speed = max(0, 5 + 3 * np.sin(2 * np.pi * hour / 24) + np.random.normal(0, 2))
            solar_irradiance = max(0, 600 * hourly_gen_factor + np.random.normal(0, 100))
            humidity = 60 + 20 * np.sin(2 * np.pi * day_of_year / 365) + np.random.normal(0, 10)
            humidity = np.clip(humidity, 10, 100)

            # Create data record
            record = {
                'timestamp': ts,
                'region': region,
                'generation': round(generation, 2),
                'demand': round(demand, 2),
                'price': round(price, 0),
                'storage_soc': round(storage_soc, 1),
                'temperature': round(temperature, 1),
                'wind_speed': round(wind_speed, 1),
                'solar_irradiance': round(solar_irradiance, 0),
                'humidity': round(humidity, 1),
                'hour': hour,
                'month': month,
                'weekday': ts.weekday()
            }

            data.append(record)

    # Create DataFrame
    df = pd.DataFrame(data)

    # Sort by timestamp and region
    df = df.sort_values(['timestamp', 'region']).reset_index(drop=True)

    print(f"Dataset created with shape: {df.shape}")
    print(f"Date range: {df['timestamp'].min()} to {df['timestamp'].max()}")
    print(f"Regions: {df['region'].unique()}")

    return df

def save_dataset(df, filename='renewable_5yr_hourly.csv'):
    """Save the dataset to CSV"""
    df.to_csv(filename, index=False)
    print(f"Dataset saved to {filename}")

    # Print summary statistics
    print("\nDataset Summary:")
    print("=" * 50)
    print(df.describe())
    print("\nSample records:")
    print(df.head())

if __name__ == "__main__":
    # Create the dataset
    dataset = create_synthetic_dataset()

    # Save to CSV
    save_dataset(dataset)

    print("\n✅ Synthetic renewable energy dataset creation complete!")
    print("This dataset includes 5 years of hourly data across 5 Indian regions.")
    print("Features: generation, demand, price, storage SoC, and weather data.")
