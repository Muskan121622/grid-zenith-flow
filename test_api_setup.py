import sys
import os
print("Python executable:", sys.executable)
print("Python path:", sys.path)

try:
    import xgboost
    print("XGBoost imported successfully")
except ImportError as e:
    print("Failed to import XGBoost:", e)

try:
    from ai_model_trainer_simple import RenewableEnergyAIModel
    print("AI Model trainer imported successfully")
    
    # Test loading the model
    ai_model = RenewableEnergyAIModel()
    print("AI Model loaded successfully")
    print("Dataset shape:", ai_model.df.shape)
    
except Exception as e:
    print("Failed to load AI Model:", e)
    import traceback
    traceback.print_exc()