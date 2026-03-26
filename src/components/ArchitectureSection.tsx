import { motion } from "framer-motion";
import architectureBg from "@/assets/architecture-bg.jpg";

const steps = [
  {
    number: "01",
    title: "Input Processing",
    description: "User input is received, sanitized, and preprocessed. Language detection identifies the input language with high confidence.",
  },
  {
    number: "02",
    title: "Context & Memory",
    description: "The contextual memory layer retrieves conversation history. User profile data enriches understanding for personalized responses.",
  },
  {
    number: "03",
    title: "AI Processing",
    description: "Sentiment analysis evaluates emotional tone. Domain-specific modules activate for specialized contexts like healthcare or education.",
  },
  {
    number: "04",
    title: "Response Generation",
    description: "Intelligent response generated in the appropriate language with adaptive switching. Caching stores results for future optimization.",
  },
];

const ArchitectureSection = () => {
  return (
    <section className="py-24 bg-hero relative overflow-hidden">
      {/* Background image overlay */}
      <div className="absolute inset-0 opacity-20">
        <img src={architectureBg} alt="" className="w-full h-full object-cover" loading="lazy" width={1280} height={600} />
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-navy/80 via-transparent to-navy/80" />

      <div className="absolute inset-0 opacity-[0.04]" style={{
        backgroundImage: `radial-gradient(circle at 1px 1px, hsl(0 0% 100%) 1px, transparent 0)`,
        backgroundSize: '32px 32px'
      }} />

      <div className="container relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <span className="text-sm font-semibold tracking-wider uppercase text-azure">How It Works</span>
          <h2 className="text-4xl md:text-5xl font-bold mt-3 mb-5 text-primary-foreground">
            Architecture Flow
          </h2>
          <p className="text-ice/60 text-lg">
            A robust pipeline from input to intelligent, context-aware multilingual output.
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8">
          {steps.map((step, i) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: i * 0.12 }}
              whileHover={{ scale: 1.03 }}
              className="relative p-8 rounded-2xl border border-royal/20 bg-navy-light/30 backdrop-blur-sm hover:border-royal/40 transition-all duration-300"
            >
              <span className="text-6xl font-bold text-royal/15 absolute top-4 right-6 select-none">
                {step.number}
              </span>
              <div className="relative z-10">
                <h3 className="text-xl font-semibold text-primary-foreground mb-3">{step.title}</h3>
                <p className="text-ice/60 leading-relaxed">{step.description}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Connecting line decoration */}
        <div className="hidden md:flex justify-center mt-8">
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.5 }}
            className="w-48 h-0.5 bg-gradient-to-r from-transparent via-azure/40 to-transparent"
          />
        </div>
      </div>
    </section>
  );
};

export default ArchitectureSection;
