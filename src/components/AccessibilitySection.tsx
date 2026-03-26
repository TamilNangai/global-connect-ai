import { Eye, Mic, Type, Globe } from "lucide-react";

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
          <div>
            <span className="text-sm font-semibold tracking-wider uppercase text-royal">Accessibility</span>
            <h2 className="text-4xl font-bold mt-3 mb-5 text-foreground">
              Built for Everyone
            </h2>
            <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
              Designed to serve users across literacy levels, technical backgrounds, and physical abilities — 
              because true multilingual communication must be universally accessible.
            </p>

            <div className="grid sm:grid-cols-2 gap-5">
              {items.map((item) => (
                <div key={item.title} className="flex gap-4">
                  <div className="w-10 h-10 rounded-lg bg-azure/10 flex items-center justify-center shrink-0">
                    <item.icon className="w-5 h-5 text-azure" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-1">{item.title}</h4>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="aspect-square rounded-3xl bg-gradient-to-br from-royal/10 to-azure/10 border border-royal/20 flex items-center justify-center">
              <div className="text-center p-8">
                <div className="w-20 h-20 rounded-2xl bg-royal/20 flex items-center justify-center mx-auto mb-6">
                  <Globe className="w-10 h-10 text-royal" />
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-2">50+ Languages</h3>
                <p className="text-muted-foreground">Seamless communication across linguistic boundaries</p>
                <div className="flex flex-wrap justify-center gap-2 mt-6">
                  {["English", "العربية", "中文", "हिन्दी", "Español", "Français", "日本語", "한국어"].map((lang) => (
                    <span key={lang} className="px-3 py-1 rounded-full bg-royal/10 text-royal text-sm font-medium border border-royal/20">
                      {lang}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AccessibilitySection;
