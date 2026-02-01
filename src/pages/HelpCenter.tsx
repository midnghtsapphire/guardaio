import { motion } from "framer-motion";
import { HelpCircle, Search, MessageCircle, Book, Video, ArrowRight, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const HelpCenter = () => {
  const navigate = useNavigate();

  const categories = [
    { icon: "🚀", title: "Getting Started", articles: 12, description: "New to DeepGuard? Start here." },
    { icon: "🔧", title: "Account & Billing", articles: 15, description: "Manage your subscription and settings." },
    { icon: "📤", title: "Uploading & Analysis", articles: 18, description: "Learn how to analyze media files." },
    { icon: "📊", title: "Understanding Results", articles: 10, description: "Interpret detection findings." },
    { icon: "🔌", title: "API & Integrations", articles: 22, description: "Connect DeepGuard to your tools." },
    { icon: "🔒", title: "Security & Privacy", articles: 8, description: "How we protect your data." },
  ];

  const faqs = [
    {
      question: "How accurate is DeepGuard's detection?",
      answer: "DeepGuard achieves 99.2% accuracy on our benchmark dataset. However, accuracy can vary depending on the type and quality of the media being analyzed. We continuously update our models to handle new deepfake techniques.",
    },
    {
      question: "What file types are supported?",
      answer: "We support most common image formats (JPEG, PNG, WebP, GIF), video formats (MP4, MOV, AVI, WebM), and audio formats (MP3, WAV, M4A, OGG). Maximum file size is 100MB for free users and 500MB for Pro users.",
    },
    {
      question: "How long does analysis take?",
      answer: "Most images are analyzed in under 2 seconds. Videos typically take 1-3 seconds per minute of content. Audio analysis averages 1 second per minute of recording.",
    },
    {
      question: "Is my data stored permanently?",
      answer: "No. Uploaded files are processed in memory and automatically deleted within 24 hours. Analysis results are stored in your history until you delete them or close your account.",
    },
    {
      question: "Can I use DeepGuard for legal evidence?",
      answer: "Our analysis provides probabilistic assessments and should be used as one factor in your evaluation. For legal proceedings, we recommend having results reviewed by a qualified forensic expert.",
    },
    {
      question: "How do I cancel my subscription?",
      answer: "You can cancel your subscription at any time from your Account Settings. Your access will continue until the end of your current billing period.",
    },
  ];

  const popularArticles = [
    "How to upload your first file for analysis",
    "Understanding confidence scores explained",
    "Setting up two-factor authentication",
    "Downloading analysis reports as PDF",
    "API rate limits and quotas",
    "Troubleshooting upload errors",
  ];

  return (
    <>
      <Helmet>
        <title>Help Center | DeepGuard</title>
        <meta name="description" content="Find answers to common questions about DeepGuard. Browse our help center for guides, tutorials, and FAQs." />
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
                <HelpCircle className="w-10 h-10 text-primary-foreground" />
              </div>
              <h1 className="font-display text-5xl font-bold mb-4">Help Center</h1>
              <p className="text-xl text-muted-foreground mb-8">
                Find answers, browse guides, and get support.
              </p>
              
              <div className="relative max-w-xl mx-auto">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  placeholder="Search for help articles..."
                  className="pl-12 h-12 text-lg"
                />
              </div>
            </motion.div>

            {/* Categories */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16"
            >
              {categories.map((category) => (
                <Card key={category.title} className="glass border-border/50 hover:border-primary/50 transition-colors cursor-pointer">
                  <CardHeader>
                    <div className="text-4xl mb-2">{category.icon}</div>
                    <CardTitle>{category.title}</CardTitle>
                    <CardDescription>{category.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <span className="text-sm text-primary">{category.articles} articles →</span>
                  </CardContent>
                </Card>
              ))}
            </motion.div>

            {/* FAQ */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="max-w-3xl mx-auto mb-16"
            >
              <h2 className="font-display text-2xl font-bold mb-6">Frequently Asked Questions</h2>
              <Accordion type="single" collapsible className="glass rounded-2xl px-6">
                {faqs.map((faq, index) => (
                  <AccordionItem key={index} value={`item-${index}`}>
                    <AccordionTrigger className="text-left">{faq.question}</AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </motion.div>

            {/* Popular Articles */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="max-w-3xl mx-auto mb-16"
            >
              <h2 className="font-display text-2xl font-bold mb-6">Popular Articles</h2>
              <div className="grid md:grid-cols-2 gap-4">
                {popularArticles.map((article) => (
                  <Card key={article} className="glass border-border/50 hover:border-primary/50 transition-colors cursor-pointer">
                    <CardContent className="py-4 flex items-center justify-between">
                      <span className="text-sm">{article}</span>
                      <ArrowRight className="w-4 h-4 shrink-0" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            </motion.div>

            {/* Contact Support */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="glass rounded-3xl p-8 max-w-3xl mx-auto"
            >
              <div className="text-center">
                <MessageCircle className="w-12 h-12 text-primary mx-auto mb-4" />
                <h2 className="font-display text-2xl font-bold mb-2">Still need help?</h2>
                <p className="text-muted-foreground mb-6">
                  Our support team is available Monday-Friday, 9am-6pm PST.
                </p>
                <div className="flex flex-wrap justify-center gap-4">
                  <Button onClick={() => navigate("/contact")} className="gap-2">
                    <MessageCircle className="w-4 h-4" />
                    Contact Support
                  </Button>
                  <Button variant="outline" onClick={() => navigate("/docs")} className="gap-2">
                    <Book className="w-4 h-4" />
                    Browse Docs
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default HelpCenter;
