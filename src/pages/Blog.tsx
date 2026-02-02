import { motion } from "framer-motion";
import { BookOpen, Calendar, Clock, ArrowRight, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Helmet } from "react-helmet-async";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const Blog = () => {
  const featuredPost = {
    title: "The Rise of Audio Deepfakes: How to Detect AI-Generated Voice",
    excerpt: "Voice cloning technology has advanced rapidly. Learn how our latest detection algorithms identify synthetic audio with 98% accuracy.",
    author: "Dr. Sarah Chen",
    date: "January 28, 2026",
    readTime: "8 min read",
    category: "Research",
    image: "/placeholder.svg",
  };

  const posts = [
    {
      title: "Guardaio 2.0: Introducing Real-Time Video Analysis",
      excerpt: "Our biggest update yet brings frame-by-frame analysis to live video streams.",
      author: "Marcus Johnson",
      date: "January 20, 2026",
      readTime: "5 min read",
      category: "Product",
    },
    {
      title: "Understanding GAN Artifacts: A Technical Deep Dive",
      excerpt: "How generative adversarial networks leave traces that our AI can detect.",
      author: "Elena Rodriguez",
      date: "January 15, 2026",
      readTime: "12 min read",
      category: "Research",
    },
    {
      title: "Protecting Elections: Guardaio Partners with EU Commission",
      excerpt: "We're proud to announce our role in combating electoral disinformation.",
      author: "Communications Team",
      date: "January 10, 2026",
      readTime: "4 min read",
      category: "News",
    },
    {
      title: "5 Signs an Image Might Be AI-Generated",
      excerpt: "Simple tips anyone can use to spot potential deepfakes before analysis.",
      author: "David Park",
      date: "January 5, 2026",
      readTime: "6 min read",
      category: "Tutorial",
    },
    {
      title: "Year in Review: 2025 Deepfake Trends",
      excerpt: "A comprehensive look at how synthetic media evolved over the past year.",
      author: "Research Team",
      date: "December 30, 2025",
      readTime: "10 min read",
      category: "Research",
    },
    {
      title: "API Best Practices for Enterprise Integration",
      excerpt: "Learn how to integrate Guardaio into your existing workflows efficiently.",
      author: "Developer Relations",
      date: "December 22, 2025",
      readTime: "7 min read",
      category: "Tutorial",
    },
  ];

  const categories = ["All", "Research", "Product", "News", "Tutorial"];

  return (
    <>
      <Helmet>
        <title>Blog | Guardaio</title>
        <meta name="description" content="Stay updated with the latest in deepfake detection, AI research, and product updates from the Guardaio team." />
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
              <h1 className="font-display text-5xl font-bold mb-4">Blog</h1>
              <p className="text-xl text-muted-foreground">
                Insights, research, and updates from the Guardaio team.
              </p>
            </motion.div>

            {/* Categories */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="flex flex-wrap justify-center gap-2 mb-12"
            >
              {categories.map((category, index) => (
                <Badge
                  key={category}
                  variant={index === 0 ? "default" : "outline"}
                  className="cursor-pointer px-4 py-2"
                >
                  {category}
                </Badge>
              ))}
            </motion.div>

            {/* Featured Post */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mb-12"
            >
              <Card className="glass border-border/50 overflow-hidden">
                <div className="grid md:grid-cols-2">
                  <div className="aspect-video md:aspect-auto bg-muted" />
                  <CardContent className="p-8 flex flex-col justify-center">
                    <Badge className="w-fit mb-4">{featuredPost.category}</Badge>
                    <CardTitle className="text-2xl mb-4">{featuredPost.title}</CardTitle>
                    <CardDescription className="text-base mb-6">{featuredPost.excerpt}</CardDescription>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-6">
                      <span className="flex items-center gap-1">
                        <User className="w-4 h-4" />
                        {featuredPost.author}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {featuredPost.date}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {featuredPost.readTime}
                      </span>
                    </div>
                    <Button className="w-fit gap-2">
                      Read Article
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </CardContent>
                </div>
              </Card>
            </motion.div>

            {/* Posts Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((post, index) => (
                <motion.div
                  key={post.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + index * 0.05 }}
                >
                  <Card className="glass border-border/50 h-full hover:border-primary/50 transition-colors cursor-pointer">
                    <CardHeader>
                      <Badge variant="outline" className="w-fit mb-2">{post.category}</Badge>
                      <CardTitle className="text-lg leading-tight">{post.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="mb-4">{post.excerpt}</CardDescription>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <span>{post.author}</span>
                        <span>•</span>
                        <span>{post.date}</span>
                        <span>•</span>
                        <span>{post.readTime}</span>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Load More */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="text-center mt-12"
            >
              <Button variant="outline" size="lg">
                Load More Articles
              </Button>
            </motion.div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default Blog;
