import { motion } from "framer-motion";
import logo from "@/assets/unispeak-logo.png";

const FooterSection = () => {
  return (
    <footer className="bg-hero py-16 border-t border-royal/10 font-normal">
      <div className="container">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="flex flex-col md:flex-row justify-between items-center gap-8">
            
            <div className="flex items-center gap-3">
              <img src={logo} alt="UniSpeak AI logo" className="w-10 h-10 object-contain" loading="lazy" width={512} height={512} />
              <span className="text-xl font-bold text-primary-foreground">UniSpeak AI</span>
            </div>

            <div className="flex gap-8 text-ice/50 text-sm">
              <a href="#" className="hover:text-ice transition-colors">Documentation</a>
              <a href="#" className="hover:text-ice transition-colors">API Reference</a>
              <a href="#" className="hover:text-ice transition-colors">GitHub</a>
              <a href="#" className="hover:text-ice transition-colors">Contact</a>
            </div>
          </motion.div>

          <div className="mt-10 pt-8 border-t border-royal/10 text-center text-sm text-ice/30">
            © 2026 UniSpeak AI. All rights reserved.
          </div>
        </div>
      </div>
    </footer>);

};

export default FooterSection;