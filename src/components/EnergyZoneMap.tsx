import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Zone {
  id: string;
  name: string;
  capacity: string;
  type: "wind" | "solar" | "mixed";
  status: "optimal" | "surplus" | "deficit";
}

const zones: Zone[] = [
  { id: "Z1", name: "North Zone", capacity: "3.2 GW", type: "wind", status: "optimal" },
  { id: "Z2", name: "South Zone", capacity: "2.8 GW", type: "solar", status: "surplus" },
  { id: "Z3", name: "East Zone", capacity: "2.4 GW", type: "mixed", status: "optimal" },
  { id: "Z4", name: "West Zone", capacity: "2.1 GW", type: "wind", status: "deficit" },
  { id: "Z5", name: "Central Zone", capacity: "1.5 GW", type: "solar", status: "optimal" },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case "optimal":
      return "bg-secondary text-secondary-foreground";
    case "surplus":
      return "bg-accent text-accent-foreground";
    case "deficit":
      return "bg-destructive text-destructive-foreground";
    default:
      return "bg-muted text-muted-foreground";
  }
};

const getTypeIcon = (type: string) => {
  switch (type) {
    case "wind":
      return "🌬️";
    case "solar":
      return "☀️";
    case "mixed":
      return "⚡";
    default:
      return "🔋";
  }
};

export const EnergyZoneMap = () => {
  return (
    <Card className="p-6">
      <h3 className="text-xl font-bold text-foreground mb-6">Energy Zones Overview</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {zones.map((zone) => (
          <div
            key={zone.id}
            className="p-4 rounded-lg border border-border bg-card hover:shadow-md transition-all duration-300"
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <p className="text-lg font-bold text-foreground">{zone.name}</p>
                <p className="text-sm text-muted-foreground">{zone.id}</p>
              </div>
              <span className="text-2xl">{getTypeIcon(zone.type)}</span>
            </div>
            <p className="text-xl font-semibold text-primary mb-2">{zone.capacity}</p>
            <Badge className={getStatusColor(zone.status)} variant="secondary">
              {zone.status.toUpperCase()}
            </Badge>
          </div>
        ))}
      </div>
      <div className="mt-6 p-4 bg-muted rounded-lg">
        <div className="flex items-center justify-between text-sm">
          <div>
            <span className="font-medium text-foreground">Total Installed: </span>
            <span className="text-muted-foreground">12 GW</span>
          </div>
          <div>
            <span className="font-medium text-foreground">Wind: </span>
            <span className="text-muted-foreground">7.2 GW (60%)</span>
          </div>
          <div>
            <span className="font-medium text-foreground">Solar: </span>
            <span className="text-muted-foreground">4.8 GW (40%)</span>
          </div>
        </div>
      </div>
    </Card>
  );
};
