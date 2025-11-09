# -*- coding: utf-8 -*-

from ai_model_trainer_simple import RenewableEnergyAIModel

def main():
    """Train the renewable energy AI model"""
    print("Starting model training...")
    
    # Initialize and train model
    ai_model = RenewableEnergyAIModel()
    results = ai_model.train_all_models()
    
    # Save trained models
    ai_model.save_models()
    
    print("Model training complete!")

if __name__ == "__main__":
    main()