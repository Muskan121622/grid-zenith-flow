import { ProblemStatement } from "@/components/model/ProblemStatement";
import { AssumptionsInputs } from "@/components/model/AssumptionsInputs";
import { MLForecastingModels } from "@/components/model/MLForecastingModels";
import { OptimizationModel } from "@/components/model/OptimizationModel";
import { DynamicBiddingStrategy } from "@/components/model/DynamicBiddingStrategy";
import { SimulationResults } from "@/components/model/SimulationResults";
import { ScalabilityAnalysis } from "@/components/model/ScalabilityAnalysis";
import OptimizationResults from "@/components/model/OptimizationResults";
import { ArrowLeft, Brain } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import ThemeToggle from "@/components/ThemeToggle";

const DecisionModel = () => {
  return (
    <div className="min-h-screen bg-background dark:bg-gradient-to-br dark:from-slate-900 dark:via-purple-900/20 dark:to-slate-900">
      {/* Header */}
      <header className="bg-gradient-to-r from-primary to-accent dark:from-purple-900/50 dark:to-blue-900/50 text-white border-b border-primary/20 dark:border-purple-500/20 dark:backdrop-blur-xl">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between mb-4">
            <Link to="/">
              <Button variant="ghost" className="text-white hover:bg-white/10 dark:hover:bg-white/5">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
            <ThemeToggle />
          </div>
          <div className="flex items-center gap-3">
            <div className="p-3 bg-white/10 dark:bg-white/5 rounded-xl backdrop-blur-sm dark:backdrop-blur-xl">
              <Brain className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold">
                AI-Powered Decision Model
              </h1>
              <p className="text-white/90 dark:text-white/80 text-sm md:text-base mt-1">
                Comprehensive Framework for Renewable Energy Optimization & Grid Management
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 space-y-8 dark:text-white">
        <ProblemStatement />
        <AssumptionsInputs />
        <MLForecastingModels />
        <OptimizationModel />
        <OptimizationResults />
        <DynamicBiddingStrategy />
        <SimulationResults />
        <ScalabilityAnalysis />
      </main>

      {/* Footer */}
      <footer className="bg-card dark:bg-slate-900/50 dark:backdrop-blur-xl border-t border-border dark:border-purple-500/20 mt-12">
        <div className="container mx-auto px-4 py-6">
          <p className="text-center text-sm text-muted-foreground dark:text-white/60">
            AI-Powered Decision Model - Renewable Energy Optimization Platform
          </p>
        </div>
      </footer>
    </div>
  );
};

export default DecisionModel;
