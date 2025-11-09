import { Card } from "@/components/ui/card";
import { Calculator, Zap, Battery, TrendingDown } from "lucide-react";

export const OptimizationModel = () => {
  return (
    <Card className="p-6">
      <h2 className="text-2xl font-bold text-foreground mb-4">4. Optimization Model Formulation</h2>
      
      <div className="space-y-6">
        <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
          <div className="flex items-center gap-2 mb-3">
            <Calculator className="w-5 h-5 text-primary" />
            <h3 className="font-semibold text-foreground">Mathematical Objective Function</h3>
          </div>
          <div className="p-4 bg-card rounded-lg font-mono text-xs overflow-x-auto">
            <div className="text-foreground mb-2">
              <strong>Maximize:</strong> 𝐸[Revenue - Costs - Penalties + Reliability Gain]
            </div>
            <div className="text-muted-foreground space-y-1 pl-4">
              <div>= 𝐸[∑<sub>t∈T</sub> (∑<sub>i,r</sub> P<sub>t</sub> · (1 - λ<sub>i→r</sub>) · x<sub>i→r,t</sub> - O&M · x<sub>i→r,t</sub></div>
              <div className="pl-4">- ∑<sub>s</sub> deg<sub>s</sub> · d<sub>s,t</sub></div>
              <div className="pl-4">- penalty<sub>short</sub> · short<sub>r,t</sub></div>
              <div className="pl-4">- penalty<sub>curt</sub> · curt<sub>i,t</sub>)]</div>
              <div>+ w<sub>rel</sub> · 𝐸[ReliabilityGain]</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="p-4 border border-border rounded-lg">
            <h3 className="font-semibold text-foreground mb-3 text-sm flex items-center gap-2">
              <Zap className="w-4 h-4 text-primary" />
              Decision Variables
            </h3>
            <div className="space-y-2 text-xs">
              <div className="p-2 bg-muted rounded">
                <div className="font-mono text-foreground">x<sub>i→r,t</sub></div>
                <div className="text-muted-foreground">Energy dispatched from zone i to region r at hour t (MWh)</div>
              </div>
              <div className="p-2 bg-muted rounded">
                <div className="font-mono text-foreground">c<sub>s,t</sub>, d<sub>s,t</sub></div>
                <div className="text-muted-foreground">Storage s charge/discharge power at hour t (MW)</div>
              </div>
              <div className="p-2 bg-muted rounded">
                <div className="font-mono text-foreground">S<sub>s,t</sub></div>
                <div className="text-muted-foreground">State of Charge (SoC) of storage s at hour t (MWh)</div>
              </div>
              <div className="p-2 bg-muted rounded">
                <div className="font-mono text-foreground">b<sub>t</sub></div>
                <div className="text-muted-foreground">IEX bid amount and price at hour t (MWh, INR/MWh)</div>
              </div>
            </div>
          </div>

          <div className="p-4 border border-border rounded-lg">
            <h3 className="font-semibold text-foreground mb-3 text-sm flex items-center gap-2">
              <Battery className="w-4 h-4 text-primary" />
              Key Constraints
            </h3>
            <div className="space-y-2 text-xs">
              <div className="p-2 bg-muted rounded">
                <div className="font-medium text-foreground mb-1">Energy Balance</div>
                <div className="font-mono text-muted-foreground text-[10px]">∑<sub>r</sub> x<sub>i→r,t</sub> + c<sub>s,t</sub> ≤ G<sub>i,t</sub></div>
              </div>
              <div className="p-2 bg-muted rounded">
                <div className="font-medium text-foreground mb-1">Storage Dynamics</div>
                <div className="font-mono text-muted-foreground text-[10px]">S<sub>s,t+1</sub> = S<sub>s,t</sub> + η<sub>s</sub><sup>ch</sup>c<sub>s,t</sub> - d<sub>s,t</sub>/η<sub>s</sub><sup>dis</sup></div>
              </div>
              <div className="p-2 bg-muted rounded">
                <div className="font-medium text-foreground mb-1">Reserve Requirement</div>
                <div className="font-mono text-muted-foreground text-[10px]">∑<sub>i,r</sub> x<sub>i→r,t</sub> ≤ (1 - 0.05) · Capacity<sub>t</sub></div>
              </div>
              <div className="p-2 bg-muted rounded">
                <div className="font-medium text-foreground mb-1">Storage Bounds</div>
                <div className="font-mono text-muted-foreground text-[10px]">0 ≤ S<sub>s,t</sub> ≤ S<sub>s</sub><sup>max</sup>, 0 ≤ c<sub>s,t</sub> ≤ C<sub>s</sub><sup>max</sup></div>
              </div>
            </div>
          </div>
        </div>

        <div className="p-4 border border-border rounded-lg">
          <h3 className="font-semibold text-foreground mb-3 text-sm flex items-center gap-2">
            <TrendingDown className="w-4 h-4 text-primary" />
            Loss & Penalty Terms
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="p-3 bg-muted rounded">
              <div className="font-medium text-foreground mb-2">Curtailment Loss</div>
              <div className="font-mono text-muted-foreground text-[10px] mb-2">
                curt<sub>i,t</sub> = max(0, G<sub>i,t</sub> - ∑<sub>r</sub> x<sub>i→r,t</sub> - ∑<sub>s</sub> c<sub>s,t</sub>)
              </div>
              <div className="text-muted-foreground">Unused generation capacity</div>
            </div>
            <div className="p-3 bg-muted rounded">
              <div className="font-medium text-foreground mb-2">Shortage Penalty</div>
              <div className="font-mono text-muted-foreground text-[10px] mb-2">
                short<sub>r,t</sub> = max(0, D<sub>r,t</sub> - ∑<sub>i</sub> (1-λ<sub>i→r</sub>)x<sub>i→r,t</sub>)
              </div>
              <div className="text-muted-foreground">Unmet regional demand</div>
            </div>
            <div className="p-3 bg-muted rounded">
              <div className="font-medium text-foreground mb-2">Transmission Loss</div>
              <div className="font-mono text-muted-foreground text-[10px] mb-2">
                λ<sub>i→r</sub> · x<sub>i→r,t</sub>
              </div>
              <div className="text-muted-foreground">Distance-based loss factor</div>
            </div>
          </div>
        </div>

        <div className="p-4 bg-accent/5 border border-accent/20 rounded-lg">
          <h3 className="font-semibold text-foreground mb-3 text-sm">Solution Method: Model Predictive Control (MPC)</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <h4 className="font-medium text-foreground mb-2">Approach</h4>
              <ul className="space-y-1 text-muted-foreground">
                <li>• Rolling horizon optimization (24-72h window)</li>
                <li>• Stochastic programming with scenario generation</li>
                <li>• Sample Average Approximation (SAA) with 100-500 scenarios</li>
                <li>• Mixed-integer linear programming (MILP) solver</li>
                <li>• Receding horizon execution (implement hour t, replan)</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-foreground mb-2">Implementation</h4>
              <ul className="space-y-1 text-muted-foreground">
                <li>• Solver: Gurobi / CPLEX for large-scale LP/MILP</li>
                <li>• CVaR objective for tail-risk hedging</li>
                <li>• Affine recourse policies for computational efficiency</li>
                <li>• Fallback rules for infeasibility (market procurement)</li>
                <li>• Solve time target: &lt;5 min per decision epoch</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="p-4 bg-secondary/5 border border-secondary/20 rounded-lg">
          <h3 className="font-semibold text-foreground mb-2 text-sm">Reliability Metric</h3>
          <div className="font-mono text-xs text-foreground p-3 bg-card rounded">
            Reliability = (∑<sub>t</sub> ∑<sub>r</sub> min(D<sub>r,t</sub>, delivered<sub>r,t</sub>)) / (∑<sub>t</sub> ∑<sub>r</sub> D<sub>r,t</sub>)
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Target: Maximize reliability from 82% baseline to ≥94% while maintaining EBITDA ≥15%
          </p>
        </div>
      </div>
    </Card>
  );
};
