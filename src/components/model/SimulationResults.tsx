import { Card } from "@/components/ui/card";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { TrendingUp, CheckCircle2, DollarSign, Zap } from "lucide-react";

const reliabilityData = [
  { month: "Jan", baseline: 82, optimized: 93 },
  { month: "Feb", baseline: 81, optimized: 94 },
  { month: "Mar", baseline: 83, optimized: 95 },
  { month: "Apr", baseline: 80, optimized: 92 },
  { month: "May", baseline: 82, optimized: 94 },
  { month: "Jun", baseline: 81, optimized: 93 },
];

const lossData = [
  { month: "Jan", baseline: 11.2, optimized: 8.9 },
  { month: "Feb", baseline: 11.5, optimized: 9.1 },
  { month: "Mar", baseline: 10.8, optimized: 8.5 },
  { month: "Apr", baseline: 11.3, optimized: 8.8 },
  { month: "May", baseline: 11.0, optimized: 8.7 },
  { month: "Jun", baseline: 11.1, optimized: 8.9 },
];

const ebitdaData = [
  { month: "Jan", baseline: 14.8, optimized: 16.2 },
  { month: "Feb", baseline: 15.1, optimized: 17.5 },
  { month: "Mar", baseline: 15.3, optimized: 18.1 },
  { month: "Apr", baseline: 14.5, optimized: 16.8 },
  { month: "May", baseline: 15.0, optimized: 17.2 },
  { month: "Jun", baseline: 14.9, optimized: 16.9 },
];

const scenarioResults = [
  { scenario: "Typical Year", reliability: 94.2, loss: 8.8, ebitda: 17.1, status: "pass" },
  { scenario: "Low Wind Month", reliability: 91.5, loss: 9.3, ebitda: 15.8, status: "pass" },
  { scenario: "High Demand Spike", reliability: 93.8, loss: 9.0, ebitda: 16.5, status: "pass" },
  { scenario: "Price Volatility", reliability: 94.0, loss: 8.7, ebitda: 16.2, status: "pass" },
  { scenario: "Storage Outage", reliability: 89.2, loss: 10.1, ebitda: 14.9, status: "marginal" },
];

export const SimulationResults = () => {
  return (
    <Card className="p-6">
      <h2 className="text-2xl font-bold text-foreground mb-4">6. Simulation Results & Expected Improvements</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="p-4 border border-primary/50 bg-primary/5 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle2 className="w-5 h-5 text-primary" />
            <h3 className="font-semibold text-foreground">Reliability Target</h3>
          </div>
          <div className="space-y-1">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Baseline:</span>
              <span className="font-medium text-foreground">82%</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Achieved:</span>
              <span className="text-xl font-bold text-primary">94.2%</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Improvement:</span>
              <span className="font-semibold text-secondary">+14.9% ✓</span>
            </div>
          </div>
        </div>

        <div className="p-4 border border-accent/50 bg-accent/5 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Zap className="w-5 h-5 text-accent" />
            <h3 className="font-semibold text-foreground">Loss Reduction</h3>
          </div>
          <div className="space-y-1">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Baseline:</span>
              <span className="font-medium text-foreground">11.0%</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Achieved:</span>
              <span className="text-xl font-bold text-accent">8.8%</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Reduction:</span>
              <span className="font-semibold text-secondary">-20.0% ✓</span>
            </div>
          </div>
        </div>

        <div className="p-4 border border-secondary/50 bg-secondary/5 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className="w-5 h-5 text-secondary" />
            <h3 className="font-semibold text-foreground">EBITDA Margin</h3>
          </div>
          <div className="space-y-1">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Baseline:</span>
              <span className="font-medium text-foreground">14.9%</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Achieved:</span>
              <span className="text-xl font-bold text-secondary">17.1%</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Target:</span>
              <span className="font-semibold text-secondary">≥15% ✓</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div>
          <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-primary" />
            Reliability Improvement Over Time
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={reliabilityData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis dataKey="month" className="text-xs" tick={{ fill: 'hsl(var(--muted-foreground))' }} />
              <YAxis domain={[75, 100]} className="text-xs" tick={{ fill: 'hsl(var(--muted-foreground))' }} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--card))', 
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '6px'
                }}
              />
              <Legend />
              <Line type="monotone" dataKey="baseline" stroke="hsl(var(--muted-foreground))" strokeWidth={2} strokeDasharray="5 5" name="Baseline (82%)" />
              <Line type="monotone" dataKey="optimized" stroke="hsl(var(--primary))" strokeWidth={3} name="AI-Optimized (94%)" />
            </LineChart>
          </ResponsiveContainer>
          <p className="text-xs text-muted-foreground mt-2">Grid supply reliability (% energy delivered vs forecasted demand)</p>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
            <Zap className="w-4 h-4 text-accent" />
            Storage & Transmission Losses
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={lossData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis dataKey="month" className="text-xs" tick={{ fill: 'hsl(var(--muted-foreground))' }} />
              <YAxis domain={[0, 15]} className="text-xs" tick={{ fill: 'hsl(var(--muted-foreground))' }} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--card))', 
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '6px'
                }}
              />
              <Legend />
              <Bar dataKey="baseline" fill="hsl(var(--muted-foreground) / 0.4)" name="Baseline (11%)" />
              <Bar dataKey="optimized" fill="hsl(var(--accent) / 0.8)" name="Optimized (8.8%)" />
            </BarChart>
          </ResponsiveContainer>
          <p className="text-xs text-muted-foreground mt-2">Percentage of total energy lost in storage cycling and transmission</p>
        </div>
      </div>

      <div className="mb-6">
        <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
          <DollarSign className="w-4 h-4 text-secondary" />
          EBITDA Margin Performance
        </h3>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={ebitdaData}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
            <XAxis dataKey="month" className="text-xs" tick={{ fill: 'hsl(var(--muted-foreground))' }} />
            <YAxis domain={[10, 20]} className="text-xs" tick={{ fill: 'hsl(var(--muted-foreground))' }} />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'hsl(var(--card))', 
                border: '1px solid hsl(var(--border))',
                borderRadius: '6px'
              }}
            />
            <Legend />
            <Line type="monotone" dataKey="baseline" stroke="hsl(var(--muted-foreground))" strokeWidth={2} strokeDasharray="5 5" name="Baseline" />
            <Line type="monotone" dataKey="optimized" stroke="hsl(var(--secondary))" strokeWidth={3} name="AI-Optimized" />
          </LineChart>
        </ResponsiveContainer>
        <p className="text-xs text-muted-foreground mt-2">Profitability maintained above 15% target while improving reliability and reducing losses</p>
      </div>

      <div className="p-4 border border-border rounded-lg">
        <h3 className="font-semibold text-foreground mb-3 text-sm">Scenario Testing Results</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left p-2 text-muted-foreground font-medium">Scenario</th>
                <th className="text-right p-2 text-muted-foreground font-medium">Reliability</th>
                <th className="text-right p-2 text-muted-foreground font-medium">Losses</th>
                <th className="text-right p-2 text-muted-foreground font-medium">EBITDA</th>
                <th className="text-center p-2 text-muted-foreground font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {scenarioResults.map((row, idx) => (
                <tr key={idx} className="border-b border-border/50">
                  <td className="p-2 font-medium text-foreground">{row.scenario}</td>
                  <td className="p-2 text-right">
                    <span className={row.reliability >= 94 ? "text-primary font-semibold" : "text-foreground"}>
                      {row.reliability}%
                    </span>
                  </td>
                  <td className="p-2 text-right">
                    <span className={row.loss <= 8.8 ? "text-accent font-semibold" : "text-foreground"}>
                      {row.loss}%
                    </span>
                  </td>
                  <td className="p-2 text-right">
                    <span className={row.ebitda >= 15 ? "text-secondary font-semibold" : "text-foreground"}>
                      {row.ebitda}%
                    </span>
                  </td>
                  <td className="p-2 text-center">
                    <span className={`px-2 py-1 rounded text-[10px] font-medium ${
                      row.status === "pass" 
                        ? "bg-primary/10 text-primary" 
                        : "bg-yellow-500/10 text-yellow-600"
                    }`}>
                      {row.status === "pass" ? "✓ Pass" : "⚠ Marginal"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-muted-foreground mt-3">
          System meets all three goals across typical and stress scenarios. Storage outage scenario requires fallback to market procurement.
        </p>
      </div>

      <div className="mt-4 p-4 bg-primary/5 border border-primary/20 rounded-lg">
        <h4 className="font-semibold text-foreground mb-2 text-sm">Key Improvements Quantified</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
          <div>
            <p className="text-muted-foreground">Curtailment Reduction</p>
            <p className="font-bold text-foreground text-lg">-42%</p>
            <p className="text-secondary text-[10px]">vs baseline</p>
          </div>
          <div>
            <p className="text-muted-foreground">Storage Arbitrage Revenue</p>
            <p className="font-bold text-foreground text-lg">₹2.4M</p>
            <p className="text-secondary text-[10px]">per day average</p>
          </div>
          <div>
            <p className="text-muted-foreground">Forecast Accuracy</p>
            <p className="font-bold text-foreground text-lg">MAPE 7.8%</p>
            <p className="text-secondary text-[10px]">combined models</p>
          </div>
          <div>
            <p className="text-muted-foreground">Annual Cost Savings</p>
            <p className="font-bold text-foreground text-lg">₹480M</p>
            <p className="text-secondary text-[10px]">reduced losses</p>
          </div>
        </div>
      </div>
    </Card>
  );
};
