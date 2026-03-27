import { Button } from "@/components/ui/button";
import { Zap, Brain, Globe, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import heroImg from "@/assets/hero-immersive.jpg";
import { useNavigate } from "react-router-dom";

const HeroSection = () => {
  const navigate = useNavigate();
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Full-screen background image */}
      <div className="absolute inset-0">
        <img
          src={heroImg}
          alt="UniSpeak AI multilingual visualization"
          className="w-full h-full object-cover"
          width={1920}
          height={1080}
        />
        {/* Gradient overlays for depth */}
        <div className="absolute inset-0 bg-gradient-to-r from-navy/95 via-navy/70 to-navy/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-navy/80 via-transparent to-navy/60" />
      </div>

      {/* Animated particles / dots */}
      <div className="absolute inset-0 opacity-[0.08]" style={{
        backgroundImage: `radial-gradient(circle at 1px 1px, hsl(0 0% 100%) 1px, transparent 0)`,
        backgroundSize: '48px 48px'
      }} />

      {/* Floating glow orbs */}
      <motion.div
        animate={{ y: [0, -30, 0], opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[20%] right-[20%] w-64 h-64 rounded-full bg-royal/25 blur-[100px]"
      />
      <motion.div
        animate={{ y: [0, 20, 0], opacity: [0.2, 0.5, 0.2] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        className="absolute bottom-[20%] left-[15%] w-80 h-80 rounded-full bg-azure/20 blur-[120px]"
      />

      <div className="container relative z-10 py-24 md:py-32">
        <div className="max-w-3xl">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-royal/30 bg-royal/10 backdrop-blur-sm mb-8"
          >
            <span className="w-2 h-2 rounded-full bg-azure animate-pulse" />
            <span className="text-sm font-medium text-ice">AI-Powered Multilingual Platform</span>
          </motion.div>

          {/* Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-6 leading-[0.95]"
          >
            <span className="text-primary-foreground">Break Every</span>
            <br />
            <span className="text-gradient">Language Barrier</span>
          </motion.h1>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.25 }}
            className="text-lg md:text-xl text-ice/70 max-w-xl mb-10 leading-relaxed"
          >
            UniSpeak AI transforms multilingual communication with contextual memory,
            adaptive language switching, and sentiment-aware intelligence — in real time.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.35 }}
            className="flex flex-col sm:flex-row gap-4 mb-16"
          >
            <Button variant="hero" size="lg" className="text-base px-8 py-6 group" onClick={() => navigate('/unispeak')}>
              <Zap className="mr-2 h-5 w-5" />
              Get Started Free
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button variant="hero-outline" size="lg" className="text-base px-8 py-6 text-ice border-ice/30 hover:bg-ice/10">
              Watch Demo
            </Button>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="flex flex-wrap gap-8 md:gap-12"
          >
            {[
              { icon: Globe, label: "Languages", value: "50+" },
              { icon: Brain, label: "Accuracy", value: "99.2%" },
              { icon: Zap, label: "Latency", value: "<100ms" },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.6 + i * 0.1 }}
                className="flex items-center gap-3"
              >
                <div className="w-10 h-10 rounded-xl bg-royal/20 backdrop-blur-sm flex items-center justify-center border border-royal/20">
                  <stat.icon className="w-5 h-5 text-azure" />
                </div>
                <div>
                  <div className="text-xl font-bold text-primary-foreground">{stat.value}</div>
                  <div className="text-xs text-ice/50 uppercase tracking-wider">{stat.label}</div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
};

export default HeroSection;
