import { motion } from "framer-motion";
import { BookOpen, Code, Zap, Shield, FileText, Video, ArrowRight, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const Documentation = () => {
  const navigate = useNavigate();

  const quickStart = [
    { title: "Getting Started", description: "Create your account and analyze your first file", time: "5 min" },
    { title: "API Authentication", description: "Generate API keys and authenticate requests", time: "3 min" },
    { title: "Upload & Analyze", description: "Learn how to submit media for analysis", time: "5 min" },
    { title: "Understanding Results", description: "Interpret confidence scores and findings", time: "10 min" },
  ];

  const sections = [
    {
      icon: Zap,
      title: "Quick Start Guide",
      description: "Get up and running in minutes with our step-by-step tutorials.",
      articles: 8,
    },
    {
      icon: Code,
      title: "API Reference",
      description: "Complete documentation for all API endpoints and SDKs.",
      articles: 24,
    },
    {
      icon: Shield,
      title: "Security & Privacy",
      description: "Learn about our security practices and data handling.",
      articles: 12,
    },
    {
      icon: FileText,
      title: "Best Practices",
      description: "Tips for optimal results and integration patterns.",
      articles: 15,
    },
    {
      icon: Video,
      title: "Video Tutorials",
      description: "Visual guides for common workflows and features.",
      articles: 10,
    },
    {
      icon: BookOpen,
      title: "FAQ",
      description: "Answers to frequently asked questions.",
      articles: 30,
    },
  ];

  const popularArticles = [
    "How to detect AI-generated images",
    "Setting up webhook notifications",
    "Batch processing with the API",
    "Understanding confidence thresholds",
    "Integrating with Slack and Discord",
    "Exporting analysis reports as PDF",
  ];

  return (
    <>
      <Helmet>
        <title>Documentation | DeepGuard</title>
        <meta name="description" content="Complete documentation for DeepGuard. API reference, tutorials, and guides for deepfake detection." />
      </Helmet>
      
      <div className="min-h-screen bg-background">
        <Navbar />
        
        <main className="pt-32 pb-20">
          <div className="container mx-auto px-6">
            {/* Hero */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center max-w-3xl mx-auto mb-12"
            >
              <div className="w-20 h-20 rounded-2xl gradient-primary flex items-center justify-center mx-auto mb-6">
                <BookOpen className="w-10 h-10 text-primary-foreground" />
              </div>
              <h1 className="font-display text-5xl font-bold mb-4">Documentation</h1>
              <p className="text-xl text-muted-foreground mb-8">
                Everything you need to integrate and use DeepGuard effectively.
              </p>
              
              {/* Search */}
              <div className="relative max-w-xl mx-auto">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  placeholder="Search documentation..."
                  className="pl-12 h-12 text-lg"
                />
              </div>
            </motion.div>

            {/* Quick Start */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="mb-16"
            >
              <h2 className="font-display text-2xl font-bold mb-6">Quick Start</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                {quickStart.map((item, index) => (
                  <Card key={item.title} className="glass border-border/50 hover:border-primary/50 transition-colors cursor-pointer">
                    <CardContent className="pt-6">
                      <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold mb-3">
                        {index + 1}
                      </div>
                      <h3 className="font-semibold mb-1">{item.title}</h3>
                      <p className="text-sm text-muted-foreground mb-2">{item.description}</p>
                      <span className="text-xs text-primary">{item.time}</span>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </motion.div>

            {/* Sections */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mb-16"
            >
              <h2 className="font-display text-2xl font-bold mb-6">Browse by Topic</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {sections.map((section) => (
                  <Card key={section.title} className="glass border-border/50 hover:border-primary/50 transition-colors cursor-pointer group">
                    <CardHeader>
                      <section.icon className="w-10 h-10 text-primary mb-2" />
                      <CardTitle className="flex items-center justify-between">
                        {section.title}
                        <ArrowRight className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </CardTitle>
                      <CardDescription>{section.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <span className="text-sm text-muted-foreground">{section.articles} articles</span>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </motion.div>

            {/* Popular Articles */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="max-w-3xl mx-auto"
            >
              <h2 className="font-display text-2xl font-bold mb-6">Popular Articles</h2>
              <Card className="glass border-border/50">
                <CardContent className="py-4 divide-y divide-border">
                  {popularArticles.map((article) => (
                    <div key={article} className="py-3 flex items-center justify-between hover:text-primary cursor-pointer transition-colors">
                      <span>{article}</span>
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  ))}
                </CardContent>
              </Card>
            </motion.div>

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mt-16 text-center"
            >
              <p className="text-muted-foreground mb-4">Can't find what you're looking for?</p>
              <Button variant="outline" onClick={() => navigate("/contact")}>Contact Support</Button>
            </motion.div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default Documentation;
