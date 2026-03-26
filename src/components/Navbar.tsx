import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import logo from "@/assets/unispeak-logo.png";

const Navbar = () => {
  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="fixed top-0 left-0 right-0 z-50 glass"
    >
      <div className="container flex items-center justify-between h-16">
        <div className="flex items-center gap-2">
          <img src={logo} alt="UniSpeak AI logo" className="w-9 h-9 object-contain" />
          <span className="text-lg font-bold text-foreground">UniSpeak AI</span>
        </div>

        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
          <a href="#features" className="hover:text-foreground transition-colors">Features</a>
          <a href="#architecture" className="hover:text-foreground transition-colors">Architecture</a>
          <a href="#accessibility" className="hover:text-foreground transition-colors">Accessibility</a>
        </div>

        <Button variant="hero" size="sm">Get Started</Button>
      </div>
    </motion.nav>
  );
};

export default Navbar;
