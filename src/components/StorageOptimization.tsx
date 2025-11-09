import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface StorageSystemProps {
  name: string;
  capacity: string;
  currentCharge: number;
  efficiency: string;
  type: "battery" | "hydro";
}

const StorageSystem = ({ name, capacity, currentCharge, efficiency, type }: StorageSystemProps) => (
  <div className="p-4 rounded-lg border border-border bg-card">
    <div className="flex items-start justify-between mb-3">
      <div>
        <h4 className="font-semibold text-foreground">{name}</h4>
        <p className="text-sm text-muted-foreground">{capacity}</p>
      </div>
      <span className="text-2xl">{type === "battery" ? "🔋" : "💧"}</span>
    </div>
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <span className="text-muted-foreground">State of Charge</span>
        <span className="font-medium text-foreground">{currentCharge}%</span>
      </div>
      <Progress value={currentCharge} className="h-2" />
      <div className="flex justify-between text-sm pt-2">
        <span className="text-muted-foreground">Efficiency</span>
        <span className="font-medium text-secondary">{efficiency}</span>
      </div>
    </div>
  </div>
);

export const StorageOptimization = () => {
  return (
    <Card className="p-6">
      <h3 className="text-xl font-bold text-foreground mb-2">Storage Systems</h3>
      <p className="text-sm text-muted-foreground mb-6">
        Real-time charge/discharge scheduling optimization
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <StorageSystem
          name="Battery Banks"
          capacity="1 GWh / 400 MW"
          currentCharge={68}
          efficiency="88% round-trip"
          type="battery"
        />
        <StorageSystem
          name="Pumped Hydro"
          capacity="2 GWh / 500 MW"
          currentCharge={45}
          efficiency="80% round-trip"
          type="hydro"
        />
      </div>

      <div className="p-4 bg-muted rounded-lg space-y-3">
        <h4 className="font-semibold text-foreground text-sm">Optimization Status</h4>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-muted-foreground">Storage Losses</p>
            <p className="font-semibold text-foreground">8.8% <span className="text-secondary text-xs">(-20% ✓)</span></p>
          </div>
          <div>
            <p className="text-muted-foreground">Curtailment Reduced</p>
            <p className="font-semibold text-foreground">42% <span className="text-secondary text-xs">vs baseline</span></p>
          </div>
          <div>
            <p className="text-muted-foreground">Arbitrage Revenue</p>
            <p className="font-semibold text-foreground">₹2.4M <span className="text-secondary text-xs">today</span></p>
          </div>
          <div>
            <p className="text-muted-foreground">Cycle Count</p>
            <p className="font-semibold text-foreground">3,247 <span className="text-muted-foreground text-xs">this month</span></p>
          </div>
        </div>
      </div>
    </Card>
  );
};
