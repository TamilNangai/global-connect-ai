import { 
  Brain, MessageSquare, Shield, Gauge, 
  UserCheck, RefreshCw, BarChart3, Layers,
  Heart, Puzzle
} from "lucide-react";
import { motion } from "framer-motion";

const features = [
  {
    icon: Brain,
    title: "Contextual Memory Layer",
    description: "Maintains conversational history for multi-turn interactions, enabling coherent and human-like follow-up responses."
  },
  {
    icon: MessageSquare,
    title: "Adaptive Language Switching",
    description: "Dynamically adjusts response language based on user behavior over time for a personalized experience."
  },
  {
    icon: UserCheck,
    title: "User Profiling",
    description: "Lightweight preference storage for personalized greetings, customized responses, and improved engagement."
  },
  {
    icon: Gauge,
    title: "Async Processing",
    description: "Efficient request handling with low latency, supporting concurrent users in real-world deployment."
  },
  {
    icon: RefreshCw,
    title: "Fallback Mechanisms",
    description: "Graceful degradation with rule-based responses or cached outputs when external APIs fail."
  },
  {
    icon: Shield,
    title: "Security & Safety",
    description: "Input sanitization, rate limiting, and secure API key management to prevent misuse."
  },
  {
    icon: Heart,
    title: "Sentiment Analysis",
    description: "Detects emotional tone and adapts responses — valuable for healthcare, support, and emergency contexts."
  },
  {
    icon: BarChart3,
    title: "Logging & Monitoring",
    description: "Track errors, analyze usage trends, and continuously improve model performance with comprehensive analytics."
  },
  {
    icon: Layers,
    title: "Modular Architecture",
    description: "Clearly defined services enabling future extensions like image input, multimodal understanding, and voice assistants."
  },
  {
    icon: Puzzle,
    title: "Feedback Loop",
    description: "Users rate responses and provide corrections, enabling adaptive tuning and continuous improvement."
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } }
};

const FeaturesSection = () => {
  return (
    <section className="py-24 bg-background relative">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-royal/30 to-transparent" />
      
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <span className="text-sm font-semibold tracking-wider uppercase text-royal">Core Capabilities</span>
          <h2 className="text-4xl md:text-5xl font-bold mt-3 mb-5 text-foreground">
            Beyond Simple Translation
          </h2>
          <p className="text-muted-foreground text-lg">
            A complete multilingual communication platform with intelligence, memory, and adaptability built in.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto"
        >
          {features.map((feature) => (
            <motion.div
              key={feature.title}
              variants={itemVariants}
              whileHover={{ y: -6, scale: 1.02 }}
              className="group relative p-6 rounded-xl bg-card-gradient shadow-card border border-border/50 hover:shadow-elevated transition-shadow duration-300"
            >
              <div className="w-12 h-12 rounded-lg bg-royal/10 flex items-center justify-center mb-4 group-hover:bg-royal/20 group-hover:scale-110 transition-all duration-300">
                <feature.icon className="w-6 h-6 text-royal" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">{feature.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturesSection;
