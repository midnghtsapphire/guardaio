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
import BatchAnalyzer from "@/components/BatchAnalyzer";
import VoiceDetector from "@/components/VoiceDetector";
import UrlAnalyzer from "@/components/UrlAnalyzer";
import ReverseImageSearch from "@/components/ReverseImageSearch";
import ComplianceBadges from "@/components/ComplianceBadges";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";
import { Image, FolderOpen, Link, Mic, Search } from "lucide-react";

const Index = () => {
  const [searchParams] = useSearchParams();
  const [externalImageUrl, setExternalImageUrl] = useState<string | null>(null);

  useEffect(() => {
    const analyzeUrl = searchParams.get("analyze");
    if (analyzeUrl) {
      setExternalImageUrl(analyzeUrl);
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
        
        {/* Compliance Badges */}
        <section className="py-12 border-b border-border">
          <div className="container mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-8"
            >
              <h3 className="text-lg font-medium text-muted-foreground mb-4">
                Trusted & Certified
              </h3>
            </motion.div>
            <ComplianceBadges variant="compact" className="justify-center" />
          </div>
        </section>

        <section id="features">
          <FeaturesSection />
        </section>

        {/* Enhanced Analyzer Section with Tabs */}
        <section id="analyzer" className="py-24">
          <div className="container mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">
                Analyze <span className="text-gradient">Any Media</span>
              </h2>
              <p className="text-muted-foreground text-lg max-w-xl mx-auto">
                Choose your analysis method - single file, batch processing, URL, voice, or reverse search.
              </p>
            </motion.div>

            <Tabs defaultValue="single" className="max-w-4xl mx-auto">
              <TabsList className="grid w-full grid-cols-5 mb-8">
                <TabsTrigger value="single" className="gap-2">
                  <Image className="w-4 h-4" />
                  <span className="hidden sm:inline">Single</span>
                </TabsTrigger>
                <TabsTrigger value="batch" className="gap-2">
                  <FolderOpen className="w-4 h-4" />
                  <span className="hidden sm:inline">Batch</span>
                </TabsTrigger>
                <TabsTrigger value="url" className="gap-2">
                  <Link className="w-4 h-4" />
                  <span className="hidden sm:inline">URL</span>
                </TabsTrigger>
                <TabsTrigger value="voice" className="gap-2">
                  <Mic className="w-4 h-4" />
                  <span className="hidden sm:inline">Voice</span>
                </TabsTrigger>
                <TabsTrigger value="reverse" className="gap-2">
                  <Search className="w-4 h-4" />
                  <span className="hidden sm:inline">Reverse</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="single">
                <AnalyzerSection 
                  externalImageUrl={externalImageUrl} 
                  onExternalImageProcessed={() => setExternalImageUrl(null)} 
                />
              </TabsContent>

              <TabsContent value="batch">
                <BatchAnalyzer />
              </TabsContent>

              <TabsContent value="url">
                <UrlAnalyzer />
              </TabsContent>

              <TabsContent value="voice">
                <VoiceDetector />
              </TabsContent>

              <TabsContent value="reverse">
                <ReverseImageSearch />
              </TabsContent>
            </Tabs>
          </div>
        </section>

        <PricingSection />
        <Footer />
        <KeyboardShortcutsHelp />
        <OnboardingTour />
      </main>
    </>
  );
};

export default Index;
