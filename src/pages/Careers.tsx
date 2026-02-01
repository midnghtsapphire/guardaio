import { motion } from "framer-motion";
import { Briefcase, MapPin, Clock, Heart, Zap, Users, Globe, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Helmet } from "react-helmet-async";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const Careers = () => {
  const benefits = [
    { icon: Heart, title: "Health & Wellness", description: "Comprehensive medical, dental, and vision coverage" },
    { icon: Zap, title: "Equity", description: "Competitive equity packages for all employees" },
    { icon: Globe, title: "Remote-First", description: "Work from anywhere in the world" },
    { icon: Users, title: "Team Offsites", description: "Quarterly gatherings in exciting locations" },
  ];

  const openings = [
    {
      title: "Senior Machine Learning Engineer",
      department: "Engineering",
      location: "Remote (US/EU)",
      type: "Full-time",
      description: "Build and optimize our core detection models using PyTorch and TensorFlow.",
    },
    {
      title: "Frontend Engineer",
      department: "Engineering",
      location: "Remote (Global)",
      type: "Full-time",
      description: "Create beautiful, responsive interfaces with React and TypeScript.",
    },
    {
      title: "Security Researcher",
      department: "Research",
      location: "San Francisco, CA",
      type: "Full-time",
      description: "Study emerging deepfake techniques and develop countermeasures.",
    },
    {
      title: "Product Designer",
      department: "Design",
      location: "Remote (US/EU)",
      type: "Full-time",
      description: "Design intuitive experiences for complex AI-powered features.",
    },
    {
      title: "Developer Advocate",
      department: "Developer Relations",
      location: "Remote (Global)",
      type: "Full-time",
      description: "Help developers integrate DeepGuard through content and community.",
    },
    {
      title: "Enterprise Account Executive",
      department: "Sales",
      location: "New York, NY",
      type: "Full-time",
      description: "Drive enterprise adoption of DeepGuard's detection platform.",
    },
  ];

  const values = [
    "We move fast and ship often",
    "We're transparent by default",
    "We celebrate diverse perspectives",
    "We prioritize impact over titles",
    "We learn from failures",
    "We protect user privacy fiercely",
  ];

  return (
    <>
      <Helmet>
        <title>Careers | DeepGuard</title>
        <meta name="description" content="Join DeepGuard and help protect truth in the age of AI. View open positions in engineering, research, design, and more." />
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
                <Briefcase className="w-10 h-10 text-primary-foreground" />
              </div>
              <h1 className="font-display text-5xl font-bold mb-4">Join Our Team</h1>
              <p className="text-xl text-muted-foreground mb-8">
                Help us build the future of media authenticity. We're looking for passionate people who want to make a difference.
              </p>
              <Button size="lg" className="gap-2">
                View Open Positions
                <ArrowRight className="w-5 h-5" />
              </Button>
            </motion.div>

            {/* Benefits */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="grid md:grid-cols-4 gap-6 mb-20"
            >
              {benefits.map((benefit) => (
                <Card key={benefit.title} className="glass border-border/50 text-center">
                  <CardContent className="pt-6">
                    <benefit.icon className="w-10 h-10 text-primary mx-auto mb-3" />
                    <h3 className="font-semibold mb-1">{benefit.title}</h3>
                    <p className="text-sm text-muted-foreground">{benefit.description}</p>
                  </CardContent>
                </Card>
              ))}
            </motion.div>

            {/* Culture */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="glass rounded-3xl p-8 md:p-12 mb-20"
            >
              <h2 className="font-display text-3xl font-bold text-center mb-8">Our Culture</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto">
                {values.map((value) => (
                  <div key={value} className="flex items-center gap-3 p-4 rounded-xl bg-primary/5">
                    <div className="w-2 h-2 rounded-full bg-primary shrink-0" />
                    <span className="text-muted-foreground">{value}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Open Positions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <h2 className="font-display text-3xl font-bold text-center mb-8">Open Positions</h2>
              <div className="space-y-4 max-w-4xl mx-auto">
                {openings.map((job, index) => (
                  <motion.div
                    key={job.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 + index * 0.05 }}
                  >
                    <Card className="glass border-border/50 hover:border-primary/50 transition-colors cursor-pointer">
                      <CardHeader>
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                          <div>
                            <CardTitle className="text-xl mb-2">{job.title}</CardTitle>
                            <div className="flex flex-wrap items-center gap-3">
                              <Badge variant="outline">{job.department}</Badge>
                              <span className="flex items-center gap-1 text-sm text-muted-foreground">
                                <MapPin className="w-4 h-4" />
                                {job.location}
                              </span>
                              <span className="flex items-center gap-1 text-sm text-muted-foreground">
                                <Clock className="w-4 h-4" />
                                {job.type}
                              </span>
                            </div>
                          </div>
                          <Button className="shrink-0 gap-2">
                            Apply
                            <ArrowRight className="w-4 h-4" />
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <CardDescription>{job.description}</CardDescription>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="mt-16 text-center glass rounded-2xl p-8 max-w-2xl mx-auto"
            >
              <h3 className="font-display text-2xl font-bold mb-2">Don't see the right role?</h3>
              <p className="text-muted-foreground mb-4">
                We're always looking for talented people. Send us your resume and we'll keep you in mind.
              </p>
              <Button variant="outline">Send General Application</Button>
            </motion.div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default Careers;
