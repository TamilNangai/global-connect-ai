import { Globe } from "lucide-react";

const FooterSection = () => {
  return (
    <footer className="bg-hero py-16 border-t border-royal/10">
      <div className="container">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-royal/20 flex items-center justify-center">
                <Globe className="w-5 h-5 text-azure" />
              </div>
              <span className="text-xl font-bold text-primary-foreground">MIE</span>
            </div>

            <div className="flex gap-8 text-ice/50 text-sm">
              <a href="#" className="hover:text-ice transition-colors">Documentation</a>
              <a href="#" className="hover:text-ice transition-colors">API Reference</a>
              <a href="#" className="hover:text-ice transition-colors">GitHub</a>
              <a href="#" className="hover:text-ice transition-colors">Contact</a>
            </div>
          </div>

          <div className="mt-10 pt-8 border-t border-royal/10 text-center text-sm text-ice/30">
            © 2026 Multilingual Intelligence Engine. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default FooterSection;
