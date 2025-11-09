import { Card } from "@/components/ui/card";
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Brain, TrendingUp, Cloud, DollarSign } from "lucide-react";

const generationData = [
  { hour: "00:00", actual: 6.2, forecast: 6.5, p5: 5.8, p95: 7.2 },
  { hour: "04:00", actual: 5.8, forecast: 5.9, p5: 5.3, p95: 6.5 },
  { hour: "08:00", actual: 7.5, forecast: 7.8, p5: 7.0, p95: 8.6 },
  { hour: "12:00", actual: 9.2, forecast: 9.0, p5: 8.4, p95: 9.8 },
  { hour: "16:00", actual: 8.1, forecast: 8.3, p5: 7.6, p95: 9.0 },
  { hour: "20:00", actual: 6.8, forecast: 6.9, p5: 6.2, p95: 7.6 },
];

const demandData = [
  { hour: "00:00", actual: 5.5, forecast: 5.7 },
  { hour: "04:00", actual: 4.8, forecast: 4.9 },
  { hour: "08:00", actual: 7.2, forecast: 7.0 },
  { hour: "12:00", actual: 8.5, forecast: 8.7 },
  { hour: "16:00", actual: 9.1, forecast: 8.9 },
  { hour: "20:00", actual: 7.8, forecast: 7.9 },
];

const priceData = [
  { hour: "00:00", price: 3200, forecast: 3100 },
  { hour: "04:00", price: 2800, forecast: 2900 },
  { hour: "08:00", price: 3600, forecast: 3500 },
  { hour: "12:00", price: 4200, forecast: 4300 },
  { hour: "16:00", price: 4800, forecast: 4700 },
  { hour: "20:00", price: 4100, forecast: 4200 },
];

export const MLForecastingModels = () => {
  return (
    <Card className="p-6">
      <h2 className="text-2xl font-bold text-foreground mb-4">3. AI/ML Forecasting Models</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        <div className="p-4 border border-border rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Cloud className="w-5 h-5 text-primary" />
            <h3 className="font-semibold text-foreground text-sm">Generation Forecast</h3>
          </div>
          <div className="space-y-2 text-xs">
            <div>
              <span className="text-muted-foreground">Model:</span>
              <span className="font-medium text-foreground ml-1">LSTM + XGBoost</span>
            </div>
            <div>
              <span className="text-muted-foreground">Features:</span>
              <span className="font-medium text-foreground ml-1">Weather, historical generation</span>
            </div>
            <div>
              <span className="text-muted-foreground">Output:</span>
              <span className="font-medium text-foreground ml-1">Probabilistic (P5, P50, P95)</span>
            </div>
            <div>
              <span className="text-muted-foreground">Horizon:</span>
              <span className="font-medium text-foreground ml-1">24-72h rolling</span>
            </div>
            <div className="pt-2 border-t border-border">
              <span className="text-muted-foreground">Accuracy:</span>
              <span className="font-medium text-secondary ml-1">MAPE 8.2%</span>
            </div>
          </div>
        </div>

        <div className="p-4 border border-border rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-5 h-5 text-primary" />
            <h3 className="font-semibold text-foreground text-sm">Demand Forecast</h3>
          </div>
          <div className="space-y-2 text-xs">
            <div>
              <span className="text-muted-foreground">Model:</span>
              <span className="font-medium text-foreground ml-1">Gradient Boosting + Prophet</span>
            </div>
            <div>
              <span className="text-muted-foreground">Features:</span>
              <span className="font-medium text-foreground ml-1">Time, temp, holidays, lag</span>
            </div>
            <div>
              <span className="text-muted-foreground">Output:</span>
              <span className="font-medium text-foreground ml-1">Mean + confidence intervals</span>
            </div>
            <div>
              <span className="text-muted-foreground">Granularity:</span>
              <span className="font-medium text-foreground ml-1">Per region, hourly</span>
            </div>
            <div className="pt-2 border-t border-border">
              <span className="text-muted-foreground">Accuracy:</span>
              <span className="font-medium text-secondary ml-1">MAPE 6.5%</span>
            </div>
          </div>
        </div>

        <div className="p-4 border border-border rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className="w-5 h-5 text-primary" />
            <h3 className="font-semibold text-foreground text-sm">Price Forecast</h3>
          </div>
          <div className="space-y-2 text-xs">
            <div>
              <span className="text-muted-foreground">Model:</span>
              <span className="font-medium text-foreground ml-1">Temporal Fusion Transformer</span>
            </div>
            <div>
              <span className="text-muted-foreground">Features:</span>
              <span className="font-medium text-foreground ml-1">Historical price, demand, gen</span>
            </div>
            <div>
              <span className="text-muted-foreground">Output:</span>
              <span className="font-medium text-foreground ml-1">Scenarios (±20% range)</span>
            </div>
            <div>
              <span className="text-muted-foreground">Market:</span>
              <span className="font-medium text-foreground ml-1">IEX (INR/MWh)</span>
            </div>
            <div className="pt-2 border-t border-border">
              <span className="text-muted-foreground">Accuracy:</span>
              <span className="font-medium text-secondary ml-1">MAPE 11.3%</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
            <Brain className="w-4 h-4 text-primary" />
            Generation Forecast (Probabilistic)
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={generationData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis dataKey="hour" className="text-xs" tick={{ fill: 'hsl(var(--muted-foreground))' }} />
              <YAxis className="text-xs" tick={{ fill: 'hsl(var(--muted-foreground))' }} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--card))', 
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '6px'
                }}
              />
              <Legend />
              <Area type="monotone" dataKey="p95" fill="hsl(var(--primary) / 0.1)" stroke="hsl(var(--primary) / 0.3)" name="P95" />
              <Area type="monotone" dataKey="p5" fill="hsl(var(--card))" stroke="hsl(var(--primary) / 0.3)" name="P5" />
              <Line type="monotone" dataKey="forecast" stroke="hsl(var(--primary))" strokeWidth={2} name="Forecast" />
              <Line type="monotone" dataKey="actual" stroke="hsl(var(--secondary))" strokeWidth={2} strokeDasharray="5 5" name="Actual" />
            </AreaChart>
          </ResponsiveContainer>
          <p className="text-xs text-muted-foreground mt-2">Generation forecast with uncertainty bands (GW)</p>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-primary" />
            Regional Demand Forecast
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={demandData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis dataKey="hour" className="text-xs" tick={{ fill: 'hsl(var(--muted-foreground))' }} />
              <YAxis className="text-xs" tick={{ fill: 'hsl(var(--muted-foreground))' }} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--card))', 
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '6px'
                }}
              />
              <Legend />
              <Line type="monotone" dataKey="forecast" stroke="hsl(var(--accent))" strokeWidth={2} name="Forecast" />
              <Line type="monotone" dataKey="actual" stroke="hsl(var(--secondary))" strokeWidth={2} strokeDasharray="5 5" name="Actual" />
            </LineChart>
          </ResponsiveContainer>
          <p className="text-xs text-muted-foreground mt-2">Demand forecast vs actual (GW)</p>
        </div>
      </div>

      <div className="mt-4">
        <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
          <DollarSign className="w-4 h-4 text-primary" />
          IEX Market Price Forecast
        </h3>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={priceData}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
            <XAxis dataKey="hour" className="text-xs" tick={{ fill: 'hsl(var(--muted-foreground))' }} />
            <YAxis className="text-xs" tick={{ fill: 'hsl(var(--muted-foreground))' }} />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'hsl(var(--card))', 
                border: '1px solid hsl(var(--border))',
                borderRadius: '6px'
              }}
            />
            <Legend />
            <Line type="monotone" dataKey="forecast" stroke="hsl(var(--primary))" strokeWidth={2} name="Forecast (INR/MWh)" />
            <Line type="monotone" dataKey="price" stroke="hsl(var(--secondary))" strokeWidth={2} strokeDasharray="5 5" name="Actual" />
          </LineChart>
        </ResponsiveContainer>
        <p className="text-xs text-muted-foreground mt-2">Market clearing price predictions (INR per MWh)</p>
      </div>

      <div className="mt-6 p-4 bg-primary/5 border border-primary/20 rounded-lg">
        <h4 className="font-semibold text-foreground mb-2 text-sm">Model Training & Deployment</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
          <div>
            <span className="text-muted-foreground">Retraining:</span>
            <span className="font-medium text-foreground ml-1">Daily (short), Weekly (full)</span>
          </div>
          <div>
            <span className="text-muted-foreground">Features:</span>
            <span className="font-medium text-foreground ml-1">150+ engineered variables</span>
          </div>
          <div>
            <span className="text-muted-foreground">Validation:</span>
            <span className="font-medium text-foreground ml-1">Rolling 30-day window</span>
          </div>
          <div>
            <span className="text-muted-foreground">Framework:</span>
            <span className="font-medium text-foreground ml-1">PyTorch, LightGBM, Prophet</span>
          </div>
        </div>
      </div>
    </Card>
  );
};
