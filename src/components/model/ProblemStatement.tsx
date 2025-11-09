import { Card } from "@/components/ui/card";
import { Target, TrendingUp, DollarSign } from "lucide-react";

export const ProblemStatement = () => {
  return (
    <Card className="p-6">
      <h2 className="text-2xl font-bold text-foreground mb-4">1. Problem Understanding</h2>
      <div className="space-y-4">
        <div className="p-4 bg-muted rounded-lg">
          <h3 className="font-semibold text-foreground mb-2">Current Situation</h3>
          <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
            <li>12 GW total capacity (60% wind, 40% solar) across 5 zones</li>
            <li>Current reliability: 82% (energy delivered vs. forecasted demand)</li>
            <li>Storage & transmission losses: 11% average</li>
            <li>Challenges: Weather variability, demand mismatches, inefficient storage</li>
          </ul>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 border border-border rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Target className="w-5 h-5 text-primary" />
              <h4 className="font-semibold text-foreground">Goal 1: Reliability</h4>
            </div>
            <div className="text-sm space-y-1">
              <p className="text-muted-foreground">Increase by 15%</p>
              <p className="text-lg font-bold text-foreground">82% → 94%</p>
              <p className="text-xs text-secondary">Grid supply reliability improvement</p>
            </div>
          </div>

          <div className="p-4 border border-border rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              <h4 className="font-semibold text-foreground">Goal 2: Efficiency</h4>
            </div>
            <div className="text-sm space-y-1">
              <p className="text-muted-foreground">Reduce losses by 20%</p>
              <p className="text-lg font-bold text-foreground">11% → 8.8%</p>
              <p className="text-xs text-secondary">Storage & transmission losses</p>
            </div>
          </div>

          <div className="p-4 border border-border rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="w-5 h-5 text-primary" />
              <h4 className="font-semibold text-foreground">Goal 3: Profitability</h4>
            </div>
            <div className="text-sm space-y-1">
              <p className="text-muted-foreground">Maintain margin</p>
              <p className="text-lg font-bold text-foreground">≥15% EBITDA</p>
              <p className="text-xs text-secondary">Across all regions (INR)</p>
            </div>
          </div>
        </div>

        <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
          <h4 className="font-semibold text-foreground mb-2">Key Constraints</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
            <div>
              <span className="text-muted-foreground">• Reserve requirement:</span>
              <span className="font-medium text-foreground ml-2">5% capacity uncommitted</span>
            </div>
            <div>
              <span className="text-muted-foreground">• Price volatility:</span>
              <span className="font-medium text-foreground ml-2">±20% daily IEX variation</span>
            </div>
            <div>
              <span className="text-muted-foreground">• Decision frequency:</span>
              <span className="font-medium text-foreground ml-2">Hourly dispatch aligned to IEX</span>
            </div>
            <div>
              <span className="text-muted-foreground">• Storage capacity:</span>
              <span className="font-medium text-foreground ml-2">1 GWh battery + 2 GWh hydro</span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};
