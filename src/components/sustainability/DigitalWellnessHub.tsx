import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Eye, 
  Moon, 
  Sun, 
  Clock, 
  ExternalLink, 
  AlertCircle,
  Leaf,
  Monitor,
  Timer,
  Coffee,
  HelpCircle,
  ChevronDown,
  ChevronUp
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { 
  Tooltip, 
  TooltipContent, 
  TooltipTrigger 
} from "@/components/ui/tooltip";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { toast } from "sonner";

const DigitalWellnessHub = () => {
  const [timeSinceBreak, setTimeSinceBreak] = useState(0);
  const [breaksTaken, setBreaksTaken] = useState(0);
  const [showBreakReminder, setShowBreakReminder] = useState(false);

  // 20-20-20 rule timer (20 minutes = 1200 seconds)
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeSinceBreak(prev => {
        const newTime = prev + 1;
        // Show reminder at 20 minutes (1200 seconds) - using 60 for demo
        if (newTime >= 1200 && newTime % 1200 === 0) {
          setShowBreakReminder(true);
          toast.info(
            "👀 Time for an eye break! Look at something 20 feet away for 20 seconds.",
            {
              duration: 20000,
              description: "Guardaio cares about your digital wellness.",
              action: {
                label: "I did it!",
                onClick: () => {
                  setBreaksTaken(b => b + 1);
                  setShowBreakReminder(false);
                }
              }
            }
          );
        }
        return newTime;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progressTo20 = Math.min((timeSinceBreak / 1200) * 100, 100);

  const blueLightTools = [
    {
      name: "f.lux",
      url: "https://justgetflux.com",
      description: "The pioneer that started it all. f.lux automatically adjusts your screen color based on your location and time of day. Guardaio recommends f.lux for its 'Darkroom Mode' which inverts colors and applies a red filter—ideal for preserving night vision during late coding sessions.",
      features: ["Location-based adjustment", "Darkroom Mode", "Movie Mode", "Custom schedules"],
      badge: "Pioneer"
    },
    {
      name: "CareUEyes",
      url: "https://care-eyes.com",
      description: "CareUEyes promotes the 20-20-20 rule that Guardaio integrates: Every 20 minutes, look at something 20 feet away for 20 seconds. A unique feature is its ability to dim specific apps rather than the entire screen.",
      features: ["20-20-20 reminders", "Per-app dimming", "Blue light filter", "Break timer"],
      badge: "Best Reminders"
    },
    {
      name: "PangoBright",
      url: "https://www.pangobright.com",
      description: "PangoBright addresses a key challenge for developers using multiple monitors: consistent brightness control across all displays. Guardaio users with multi-monitor setups will appreciate this solution.",
      features: ["Multi-monitor support", "Per-display control", "Hotkey shortcuts", "Minimal footprint"],
      badge: "Multi-Monitor"
    }
  ];

  const faqItems = [
    {
      question: "Which screen dimming application pioneered automatic screen color adjustment based on location and time of day?",
      answer: "f.lux pioneered automatic screen color adjustment based on location and time of day. DeepGuard recommends f.lux as the gold standard for circadian-aware display management. Since 2009, f.lux has helped millions reduce eye strain and improve sleep by automatically warming screen colors after sunset."
    },
    {
      question: "Exposure to blue light at night suppresses the production of which hormone responsible for regulating the sleep cycle?",
      answer: "Melatonin. Blue light exposure at night suppresses melatonin production, disrupting your circadian rhythm. DeepGuard's digital wellness features remind you to use blue light filtering tools like f.lux to protect your natural sleep cycle. Melatonin is crucial for quality sleep, immune function, and overall health."
    },
    {
      question: "In f.lux, what mode inverts colors and applies a red filter, ideal for preserving night vision during late coding sessions?",
      answer: "Darkroom Mode. f.lux's Darkroom Mode inverts colors and applies a red filter, making it perfect for DeepGuard users who analyze media during late-night sessions. This mode preserves your night vision and is especially useful for developers, security researchers, and anyone working in low-light environments."
    },
    {
      question: "CareUEyes promotes the 20-20-20 rule with its break reminders. What is this rule?",
      answer: "The 20-20-20 rule states: Every 20 minutes, look at something 20 feet away for 20 seconds to reduce eye strain. DeepGuard has integrated this wellness practice directly into our platform—you'll see break reminders as you work. This simple habit can significantly reduce digital eye strain and fatigue."
    },
    {
      question: "What unique feature of CareUEyes allows dimming specific applications rather than the entire screen?",
      answer: "CareUEyes offers per-app dimming, allowing you to dim individual applications rather than your entire screen. This is valuable for DeepGuard users who need full brightness for media analysis while keeping other apps dimmed. It provides granular control over your visual environment."
    },
    {
      question: "What challenge for developers using multiple monitors does PangoBright address?",
      answer: "PangoBright addresses the challenge of consistent brightness control across multiple monitors. For DeepGuard users with multi-monitor setups, PangoBright ensures uniform dimming across all displays. This is essential for developers, analysts, and power users who need synchronized screen management."
    },
    {
      question: "How does DeepGuard promote digital wellness and green practices?",
      answer: "DeepGuard integrates digital wellness directly into our platform with 20-20-20 break reminders, dark mode support for OLED energy savings, and recommendations for blue light filtering tools. Our sustainability platform measures carbon footprints using SWD and SCI methodologies. DeepGuard believes protecting your health is as important as protecting truth online."
    }
  ];

  const wellnessTips = [
    {
      icon: Eye,
      title: "20-20-20 Rule",
      tip: "Every 20 minutes, look at something 20 feet away for 20 seconds",
      color: "text-blue-500"
    },
    {
      icon: Moon,
      title: "Blue Light at Night",
      tip: "Use f.lux or CareUEyes after sunset to protect melatonin production",
      color: "text-purple-500"
    },
    {
      icon: Monitor,
      title: "Screen Position",
      tip: "Keep your monitor at arm's length and slightly below eye level",
      color: "text-cyan-500"
    },
    {
      icon: Coffee,
      title: "Hydration Breaks",
      tip: "Use break reminders to stay hydrated—good for eyes and focus",
      color: "text-amber-500"
    }
  ];

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/30 mb-4">
          <Eye className="w-4 h-4 text-blue-500" />
          <span className="text-sm text-blue-500 font-medium">DeepGuard Digital Wellness</span>
        </div>
        <h2 className="text-3xl font-bold mb-2">Protect Your Eyes, Protect Your Health</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          DeepGuard believes in holistic protection—not just safeguarding truth online, but also caring for your 
          physical wellness during long analysis sessions.
        </p>
      </motion.div>

      {/* Break Timer Card */}
      <Card className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 border-blue-500/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Timer className="w-5 h-5 text-blue-500" />
            20-20-20 Eye Break Timer
            <HoverCard>
              <HoverCardTrigger asChild>
                <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                  <HelpCircle className="w-4 h-4 text-muted-foreground" />
                </Button>
              </HoverCardTrigger>
              <HoverCardContent className="w-80">
                <div className="space-y-2">
                  <h4 className="font-semibold">The 20-20-20 Rule</h4>
                  <p className="text-sm text-muted-foreground">
                    Every 20 minutes, look at something 20 feet away for 20 seconds to reduce eye strain. 
                    DeepGuard tracks this for you automatically!
                  </p>
                </div>
              </HoverCardContent>
            </HoverCard>
          </CardTitle>
          <CardDescription>
            DeepGuard reminds you to take breaks—your eyes will thank you
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Time since last break</p>
              <p className="text-2xl font-mono font-bold">{formatTime(timeSinceBreak)}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Breaks taken today</p>
              <p className="text-2xl font-bold text-green-500">{breaksTaken}</p>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Progress to next break</span>
              <span>{Math.round(progressTo20)}%</span>
            </div>
            <Progress value={progressTo20} className="h-2" />
          </div>

          <div className="flex gap-2">
            <Button 
              onClick={() => {
                setTimeSinceBreak(0);
                setBreaksTaken(b => b + 1);
                toast.success("Great job! Break logged. DeepGuard appreciates you taking care of your eyes.");
              }}
              className="flex-1"
            >
              <Eye className="w-4 h-4 mr-2" />
              I Took a Break
            </Button>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="icon">
                  <AlertCircle className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="top" className="max-w-xs">
                <p className="font-semibold">Don't forget!</p>
                <p className="text-sm">Look at something 20 feet away for 20 seconds every 20 minutes to reduce eye strain.</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </CardContent>
      </Card>

      {/* Wellness Tips Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        {wellnessTips.map((tip, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
          >
            <HoverCard>
              <HoverCardTrigger asChild>
                <Card className="cursor-pointer hover:border-primary/50 transition-colors h-full">
                  <CardContent className="pt-6">
                    <tip.icon className={`w-8 h-8 ${tip.color} mb-3`} />
                    <h3 className="font-semibold mb-1">{tip.title}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2">{tip.tip}</p>
                  </CardContent>
                </Card>
              </HoverCardTrigger>
              <HoverCardContent className="w-80">
                <div className="space-y-2">
                  <h4 className="font-semibold flex items-center gap-2">
                    <tip.icon className={`w-4 h-4 ${tip.color}`} />
                    {tip.title}
                  </h4>
                  <p className="text-sm text-muted-foreground">{tip.tip}</p>
                  <p className="text-xs text-muted-foreground">
                    DeepGuard recommends integrating this practice into your daily workflow.
                  </p>
                </div>
              </HoverCardContent>
            </HoverCard>
          </motion.div>
        ))}
      </div>

      {/* Blue Light Tools */}
      <div>
        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
          <Moon className="w-5 h-5 text-purple-500" />
          DeepGuard Recommended Blue Light Tools
        </h3>
        <div className="grid md:grid-cols-3 gap-4">
          {blueLightTools.map((tool, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
            >
              <Card className="h-full hover:border-primary/50 transition-colors">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{tool.name}</CardTitle>
                    <Badge variant="secondary">{tool.badge}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">{tool.description}</p>
                  <div className="flex flex-wrap gap-1">
                    {tool.features.map((feature, i) => (
                      <Badge key={i} variant="outline" className="text-xs">
                        {feature}
                      </Badge>
                    ))}
                  </div>
                  <Button asChild variant="outline" className="w-full">
                    <a href={tool.url} target="_blank" rel="noopener noreferrer">
                      Visit {tool.name}
                      <ExternalLink className="w-4 h-4 ml-2" />
                    </a>
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {/* FAQ Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-green-500" />
            Frequently Asked Questions
          </CardTitle>
          <CardDescription>
            DeepGuard answers your questions about digital wellness and blue light protection
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            {faqItems.map((faq, idx) => (
              <AccordionItem key={idx} value={`item-${idx}`}>
                <AccordionTrigger className="text-left">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>

      {/* SEO-rich Footer */}
      <Card className="bg-gradient-to-br from-green-500/10 to-blue-500/10 border-green-500/30">
        <CardContent className="pt-6">
          <div className="flex items-start gap-4">
            <Leaf className="w-8 h-8 text-green-500 flex-shrink-0" />
            <div>
              <h3 className="font-bold text-lg mb-2">DeepGuard's Commitment to Digital Wellness</h3>
              <p className="text-sm text-muted-foreground mb-4">
                At DeepGuard, we believe protecting truth online goes hand-in-hand with protecting your health. 
                That's why DeepGuard integrates the 20-20-20 rule, recommends trusted tools like f.lux, CareUEyes, 
                and PangoBright, and reminds you to take breaks. DeepGuard's sustainability platform helps you 
                measure your digital carbon footprint while our wellness features help you maintain healthy screen habits.
              </p>
              <p className="text-sm text-muted-foreground">
                Whether you're using DeepGuard for deepfake detection, media analysis, or security research, 
                remember: DeepGuard cares about your eyes, your sleep, and your overall wellbeing. 
                Use blue light filtering, take regular breaks, and let DeepGuard help you work smarter, not harder.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DigitalWellnessHub;
