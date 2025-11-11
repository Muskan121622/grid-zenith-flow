import { EnergyMetrics } from "@/components/EnergyMetrics";
import { EnergyZoneMap } from "@/components/EnergyZoneMap";
import { StorageOptimization } from "@/components/StorageOptimization";
import { AIChat } from "@/components/AIChat";
import { Zap, Brain, TrendingUp, BookOpen } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import ThemeToggle from "@/components/ThemeToggle";

const Index = () => {
  return (
    <div className="min-h-screen bg-background dark:bg-gradient-to-br dark:from-slate-900 dark:via-purple-900/20 dark:to-slate-900">
      {/* Hero Header */}
      <header className="bg-gradient-to-r from-primary to-accent dark:from-purple-900/50 dark:to-blue-900/50 text-white dark:backdrop-blur-xl dark:border-b dark:border-purple-500/20">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
            <div className="p-3 bg-white/10 dark:bg-white/5 rounded-xl backdrop-blur-sm dark:backdrop-blur-xl">
              <Zap className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold">
                Renewable Energy Optimization Platform
              </h1>
              <p className="text-white/90 dark:text-white/80 text-sm md:text-base mt-1">
                AI-Powered Decision Framework for Real-Time Energy Allocation & Grid Management
              </p>
            </div>
            </div>
            <div className="flex items-center gap-4">
              <ThemeToggle />
              <Link to="/decision-model">
                <div className="relative group">
                  <div className="absolute -inset-1 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 rounded-lg blur opacity-0 group-hover:opacity-75 transition duration-1000 group-hover:duration-200 animate-tilt"></div>
                  <Button className="relative bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 dark:from-purple-500 dark:to-violet-600 dark:hover:from-purple-600 dark:hover:to-violet-700 text-white border-0 shadow-lg transition-all duration-300 animate-bloom">
                    <BookOpen className="w-4 h-4 mr-2" />
                    View Decision Model
                  </Button>
                </div>
              </Link>
            </div>
          </div>
          <div className="flex flex-wrap gap-4 mt-6">
            <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-lg backdrop-blur-sm">
              <Brain className="w-5 h-5" />
              <span className="text-sm font-medium">ML Forecasting</span>
            </div>
            <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-lg backdrop-blur-sm">
              <TrendingUp className="w-5 h-5" />
              <span className="text-sm font-medium">Dynamic Bidding</span>
            </div>
            <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-lg backdrop-blur-sm">
              <Zap className="w-5 h-5" />
              <span className="text-sm font-medium">Storage Optimization</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 space-y-8 dark:text-white">
        {/* Key Metrics */}
        <section>
          <h2 className="text-2xl font-bold text-foreground mb-4">Key Performance Indicators</h2>
          <EnergyMetrics />
        </section>

        {/* Energy Zones */}
        <section>
          <EnergyZoneMap />
        </section>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Storage Optimization */}
          <section>
            <StorageOptimization />
          </section>

          {/* AI Chat Assistant */}
          <section>
            <AIChat />
          </section>
        </div>

        {/* Case Study Overview */}
        <section className="bg-card rounded-lg p-6 border border-border">
          <h2 className="text-2xl font-bold text-foreground mb-4">Solution Architecture</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <div className="text-3xl mb-2">🎯</div>
              <h3 className="font-semibold text-foreground">Objectives</h3>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• 15% reliability increase (82% → 94%)</li>
                <li>• 20% loss reduction (11% → 8.8%)</li>
                <li>• Maintain 15%+ EBITDA margin</li>
              </ul>
            </div>
            <div className="space-y-2">
              <div className="text-3xl mb-2">🤖</div>
              <h3 className="font-semibold text-foreground">AI/ML Models</h3>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Weather → generation forecasting</li>
                <li>• Regional demand prediction</li>
                <li>• IEX price forecasting</li>
                <li>• Probabilistic scenarios</li>
              </ul>
            </div>
            <div className="space-y-2">
              <div className="text-3xl mb-2">⚡</div>
              <h3 className="font-semibold text-foreground">Optimization</h3>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Model Predictive Control (MPC)</li>
                <li>• Storage charge/discharge scheduling</li>
                <li>• Dynamic IEX bidding strategy</li>
                <li>• Real-time dispatch decisions</li>
              </ul>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-card border-t border-border mt-12">
        <div className="container mx-auto px-4 py-6">
          <p className="text-center text-sm text-muted-foreground">
            Renewable Energy Optimization Platform - AI-Powered Grid Management System
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
