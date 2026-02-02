import { motion } from "framer-motion";
import { Shield, Lock, Eye, Server, Key, FileCheck, CheckCircle, AlertTriangle, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const Security = () => {
  const navigate = useNavigate();

  const securityFeatures = [
    {
      icon: Lock,
      title: "End-to-End Encryption",
      description: "All data is encrypted in transit using TLS 1.3 and at rest using AES-256.",
    },
    {
      icon: Eye,
      title: "Privacy by Design",
      description: "Files are processed in memory and automatically deleted within 24 hours.",
    },
    {
      icon: Server,
      title: "Secure Infrastructure",
      description: "Hosted on SOC 2 Type II certified cloud infrastructure with 24/7 monitoring.",
    },
    {
      icon: Key,
      title: "API Security",
      description: "API keys with granular permissions, rate limiting, and audit logging.",
    },
    {
      icon: FileCheck,
      title: "Regular Audits",
      description: "Annual third-party penetration testing and security assessments.",
    },
    {
      icon: Shield,
      title: "Compliance",
      description: "GDPR, CCPA, and SOC 2 compliant data handling practices.",
    },
  ];

  const certifications = [
    { name: "SOC 2 Type II", status: "certified", date: "2025" },
    { name: "ISO 27001", status: "in-progress", date: "Expected Q2 2026" },
    { name: "GDPR Compliant", status: "certified", date: "2024" },
    { name: "CCPA Compliant", status: "certified", date: "2024" },
  ];

  const practices = [
    "Multi-factor authentication for all accounts",
    "Role-based access control (RBAC)",
    "Regular security training for all employees",
    "Incident response plan with 24-hour SLA",
    "Encrypted backups with geo-redundancy",
    "Network segmentation and firewalls",
    "Vulnerability disclosure program",
    "Security-focused code review process",
  ];

  return (
    <>
      <Helmet>
        <title>Security | Guardaio</title>
        <meta name="description" content="Learn about Guardaio's security practices, certifications, and how we protect your data." />
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
                <Shield className="w-10 h-10 text-primary-foreground" />
              </div>
              <h1 className="font-display text-5xl font-bold mb-4">Security</h1>
              <p className="text-xl text-muted-foreground">
                Your security is our top priority. Learn how we protect your data and maintain the highest security standards.
              </p>
            </motion.div>

            {/* Security Features */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="mb-20"
            >
              <h2 className="font-display text-3xl font-bold text-center mb-8">Security Features</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {securityFeatures.map((feature) => (
                  <Card key={feature.title} className="glass border-border/50">
                    <CardHeader>
                      <feature.icon className="w-10 h-10 text-primary mb-2" />
                      <CardTitle>{feature.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription>{feature.description}</CardDescription>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </motion.div>

            {/* Certifications */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mb-20"
            >
              <h2 className="font-display text-3xl font-bold text-center mb-8">Certifications & Compliance</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {certifications.map((cert) => (
                  <Card key={cert.name} className="glass border-border/50 text-center">
                    <CardContent className="pt-6">
                      {cert.status === "certified" ? (
                        <CheckCircle className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
                      ) : (
                        <AlertTriangle className="w-12 h-12 text-amber-500 mx-auto mb-3" />
                      )}
                      <h3 className="font-semibold mb-1">{cert.name}</h3>
                      <p className="text-sm text-muted-foreground capitalize">{cert.status}</p>
                      <p className="text-xs text-primary mt-1">{cert.date}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </motion.div>

            {/* Security Practices */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mb-20"
            >
              <h2 className="font-display text-3xl font-bold text-center mb-8">Security Practices</h2>
              <Card className="glass border-border/50 max-w-3xl mx-auto">
                <CardContent className="pt-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    {practices.map((practice) => (
                      <div key={practice} className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                        <span className="text-muted-foreground">{practice}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Data Handling */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="glass rounded-3xl p-8 md:p-12 mb-20"
            >
              <div className="max-w-3xl mx-auto">
                <h2 className="font-display text-3xl font-bold text-center mb-6">How We Handle Your Data</h2>
                <div className="space-y-6">
                  <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                      <span className="text-primary font-bold">1</span>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Upload</h3>
                      <p className="text-muted-foreground">Files are transmitted over encrypted TLS 1.3 connections directly to our secure processing servers.</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                      <span className="text-primary font-bold">2</span>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Analysis</h3>
                      <p className="text-muted-foreground">Files are processed in isolated, ephemeral environments. No human reviews your content.</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                      <span className="text-primary font-bold">3</span>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Deletion</h3>
                      <p className="text-muted-foreground">Original files are automatically purged within 24 hours. Only metadata and results are retained in your account.</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Vulnerability Disclosure */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-center max-w-2xl mx-auto"
            >
              <h2 className="font-display text-2xl font-bold mb-4">Responsible Disclosure</h2>
              <p className="text-muted-foreground mb-6">
                Found a security vulnerability? We appreciate your help in keeping Guardaio secure. Please report any security issues to our security team.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Button className="gap-2">
                  security@guardaio.com
                </Button>
                <Button variant="outline" onClick={() => navigate("/privacy")} className="gap-2">
                  Privacy Policy
                  <ExternalLink className="w-4 h-4" />
                </Button>
              </div>
            </motion.div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default Security;
