import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Database, MessageSquare, Star, HelpCircle, Quote,
  User, Calendar, ThumbsUp, ThumbsDown, RefreshCw
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface FAQ {
  question: string;
  answer: string;
  category: string;
  helpful: number;
  notHelpful: number;
}

interface Review {
  id: string;
  author: string;
  rating: number;
  title: string;
  content: string;
  date: string;
  verified: boolean;
  helpful: number;
}

interface Testimonial {
  quote: string;
  author: string;
  role: string;
  company: string;
  avatar?: string;
}

const SampleData = () => {
  const [refreshKey, setRefreshKey] = useState(0);

  const faqs: FAQ[] = [
    {
      question: "How accurate is DeepGuard's detection?",
      answer: "DeepGuard achieves 95%+ accuracy on standard deepfake benchmarks. Our AI models are continuously trained on the latest manipulation techniques. However, no detection system is 100% accurate - results should be used as one factor in your evaluation.",
      category: "Accuracy",
      helpful: 342,
      notHelpful: 12,
    },
    {
      question: "What file formats are supported?",
      answer: "We support images (JPG, PNG, WebP, GIF), videos (MP4, WebM, MOV), and audio (MP3, WAV, M4A). Maximum file size is 50MB for free users and 500MB for Pro subscribers.",
      category: "Features",
      helpful: 289,
      notHelpful: 8,
    },
    {
      question: "Is my uploaded content stored?",
      answer: "No. Your files are processed in real-time and automatically deleted within 24 hours. We never store your media permanently or use it for training purposes. See our Privacy Policy for details.",
      category: "Privacy",
      helpful: 456,
      notHelpful: 5,
    },
    {
      question: "How does the API work?",
      answer: "Our REST API accepts base64-encoded media files and returns analysis results in JSON format. Authentication is via Bearer tokens. Rate limits are 100/day (Free) or 10,000/day (Pro). See API docs for endpoints.",
      category: "API",
      helpful: 178,
      notHelpful: 15,
    },
    {
      question: "Can I cancel my subscription anytime?",
      answer: "Yes! You can cancel your Pro subscription at any time from your Profile page. You'll retain access until the end of your billing period. We offer a 14-day money-back guarantee for new subscribers.",
      category: "Billing",
      helpful: 234,
      notHelpful: 3,
    },
    {
      question: "What is the heatmap overlay?",
      answer: "The heatmap highlights regions of an image where our AI detected potential manipulation. Brighter red areas indicate higher confidence of editing. This helps you understand exactly where alterations may have occurred.",
      category: "Features",
      helpful: 312,
      notHelpful: 9,
    },
    {
      question: "Does DeepGuard work with AI-generated images?",
      answer: "Yes! DeepGuard can detect AI-generated images from tools like Midjourney, DALL-E, and Stable Diffusion. Our models are trained to identify artifacts and patterns unique to synthetic media.",
      category: "Accuracy",
      helpful: 423,
      notHelpful: 18,
    },
    {
      question: "Is there a browser extension?",
      answer: "Yes! Our browser extension lets you right-click any image online to analyze it instantly. Available for Chrome and Firefox. Pro subscribers get unlimited extension usage.",
      category: "Features",
      helpful: 267,
      notHelpful: 11,
    },
  ];

  const reviews: Review[] = [
    {
      id: "1",
      author: "Sarah M.",
      rating: 5,
      title: "Essential tool for journalists",
      content: "As a fact-checker at a major news outlet, DeepGuard has become indispensable. The batch processing feature saves hours when verifying multiple images. Highly recommend for any newsroom.",
      date: "January 28, 2026",
      verified: true,
      helpful: 89,
    },
    {
      id: "2",
      author: "James T.",
      rating: 5,
      title: "Caught a deepfake that fooled everyone else",
      content: "Used DeepGuard to verify a viral video and it immediately flagged facial inconsistencies that human reviewers missed. The heatmap feature is incredibly useful for understanding WHY something is flagged.",
      date: "January 25, 2026",
      verified: true,
      helpful: 156,
    },
    {
      id: "3",
      author: "Maria K.",
      rating: 4,
      title: "Great accuracy, occasional false positives",
      content: "Overall very impressed with the detection capabilities. Occasionally flags heavily compressed images as suspicious, but the confidence scores help distinguish real issues. Pro plan is worth it.",
      date: "January 22, 2026",
      verified: true,
      helpful: 67,
    },
    {
      id: "4",
      author: "David L.",
      rating: 5,
      title: "API integration was seamless",
      content: "Integrated DeepGuard API into our content moderation pipeline in under a day. Documentation is excellent, and the response times are fast enough for real-time use. Support team was very helpful.",
      date: "January 18, 2026",
      verified: true,
      helpful: 43,
    },
    {
      id: "5",
      author: "Emily R.",
      rating: 5,
      title: "Finally, a tool I can trust",
      content: "After trying several deepfake detectors, DeepGuard is the first one that consistently works. The privacy-first approach (24hr deletion) matters a lot for the sensitive content we handle.",
      date: "January 15, 2026",
      verified: true,
      helpful: 112,
    },
    {
      id: "6",
      author: "Michael P.",
      rating: 4,
      title: "Solid for personal use",
      content: "Using the free tier to verify images before sharing them. Works well for most cases. Would love to see more detailed explanations of what the AI is detecting.",
      date: "January 12, 2026",
      verified: false,
      helpful: 28,
    },
  ];

  const testimonials: Testimonial[] = [
    {
      quote: "DeepGuard has fundamentally changed how we verify user-submitted content. What used to take our moderation team hours now takes seconds.",
      author: "Alexandra Chen",
      role: "Head of Trust & Safety",
      company: "SocialNet",
    },
    {
      quote: "In an era of synthetic media, tools like DeepGuard are essential for maintaining public trust in journalism. It's now part of our standard verification workflow.",
      author: "Robert Martinez",
      role: "Managing Editor",
      company: "Global News Network",
    },
    {
      quote: "The API reliability and speed exceeded our expectations. We process over 100,000 images daily through DeepGuard with 99.9% uptime.",
      author: "Priya Sharma",
      role: "CTO",
      company: "ContentGuard AI",
    },
    {
      quote: "As a cybersecurity firm, we recommend DeepGuard to all our enterprise clients. The accuracy and privacy guarantees meet the highest standards.",
      author: "Thomas Anderson",
      role: "Principal Security Consultant",
      company: "CyberShield Inc",
    },
  ];

  const renderStars = (rating: number) => {
    return Array(5).fill(0).map((_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < rating ? "text-yellow-400 fill-yellow-400" : "text-muted-foreground"}`}
      />
    ));
  };

  return (
    <Card className="glass border-border/50">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Database className="w-5 h-5 text-primary" />
              Sample Data Repository
            </CardTitle>
            <CardDescription>
              FAQ, reviews, and testimonials data
            </CardDescription>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            className="gap-2"
            onClick={() => {
              setRefreshKey(k => k + 1);
              toast.success("Data refreshed");
            }}
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="faq" className="space-y-4">
          <TabsList>
            <TabsTrigger value="faq" className="gap-2">
              <HelpCircle className="w-4 h-4" />
              FAQ ({faqs.length})
            </TabsTrigger>
            <TabsTrigger value="reviews" className="gap-2">
              <Star className="w-4 h-4" />
              Reviews ({reviews.length})
            </TabsTrigger>
            <TabsTrigger value="testimonials" className="gap-2">
              <Quote className="w-4 h-4" />
              Testimonials ({testimonials.length})
            </TabsTrigger>
          </TabsList>

          <ScrollArea className="h-[400px]">
            {/* FAQ Tab */}
            <TabsContent value="faq" className="space-y-3 mt-0">
              {faqs.map((faq, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.05 }}
                  className="p-4 rounded-lg bg-muted/30"
                >
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-semibold text-sm">{faq.question}</h4>
                    <Badge variant="outline" className="text-xs shrink-0 ml-2">
                      {faq.category}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">{faq.answer}</p>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <ThumbsUp className="w-3 h-3" /> {faq.helpful}
                    </span>
                    <span className="flex items-center gap-1">
                      <ThumbsDown className="w-3 h-3" /> {faq.notHelpful}
                    </span>
                  </div>
                </motion.div>
              ))}
            </TabsContent>

            {/* Reviews Tab */}
            <TabsContent value="reviews" className="space-y-3 mt-0">
              {reviews.map((review, i) => (
                <motion.div
                  key={review.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.05 }}
                  className="p-4 rounded-lg bg-muted/30"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                        <User className="w-4 h-4 text-primary" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-sm">{review.author}</span>
                          {review.verified && (
                            <Badge variant="outline" className="text-xs bg-green-500/20 text-green-400">
                              Verified
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-1">
                          {renderStars(review.rating)}
                        </div>
                      </div>
                    </div>
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {review.date}
                    </span>
                  </div>
                  <h5 className="font-semibold text-sm mb-1">{review.title}</h5>
                  <p className="text-sm text-muted-foreground mb-2">{review.content}</p>
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <ThumbsUp className="w-3 h-3" />
                    {review.helpful} found this helpful
                  </span>
                </motion.div>
              ))}
            </TabsContent>

            {/* Testimonials Tab */}
            <TabsContent value="testimonials" className="space-y-3 mt-0">
              {testimonials.map((testimonial, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.05 }}
                  className="p-4 rounded-lg bg-muted/30"
                >
                  <Quote className="w-6 h-6 text-primary mb-2" />
                  <p className="text-sm italic mb-4">"{testimonial.quote}"</p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                      <User className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold text-sm">{testimonial.author}</p>
                      <p className="text-xs text-muted-foreground">
                        {testimonial.role}, {testimonial.company}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </TabsContent>
          </ScrollArea>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default SampleData;
