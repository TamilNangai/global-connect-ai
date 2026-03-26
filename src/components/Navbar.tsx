import { Globe } from "lucide-react";
import { Button } from "@/components/ui/button";

const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass">
      <div className="container flex items-center justify-between h-16">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-royal/20 flex items-center justify-center">
            <Globe className="w-5 h-5 text-royal" />
          </div>
          <span className="text-lg font-bold text-foreground">MIE</span>
        </div>

        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
          <a href="#features" className="hover:text-foreground transition-colors">Features</a>
          <a href="#architecture" className="hover:text-foreground transition-colors">Architecture</a>
          <a href="#accessibility" className="hover:text-foreground transition-colors">Accessibility</a>
        </div>

        <Button variant="hero" size="sm">Get Started</Button>
      </div>
    </nav>
  );
};

export default Navbar;
