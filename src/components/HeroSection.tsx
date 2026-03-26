import { Button } from "@/components/ui/button";
import { Zap, Brain, Globe } from "lucide-react";
import { motion } from "framer-motion";
import heroImg from "@/assets/hero-illustration.jpg";

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
        <div className="grid lg:grid-cols-2 gap-12 items-center max-w-7xl mx-auto">
          {/* Left content */}
          <div className="text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-royal/30 bg-royal/10 mb-8"
            >
              <span className="w-2 h-2 rounded-full bg-azure animate-pulse" />
              <span className="text-sm font-medium text-ice">AI-Powered Multilingual Platform</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-5xl md:text-7xl font-bold tracking-tight mb-6"
            >
              <span className="text-primary-foreground">UniSpeak</span>
              <br />
              <span className="text-gradient">Intelligence Engine</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-lg md:text-xl text-ice/70 max-w-xl mb-10 leading-relaxed"
            >
              A comprehensive AI-powered communication platform designed to break language barriers
              with contextual memory, adaptive language switching, and sentiment-aware responses.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
            >
              <Button variant="hero" size="lg" className="text-base px-8 py-6">
                <Zap className="mr-2 h-5 w-5" />
                Get Started
              </Button>
              <Button variant="hero-outline" size="lg" className="text-base px-8 py-6 text-ice border-ice/30 hover:bg-ice/10">
                View Documentation
              </Button>
            </motion.div>

            {/* Stats row */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="mt-12 grid grid-cols-3 gap-8 max-w-md"
            >
              {[
                { icon: Globe, label: "Languages", value: "50+" },
                { icon: Brain, label: "Accuracy", value: "99.2%" },
                { icon: Zap, label: "Latency", value: "<100ms" },
              ].map((stat) => (
                <div key={stat.label} className="text-center lg:text-left">
                  <stat.icon className="w-5 h-5 text-azure mx-auto lg:mx-0 mb-2" />
                  <div className="text-2xl font-bold text-primary-foreground">{stat.value}</div>
                  <div className="text-sm text-ice/50">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, x: 40 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="relative hidden lg:block"
          >
            <div className="relative rounded-3xl overflow-hidden border border-royal/20 shadow-elevated">
              <img
                src={heroImg}
                alt="UniSpeak AI neural network visualization"
                className="w-full h-auto object-cover"
                width={1280}
                height={720}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-navy/60 via-transparent to-transparent" />
            </div>
            {/* Floating badge */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -bottom-4 -left-4 px-5 py-3 rounded-xl glass shadow-elevated"
            >
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-azure animate-pulse" />
                <span className="text-sm font-semibold text-foreground">Live Translation</span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
