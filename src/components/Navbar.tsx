import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { motion, useScroll, useTransform } from "framer-motion";
import logo from "@/assets/unispeak-logo.png";

const navLinks = [
  { href: "#features", label: "Features" },
  { href: "#architecture", label: "Architecture" },
  { href: "#accessibility", label: "Accessibility" },
];

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const { scrollY } = useScroll();
  const bgOpacity = useTransform(scrollY, [0, 100], [0.5, 0.95]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);

      const sections = ["features", "architecture", "accessibility"];
      for (const id of sections.reverse()) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= 120) {
          setActiveSection(`#${id}`);
          return;
        }
      }
      setActiveSection("");
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "glass shadow-elevated py-0"
          : "bg-transparent border-b border-transparent py-1"
      }`}
    >
      <div className="container flex items-center justify-between h-16">
        <motion.div
          className="flex items-center gap-2"
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <motion.img
            src={logo}
            alt="UniSpeak AI logo"
            className="w-9 h-9 object-contain"
            animate={{ rotate: scrolled ? 0 : [0, -5, 5, 0] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 4 }}
          />
          <span className="text-lg font-bold text-foreground">UniSpeak AI</span>
        </motion.div>

        <div className="hidden md:flex items-center gap-1 text-sm font-medium">
          {navLinks.map((link) => (
            <motion.a
              key={link.href}
              href={link.href}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.95 }}
              className={`relative px-4 py-2 rounded-lg transition-colors duration-300 ${
                activeSection === link.href
                  ? "text-royal"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {link.label}
              {activeSection === link.href && (
                <motion.div
                  layoutId="activeNav"
                  className="absolute inset-0 rounded-lg bg-royal/10 -z-10"
                  transition={{ type: "spring", stiffness: 350, damping: 30 }}
                />
              )}
            </motion.a>
          ))}
        </div>

        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button variant="hero" size="sm">Get Started</Button>
        </motion.div>
      </div>
    </motion.nav>
  );
};

export default Navbar;
