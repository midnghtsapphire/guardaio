import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Map, Calendar, Target, Layers, Box, Cpu, 
  CheckCircle2, Clock, AlertCircle, ChevronRight,
  Milestone, GitBranch, Flag
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

const ProjectPlanning = () => {
  const roadmapPhases = [
    {
      phase: "Phase 1: Foundation",
      status: "complete",
      progress: 100,
      timeline: "Q4 2025",
      items: [
        { task: "Core analyzer engine", status: "complete" },
        { task: "User authentication system", status: "complete" },
        { task: "Database schema design", status: "complete" },
        { task: "Landing page & UI", status: "complete" },
        { task: "Basic image analysis", status: "complete" },
      ],
    },
    {
      phase: "Phase 2: Core Features",
      status: "complete",
      progress: 100,
      timeline: "Q1 2026",
      items: [
        { task: "Video analysis support", status: "complete" },
        { task: "Audio deepfake detection", status: "complete" },
        { task: "Batch processing", status: "complete" },
        { task: "History & dashboard", status: "complete" },
        { task: "PDF export", status: "complete" },
        { task: "Email sharing", status: "complete" },
      ],
    },
    {
      phase: "Phase 3: Monetization",
      status: "in-progress",
      progress: 85,
      timeline: "Q1 2026",
      items: [
        { task: "Stripe payment integration", status: "complete" },
        { task: "Subscription tiers", status: "complete" },
        { task: "Affiliate program", status: "complete" },
        { task: "Usage tracking", status: "in-progress" },
        { task: "Invoice generation", status: "planned" },
      ],
    },
    {
      phase: "Phase 4: Enterprise",
      status: "planned",
      progress: 20,
      timeline: "Q2 2026",
      items: [
        { task: "API v2 with rate limiting", status: "planned" },
        { task: "Team workspaces", status: "planned" },
        { task: "SSO integration", status: "planned" },
        { task: "Custom branding", status: "planned" },
        { task: "SLA dashboard", status: "planned" },
      ],
    },
    {
      phase: "Phase 5: Scale",
      status: "planned",
      progress: 0,
      timeline: "Q3 2026",
      items: [
        { task: "Mobile apps (iOS/Android)", status: "planned" },
        { task: "Browser extension v2", status: "planned" },
        { task: "Real-time collaboration", status: "planned" },
        { task: "ML model marketplace", status: "planned" },
        { task: "Global CDN deployment", status: "planned" },
      ],
    },
  ];

  const wireframes = [
    { name: "Landing Page", description: "Hero, features grid, pricing cards, footer", status: "Implemented" },
    { name: "Analyzer Interface", description: "Upload zone, results panel, heatmap overlay", status: "Implemented" },
    { name: "Dashboard", description: "Stats cards, usage charts, recent activity", status: "Implemented" },
    { name: "Admin Panel", description: "Test suite, user management, settings", status: "Implemented" },
    { name: "Mobile Layouts", description: "Responsive breakpoints for all views", status: "Implemented" },
    { name: "Email Templates", description: "Confirmation, reports, notifications", status: "Implemented" },
  ];

  const architecture3D = [
    {
      layer: "Presentation Layer",
      components: ["React Components", "Tailwind CSS", "Framer Motion", "shadcn/ui"],
      color: "bg-blue-500/20 border-blue-500/50",
    },
    {
      layer: "Application Layer",
      components: ["React Router", "React Query", "Context API", "Custom Hooks"],
      color: "bg-green-500/20 border-green-500/50",
    },
    {
      layer: "API Layer",
      components: ["Supabase Client", "Edge Functions", "REST Endpoints", "WebSocket"],
      color: "bg-yellow-500/20 border-yellow-500/50",
    },
    {
      layer: "Data Layer",
      components: ["PostgreSQL", "RLS Policies", "Triggers", "Functions"],
      color: "bg-purple-500/20 border-purple-500/50",
    },
    {
      layer: "AI/ML Layer",
      components: ["Gemini 2.5 Flash", "Audio Spectral", "Heatmap Generator", "Confidence Scoring"],
      color: "bg-red-500/20 border-red-500/50",
    },
    {
      layer: "Infrastructure",
      components: ["Supabase Cloud", "Vercel/Netlify", "Stripe", "Resend"],
      color: "bg-orange-500/20 border-orange-500/50",
    },
  ];

  const bomSoftware = [
    { category: "Frontend Framework", items: ["React 18", "TypeScript 5", "Vite 5"], license: "MIT" },
    { category: "Styling", items: ["Tailwind CSS 3", "shadcn/ui", "Framer Motion"], license: "MIT" },
    { category: "Backend", items: ["Supabase", "PostgreSQL 15", "Deno Runtime"], license: "Apache 2.0 / MIT" },
    { category: "AI/ML", items: ["Lovable AI", "Gemini 2.5 Flash", "Web Audio API"], license: "Proprietary / MIT" },
    { category: "Payments", items: ["Stripe SDK", "Stripe Elements"], license: "MIT" },
    { category: "Email", items: ["Resend API", "React Email"], license: "MIT" },
    { category: "Charts", items: ["Recharts", "Canvas API"], license: "MIT" },
    { category: "Utilities", items: ["date-fns", "clsx", "zod"], license: "MIT" },
  ];

  const bomHardware = [
    { category: "Development", items: ["Modern browser (Chrome 90+)", "Node.js 18+", "8GB+ RAM"], required: true },
    { category: "Deployment", items: ["Cloud hosting (Vercel/Netlify)", "CDN for static assets", "SSL certificate"], required: true },
    { category: "Database", items: ["Supabase free tier (500MB)", "Or self-hosted PostgreSQL"], required: true },
    { category: "Optional", items: ["GPU for local ML training", "Custom domain", "Load balancer for scale"], required: false },
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "complete": return <CheckCircle2 className="w-4 h-4 text-green-500" />;
      case "in-progress": return <Clock className="w-4 h-4 text-yellow-500" />;
      case "planned": return <AlertCircle className="w-4 h-4 text-muted-foreground" />;
      default: return <AlertCircle className="w-4 h-4" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      complete: "bg-green-500/20 text-green-400",
      "in-progress": "bg-yellow-500/20 text-yellow-400",
      planned: "bg-muted text-muted-foreground",
    };
    return styles[status] || "";
  };

  return (
    <Card className="glass border-border/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Map className="w-5 h-5 text-primary" />
          Project Planning Center
        </CardTitle>
        <CardDescription>
          Roadmap, blueprints, wireframes, and bill of materials
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="roadmap" className="space-y-4">
          <TabsList className="grid grid-cols-4 w-full">
            <TabsTrigger value="roadmap" className="gap-1 text-xs">
              <Milestone className="w-3 h-3" />
              Roadmap
            </TabsTrigger>
            <TabsTrigger value="architecture" className="gap-1 text-xs">
              <Layers className="w-3 h-3" />
              Architecture
            </TabsTrigger>
            <TabsTrigger value="wireframes" className="gap-1 text-xs">
              <Box className="w-3 h-3" />
              Wireframes
            </TabsTrigger>
            <TabsTrigger value="bom" className="gap-1 text-xs">
              <Cpu className="w-3 h-3" />
              BOM
            </TabsTrigger>
          </TabsList>

          <ScrollArea className="h-[500px]">
            {/* Roadmap Tab */}
            <TabsContent value="roadmap" className="space-y-4 mt-0">
              <div className="text-sm text-muted-foreground mb-4">
                Development roadmap with milestones and deliverables
              </div>
              {roadmapPhases.map((phase, i) => (
                <motion.div
                  key={phase.phase}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="p-4 rounded-lg bg-muted/30 border border-border/50"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Flag className="w-4 h-4 text-primary" />
                      <h3 className="font-semibold">{phase.phase}</h3>
                      <Badge variant="outline" className={getStatusBadge(phase.status)}>
                        {phase.status}
                      </Badge>
                    </div>
                    <span className="text-sm text-muted-foreground">{phase.timeline}</span>
                  </div>
                  <Progress value={phase.progress} className="h-2 mb-3" />
                  <div className="grid grid-cols-2 gap-2">
                    {phase.items.map((item) => (
                      <div key={item.task} className="flex items-center gap-2 text-sm">
                        {getStatusIcon(item.status)}
                        <span className={item.status === "complete" ? "" : "text-muted-foreground"}>
                          {item.task}
                        </span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </TabsContent>

            {/* Architecture Tab */}
            <TabsContent value="architecture" className="space-y-4 mt-0">
              <div className="text-sm text-muted-foreground mb-4">
                3D layered architecture view of the system
              </div>
              <div className="space-y-3">
                {architecture3D.map((layer, i) => (
                  <motion.div
                    key={layer.layer}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className={`p-4 rounded-lg border-2 ${layer.color}`}
                    style={{ marginLeft: i * 8 }}
                  >
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <Layers className="w-4 h-4" />
                      {layer.layer}
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {layer.components.map((comp) => (
                        <Badge key={comp} variant="outline" className="text-xs">
                          {comp}
                        </Badge>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>
            </TabsContent>

            {/* Wireframes Tab */}
            <TabsContent value="wireframes" className="space-y-4 mt-0">
              <div className="text-sm text-muted-foreground mb-4">
                UI wireframes and layout blueprints
              </div>
              <div className="grid grid-cols-2 gap-3">
                {wireframes.map((wf, i) => (
                  <motion.div
                    key={wf.name}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.05 }}
                    className="p-4 rounded-lg bg-muted/30 border border-border/50"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-sm">{wf.name}</h4>
                      <Badge variant="outline" className="bg-green-500/20 text-green-400 text-xs">
                        {wf.status}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">{wf.description}</p>
                  </motion.div>
                ))}
              </div>
              
              <div className="mt-6 p-4 rounded-lg bg-muted/30">
                <h4 className="font-semibold mb-3">Component Layout Structure</h4>
                <pre className="text-xs bg-background/50 p-3 rounded-md overflow-x-auto">
{`┌─────────────────────────────────────┐
│             Navbar                  │
├─────────────────────────────────────┤
│                                     │
│           Hero Section              │
│     (Gradient BG + CTA buttons)     │
│                                     │
├─────────────────────────────────────┤
│                                     │
│         Analyzer Section            │
│   ┌───────────┬───────────────┐     │
│   │  Upload   │    Results    │     │
│   │   Zone    │    Panel      │     │
│   └───────────┴───────────────┘     │
│                                     │
├─────────────────────────────────────┤
│         Features Grid (3x2)         │
├─────────────────────────────────────┤
│         Pricing Cards (3)           │
├─────────────────────────────────────┤
│             Footer                  │
└─────────────────────────────────────┘`}
                </pre>
              </div>
            </TabsContent>

            {/* BOM Tab */}
            <TabsContent value="bom" className="space-y-6 mt-0">
              <div className="text-sm text-muted-foreground mb-4">
                Bill of Materials - Software and hardware requirements
              </div>
              
              <div>
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <Box className="w-4 h-4 text-blue-500" />
                  Software Dependencies
                </h4>
                <div className="space-y-2">
                  {bomSoftware.map((cat, i) => (
                    <motion.div
                      key={cat.category}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.05 }}
                      className="p-3 rounded-lg bg-muted/30 flex items-center justify-between"
                    >
                      <div>
                        <p className="font-medium text-sm">{cat.category}</p>
                        <p className="text-xs text-muted-foreground">{cat.items.join(", ")}</p>
                      </div>
                      <Badge variant="outline" className="text-xs">{cat.license}</Badge>
                    </motion.div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-green-500" />
                  Hardware/Infrastructure Requirements
                </h4>
                <div className="space-y-2">
                  {bomHardware.map((cat, i) => (
                    <motion.div
                      key={cat.category}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.05 }}
                      className="p-3 rounded-lg bg-muted/30 flex items-center justify-between"
                    >
                      <div>
                        <p className="font-medium text-sm">{cat.category}</p>
                        <p className="text-xs text-muted-foreground">{cat.items.join(", ")}</p>
                      </div>
                      <Badge variant="outline" className={cat.required ? "bg-red-500/20 text-red-400" : ""}>
                        {cat.required ? "Required" : "Optional"}
                      </Badge>
                    </motion.div>
                  ))}
                </div>
              </div>
            </TabsContent>
          </ScrollArea>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default ProjectPlanning;
