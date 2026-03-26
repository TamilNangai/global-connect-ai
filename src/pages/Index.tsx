import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import FeaturesSection from "@/components/FeaturesSection";
import ArchitectureSection from "@/components/ArchitectureSection";
import AccessibilitySection from "@/components/AccessibilitySection";
import FooterSection from "@/components/FooterSection";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <HeroSection />
      <div id="features">
        <FeaturesSection />
      </div>
      <div id="architecture">
        <ArchitectureSection />
      </div>
      <div id="accessibility">
        <AccessibilitySection />
      </div>
      <FooterSection />
    </div>
  );
};

export default Index;
