import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { Play, Zap, TrendingUp, Battery, Droplets, Loader2 } from "lucide-react";
import { useState } from "react";

const OptimizationResults = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);

  const runOptimization = async () => {
    setIsRunning(true);
    setError(null);
    
    try {
      const response = await fetch('http://localhost:5000/api/optimize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          start_date: '2024-01-01',
          end_date: '2024-01-02',
          regions: ['North', 'South']
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        setResults(data);
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError('Failed to connect to optimization service');
    } finally {
      setIsRunning(false);
    }
  };

  const optimizationData = results ? 
    results.results.slice(0, 24).map((item, index) => ({
      hour: `${index.toString().padStart(2, '0')}:00`,
      generation: item.total_generation,
      demand: item.total_demand,
      price: item.price
    })) : [
      { hour: '00:00', generation: 8.5, demand: 9.2, price: 3200 },
      { hour: '06:00', generation: 9.8, demand: 11.5, price: 4100 },
      { hour: '12:00', generation: 12.2, demand: 13.8, price: 4800 },
      { hour: '18:00', generation: 10.1, demand: 15.2, price: 5200 },
      { hour: '23:00', generation: 7.8, demand: 8.9, price: 3800 }
    ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            AI-Driven Optimization Engine
          </CardTitle>
          <CardDescription>
            Real-time renewable energy dispatch optimization using trained ML models
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Button 
              onClick={runOptimization} 
              disabled={isRunning}
              className="w-full"
            >
              {isRunning ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Play className="mr-2 h-4 w-4" />
              )}
              {isRunning ? "Running Optimization..." : "Run Optimization"}
            </Button>
            
            {error && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-700">Error: {error}</p>
              </div>
            )}
            
            {results && (
              <div className="mt-4 space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="p-4 bg-green-50 rounded-lg">
                    <p className="text-sm text-green-600">Net Profit</p>
                    <p className="text-2xl font-bold text-green-700">
                      ₹{results.summary.net_profit.toLocaleString()}
                    </p>
                  </div>
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-600">Reliability</p>
                    <p className="text-2xl font-bold text-blue-700">
                      {(results.summary.avg_reliability * 100).toFixed(1)}%
                    </p>
                  </div>
                  <div className="p-4 bg-orange-50 rounded-lg">
                    <p className="text-sm text-orange-600">Grid Import</p>
                    <p className="text-2xl font-bold text-orange-700">
                      {results.summary.grid_import_total.toFixed(1)} GWh
                    </p>
                  </div>
                  <div className="p-4 bg-purple-50 rounded-lg">
                    <p className="text-sm text-purple-600">Grid Export</p>
                    <p className="text-2xl font-bold text-purple-700">
                      {results.summary.grid_export_total.toFixed(1)} GWh
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="energy" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="energy">Energy Balance</TabsTrigger>
          <TabsTrigger value="economics">Economics</TabsTrigger>
          <TabsTrigger value="kpis">KPIs</TabsTrigger>
        </TabsList>

        <TabsContent value="energy" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Generation vs Demand</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={optimizationData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="hour" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="generation" stroke="#10b981" strokeWidth={2} />
                  <Line type="monotone" dataKey="demand" stroke="#f59e0b" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="economics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-center">
                  <div className="text-3xl font-bold text-green-600">
                    ₹{results ? results.summary.net_profit.toLocaleString() : '4.3M'}
                  </div>
                  <div className="text-sm text-gray-500">Net Profit (24h)</div>
                </CardTitle>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-center">
                  <div className="text-3xl font-bold text-blue-600">
                    {results ? (results.summary.avg_reliability * 100).toFixed(1) : '94.2'}%
                  </div>
                  <div className="text-sm text-gray-500">Reliability Score</div>
                </CardTitle>
              </CardHeader>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="kpis" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {results && (
              <>
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">Total Revenue</p>
                        <p className="text-2xl font-bold">₹{results.summary.total_revenue.toLocaleString()}</p>
                      </div>
                      <TrendingUp className="h-8 w-8 text-green-500" />
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">Total Costs</p>
                        <p className="text-2xl font-bold">₹{results.summary.total_costs.toLocaleString()}</p>
                      </div>
                      <TrendingUp className="h-8 w-8 text-red-500" />
                    </div>
                  </CardContent>
                </Card>
              </>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default OptimizationResults;