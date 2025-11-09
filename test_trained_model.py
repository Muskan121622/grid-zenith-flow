# -*- coding: utf-8 -*-

from optimization_model_fixed import RenewableEnergyOptimizer

def main():
    """Test the trained model"""
    print("Testing trained model...")
    
    # Initialize optimizer
    optimizer = RenewableEnergyOptimizer()
    
    # Run optimization for 24 hours
    results, summary = optimizer.run_optimization(
        start_date='2024-01-01 00:00:00',
        end_date='2024-01-01 23:00:00',
        regions=['North', 'South']
    )
    
    print("\nOptimization Results Summary:")
    print(f"Net Profit: {summary['net_profit']:.2f}")
    print(f"Average Reliability: {summary['avg_reliability']:.3f}")
    print(f"Grid Import: {summary['grid_import_total']:.2f} GWh")
    print(f"Grid Export: {summary['grid_export_total']:.2f} GWh")
    
    print("\nModel training and optimization complete!")

if __name__ == "__main__":
    main()