import { Eye, Mic, Type, Globe } from "lucide-react";
import { motion } from "framer-motion";
import globeImg from "@/assets/globe-languages.jpg";

const items = [
  {
    icon: Type,
    title: "Adjustable Text",
    description: "Scalable typography and high-contrast modes for visual accessibility.",
  },
  {
    icon: Mic,
    title: "Voice-First Mode",
    description: "Speech input and output for hands-free, voice-driven interactions.",
  },
  {
    icon: Globe,
    title: "Multilingual UI",
    description: "Interface labels and navigation in the user's preferred language.",
  },
  {
    icon: Eye,
    title: "Inclusive Design",
    description: "WCAG-compliant design principles ensuring usability for all users.",
  },
];

const AccessibilitySection = () => {
  return (
    <section className="py-24 bg-background">
      <div className="container">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-sm font-semibold tracking-wider uppercase text-royal">Accessibility</span>
            <h2 className="text-4xl font-bold mt-3 mb-5 text-foreground">
              Built for Everyone
            </h2>
            <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
              Designed to serve users across literacy levels, technical backgrounds, and physical abilities — 
              because true multilingual communication must be universally accessible.
            </p>

            <div className="grid sm:grid-cols-2 gap-5">
              {items.map((item, i) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.1 }}
                  whileHover={{ x: 4 }}
                  className="flex gap-4 cursor-default"
                >
                  <div className="w-10 h-10 rounded-lg bg-azure/10 flex items-center justify-center shrink-0">
                    <item.icon className="w-5 h-5 text-azure" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-1">{item.title}</h4>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7 }}
            className="relative"
          >
            <div className="aspect-square rounded-3xl overflow-hidden border border-royal/20 shadow-elevated relative">
              <img
                src={globeImg}
                alt="Global multilingual AI visualization"
                className="w-full h-full object-cover"
                loading="lazy"
                width={800}
                height={800}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-8 text-center">
                <h3 className="text-2xl font-bold text-foreground mb-2">50+ Languages</h3>
                <p className="text-muted-foreground text-sm mb-4">Seamless communication across linguistic boundaries</p>
                <div className="flex flex-wrap justify-center gap-2">
                  {["English", "العربية", "中文", "हिन्दी", "Español", "Français", "日本語", "한국어"].map((lang) => (
                    <span key={lang} className="px-3 py-1 rounded-full bg-royal/10 text-royal text-sm font-medium border border-royal/20 backdrop-blur-sm">
                      {lang}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AccessibilitySection;
