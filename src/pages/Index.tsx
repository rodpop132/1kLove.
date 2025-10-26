import { useState, useEffect } from "react";
import LoadingScreen from "@/components/LoadingScreen";
import SiteHeader from "@/components/SiteHeader";
import HeroSection from "@/components/HeroSection";
import PainSolutionSection from "@/components/PainSolutionSection";
import WhatYouGetSection from "@/components/WhatYouGetSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import OfferSection from "@/components/OfferSection";
import FAQSection from "@/components/FAQSection";
import Footer from "@/components/Footer";

const Index = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Scroll animations observer
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-fade-up");
          }
        });
      },
      { threshold: 0.1 }
    );

    // Observe all sections after loading
    if (!isLoading) {
      const sections = document.querySelectorAll("section");
      sections.forEach((section) => observer.observe(section));
    }

    return () => observer.disconnect();
  }, [isLoading]);

  if (isLoading) {
    return <LoadingScreen onLoadingComplete={() => setIsLoading(false)} />;
  }

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <HeroSection />
      
      {/* Divider with gradient */}
      <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      
      <PainSolutionSection />
      
      {/* Divider with gradient */}
      <div className="h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
      
      <WhatYouGetSection />
      
      {/* Divider with gradient */}
      <div className="h-px bg-gradient-to-r from-transparent via-secondary/20 to-transparent" />
      
      <TestimonialsSection />
      
      {/* Divider with gradient */}
      <div className="h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
      
      <OfferSection />
      
      {/* Divider with gradient */}
      <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      
      <FAQSection />
      
      <Footer />
    </div>
  );
};

export default Index;
