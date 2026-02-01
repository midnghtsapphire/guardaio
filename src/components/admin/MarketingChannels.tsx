import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Youtube, Twitter, Linkedin, Instagram, Facebook,
  Megaphone, BarChart3, Target, Calendar, 
  ExternalLink, Copy, Check, TrendingUp, Users,
  Video, FileText, Podcast, Mail, Camera, Palette,
  Monitor, Mic, Scissors, Clapperboard
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";

const MarketingChannels = () => {
  const [copiedText, setCopiedText] = useState<string | null>(null);

  const copyText = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(id);
    toast.success("Copied to clipboard!");
    setTimeout(() => setCopiedText(null), 2000);
  };

  const youtubeStrategy = {
    channel: {
      name: "DeepGuard AI",
      handle: "@deepguard",
      description: "Protecting truth in the age of AI. Learn to detect deepfakes, understand AI manipulation, and stay safe online.",
      targetSubs: "100K by Q4 2026",
    },
    contentPillars: [
      {
        pillar: "Detection Tutorials",
        frequency: "2x/week",
        format: "10-15 min",
        examples: [
          "How to Spot a Deepfake in 30 Seconds",
          "5 Signs an Image is AI-Generated",
          "Audio Deepfakes: What Your Ears Miss",
          "Reverse Image Search Like a Pro"
        ]
      },
      {
        pillar: "Case Studies",
        frequency: "1x/week",
        format: "15-25 min",
        examples: [
          "Breaking Down Viral Deepfakes",
          "How Scammers Use AI Voices",
          "Celebrity Deepfake Analysis",
          "Political Misinformation Deep Dive"
        ]
      },
      {
        pillar: "Tool Demos",
        frequency: "1x/week",
        format: "5-10 min",
        examples: [
          "DeepGuard Full Walkthrough",
          "Batch Analysis Tutorial",
          "API Integration Guide",
          "Mobile App Features"
        ]
      },
      {
        pillar: "Expert Interviews",
        frequency: "2x/month",
        format: "30-45 min",
        examples: [
          "FBI Agent on Deepfake Crimes",
          "AI Researcher: Future of Fakes",
          "Victim Stories: Recovery & Justice",
          "Legal Expert: Deepfake Laws"
        ]
      },
    ],
    seoKeywords: [
      "deepfake detection", "how to spot deepfakes", "AI generated images",
      "fake video detection", "deepfake detector", "is this image real",
      "AI manipulation", "deepfake tutorial", "protect from deepfakes",
      "voice cloning detection", "synthetic media", "media forensics"
    ],
    thumbnailFormula: {
      elements: ["Face with red highlight", "FAKE/REAL stamp", "Question mark", "Before/After split"],
      colors: ["Red for danger", "Green for verified", "Yellow for warning"],
      text: "Max 3 words, large bold font"
    }
  };

  const contentCalendar = [
    { week: "Week 1", monday: "Detection Tutorial", wednesday: "Case Study", friday: "Tool Demo" },
    { week: "Week 2", monday: "Detection Tutorial", wednesday: "Expert Interview", friday: "Case Study" },
    { week: "Week 3", monday: "Detection Tutorial", wednesday: "Case Study", friday: "Tool Demo" },
    { week: "Week 4", monday: "Detection Tutorial", wednesday: "Community Q&A", friday: "Monthly Roundup" },
  ];

  const socialChannels = [
    {
      platform: "YouTube",
      icon: Youtube,
      color: "text-red-500",
      handle: "@deepguard",
      strategy: "Long-form educational + Shorts for virality",
      kpis: ["Watch time", "Subscribers", "CTR"],
      priority: "High",
    },
    {
      platform: "Twitter/X",
      icon: Twitter,
      color: "text-blue-400",
      handle: "@DeepGuardAI",
      strategy: "Breaking deepfake news, quick tips, engagement threads",
      kpis: ["Impressions", "Engagement rate", "Followers"],
      priority: "High",
    },
    {
      platform: "LinkedIn",
      icon: Linkedin,
      color: "text-blue-600",
      handle: "DeepGuard",
      strategy: "B2B content, enterprise features, thought leadership",
      kpis: ["Post views", "Company follows", "Demo requests"],
      priority: "Medium",
    },
    {
      platform: "Instagram",
      icon: Instagram,
      color: "text-pink-500",
      handle: "@deepguard.ai",
      strategy: "Visual comparisons, Reels, Stories for tips",
      kpis: ["Reach", "Saves", "Shares"],
      priority: "Medium",
    },
    {
      platform: "TikTok",
      icon: Video,
      color: "text-black dark:text-white",
      handle: "@deepguard",
      strategy: "Viral deepfake reveals, quick detection tips",
      kpis: ["Views", "Shares", "Profile visits"],
      priority: "High",
    },
  ];

  const contentTemplates = {
    youtube: {
      title: `🔍 Is This Image REAL or AI? | DeepGuard Detection Tutorial`,
      description: `Learn how to spot AI-generated images in seconds! In this video, I'll show you the telltale signs of deepfakes and how to use DeepGuard to verify any image.

🛡️ Try DeepGuard FREE: https://deepguard.app
📱 Download our app: [App Store/Play Store links]

⏱️ Timestamps:
0:00 - Introduction
1:30 - Common AI artifacts
4:00 - Using DeepGuard
7:00 - Advanced techniques
10:00 - Practice examples

#deepfake #AIdetection #factcheck #deepguard`,
      tags: "deepfake, AI detection, fake image, deepfake detector, how to spot deepfakes, AI generated, synthetic media, media forensics, fact check, misinformation"
    },
    twitter: {
      thread: `🧵 THREAD: How to spot a deepfake in 30 seconds

1/ Look at the EYES 👁️
- Unnatural blinking patterns
- Inconsistent lighting/reflections
- Pupils may be different sizes

2/ Check the EDGES 🔍
- Hair and ears often have artifacts
- Blurry boundaries around face
- Background inconsistencies

3/ Watch for TEMPORAL issues ⏱️
- Unnatural head movements
- Audio-video sync problems
- Flickering at edges

4/ Use TOOLS 🛡️
Stop guessing. Let AI detect AI.
Try @DeepGuardAI free: deepguard.app

RT to help others stay safe! 🔄`
    }
  };

  const growthMetrics = [
    { metric: "YouTube Subscribers", current: 0, target: 10000, timeline: "6 months" },
    { metric: "Monthly Video Views", current: 0, target: 100000, timeline: "6 months" },
    { metric: "Twitter Followers", current: 0, target: 25000, timeline: "6 months" },
    { metric: "Email List", current: 0, target: 5000, timeline: "6 months" },
    { metric: "Website Traffic", current: 0, target: 50000, timeline: "6 months" },
  ];

  const videoProductionGuide = {
    equipment: {
      essential: [
        { item: "Camera", recommendation: "Sony ZV-E10 or iPhone 14+", budget: "$600-1200" },
        { item: "Microphone", recommendation: "Rode VideoMicro II or Blue Yeti", budget: "$70-130" },
        { item: "Lighting", recommendation: "Elgato Key Light or ring light", budget: "$50-200" },
        { item: "Tripod", recommendation: "Manfrotto PIXI or Joby GorillaPod", budget: "$30-80" },
      ],
      advanced: [
        { item: "4K Camera", recommendation: "Sony A7C II or Canon R6 II", budget: "$2000-2500" },
        { item: "Shotgun Mic", recommendation: "Rode NTG5 or Sennheiser MKE 600", budget: "$400-500" },
        { item: "3-Point Lighting", recommendation: "Aputure 120D II kit", budget: "$600-1200" },
        { item: "Teleprompter", recommendation: "Elgato Prompter or iPad setup", budget: "$100-300" },
        { item: "Green Screen", recommendation: "Elgato Green Screen XL", budget: "$150-200" },
      ],
    },
    software: [
      { name: "DaVinci Resolve", purpose: "Video editing (free)", tier: "Essential" },
      { name: "Adobe Premiere Pro", purpose: "Professional video editing", tier: "Advanced" },
      { name: "Canva Pro", purpose: "Thumbnails & graphics", tier: "Essential" },
      { name: "Descript", purpose: "AI transcription & editing", tier: "Essential" },
      { name: "VidIQ / TubeBuddy", purpose: "YouTube SEO optimization", tier: "Essential" },
      { name: "Adobe After Effects", purpose: "Motion graphics & intros", tier: "Advanced" },
      { name: "Epidemic Sound", purpose: "Royalty-free music", tier: "Essential" },
    ],
    thumbnailFormula: {
      elements: [
        "High-contrast colors (red/yellow for danger)",
        "Face with strong emotion (surprise/concern)",
        "FAKE/REAL stamp or checkmark",
        "Before/After split composition",
        "Max 3 words of text",
        "Dark background for pop",
      ],
      tools: ["Canva Pro", "Photoshop", "Figma"],
      size: "1280x720 pixels (16:9)",
    },
    scriptTemplate: `[HOOK - 0:00-0:15]
- Start with a shocking statistic or visual
- "This image fooled 10 million people..."
- Show the deepfake before revealing it's fake

[INTRO - 0:15-0:45]
- Brief channel intro (2-3 seconds max)
- State what viewers will learn
- "By the end of this video, you'll know exactly how to spot this"

[MAIN CONTENT - 0:45-8:00]
Section 1: The Problem (1-2 min)
- Why this matters, real-world impact
- Statistics on deepfake prevalence

Section 2: The Signs (3-4 min)
- Specific detection techniques
- Visual examples with annotations
- "Notice how the edges blur here..."

Section 3: The Solution (2 min)
- Introduce DeepGuard tool
- Live demo with real analysis
- Show the confidence score and findings

[CTA - 8:00-8:30]
- "Try DeepGuard free at deepguard.app"
- Like, subscribe, notification bell
- Tease next video topic

[OUTRO - 8:30-9:00]
- End screen with related videos
- Final reminder of key takeaway`,
  };

  return (
    <Card className="glass border-border/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Megaphone className="w-5 h-5 text-primary" />
          Marketing Channels
        </CardTitle>
        <CardDescription>
          YouTube strategy, social media playbook, and content calendar
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="youtube" className="space-y-4">
          <TabsList className="grid grid-cols-5 w-full">
            <TabsTrigger value="youtube" className="gap-1 text-xs">
              <Youtube className="w-3 h-3" />
              <span className="hidden sm:inline">YouTube</span>
            </TabsTrigger>
            <TabsTrigger value="production" className="gap-1 text-xs">
              <Clapperboard className="w-3 h-3" />
              <span className="hidden sm:inline">Production</span>
            </TabsTrigger>
            <TabsTrigger value="social" className="gap-1 text-xs">
              <Users className="w-3 h-3" />
              <span className="hidden sm:inline">Social</span>
            </TabsTrigger>
            <TabsTrigger value="templates" className="gap-1 text-xs">
              <FileText className="w-3 h-3" />
              <span className="hidden sm:inline">Templates</span>
            </TabsTrigger>
            <TabsTrigger value="metrics" className="gap-1 text-xs">
              <BarChart3 className="w-3 h-3" />
              <span className="hidden sm:inline">Metrics</span>
            </TabsTrigger>
          </TabsList>

          <ScrollArea className="h-[500px]">
            {/* YouTube Strategy Tab */}
            <TabsContent value="youtube" className="space-y-4 mt-0">
              <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/30">
                <div className="flex items-center gap-3 mb-3">
                  <Youtube className="w-8 h-8 text-red-500" />
                  <div>
                    <h3 className="font-semibold">{youtubeStrategy.channel.name}</h3>
                    <p className="text-sm text-muted-foreground">{youtubeStrategy.channel.handle}</p>
                  </div>
                  <Badge variant="outline" className="ml-auto">
                    Target: {youtubeStrategy.channel.targetSubs}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  {youtubeStrategy.channel.description}
                </p>
              </div>

              <h4 className="font-semibold mt-4">Content Pillars</h4>
              <div className="grid gap-3">
                {youtubeStrategy.contentPillars.map((pillar, i) => (
                  <motion.div
                    key={pillar.pillar}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="p-4 rounded-lg bg-muted/30"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h5 className="font-medium">{pillar.pillar}</h5>
                      <div className="flex gap-2">
                        <Badge variant="outline">{pillar.frequency}</Badge>
                        <Badge variant="secondary">{pillar.format}</Badge>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {pillar.examples.map(ex => (
                        <Badge key={ex} variant="outline" className="text-xs">
                          {ex}
                        </Badge>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>

              <h4 className="font-semibold mt-4">SEO Keywords</h4>
              <div className="flex flex-wrap gap-2 p-3 rounded-lg bg-muted/30">
                {youtubeStrategy.seoKeywords.map(kw => (
                  <Badge key={kw} variant="secondary" className="text-xs">
                    {kw}
                  </Badge>
                ))}
              </div>

              <h4 className="font-semibold mt-4">Content Calendar (Monthly)</h4>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left p-2">Week</th>
                      <th className="text-left p-2">Monday</th>
                      <th className="text-left p-2">Wednesday</th>
                      <th className="text-left p-2">Friday</th>
                    </tr>
                  </thead>
                  <tbody>
                    {contentCalendar.map(week => (
                      <tr key={week.week} className="border-b border-border/50">
                        <td className="p-2 font-medium">{week.week}</td>
                        <td className="p-2">{week.monday}</td>
                        <td className="p-2">{week.wednesday}</td>
                        <td className="p-2">{week.friday}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </TabsContent>

            {/* Video Production Tab */}
            <TabsContent value="production" className="space-y-4 mt-0">
              <div className="p-4 rounded-lg bg-primary/10 border border-primary/30 mb-4">
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <Camera className="w-4 h-4 text-primary" />
                  Video Production Guide
                </h3>
                <p className="text-sm text-muted-foreground">
                  Equipment, software, and workflows for creating professional deepfake detection content.
                </p>
              </div>

              {/* Equipment */}
              <div className="space-y-3">
                <h4 className="font-semibold flex items-center gap-2">
                  <Monitor className="w-4 h-4" />
                  Essential Equipment
                </h4>
                {videoProductionGuide.equipment.essential.map((eq) => (
                  <div key={eq.item} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                    <div>
                      <p className="font-medium text-sm">{eq.item}</p>
                      <p className="text-xs text-muted-foreground">{eq.recommendation}</p>
                    </div>
                    <Badge variant="outline">{eq.budget}</Badge>
                  </div>
                ))}

                <h4 className="font-semibold flex items-center gap-2 pt-4">
                  <Video className="w-4 h-4" />
                  Advanced Equipment
                </h4>
                {videoProductionGuide.equipment.advanced.map((eq) => (
                  <div key={eq.item} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                    <div>
                      <p className="font-medium text-sm">{eq.item}</p>
                      <p className="text-xs text-muted-foreground">{eq.recommendation}</p>
                    </div>
                    <Badge variant="secondary">{eq.budget}</Badge>
                  </div>
                ))}
              </div>

              {/* Software */}
              <div className="space-y-3 pt-4">
                <h4 className="font-semibold flex items-center gap-2">
                  <Scissors className="w-4 h-4" />
                  Software Stack
                </h4>
                <div className="grid gap-2">
                  {videoProductionGuide.software.map((sw) => (
                    <div key={sw.name} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                      <div>
                        <p className="font-medium text-sm">{sw.name}</p>
                        <p className="text-xs text-muted-foreground">{sw.purpose}</p>
                      </div>
                      <Badge variant={sw.tier === "Essential" ? "default" : "outline"}>
                        {sw.tier}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>

              {/* Thumbnail Formula */}
              <div className="space-y-3 pt-4">
                <h4 className="font-semibold flex items-center gap-2">
                  <Palette className="w-4 h-4" />
                  Thumbnail Formula
                </h4>
                <div className="p-4 rounded-lg bg-muted/30">
                  <p className="text-xs text-muted-foreground mb-2">Size: {videoProductionGuide.thumbnailFormula.size}</p>
                  <div className="flex flex-wrap gap-1 mb-3">
                    {videoProductionGuide.thumbnailFormula.elements.map((el) => (
                      <Badge key={el} variant="outline" className="text-xs">
                        {el}
                      </Badge>
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Tools: {videoProductionGuide.thumbnailFormula.tools.join(", ")}
                  </p>
                </div>
              </div>

              {/* Script Template */}
              <div className="space-y-3 pt-4">
                <h4 className="font-semibold flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Video Script Template
                </h4>
                <div className="p-4 rounded-lg bg-muted/30">
                  <div className="flex justify-end mb-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => copyText(videoProductionGuide.scriptTemplate, "script")}
                      className="gap-1"
                    >
                      {copiedText === "script" ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                      Copy
                    </Button>
                  </div>
                  <pre className="text-xs whitespace-pre-wrap">{videoProductionGuide.scriptTemplate}</pre>
                </div>
              </div>
            </TabsContent>

            {/* Social Channels Tab */}
            <TabsContent value="social" className="space-y-4 mt-0">
              {socialChannels.map((channel, i) => (
                <motion.div
                  key={channel.platform}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="p-4 rounded-lg bg-muted/30"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <channel.icon className={`w-6 h-6 ${channel.color}`} />
                      <div>
                        <h4 className="font-medium">{channel.platform}</h4>
                        <p className="text-xs text-muted-foreground">{channel.handle}</p>
                      </div>
                    </div>
                    <Badge 
                      variant="outline"
                      className={
                        channel.priority === "High" 
                          ? "bg-green-500/20 text-green-400" 
                          : "bg-yellow-500/20 text-yellow-400"
                      }
                    >
                      {channel.priority} Priority
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">{channel.strategy}</p>
                  <div className="flex gap-2">
                    {channel.kpis.map(kpi => (
                      <Badge key={kpi} variant="secondary" className="text-xs">
                        {kpi}
                      </Badge>
                    ))}
                  </div>
                </motion.div>
              ))}
            </TabsContent>

            {/* Templates Tab */}
            <TabsContent value="templates" className="space-y-4 mt-0">
              <div className="p-4 rounded-lg bg-muted/30">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold flex items-center gap-2">
                    <Youtube className="w-4 h-4 text-red-500" />
                    YouTube Video Template
                  </h4>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => copyText(contentTemplates.youtube.title + "\n\n" + contentTemplates.youtube.description, "youtube")}
                    className="gap-1"
                  >
                    {copiedText === "youtube" ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                    Copy
                  </Button>
                </div>
                <div className="space-y-2">
                  <div>
                    <p className="text-xs font-medium text-muted-foreground mb-1">Title:</p>
                    <p className="text-sm bg-background/50 p-2 rounded">{contentTemplates.youtube.title}</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-muted-foreground mb-1">Description:</p>
                    <pre className="text-xs bg-background/50 p-2 rounded whitespace-pre-wrap">
                      {contentTemplates.youtube.description}
                    </pre>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-muted-foreground mb-1">Tags:</p>
                    <p className="text-xs bg-background/50 p-2 rounded">{contentTemplates.youtube.tags}</p>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-lg bg-muted/30">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold flex items-center gap-2">
                    <Twitter className="w-4 h-4 text-blue-400" />
                    Twitter Thread Template
                  </h4>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => copyText(contentTemplates.twitter.thread, "twitter")}
                    className="gap-1"
                  >
                    {copiedText === "twitter" ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                    Copy
                  </Button>
                </div>
                <pre className="text-xs bg-background/50 p-3 rounded whitespace-pre-wrap">
                  {contentTemplates.twitter.thread}
                </pre>
              </div>
            </TabsContent>

            {/* Metrics Tab */}
            <TabsContent value="metrics" className="space-y-4 mt-0">
              <h4 className="font-semibold">Growth Targets (6 Month)</h4>
              {growthMetrics.map((metric, i) => (
                <motion.div
                  key={metric.metric}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.1 }}
                  className="p-4 rounded-lg bg-muted/30"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h5 className="font-medium">{metric.metric}</h5>
                    <span className="text-sm text-muted-foreground">{metric.timeline}</span>
                  </div>
                  <Progress value={(metric.current / metric.target) * 100} className="h-2 mb-2" />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Current: {metric.current.toLocaleString()}</span>
                    <span>Target: {metric.target.toLocaleString()}</span>
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

export default MarketingChannels;
