import { Button } from "@/components/ui/button";
import { Globe, Zap, Brain } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-hero">
      {/* Abstract grid pattern */}
      <div className="absolute inset-0 opacity-[0.07]" style={{
        backgroundImage: `radial-gradient(circle at 1px 1px, hsl(0 0% 100%) 1px, transparent 0)`,
        backgroundSize: '40px 40px'
      }} />
      
      {/* Floating orbs */}
      <div className="absolute top-20 right-[15%] w-72 h-72 rounded-full bg-royal/20 blur-[100px] animate-pulse-glow" />
      <div className="absolute bottom-20 left-[10%] w-96 h-96 rounded-full bg-azure/15 blur-[120px]" />

      <div className="container relative z-10 py-20">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-royal/30 bg-royal/10 mb-8 animate-fade-in">
            <span className="w-2 h-2 rounded-full bg-azure animate-pulse" />
            <span className="text-sm font-medium text-ice">AI-Powered Multilingual Platform</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 animate-fade-in" style={{ animationDelay: '0.1s' }}>
            <span className="text-primary-foreground">Multilingual</span>
            <br />
            <span className="text-gradient">Intelligence Engine</span>
          </h1>

          <p className="text-lg md:text-xl text-ice/70 max-w-2xl mx-auto mb-10 leading-relaxed animate-fade-in" style={{ animationDelay: '0.2s' }}>
            A comprehensive AI-powered communication platform designed to break language barriers 
            with contextual memory, adaptive language switching, and sentiment-aware responses.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <Button variant="hero" size="lg" className="text-base px-8 py-6">
              <Zap className="mr-2 h-5 w-5" />
              Get Started
            </Button>
            <Button variant="hero-outline" size="lg" className="text-base px-8 py-6 text-ice border-ice/30 hover:bg-ice/10">
              View Documentation
            </Button>
          </div>

          {/* Stats row */}
          <div className="mt-16 grid grid-cols-3 gap-8 max-w-lg mx-auto animate-fade-in" style={{ animationDelay: '0.5s' }}>
            {[
              { icon: Globe, label: "Languages", value: "50+" },
              { icon: Brain, label: "Accuracy", value: "99.2%" },
              { icon: Zap, label: "Latency", value: "<100ms" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <stat.icon className="w-5 h-5 text-azure mx-auto mb-2" />
                <div className="text-2xl font-bold text-primary-foreground">{stat.value}</div>
                <div className="text-sm text-ice/50">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
