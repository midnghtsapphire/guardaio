import { motion } from "framer-motion";
import { Shield, Users, Target, Heart, Award, Globe } from "lucide-react";
import { Helmet } from "react-helmet-async";
import { Card, CardContent } from "@/components/ui/card";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const About = () => {
  const stats = [
    { value: "10M+", label: "Files Analyzed" },
    { value: "150+", label: "Countries" },
    { value: "99.2%", label: "Accuracy Rate" },
    { value: "50K+", label: "Active Users" },
  ];

  const values = [
    {
      icon: Shield,
      title: "Truth First",
      description: "We believe everyone deserves access to tools that help distinguish real from fake.",
    },
    {
      icon: Users,
      title: "Accessibility",
      description: "Advanced AI technology should be available to everyone, not just large organizations.",
    },
    {
      icon: Target,
      title: "Accuracy",
      description: "We continuously improve our detection algorithms to stay ahead of emerging threats.",
    },
    {
      icon: Heart,
      title: "Privacy",
      description: "Your data is yours. We process files securely and never store them permanently.",
    },
  ];

  const team = [
    { name: "Dr. Sarah Chen", role: "CEO & Co-Founder", bio: "Former AI Research Lead at Stanford. PhD in Computer Vision." },
    { name: "Marcus Johnson", role: "CTO & Co-Founder", bio: "Ex-Google engineer. Expert in deep learning and media forensics." },
    { name: "Elena Rodriguez", role: "Head of Research", bio: "Published 40+ papers on synthetic media detection." },
    { name: "David Park", role: "VP of Engineering", bio: "Built ML infrastructure at scale for Fortune 500 companies." },
  ];

  const milestones = [
    { year: "2023", event: "DeepGuard founded with $5M seed funding" },
    { year: "2024", event: "Launched public beta, reached 10K users in first month" },
    { year: "2024", event: "Series A funding of $25M led by Sequoia" },
    { year: "2025", event: "Expanded to 150+ countries, 1M monthly analyses" },
    { year: "2026", event: "Launched enterprise API and desktop applications" },
  ];

  return (
    <>
      <Helmet>
        <title>About Us | DeepGuard</title>
        <meta name="description" content="Learn about DeepGuard's mission to protect truth in the age of AI through advanced deepfake detection technology." />
      </Helmet>
      
      <div className="min-h-screen bg-background">
        <Navbar />
        
        <main className="pt-32 pb-20">
          <div className="container mx-auto px-6">
            {/* Hero */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center max-w-3xl mx-auto mb-20"
            >
              <div className="w-20 h-20 rounded-2xl gradient-primary flex items-center justify-center mx-auto mb-6">
                <Shield className="w-10 h-10 text-primary-foreground" />
              </div>
              <h1 className="font-display text-5xl font-bold mb-4">About DeepGuard</h1>
              <p className="text-xl text-muted-foreground">
                We're on a mission to protect truth in the age of AI. Our technology helps individuals and organizations detect manipulated media with unprecedented accuracy.
              </p>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20"
            >
              {stats.map((stat) => (
                <div key={stat.label} className="glass rounded-2xl p-6 text-center">
                  <div className="font-display text-4xl font-bold text-primary mb-2">{stat.value}</div>
                  <div className="text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </motion.div>

            {/* Mission */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="glass rounded-3xl p-8 md:p-12 mb-20"
            >
              <div className="max-w-3xl mx-auto text-center">
                <Globe className="w-12 h-12 text-primary mx-auto mb-6" />
                <h2 className="font-display text-3xl font-bold mb-4">Our Mission</h2>
                <p className="text-lg text-muted-foreground">
                  As AI-generated content becomes increasingly sophisticated, the line between real and fake blurs. DeepGuard exists to give everyone the tools to verify what they see. We believe that access to truth is a fundamental right, and we're committed to making deepfake detection accessible, accurate, and private.
                </p>
              </div>
            </motion.div>

            {/* Values */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mb-20"
            >
              <h2 className="font-display text-3xl font-bold text-center mb-8">Our Values</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {values.map((value) => (
                  <Card key={value.title} className="glass border-border/50">
                    <CardContent className="pt-6">
                      <value.icon className="w-10 h-10 text-primary mb-4" />
                      <h3 className="font-display text-xl font-semibold mb-2">{value.title}</h3>
                      <p className="text-muted-foreground">{value.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </motion.div>

            {/* Team */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mb-20"
            >
              <h2 className="font-display text-3xl font-bold text-center mb-8">Leadership Team</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {team.map((member) => (
                  <Card key={member.name} className="glass border-border/50">
                    <CardContent className="pt-6 text-center">
                      <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4">
                        <Users className="w-8 h-8 text-primary" />
                      </div>
                      <h3 className="font-display text-lg font-semibold">{member.name}</h3>
                      <p className="text-primary text-sm mb-2">{member.role}</p>
                      <p className="text-muted-foreground text-sm">{member.bio}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </motion.div>

            {/* Timeline */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <h2 className="font-display text-3xl font-bold text-center mb-8">Our Journey</h2>
              <div className="max-w-2xl mx-auto">
                {milestones.map((milestone, index) => (
                  <div key={index} className="flex gap-4 mb-6">
                    <div className="flex flex-col items-center">
                      <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                        <Award className="w-5 h-5 text-primary" />
                      </div>
                      {index < milestones.length - 1 && <div className="w-0.5 h-full bg-border mt-2" />}
                    </div>
                    <div className="pb-6">
                      <span className="text-primary font-bold">{milestone.year}</span>
                      <p className="text-muted-foreground">{milestone.event}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default About;
