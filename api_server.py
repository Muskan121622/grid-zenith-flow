from flask import Flask, jsonify, request
from flask_cors import CORS
from optimization_model_fixed import RenewableEnergyOptimizer
import json
import numpy as np
import pandas as pd
import os

app = Flask(__name__)
# Add localhost:8080 to the allowed origins
CORS(app, origins=['http://localhost:8080', 'http://localhost:8081', 'http://localhost:8082', 'http://localhost:3000', 'http://localhost:5173', 'http://localhost:5001', 'https://grid-zenith-flow.vercel.app'], methods=['GET', 'POST', 'OPTIONS'], allow_headers=['Content-Type'])

optimizer = RenewableEnergyOptimizer()

# Global flag to track if models have been loaded
models_loaded = False

def load_models_if_needed():
    """Load models if not already loaded"""
    global models_loaded
    if not models_loaded:
        try:
            if os.path.exists('models/generation_model.json'):
                print("Loading pre-trained models...")
                optimizer.load_trained_models()
                print("Models loaded successfully")
                models_loaded = True
                return True
            else:
                print("No pre-trained models found")
                return False
        except Exception as e:
            print(f"Error loading models: {str(e)}")
            return False
    return True

def convert_numpy_types(obj):
    """Convert numpy types to Python native types"""
    if isinstance(obj, np.integer):
        return int(obj)
    elif isinstance(obj, np.floating):
        return float(obj)
    elif isinstance(obj, np.ndarray):
        return obj.tolist()
    elif isinstance(obj, pd.Timestamp):
        return obj.isoformat()
    elif isinstance(obj, np.bool_):
        return bool(obj)
    elif isinstance(obj, dict):
        return {key: convert_numpy_types(value) for key, value in obj.items()}
    elif isinstance(obj, list):
        return [convert_numpy_types(item) for item in obj]
    return obj

@app.route('/api/optimize', methods=['POST'])
def run_optimization():
    try:
        # Load models if needed
        load_models_if_needed()
        
        # If models still aren't available, train them
        if not os.path.exists('models/generation_model.json'):
            print("Training models on first run...")
            os.makedirs('models', exist_ok=True)
            try:
                optimizer.ai_model.train_all_models()
                optimizer.ai_model.save_models()
                print("Models trained and saved successfully")
                # Mark models as loaded
                global models_loaded
                models_loaded = True
            except Exception as e:
                print(f"Error training models: {str(e)}")
                return jsonify({'success': False, 'error': f'Model training failed: {str(e)}'})
        
        data = request.get_json()
        if not data:
            return jsonify({'success': False, 'error': 'No data provided'})
            
        start_date = data.get('start_date', '2024-01-01')
        end_date = data.get('end_date', '2024-01-02')
        regions = data.get('regions', ['Northern', 'Southern'])  # Fixed region names
        scenario = data.get('scenario', 'base')
        
        print(f"Running optimization: {start_date} to {end_date}, regions: {regions}, scenario: {scenario}")
        
        try:
            results, summary = optimizer.run_optimization(start_date, end_date, regions, scenario)
        except Exception as e:
            print(f"Error during optimization: {str(e)}")
            return jsonify({'success': False, 'error': f'Optimization failed: {str(e)}'})
        
        # Convert numpy types to JSON serializable types
        summary_clean = convert_numpy_types(summary)
        results_clean = convert_numpy_types(results.to_dict('records'))
        
        return jsonify({
            'success': True,
            'summary': summary_clean,
            'results': results_clean
        })
    except Exception as e:
        print(f"Unexpected error: {str(e)}")
        return jsonify({'success': False, 'error': f'Unexpected error: {str(e)}'})

@app.route('/api/train', methods=['POST'])
def train_model():
    try:
        optimizer.ai_model.train_all_models()
        optimizer.ai_model.save_models()
        # Mark models as loaded
        global models_loaded
        models_loaded = True
        return jsonify({'success': True, 'message': 'Model trained successfully'})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)})

@app.route('/api/scenarios', methods=['GET'])
def get_scenarios():
    return jsonify({
        'scenarios': [
            {'id': 'base', 'name': 'Base Case', 'description': 'Normal operations'},
            {'id': 'high_demand', 'name': 'High Demand', 'description': '+15% demand spike'},
            {'id': 'low_wind', 'name': 'Low Wind', 'description': '-20% wind generation'},
            {'id': 'high_volatility', 'name': 'High Volatility', 'description': '+20% price swings'}
        ]
    })

if __name__ == '__main__':
    print("Starting optimized API server for instant demo responses...")
    app.run(debug=True, port=5001)