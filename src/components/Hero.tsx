import { Shield, Eye, Sparkles } from "lucide-react";

const Hero = () => {
  return (
    <section className="relative overflow-hidden px-6 py-20 md:py-32">
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-destructive/10 animate-pulse-glow" />
      
      {/* Grid overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(187,239,253,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(187,239,253,0.05)_1px,transparent_1px)] bg-[size:4rem_4rem]" />
      
      <div className="relative mx-auto max-w-7xl text-center">
        <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-glass bg-glass px-6 py-3 backdrop-blur-xl">
          <Sparkles className="h-5 w-5 text-primary" />
          <span className="text-sm font-medium text-foreground">
            Powered by Advanced AI & Explainable ML
          </span>
        </div>
        
        <h1 className="mb-6 text-5xl font-bold tracking-tight text-foreground md:text-7xl">
          TruthLens
          <span className="bg-gradient-primary bg-clip-text text-transparent"> AI </span>
        </h1>
        
        <p className="mx-auto mb-12 max-w-3xl text-lg text-muted-foreground md:text-xl">
          Advanced AI-powered analysis that not only detects manipulated videos but explains 
          <span className="text-foreground font-semibold"> exactly why </span>
          they're suspicious. Fighting misinformation with transparency.
        </p>
        
        <div className="grid gap-6 md:grid-cols-3 mx-auto max-w-4xl mb-16">
          <div className="rounded-2xl border border-glass bg-glass p-6 backdrop-blur-xl shadow-card hover:shadow-glow transition-all duration-300">
            <div className="mb-4 inline-flex items-center justify-center rounded-xl bg-primary/10 p-3">
              <Shield className="h-6 w-6 text-primary" />
            </div>
            <h3 className="mb-2 text-lg font-semibold text-foreground">
              Multi-Modal Analysis
            </h3>
            <p className="text-sm text-muted-foreground">
              Analyzes video frames, audio patterns, and temporal inconsistencies
            </p>
          </div>
          
          <div className="rounded-2xl border border-glass bg-glass p-6 backdrop-blur-xl shadow-card hover:shadow-glow transition-all duration-300">
            <div className="mb-4 inline-flex items-center justify-center rounded-xl bg-primary/10 p-3">
              <Eye className="h-6 w-6 text-primary" />
            </div>
            <h3 className="mb-2 text-lg font-semibold text-foreground">
              Explainable AI
            </h3>
            <p className="text-sm text-muted-foreground">
              Visual heatmaps and detailed reasoning for every detection
            </p>
          </div>
          
          <div className="rounded-2xl border border-glass bg-glass p-6 backdrop-blur-xl shadow-card hover:shadow-glow transition-all duration-300">
            <div className="mb-4 inline-flex items-center justify-center rounded-xl bg-primary/10 p-3">
              <Sparkles className="h-6 w-6 text-primary" />
            </div>
            <h3 className="mb-2 text-lg font-semibold text-foreground">
              Real-Time Results
            </h3>
            <p className="text-sm text-muted-foreground">
              Fast processing with frame-by-frame confidence scoring
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
