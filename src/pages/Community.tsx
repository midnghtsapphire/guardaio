import { motion } from "framer-motion";
import { Users, MessageSquare, Github, Twitter, Linkedin, ExternalLink, ArrowRight, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Helmet } from "react-helmet-async";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const Community = () => {
  const platforms = [
    {
      icon: MessageSquare,
      name: "Discord",
      description: "Join 5,000+ members discussing deepfake detection",
      members: "5,234",
      link: "#",
      color: "bg-[hsl(235,86%,65%)]",
    },
    {
      icon: Github,
      name: "GitHub",
      description: "Contribute to our open-source projects",
      members: "1,200 stars",
      link: "#",
      color: "bg-foreground",
    },
    {
      icon: Twitter,
      name: "Twitter/X",
      description: "Follow for updates and industry news",
      members: "12.5K followers",
      link: "#",
      color: "bg-foreground",
    },
    {
      icon: Linkedin,
      name: "LinkedIn",
      description: "Professional updates and company news",
      members: "8.2K followers",
      link: "#",
      color: "bg-[hsl(201,100%,35%)]",
    },
  ];

  const discussions = [
    { title: "Best practices for detecting face-swap deepfakes", replies: 47, category: "Research" },
    { title: "New audio cloning detection model released", replies: 23, category: "Updates" },
    { title: "Integration with Zapier - feature request", replies: 15, category: "Feature Requests" },
    { title: "False positive on celebrity images - help needed", replies: 31, category: "Support" },
    { title: "Building a deepfake detection app with React", replies: 42, category: "Showcase" },
  ];

  const contributors = [
    { name: "Alex Chen", contributions: 156, badge: "Core Contributor" },
    { name: "Maria Garcia", contributions: 89, badge: "Top Helper" },
    { name: "James Wilson", contributions: 67, badge: "Bug Hunter" },
    { name: "Priya Patel", contributions: 54, badge: "Documentation" },
  ];

  const events = [
    { title: "Monthly Community Call", date: "Feb 5, 2026", time: "10:00 AM PST" },
    { title: "Deepfake Detection Workshop", date: "Feb 12, 2026", time: "2:00 PM PST" },
    { title: "AMA with Research Team", date: "Feb 20, 2026", time: "11:00 AM PST" },
  ];

  return (
    <>
      <Helmet>
        <title>Community | Guardaio</title>
        <meta name="description" content="Join the Guardaio community. Connect with other users, get help, and contribute to deepfake detection research." />
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
                <Users className="w-10 h-10 text-primary-foreground" />
              </div>
              <h1 className="font-display text-5xl font-bold mb-4">Community</h1>
              <p className="text-xl text-muted-foreground mb-8">
                Connect with thousands of users fighting misinformation together.
              </p>
              <Button size="lg" className="gap-2">
                <MessageSquare className="w-5 h-5" />
                Join Discord
              </Button>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16"
            >
              {[
                { value: "25K+", label: "Community Members" },
                { value: "150+", label: "Countries" },
                { value: "10K+", label: "Discussions" },
                { value: "500+", label: "Contributors" },
              ].map((stat) => (
                <div key={stat.label} className="glass rounded-2xl p-6 text-center">
                  <div className="font-display text-3xl font-bold text-primary mb-1">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </motion.div>

            {/* Platforms */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mb-16"
            >
              <h2 className="font-display text-2xl font-bold text-center mb-8">Connect With Us</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {platforms.map((platform) => (
                  <Card key={platform.name} className="glass border-border/50 hover:border-primary/50 transition-colors cursor-pointer group">
                    <CardHeader>
                      <div className={`w-12 h-12 rounded-xl ${platform.color} flex items-center justify-center mb-2`}>
                        <platform.icon className="w-6 h-6 text-white" />
                      </div>
                      <CardTitle className="flex items-center justify-between">
                        {platform.name}
                        <ExternalLink className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </CardTitle>
                      <CardDescription>{platform.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <span className="text-sm text-primary">{platform.members}</span>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </motion.div>

            <div className="grid lg:grid-cols-3 gap-8">
              {/* Recent Discussions */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="lg:col-span-2"
              >
                <h2 className="font-display text-2xl font-bold mb-6">Trending Discussions</h2>
                <div className="space-y-4">
                  {discussions.map((discussion) => (
                    <Card key={discussion.title} className="glass border-border/50 hover:border-primary/50 transition-colors cursor-pointer">
                      <CardContent className="py-4 flex items-center justify-between">
                        <div>
                          <h3 className="font-medium mb-1">{discussion.title}</h3>
                          <div className="flex items-center gap-3 text-sm text-muted-foreground">
                            <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs">
                              {discussion.category}
                            </span>
                            <span>{discussion.replies} replies</span>
                          </div>
                        </div>
                        <ArrowRight className="w-4 h-4 shrink-0" />
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </motion.div>

              {/* Sidebar */}
              <div className="space-y-8">
                {/* Top Contributors */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <h2 className="font-display text-2xl font-bold mb-6">Top Contributors</h2>
                  <Card className="glass border-border/50">
                    <CardContent className="py-4 space-y-4">
                      {contributors.map((contributor, index) => (
                        <div key={contributor.name} className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                            {index + 1}
                          </div>
                          <div className="flex-1">
                            <p className="font-medium">{contributor.name}</p>
                            <p className="text-xs text-muted-foreground">{contributor.contributions} contributions</p>
                          </div>
                          <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary">
                            {contributor.badge}
                          </span>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Upcoming Events */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <h2 className="font-display text-2xl font-bold mb-6">Upcoming Events</h2>
                  <Card className="glass border-border/50">
                    <CardContent className="py-4 space-y-4">
                      {events.map((event) => (
                        <div key={event.title} className="border-l-2 border-primary pl-4">
                          <p className="font-medium">{event.title}</p>
                          <p className="text-sm text-muted-foreground">{event.date} • {event.time}</p>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                </motion.div>
              </div>
            </div>

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="mt-16 text-center glass rounded-3xl p-8 max-w-2xl mx-auto"
            >
              <Heart className="w-12 h-12 text-primary mx-auto mb-4" />
              <h2 className="font-display text-2xl font-bold mb-2">Become a Contributor</h2>
              <p className="text-muted-foreground mb-6">
                Help shape the future of deepfake detection. Contribute code, documentation, or research.
              </p>
              <Button className="gap-2">
                <Github className="w-4 h-4" />
                View on GitHub
              </Button>
            </motion.div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default Community;
