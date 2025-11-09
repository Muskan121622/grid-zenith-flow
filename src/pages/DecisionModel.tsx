import { ProblemStatement } from "@/components/model/ProblemStatement";
import { AssumptionsInputs } from "@/components/model/AssumptionsInputs";
import { MLForecastingModels } from "@/components/model/MLForecastingModels";
import { OptimizationModel } from "@/components/model/OptimizationModel";
import { DynamicBiddingStrategy } from "@/components/model/DynamicBiddingStrategy";
import { SimulationResults } from "@/components/model/SimulationResults";
import { ScalabilityAnalysis } from "@/components/model/ScalabilityAnalysis";
import { ArrowLeft, Brain } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const DecisionModel = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-gradient-to-r from-primary to-accent text-white border-b border-primary/20">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between mb-4">
            <Link to="/">
              <Button variant="ghost" className="text-white hover:bg-white/10">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
          </div>
          <div className="flex items-center gap-3">
            <div className="p-3 bg-white/10 rounded-xl backdrop-blur-sm">
              <Brain className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold">
                AI-Powered Decision Model
              </h1>
              <p className="text-white/90 text-sm md:text-base mt-1">
                Comprehensive Framework for Renewable Energy Optimization & Grid Management
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 space-y-8">
        <ProblemStatement />
        <AssumptionsInputs />
        <MLForecastingModels />
        <OptimizationModel />
        <DynamicBiddingStrategy />
        <SimulationResults />
        <ScalabilityAnalysis />
      </main>

      {/* Footer */}
      <footer className="bg-card border-t border-border mt-12">
        <div className="container mx-auto px-4 py-6">
          <p className="text-center text-sm text-muted-foreground">
            AI-Powered Decision Model - Renewable Energy Optimization Platform
          </p>
        </div>
      </footer>
    </div>
  );
};

export default DecisionModel;
