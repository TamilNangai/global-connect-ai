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
      <div className="absolute inset-0 opacity-[0.04]" style={{
        backgroundImage: `radial-gradient(circle at 1px 1px, hsl(0 0% 100%) 1px, transparent 0)`,
        backgroundSize: '32px 32px'
      }} />

      <div className="container relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-sm font-semibold tracking-wider uppercase text-azure">How It Works</span>
          <h2 className="text-4xl md:text-5xl font-bold mt-3 mb-5 text-primary-foreground">
            Architecture Flow
          </h2>
          <p className="text-ice/60 text-lg">
            A robust pipeline from input to intelligent, context-aware multilingual output.
          </p>
        </div>

        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8">
          {steps.map((step, i) => (
            <div
              key={step.number}
              className="relative p-8 rounded-2xl border border-royal/20 bg-navy-light/30 backdrop-blur-sm hover:border-royal/40 transition-all duration-300"
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              <span className="text-6xl font-bold text-royal/15 absolute top-4 right-6 select-none">
                {step.number}
              </span>
              <div className="relative z-10">
                <h3 className="text-xl font-semibold text-primary-foreground mb-3">{step.title}</h3>
                <p className="text-ice/60 leading-relaxed">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ArchitectureSection;
