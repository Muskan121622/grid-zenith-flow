# AI-Driven Renewable Energy Optimization Platform
🌐 **[Live Application → Grid Zenith Flow](https://grid-zenith-flow.vercel.app/)**

## Project Overview

A comprehensive AI-powered decision framework for renewable energy distribution and market optimization. This system helps renewable energy companies optimize energy dispatch, storage management, and market bidding strategies.

## Features

- **AI Forecasting Models**: XGBoost for generation, Prophet for demand, statistical models for price prediction
- **Real-time Optimization**: Model Predictive Control (MPC) with stochastic elements
- **Storage Management**: Battery and pumped hydro optimization
- **Market Integration**: IEX bidding strategy and price optimization
- **Performance Monitoring**: Live KPI tracking and reliability metrics

## System Specifications

- **Total Capacity**: 12 GW (60% wind, 40% solar)
- **Storage**: 1 GWh battery + 2 GWh pumped hydro
- **Target Reliability**: 94% (up from 82% baseline)
- **Loss Reduction**: 20% improvement (11% → 8.8%)
- **EBITDA Margin**: Maintain ≥15%

## Technologies Used

- **Frontend**: React, TypeScript, Tailwind CSS, shadcn-ui
- **Backend**: Python, Flask, XGBoost, Prophet, Pandas
- **Optimization**: Model Predictive Control, Linear Programming
- **Data**: 5-year historical dataset (219K records)

## Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- Python 3.8+
- npm or yarn

### Frontend Setup
```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

### Backend Setup
```bash
# Install Python dependencies
pip install flask flask-cors pandas numpy xgboost scikit-learn prophet matplotlib seaborn joblib

# Train AI models (first time only)
python train_model.py

# Start API server
python api_server.py
```

## Usage

1. **Start Backend**: Run `python api_server.py` (serves on http://localhost:5000)
2. **Start Frontend**: Run `npm run dev` (serves on http://localhost:8082)
3. **Access Application**: Open http://localhost:8082 in your browser
4. **Navigate to Decision Model**: Click on "Decision Model" to access the optimization interface
5. **Run Optimization**: Click "Run Optimization" to execute the trained AI model

## Key Components

- **Dashboard**: Real-time energy metrics and zone visualization
- **Decision Model**: Complete AI framework with mathematical formulation
- **Optimization Engine**: Live optimization results with trained models
- **Storage Management**: Battery and hydro optimization strategies
- **Market Analysis**: IEX price forecasting and bidding logic

## Results

The system successfully demonstrates:
- **94.0% reliability** (meeting target exactly)
- **Real-time optimization** with trained AI models
- **Complete mathematical formulation** with all constraints
- **Live performance metrics** and KPI tracking

## Architecture

- **Data Layer**: Historical generation, demand, weather, and price data
- **Forecasting Layer**: ML models for probabilistic predictions
- **Decision Engine**: MPC optimization with stochastic elements
- **Execution Layer**: Real-time dispatch and storage commands
- **Feedback Loop**: Continuous model retraining and parameter updates
