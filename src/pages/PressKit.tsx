import { motion } from "framer-motion";
import { Newspaper, Download, Image, FileText, Mail, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Helmet } from "react-helmet-async";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const PressKit = () => {
  const pressReleases = [
    { date: "Jan 15, 2026", title: "Guardaio Launches Enterprise API with 99.9% Uptime SLA" },
    { date: "Dec 10, 2025", title: "Guardaio Expands to 150 Countries, Surpasses 10M Analyses" },
    { date: "Nov 5, 2025", title: "Guardaio Partners with EU Commission to Combat Electoral Disinformation" },
    { date: "Sep 20, 2025", title: "Guardaio Closes $25M Series A Led by Sequoia Capital" },
  ];

  const stats = [
    { value: "10M+", label: "Files Analyzed" },
    { value: "50K+", label: "Active Users" },
    { value: "150+", label: "Countries" },
    { value: "99.2%", label: "Detection Accuracy" },
  ];

  const coverage = [
    { outlet: "TechCrunch", headline: "Guardaio raises $25M to fight AI-generated disinformation" },
    { outlet: "Wired", headline: "The startup making deepfake detection accessible to everyone" },
    { outlet: "The Verge", headline: "Guardaio's AI can spot fakes that fool the human eye" },
    { outlet: "MIT Tech Review", headline: "How Guardaio stays ahead of synthetic media creators" },
  ];

  return (
    <>
      <Helmet>
        <title>Press Kit | Guardaio</title>
        <meta name="description" content="Download Guardaio logos, brand assets, and press materials. Find press releases and media contact information." />
      </Helmet>
      
      <div className="min-h-screen bg-background">
        <Navbar />
        
        <main className="pt-32 pb-20">
          <div className="container mx-auto px-6">
            {/* Hero */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center max-w-3xl mx-auto mb-16"
            >
              <div className="w-20 h-20 rounded-2xl gradient-primary flex items-center justify-center mx-auto mb-6">
                <Newspaper className="w-10 h-10 text-primary-foreground" />
              </div>
              <h1 className="font-display text-5xl font-bold mb-4">Press Kit</h1>
              <p className="text-xl text-muted-foreground">
                Everything you need to write about Guardaio. Logos, brand assets, and company information.
              </p>
            </motion.div>

            {/* Brand Assets */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="mb-16"
            >
              <h2 className="font-display text-3xl font-bold text-center mb-8">Brand Assets</h2>
              <div className="grid md:grid-cols-3 gap-6">
                <Card className="glass border-border/50">
                  <CardHeader>
                    <div className="w-full aspect-video bg-background rounded-lg flex items-center justify-center mb-4 border border-border">
                      <div className="w-16 h-16 rounded-xl gradient-primary flex items-center justify-center">
                        <Shield className="w-8 h-8 text-primary-foreground" />
                      </div>
                    </div>
                    <CardTitle>Logo Package</CardTitle>
                    <CardDescription>SVG, PNG, and EPS formats in various colors</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button className="w-full gap-2">
                      <Download className="w-4 h-4" />
                      Download Logos
                    </Button>
                  </CardContent>
                </Card>

                <Card className="glass border-border/50">
                  <CardHeader>
                    <div className="w-full aspect-video bg-background rounded-lg flex items-center justify-center mb-4 border border-border">
                      <Image className="w-12 h-12 text-muted-foreground" />
                    </div>
                    <CardTitle>Product Screenshots</CardTitle>
                    <CardDescription>High-resolution interface screenshots</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button className="w-full gap-2">
                      <Download className="w-4 h-4" />
                      Download Screenshots
                    </Button>
                  </CardContent>
                </Card>

                <Card className="glass border-border/50">
                  <CardHeader>
                    <div className="w-full aspect-video bg-background rounded-lg flex items-center justify-center mb-4 border border-border">
                      <FileText className="w-12 h-12 text-muted-foreground" />
                    </div>
                    <CardTitle>Brand Guidelines</CardTitle>
                    <CardDescription>Color palette, typography, and usage rules</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button className="w-full gap-2">
                      <Download className="w-4 h-4" />
                      Download PDF
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </motion.div>

            {/* Company Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mb-16"
            >
              <h2 className="font-display text-3xl font-bold text-center mb-8">Key Statistics</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {stats.map((stat) => (
                  <div key={stat.label} className="glass rounded-2xl p-6 text-center">
                    <div className="font-display text-3xl font-bold text-primary mb-2">{stat.value}</div>
                    <div className="text-muted-foreground text-sm">{stat.label}</div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* About */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="glass rounded-3xl p-8 mb-16"
            >
              <h2 className="font-display text-3xl font-bold mb-4">About Guardaio</h2>
              <p className="text-muted-foreground mb-4">
                Guardaio is an AI-powered platform that helps individuals and organizations detect deepfakes and synthetic media. Founded in 2023 by AI researchers from Stanford and Google, Guardaio has analyzed over 10 million files and serves users in 150+ countries.
              </p>
              <p className="text-muted-foreground mb-4">
                Our technology combines advanced computer vision with machine learning to identify manipulated images, videos, and audio with industry-leading accuracy. We're backed by leading investors including Sequoia Capital, and are on a mission to protect truth in the age of AI.
              </p>
              <p className="text-muted-foreground">
                <strong>Founded:</strong> 2023 • <strong>Headquarters:</strong> San Francisco, CA • <strong>Funding:</strong> $30M total
              </p>
            </motion.div>

            {/* Press Releases */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mb-16"
            >
              <h2 className="font-display text-3xl font-bold text-center mb-8">Press Releases</h2>
              <div className="space-y-4 max-w-3xl mx-auto">
                {pressReleases.map((release) => (
                  <Card key={release.title} className="glass border-border/50 hover:border-primary/50 transition-colors cursor-pointer">
                    <CardContent className="py-4 flex items-center justify-between">
                      <div>
                        <span className="text-sm text-muted-foreground">{release.date}</span>
                        <h3 className="font-semibold">{release.title}</h3>
                      </div>
                      <Button variant="ghost" size="sm">Read →</Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </motion.div>

            {/* Media Coverage */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mb-16"
            >
              <h2 className="font-display text-3xl font-bold text-center mb-8">In the Press</h2>
              <div className="grid md:grid-cols-2 gap-4 max-w-4xl mx-auto">
                {coverage.map((item) => (
                  <Card key={item.headline} className="glass border-border/50">
                    <CardContent className="py-4">
                      <span className="text-primary font-semibold">{item.outlet}</span>
                      <p className="text-muted-foreground">{item.headline}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </motion.div>

            {/* Contact */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="text-center glass rounded-2xl p-8 max-w-2xl mx-auto"
            >
              <Mail className="w-12 h-12 text-primary mx-auto mb-4" />
              <h3 className="font-display text-2xl font-bold mb-2">Media Inquiries</h3>
              <p className="text-muted-foreground mb-4">
                For press inquiries, interviews, or additional assets, please contact our communications team.
              </p>
              <Button className="gap-2">
                <Mail className="w-4 h-4" />
                press@guardaio.com
              </Button>
            </motion.div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default PressKit;
