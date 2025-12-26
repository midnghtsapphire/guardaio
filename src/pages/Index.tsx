import { Helmet } from "react-helmet-async";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import FeaturesSection from "@/components/FeaturesSection";
import AnalyzerSection from "@/components/AnalyzerSection";
import PricingSection from "@/components/PricingSection";
import Footer from "@/components/Footer";

const Index = () => {
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
        <HeroSection />
        <section id="features">
          <FeaturesSection />
        </section>
        <AnalyzerSection />
        <PricingSection />
        <Footer />
      </main>
    </>
  );
};

export default Index;
