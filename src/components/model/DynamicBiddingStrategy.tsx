import { Card } from "@/components/ui/card";
import { TrendingUp, Target, Lightbulb, BarChart3 } from "lucide-react";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ComposedChart } from "recharts";

const biddingData = [
  { hour: "00:00", price: 3200, bidPrice: 3100, quantity: 450, profit: 180 },
  { hour: "04:00", price: 2800, bidPrice: 2850, quantity: 380, profit: 140 },
  { hour: "08:00", price: 3600, bidPrice: 3500, quantity: 520, profit: 220 },
  { hour: "12:00", price: 4200, bidPrice: 4150, quantity: 600, profit: 380 },
  { hour: "16:00", price: 4800, bidPrice: 4700, quantity: 680, profit: 450 },
  { hour: "20:00", price: 4100, bidPrice: 4050, quantity: 580, profit: 310 },
];

const storageArbitrageData = [
  { hour: "02:00", price: 2900, action: "Charge", power: 300, value: -870 },
  { hour: "06:00", price: 2700, action: "Charge", power: 400, value: -1080 },
  { hour: "10:00", price: 3800, action: "Hold", power: 0, value: 0 },
  { hour: "14:00", price: 4500, action: "Discharge", power: 350, value: 1575 },
  { hour: "18:00", price: 4900, action: "Discharge", power: 450, value: 2205 },
  { hour: "22:00", price: 3600, action: "Hold", power: 0, value: 0 },
];

export const DynamicBiddingStrategy = () => {
  return (
    <Card className="p-6">
      <h2 className="text-2xl font-bold text-foreground mb-4">5. Dynamic Bidding Strategy</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        <div className="p-4 border border-border rounded-lg">
          <div className="flex items-center gap-2 mb-3">
            <Target className="w-5 h-5 text-primary" />
            <h3 className="font-semibold text-foreground text-sm">Bidding Logic</h3>
          </div>
          <div className="space-y-2 text-xs">
            <div className="p-2 bg-muted rounded">
              <div className="font-medium text-foreground">Day-Ahead Market</div>
              <div className="text-muted-foreground">Submit supply offers based on price forecasts</div>
            </div>
            <div className="p-2 bg-muted rounded">
              <div className="font-medium text-foreground">Intra-Day Adjustment</div>
              <div className="text-muted-foreground">Update bids as generation & demand forecasts refresh</div>
            </div>
            <div className="p-2 bg-muted rounded">
              <div className="font-medium text-foreground">Storage Arbitrage</div>
              <div className="text-muted-foreground">Discharge during high price, charge during low price</div>
            </div>
          </div>
        </div>

        <div className="p-4 border border-border rounded-lg">
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp className="w-5 h-5 text-primary" />
            <h3 className="font-semibold text-foreground text-sm">Price-Based Strategy</h3>
          </div>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between p-2 bg-primary/5 rounded">
              <span className="text-muted-foreground">High Price (&gt;₹4500)</span>
              <span className="font-medium text-foreground">Aggressive sell + discharge</span>
            </div>
            <div className="flex justify-between p-2 bg-accent/5 rounded">
              <span className="text-muted-foreground">Medium Price (₹3000-4500)</span>
              <span className="font-medium text-foreground">Balanced dispatch</span>
            </div>
            <div className="flex justify-between p-2 bg-secondary/5 rounded">
              <span className="text-muted-foreground">Low Price (&lt;₹3000)</span>
              <span className="font-medium text-foreground">Charge storage + curtail</span>
            </div>
          </div>
        </div>

        <div className="p-4 border border-border rounded-lg">
          <div className="flex items-center gap-2 mb-3">
            <Lightbulb className="w-5 h-5 text-primary" />
            <h3 className="font-semibold text-foreground text-sm">RL Agent Integration</h3>
          </div>
          <div className="space-y-2 text-xs">
            <div>
              <span className="text-muted-foreground">Algorithm:</span>
              <span className="font-medium text-foreground ml-1">PPO (Proximal Policy Optimization)</span>
            </div>
            <div>
              <span className="text-muted-foreground">State Space:</span>
              <span className="font-medium text-foreground ml-1">Forecasts, SoC, prices</span>
            </div>
            <div>
              <span className="text-muted-foreground">Action Space:</span>
              <span className="font-medium text-foreground ml-1">Bid prices & quantities</span>
            </div>
            <div>
              <span className="text-muted-foreground">Reward:</span>
              <span className="font-medium text-foreground ml-1">Profit - penalties</span>
            </div>
            <div className="pt-2 border-t border-border">
              <span className="text-muted-foreground">Training:</span>
              <span className="font-medium text-secondary ml-1">Simulated 5-year market</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div>
          <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-primary" />
            Hourly Bidding Performance
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <ComposedChart data={biddingData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis dataKey="hour" className="text-xs" tick={{ fill: 'hsl(var(--muted-foreground))' }} />
              <YAxis yAxisId="left" className="text-xs" tick={{ fill: 'hsl(var(--muted-foreground))' }} />
              <YAxis yAxisId="right" orientation="right" className="text-xs" tick={{ fill: 'hsl(var(--muted-foreground))' }} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--card))', 
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '6px'
                }}
              />
              <Legend />
              <Bar yAxisId="left" dataKey="quantity" fill="hsl(var(--primary) / 0.6)" name="Quantity (MW)" />
              <Line yAxisId="right" type="monotone" dataKey="price" stroke="hsl(var(--accent))" strokeWidth={2} name="Market Price (INR)" />
              <Line yAxisId="right" type="monotone" dataKey="bidPrice" stroke="hsl(var(--secondary))" strokeWidth={2} strokeDasharray="5 5" name="Bid Price (INR)" />
            </ComposedChart>
          </ResponsiveContainer>
          <p className="text-xs text-muted-foreground mt-2">Bid quantities and price positioning relative to market clearing price</p>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-primary" />
            Storage Arbitrage Strategy
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <ComposedChart data={storageArbitrageData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis dataKey="hour" className="text-xs" tick={{ fill: 'hsl(var(--muted-foreground))' }} />
              <YAxis yAxisId="left" className="text-xs" tick={{ fill: 'hsl(var(--muted-foreground))' }} />
              <YAxis yAxisId="right" orientation="right" className="text-xs" tick={{ fill: 'hsl(var(--muted-foreground))' }} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--card))', 
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '6px'
                }}
              />
              <Legend />
              <Bar yAxisId="left" dataKey="power" fill="hsl(var(--accent) / 0.6)" name="Power (MW)" />
              <Line yAxisId="right" type="monotone" dataKey="price" stroke="hsl(var(--primary))" strokeWidth={2} name="Price (INR/MWh)" />
            </ComposedChart>
          </ResponsiveContainer>
          <p className="text-xs text-muted-foreground mt-2">
            <span className="inline-block w-3 h-3 bg-green-500 rounded mr-1"></span>Charge during low price
            <span className="inline-block w-3 h-3 bg-red-500 rounded ml-3 mr-1"></span>Discharge during high price
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
          <h3 className="font-semibold text-foreground mb-3 text-sm">Bidding Decision Rules</h3>
          <div className="space-y-2 text-xs">
            <div className="p-2 bg-card rounded">
              <div className="font-medium text-foreground mb-1">Rule 1: Price-Volume Optimization</div>
              <div className="text-muted-foreground">Bid at expected price - risk premium, volume = available capacity - reserve</div>
            </div>
            <div className="p-2 bg-card rounded">
              <div className="font-medium text-foreground mb-1">Rule 2: Storage Timing</div>
              <div className="text-muted-foreground">Discharge storage when price &gt; marginal cost + degradation cost + ₹500 premium</div>
            </div>
            <div className="p-2 bg-card rounded">
              <div className="font-medium text-foreground mb-1">Rule 3: Curtailment Avoidance</div>
              <div className="text-muted-foreground">If surplus generation, bid aggressively low to avoid curtailment losses</div>
            </div>
            <div className="p-2 bg-card rounded">
              <div className="font-medium text-foreground mb-1">Rule 4: Emergency Procurement</div>
              <div className="text-muted-foreground">If expected shortfall &gt; threshold, buy from market to maintain reliability SLA</div>
            </div>
          </div>
        </div>

        <div className="p-4 bg-accent/5 border border-accent/20 rounded-lg">
          <h3 className="font-semibold text-foreground mb-3 text-sm">Risk Management & Constraints</h3>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between items-center p-2 bg-card rounded">
              <span className="text-muted-foreground">Max single-hour exposure:</span>
              <span className="font-medium text-foreground">₹50M</span>
            </div>
            <div className="flex justify-between items-center p-2 bg-card rounded">
              <span className="text-muted-foreground">Storage SoC safety margin:</span>
              <span className="font-medium text-foreground">15% min reserve</span>
            </div>
            <div className="flex justify-between items-center p-2 bg-card rounded">
              <span className="text-muted-foreground">Max price deviation from forecast:</span>
              <span className="font-medium text-foreground">±25%</span>
            </div>
            <div className="flex justify-between items-center p-2 bg-card rounded">
              <span className="text-muted-foreground">Stop-loss trigger:</span>
              <span className="font-medium text-foreground">-₹5M/hour</span>
            </div>
            <div className="flex justify-between items-center p-2 bg-card rounded">
              <span className="text-muted-foreground">Fallback strategy:</span>
              <span className="font-medium text-foreground">Conservative dispatch</span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};
