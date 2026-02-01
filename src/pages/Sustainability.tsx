import { useState } from "react";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet-async";
import { 
  Leaf, 
  Globe, 
  Zap, 
  Server, 
  BarChart3, 
  Award,
  BookOpen,
  Code,
  Scale,
  TrendingDown
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CarbonAuditor from "@/components/sustainability/CarbonAuditor";
import SustainabilityLearningHub from "@/components/sustainability/SustainabilityLearningHub";
import CarbonBadgeGenerator from "@/components/sustainability/CarbonBadgeGenerator";
import SustainabilityAPIReference from "@/components/sustainability/SustainabilityAPIReference";

const Sustainability = () => {
  return (
    <>
      <Helmet>
        <title>GreenWeb Sustainability Platform | DeepGuard</title>
        <meta name="description" content="Open source digital carbon footprint calculator. Measure, reduce, and report your website's environmental impact with SWD and SCI methodologies." />
      </Helmet>

      <div className="min-h-screen bg-background">
        <Navbar />

        <main className="pt-32 pb-20">
          <div className="container mx-auto px-6">
            {/* Hero Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-12"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 border border-green-500/30 mb-6">
                <Leaf className="w-4 h-4 text-green-500" />
                <span className="text-sm text-green-500 font-medium">GreenWeb Open Standard</span>
              </div>
              
              <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">
                Digital Sustainability Platform
              </h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
                Measure your digital carbon footprint using industry-standard SWD and SCI methodologies. 
                Open source, transparent, and action-oriented.
              </p>

              {/* Stats Grid */}
              <div className="grid md:grid-cols-4 gap-4 max-w-4xl mx-auto mb-12">
                {[
                  { icon: Globe, label: "Websites Audited", value: "12,847", color: "text-blue-500" },
                  { icon: TrendingDown, label: "CO2 Reduced", value: "2.4 tons", color: "text-green-500" },
                  { icon: Server, label: "Green Hosts", value: "847", color: "text-cyan-500" },
                  { icon: Award, label: "Badges Issued", value: "3,291", color: "text-yellow-500" },
                ].map((stat, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="p-4 rounded-xl bg-secondary/30 border border-border/50"
                  >
                    <stat.icon className={`w-6 h-6 ${stat.color} mx-auto mb-2`} />
                    <div className="text-2xl font-bold">{stat.value}</div>
                    <div className="text-sm text-muted-foreground">{stat.label}</div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Main Tabs */}
            <Tabs defaultValue="auditor" className="space-y-8">
              <TabsList className="flex flex-wrap justify-center gap-1">
                <TabsTrigger value="auditor" className="gap-2">
                  <Zap className="w-4 h-4" />
                  Carbon Auditor
                </TabsTrigger>
                <TabsTrigger value="learning" className="gap-2">
                  <BookOpen className="w-4 h-4" />
                  Learning Hub
                </TabsTrigger>
                <TabsTrigger value="badges" className="gap-2">
                  <Award className="w-4 h-4" />
                  Badges
                </TabsTrigger>
                <TabsTrigger value="api" className="gap-2">
                  <Code className="w-4 h-4" />
                  API Docs
                </TabsTrigger>
              </TabsList>

              <TabsContent value="auditor">
                <CarbonAuditor />
              </TabsContent>

              <TabsContent value="learning">
                <SustainabilityLearningHub />
              </TabsContent>

              <TabsContent value="badges">
                <CarbonBadgeGenerator />
              </TabsContent>

              <TabsContent value="api">
                <SustainabilityAPIReference />
              </TabsContent>
            </Tabs>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default Sustainability;
