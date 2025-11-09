import { Card } from "@/components/ui/card";
import { Zap, Battery, TrendingUp, DollarSign } from "lucide-react";

interface MetricCardProps {
  title: string;
  value: string;
  change: string;
  icon: React.ReactNode;
  trend: "up" | "down";
}

const MetricCard = ({ title, value, change, icon, trend }: MetricCardProps) => (
  <Card className="p-6 bg-card hover:shadow-lg transition-all duration-300">
    <div className="flex items-start justify-between">
      <div className="flex-1">
        <p className="text-sm font-medium text-muted-foreground mb-2">{title}</p>
        <p className="text-3xl font-bold text-foreground mb-1">{value}</p>
        <p className={`text-sm font-medium ${trend === "up" ? "text-secondary" : "text-destructive"}`}>
          {change}
        </p>
      </div>
      <div className="p-3 rounded-xl bg-primary/10">
        {icon}
      </div>
    </div>
  </Card>
);

export const EnergyMetrics = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <MetricCard
        title="Grid Reliability"
        value="94.3%"
        change="+15% vs baseline"
        icon={<Zap className="w-6 h-6 text-primary" />}
        trend="up"
      />
      <MetricCard
        title="Storage Efficiency"
        value="88.2%"
        change="-20% losses"
        icon={<Battery className="w-6 h-6 text-secondary" />}
        trend="up"
      />
      <MetricCard
        title="Total Capacity"
        value="12 GW"
        change="60% wind, 40% solar"
        icon={<TrendingUp className="w-6 h-6 text-accent" />}
        trend="up"
      />
      <MetricCard
        title="EBITDA Margin"
        value="18.5%"
        change="+3.5% above target"
        icon={<DollarSign className="w-6 h-6 text-energy-demand" />}
        trend="up"
      />
    </div>
  );
};
