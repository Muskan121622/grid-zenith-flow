import { Card } from "@/components/ui/card";
import { Database, CloudRain, Zap, Battery } from "lucide-react";

export const AssumptionsInputs = () => {
  return (
    <Card className="p-6">
      <h2 className="text-2xl font-bold text-foreground mb-4">2. Assumptions & Input Data</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="p-4 border border-border rounded-lg">
            <div className="flex items-center gap-2 mb-3">
              <Database className="w-5 h-5 text-primary" />
              <h3 className="font-semibold text-foreground">Historical Data (5 Years)</h3>
            </div>
            <ul className="text-sm text-muted-foreground space-y-2">
              <li className="flex justify-between">
                <span>• Hourly generation logs</span>
                <span className="text-foreground font-medium">43,800 records/zone</span>
              </li>
              <li className="flex justify-between">
                <span>• Regional demand data</span>
                <span className="text-foreground font-medium">43,800 records/region</span>
              </li>
              <li className="flex justify-between">
                <span>• Weather patterns</span>
                <span className="text-foreground font-medium">Irradiance, wind, temp</span>
              </li>
              <li className="flex justify-between">
                <span>• IEX market prices</span>
                <span className="text-foreground font-medium">INR/MWh (hourly)</span>
              </li>
              <li className="flex justify-between">
                <span>• Storage utilization</span>
                <span className="text-foreground font-medium">SoC & cycle data</span>
              </li>
            </ul>
          </div>

          <div className="p-4 border border-border rounded-lg">
            <div className="flex items-center gap-2 mb-3">
              <CloudRain className="w-5 h-5 text-primary" />
              <h3 className="font-semibold text-foreground">Weather Features</h3>
            </div>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="p-2 bg-muted rounded">
                <p className="text-muted-foreground text-xs">Solar</p>
                <p className="font-medium text-foreground">Irradiance (W/m²)</p>
              </div>
              <div className="p-2 bg-muted rounded">
                <p className="text-muted-foreground text-xs">Wind</p>
                <p className="font-medium text-foreground">Speed (m/s)</p>
              </div>
              <div className="p-2 bg-muted rounded">
                <p className="text-muted-foreground text-xs">Cloud</p>
                <p className="font-medium text-foreground">Cover (%)</p>
              </div>
              <div className="p-2 bg-muted rounded">
                <p className="text-muted-foreground text-xs">Temperature</p>
                <p className="font-medium text-foreground">°C (ambient)</p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="p-4 border border-border rounded-lg">
            <div className="flex items-center gap-2 mb-3">
              <Zap className="w-5 h-5 text-primary" />
              <h3 className="font-semibold text-foreground">Generation Capacity</h3>
            </div>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between items-center p-2 bg-muted rounded">
                <span className="text-muted-foreground">Total Installed</span>
                <span className="text-lg font-bold text-foreground">12 GW</span>
              </div>
              <div className="flex justify-between items-center p-2 bg-primary/5 rounded">
                <span className="text-muted-foreground">Wind (60%)</span>
                <span className="font-semibold text-foreground">7.2 GW</span>
              </div>
              <div className="flex justify-between items-center p-2 bg-accent/5 rounded">
                <span className="text-muted-foreground">Solar (40%)</span>
                <span className="font-semibold text-foreground">4.8 GW</span>
              </div>
              <div className="flex justify-between items-center p-2 bg-secondary/5 rounded">
                <span className="text-muted-foreground">Reserve (5%)</span>
                <span className="font-semibold text-foreground">600 MW</span>
              </div>
            </div>
          </div>

          <div className="p-4 border border-border rounded-lg">
            <div className="flex items-center gap-2 mb-3">
              <Battery className="w-5 h-5 text-primary" />
              <h3 className="font-semibold text-foreground">Storage Systems</h3>
            </div>
            <div className="space-y-2 text-sm">
              <div className="p-3 bg-muted rounded">
                <div className="flex justify-between mb-1">
                  <span className="font-medium text-foreground">Battery Banks</span>
                  <span className="text-xs text-secondary">88% efficiency</span>
                </div>
                <div className="flex justify-between text-muted-foreground text-xs">
                  <span>1 GWh energy</span>
                  <span>400 MW power</span>
                </div>
              </div>
              <div className="p-3 bg-muted rounded">
                <div className="flex justify-between mb-1">
                  <span className="font-medium text-foreground">Pumped Hydro</span>
                  <span className="text-xs text-secondary">80% efficiency</span>
                </div>
                <div className="flex justify-between text-muted-foreground text-xs">
                  <span>2 GWh energy</span>
                  <span>500 MW power</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 p-4 bg-primary/5 border border-primary/20 rounded-lg">
        <h4 className="font-semibold text-foreground mb-2 text-sm">Key Operating Parameters</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
          <div>
            <span className="text-muted-foreground">O&M Cost:</span>
            <span className="font-medium text-foreground ml-1">₹250/MWh</span>
          </div>
          <div>
            <span className="text-muted-foreground">Battery Degradation:</span>
            <span className="font-medium text-foreground ml-1">₹80/MWh/cycle</span>
          </div>
          <div>
            <span className="text-muted-foreground">Transmission Loss:</span>
            <span className="font-medium text-foreground ml-1">11% baseline</span>
          </div>
          <div>
            <span className="text-muted-foreground">IEX Window:</span>
            <span className="font-medium text-foreground ml-1">Hourly bidding</span>
          </div>
        </div>
      </div>
    </Card>
  );
};
