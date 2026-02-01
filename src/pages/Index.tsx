import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import FeaturesSection from "@/components/FeaturesSection";
import AnalyzerSection from "@/components/AnalyzerSection";
import PricingSection from "@/components/PricingSection";
import Footer from "@/components/Footer";
import KeyboardShortcutsHelp from "@/components/KeyboardShortcutsHelp";
import OnboardingTour from "@/components/OnboardingTour";

const Index = () => {
  const [searchParams] = useSearchParams();
  const [externalImageUrl, setExternalImageUrl] = useState<string | null>(null);

  useEffect(() => {
    const analyzeUrl = searchParams.get("analyze");
    if (analyzeUrl) {
      setExternalImageUrl(analyzeUrl);
      // Scroll to analyzer section
      setTimeout(() => {
        const element = document.querySelector("#analyzer");
        element?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
  }, [searchParams]);

  return (
    <>
      <Helmet>
        <title>DeepGuard - AI-Powered Deepfake & Disinformation Detector</title>
        <meta
          name="description"
          content="Protect yourself from AI-generated manipulation with DeepGuard's advanced deepfake detection technology. Analyze images, videos, and audio in real-time."
        />
        <meta name="keywords" content="deepfake detection, AI manipulation, disinformation, fact-checking, media analysis" />
        <link rel="canonical" href="https://deepguard.ai" />
      </Helmet>

      <main className="min-h-screen bg-background">
        <Navbar />
        <div id="hero">
          <HeroSection />
        </div>
        <section id="features">
          <FeaturesSection />
        </section>
        <AnalyzerSection externalImageUrl={externalImageUrl} onExternalImageProcessed={() => setExternalImageUrl(null)} />
        <PricingSection />
        <Footer />
        <KeyboardShortcutsHelp />
        <OnboardingTour />
      </main>
    </>
  );
};

export default Index;
