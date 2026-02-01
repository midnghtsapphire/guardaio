import { motion } from "framer-motion";
import { Monitor, Download, Apple, Shield, Zap, Bell, HardDrive, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const DesktopApp = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: Zap,
      title: "Native Performance",
      description: "Lightning-fast analysis with native code optimization for your operating system.",
    },
    {
      icon: Bell,
      title: "System Notifications",
      description: "Get instant alerts when analysis completes or suspicious content is detected.",
    },
    {
      icon: HardDrive,
      title: "Offline Mode",
      description: "Analyze files locally without an internet connection for sensitive content.",
    },
    {
      icon: Shield,
      title: "Enhanced Privacy",
      description: "Files never leave your device in offline mode for maximum privacy.",
    },
  ];

  const systemRequirements = {
    windows: ["Windows 10 or later", "64-bit processor", "4GB RAM minimum", "500MB disk space"],
    mac: ["macOS 11 (Big Sur) or later", "Apple Silicon or Intel", "4GB RAM minimum", "500MB disk space"],
    linux: ["Ubuntu 20.04+, Fedora 34+, or Debian 11+", "64-bit processor", "4GB RAM minimum", "500MB disk space"],
  };

  return (
    <>
      <Helmet>
        <title>Desktop App | DeepGuard</title>
        <meta name="description" content="Download the DeepGuard desktop app for native deepfake detection on Windows, macOS, and Linux." />
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
                <Monitor className="w-10 h-10 text-primary-foreground" />
              </div>
              <h1 className="font-display text-5xl font-bold mb-4">Desktop App</h1>
              <p className="text-xl text-muted-foreground mb-8">
                Native deepfake detection for Windows, macOS, and Linux. Analyze files locally with enhanced privacy and performance.
              </p>
              
              <div className="flex flex-wrap justify-center gap-4">
                <Button size="lg" className="gap-2">
                  <Download className="w-5 h-5" />
                  Download for Windows
                </Button>
                <Button size="lg" variant="outline" className="gap-2">
                  <Apple className="w-5 h-5" />
                  Download for Mac
                </Button>
              </div>
              
              <p className="text-sm text-muted-foreground mt-4">
                Version 2.1.0 • Released January 2026
              </p>
            </motion.div>

            {/* Features */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20"
            >
              {features.map((feature, index) => (
                <Card key={feature.title} className="glass border-border/50">
                  <CardHeader>
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-2">
                      <feature.icon className="w-6 h-6 text-primary" />
                    </div>
                    <CardTitle className="text-lg">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>{feature.description}</CardDescription>
                  </CardContent>
                </Card>
              ))}
            </motion.div>

            {/* System Requirements */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="max-w-4xl mx-auto"
            >
              <h2 className="font-display text-3xl font-bold text-center mb-8">System Requirements</h2>
              
              <div className="grid md:grid-cols-3 gap-6">
                {Object.entries(systemRequirements).map(([os, requirements]) => (
                  <Card key={os} className="glass border-border/50">
                    <CardHeader>
                      <CardTitle className="capitalize">{os === "mac" ? "macOS" : os}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {requirements.map((req) => (
                          <li key={req} className="flex items-start gap-2 text-sm text-muted-foreground">
                            <CheckCircle className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                            {req}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </motion.div>

            {/* Coming Soon Notice */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mt-16 text-center glass rounded-2xl p-8 max-w-2xl mx-auto"
            >
              <h3 className="font-display text-2xl font-bold mb-2">Coming Soon</h3>
              <p className="text-muted-foreground mb-4">
                The desktop app is currently in private beta. Join the waitlist to get early access.
              </p>
              <Button onClick={() => navigate("/auth")}>Join Waitlist</Button>
            </motion.div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default DesktopApp;
