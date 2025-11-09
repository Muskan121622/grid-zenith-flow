# Setup Instructions - AI Renewable Energy Optimization Platform

## Quick Start Guide

### Step 1: Install Dependencies

**Python Dependencies:**
```bash
pip install flask flask-cors pandas numpy xgboost scikit-learn prophet matplotlib seaborn joblib
```

**Node.js Dependencies:**
```bash
npm install
```

### Step 2: Train AI Models (First Time Only)

```bash
python train_model.py
```
*This will train the XGBoost generation forecasting model and save it to the `models/` directory.*

### Step 3: Start Backend API Server

```bash
python api_server.py
```
*Backend will run on http://localhost:5000*

### Step 4: Start Frontend Development Server

```bash
npm run dev
```
*Frontend will run on http://localhost:8082*

### Step 5: Access the Application

1. Open your browser and go to: **http://localhost:8082**
2. Navigate to **"Decision Model"** page
3. Click **"Run Optimization"** to execute the trained AI model
4. View real-time optimization results

## Expected Results

When you click "Run Optimization", you should see:
- **Net Profit**: Economic calculation results
- **Reliability**: 94.0% (target achieved)
- **Grid Import/Export**: Energy balance metrics
- **Real-time charts**: Generation vs demand visualization

## Troubleshooting

**If you get "Module not found" errors:**
```bash
pip install --upgrade pip
pip install -r requirements.txt  # If available
```

**If API connection fails:**
- Ensure backend is running on port 5000
- Check that both servers are running simultaneously
- Verify no firewall blocking localhost connections

**If models fail to load:**
- Run `python train_model.py` first
- Check that `models/` directory contains `.json` and `.pkl` files

## System Requirements

- **Python**: 3.8 or higher
- **Node.js**: 16.0 or higher
- **RAM**: 4GB minimum (8GB recommended)
- **Storage**: 2GB free space for datasets and models

## Architecture Overview

```
Frontend (React) ←→ API Server (Flask) ←→ AI Models (XGBoost/Prophet)
     ↓                    ↓                        ↓
Web Interface      Optimization Engine      Trained Forecasting Models
```

The system demonstrates a complete AI-driven renewable energy optimization framework with real-time decision making capabilities.