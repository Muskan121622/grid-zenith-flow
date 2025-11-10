from flask import Flask, jsonify, request
from flask_cors import CORS
from optimization_model_fixed import RenewableEnergyOptimizer
import json
import numpy as np
import pandas as pd
import os

app = Flask(__name__)
CORS(app, origins=['http://localhost:8082', 'http://localhost:3000', 'http://localhost:5173', 'https://grid-zenith-flow.vercel.app'], methods=['GET', 'POST', 'OPTIONS'], allow_headers=['Content-Type'])

optimizer = RenewableEnergyOptimizer()

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
    elif isinstance(obj, dict):
        return {key: convert_numpy_types(value) for key, value in obj.items()}
    elif isinstance(obj, list):
        return [convert_numpy_types(item) for item in obj]
    return obj

@app.route('/api/optimize', methods=['POST'])
def run_optimization():
    try:
        # Train models if they don't exist
        if not os.path.exists('models/generation_model.json'):
            print("Training models on first run...")
            os.makedirs('models', exist_ok=True)
            optimizer.ai_model.train_all_models()
            optimizer.ai_model.save_models()
        
        data = request.get_json()
        start_date = data.get('start_date', '2024-01-01')
        end_date = data.get('end_date', '2024-01-02')
        regions = data.get('regions', ['North', 'South'])
        
        results, summary = optimizer.run_optimization(start_date, end_date, regions)
        
        # Convert numpy types to JSON serializable types
        summary_clean = convert_numpy_types(summary)
        results_clean = convert_numpy_types(results.to_dict('records'))
        
        return jsonify({
            'success': True,
            'summary': summary_clean,
            'results': results_clean
        })
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)})

@app.route('/api/train', methods=['POST'])
def train_model():
    try:
        optimizer.ai_model.train_all_models()
        optimizer.ai_model.save_models()
        return jsonify({'success': True, 'message': 'Model trained successfully'})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)})

if __name__ == '__main__':
    app.run(debug=True, port=5000)