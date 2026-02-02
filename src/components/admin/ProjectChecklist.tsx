import { useState } from "react";
import { motion } from "framer-motion";
import { 
  CheckSquare, 
  Square, 
  ChevronDown, 
  ChevronRight,
  Shield,
  Layout,
  Database,
  Zap,
  Globe,
  Users,
  FileText,
  Bot,
  Cpu,
  Palette,
  Lock,
  Search,
  Mic,
  Image,
  Mail,
  CreditCard,
  Smartphone,
  BookOpen,
  BarChart3,
  MessageSquare,
  Leaf,
  AlertTriangle,
  CheckCircle
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface ChecklistItem {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  subItems?: ChecklistItem[];
}

interface ChecklistCategory {
  id: string;
  title: string;
  icon: React.ElementType;
  color: string;
  items: ChecklistItem[];
}

const ProjectChecklist = () => {
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set(['core-features']));

  const categories: ChecklistCategory[] = [
    {
      id: "branding",
      title: "Branding & Identity",
      icon: Palette,
      color: "text-pink-500",
      items: [
        { id: "b1", title: "Guardaio brand name", description: "Rebranded from DeepGuard to Guardaio across all files", completed: true },
        { id: "b2", title: "Lion shield logo", description: "Custom logo with real/digital lion duality in shield", completed: true },
        { id: "b3", title: "Logo in Navbar", description: "Logo displayed in main navigation", completed: true },
        { id: "b4", title: "Logo in Footer", description: "Logo displayed in footer section", completed: true },
        { id: "b5", title: "guardaio.com domain references", description: "All URLs updated to guardaio.com", completed: true },
        { id: "b6", title: "@GuardaioAI social handles", description: "Social media handles standardized", completed: true },
        { id: "b7", title: "App ID: com.guardaio.app", description: "Mobile app bundle ID configured", completed: true },
        { id: "b8", title: "PWA manifest updated", description: "manifest.json with Guardaio branding", completed: true },
      ]
    },
    {
      id: "core-features",
      title: "Core Analysis Features",
      icon: Search,
      color: "text-primary",
      items: [
        { id: "c1", title: "Single file analysis", description: "Upload and analyze individual images/videos", completed: true },
        { id: "c2", title: "Batch analysis", description: "Multi-file processing with progress tracking", completed: true },
        { id: "c3", title: "URL analysis", description: "Analyze media from URLs using Firecrawl", completed: true },
        { id: "c4", title: "Voice/Audio detection", description: "Live recording and audio file analysis", completed: true },
        { id: "c5", title: "Reverse image search", description: "Find image origins across the web", completed: true },
        { id: "c6", title: "Side-by-side comparison", description: "Compare two images with sync zoom/pan", completed: true },
        { id: "c7", title: "Heatmap overlays", description: "Visual manipulation zone highlighting", completed: true },
        { id: "c8", title: "Sensitivity threshold slider", description: "Adjustable detection sensitivity (0-100)", completed: true },
        { id: "c9", title: "Demo samples", description: "Pre-loaded test files for demonstration", completed: true },
        { id: "c10", title: "Camera capture", description: "Direct webcam image capture for analysis", completed: true },
      ]
    },
    {
      id: "forensics",
      title: "Forensic Analysis",
      icon: Cpu,
      color: "text-cyan-500",
      items: [
        { id: "f1", title: "Error Level Analysis (ELA)", description: "JPEG compression artifact detection", completed: true },
        { id: "f2", title: "Noise analysis", description: "Laplacian noise pattern detection", completed: true },
        { id: "f3", title: "DCT artifact detection", description: "Discrete cosine transform analysis", completed: true },
        { id: "f4", title: "EXIF metadata extraction", description: "Full metadata parsing and display", completed: true },
        { id: "f5", title: "Histogram analysis", description: "Color channel distribution analysis", completed: true },
        { id: "f6", title: "Frequency domain analysis", description: "FFT-based pattern detection", completed: true },
        { id: "f7", title: "Face detection", description: "68-point facial landmark detection", completed: true },
        { id: "f8", title: "Face symmetry scoring", description: "Facial asymmetry measurement", completed: true },
        { id: "f9", title: "Expression analysis", description: "Emotion detection on faces", completed: true },
        { id: "f10", title: "Blur detection", description: "Focus quality assessment", completed: true },
        { id: "f11", title: "Audio spectral FFT", description: "Frequency spectrum visualization", completed: true },
        { id: "f12", title: "Voice pattern analysis", description: "Synthetic voice marker detection", completed: true },
        { id: "f13", title: "Temporal pattern analysis", description: "Audio timing anomaly detection", completed: true },
      ]
    },
    {
      id: "ai-ml",
      title: "AI/ML Integration",
      icon: Bot,
      color: "text-violet-500",
      items: [
        { id: "ai1", title: "Lovable AI (Gemini 2.5 Flash)", description: "Primary media analysis engine", completed: true },
        { id: "ai2", title: "TensorFlow.js integration", description: "Client-side ML inference", completed: true },
        { id: "ai3", title: "face-api.js integration", description: "@vladmandic/face-api for landmarks", completed: true },
        { id: "ai4", title: "Web Audio API", description: "Real-time audio processing", completed: true },
        { id: "ai5", title: "Canvas API forensics", description: "Image manipulation detection", completed: true },
      ]
    },
    {
      id: "security",
      title: "Security & Bot Protection",
      icon: Shield,
      color: "text-red-500",
      items: [
        { id: "s1", title: "CrowdSec IP blocking", description: "Collaborative community threat intelligence", completed: true },
        { id: "s2", title: "BunkerWeb WAF engine", description: "NGINX-based firewall with 8+ rules", completed: true },
        { id: "s3", title: "ALTCHA Proof-of-Work", description: "SHA-256 computational challenges", completed: true },
        { id: "s4", title: "BotD client detection", description: "10+ browser fingerprinting signals", completed: true },
        { id: "s5", title: "Rate limiting", description: "Leaky bucket algorithm (60 req/min)", completed: true },
        { id: "s6", title: "Honeypot traps", description: "Hidden endpoints and form fields", completed: true },
        { id: "s7", title: "Hardware security module", description: "COVERT Trojan detection simulation", completed: true },
        { id: "s8", title: "Side-channel analysis", description: "Power/thermal/timing monitoring", completed: true },
        { id: "s9", title: "TPM 2.0 attestation", description: "Trusted Platform Module simulation", completed: true },
        { id: "s10", title: "Supply chain traceability", description: "SHA-3 hash chain verification", completed: true },
        { id: "s11", title: "XSS prevention rules", description: "Script injection blocking", completed: true },
        { id: "s12", title: "SQLi prevention rules", description: "SQL injection detection", completed: true },
        { id: "s13", title: "RLS policies", description: "Row Level Security on all tables", completed: true },
        { id: "s14", title: "JWT token security", description: "Secure authentication tokens", completed: true },
      ]
    },
    {
      id: "database",
      title: "Database & Backend",
      icon: Database,
      color: "text-emerald-500",
      items: [
        { id: "d1", title: "Supabase PostgreSQL", description: "Primary database with RLS", completed: true },
        { id: "d2", title: "profiles table", description: "User profile data", completed: true },
        { id: "d3", title: "analysis_history table", description: "Analysis records with findings", completed: true },
        { id: "d4", title: "user_roles table", description: "RBAC with admin/moderator/user", completed: true },
        { id: "d5", title: "affiliates table", description: "Affiliate program data", completed: true },
        { id: "d6", title: "affiliate_referrals table", description: "Referral tracking", completed: true },
        { id: "d7", title: "payments table", description: "Stripe payment records", completed: true },
        { id: "d8", title: "batch_analyses table", description: "Batch job tracking", completed: true },
        { id: "d9", title: "compliance_tests table", description: "Security test results", completed: true },
        { id: "d10", title: "metadata_anomalies table", description: "Rare pattern catalog", completed: true },
        { id: "d11", title: "known_software_signatures table", description: "AI tool fingerprints", completed: true },
      ]
    },
    {
      id: "edge-functions",
      title: "Edge Functions",
      icon: Zap,
      color: "text-yellow-500",
      items: [
        { id: "e1", title: "analyze-media", description: "Image/video analysis via Gemini", completed: true },
        { id: "e2", title: "analyze-audio", description: "Audio deepfake detection", completed: true },
        { id: "e3", title: "analyze-url", description: "URL content extraction", completed: true },
        { id: "e4", title: "reverse-image-search", description: "Firecrawl image search", completed: true },
        { id: "e5", title: "send-analysis-report", description: "Email reports via Resend", completed: true },
        { id: "e6", title: "send-contact-email", description: "Contact form handler", completed: true },
        { id: "e7", title: "create-checkout", description: "Stripe checkout sessions", completed: true },
        { id: "e8", title: "check-subscription", description: "Subscription status check", completed: true },
        { id: "e9", title: "get-shared-analysis", description: "Public share token lookup", completed: true },
        { id: "e10", title: "hardware-integrity-report", description: "Hardware security API", completed: true },
        { id: "e11", title: "hardware-threat-alert", description: "Threat email notifications", completed: true },
        { id: "e12", title: "rare-pattern-alert", description: "Anomaly email alerts", completed: true },
      ]
    },
    {
      id: "auth",
      title: "Authentication & Users",
      icon: Users,
      color: "text-blue-500",
      items: [
        { id: "a1", title: "Email/password auth", description: "Standard Supabase authentication", completed: true },
        { id: "a2", title: "OAuth providers", description: "Google, Apple sign-in ready", completed: true },
        { id: "a3", title: "Session management", description: "Secure cookie handling", completed: true },
        { id: "a4", title: "Role-based access", description: "Admin/Moderator/User roles", completed: true },
        { id: "a5", title: "Profile management", description: "Display name and preferences", completed: true },
        { id: "a6", title: "Auth context", description: "React context for auth state", completed: true },
      ]
    },
    {
      id: "payments",
      title: "Payments & Affiliate",
      icon: CreditCard,
      color: "text-green-500",
      items: [
        { id: "p1", title: "Stripe integration", description: "Payment processing", completed: true },
        { id: "p2", title: "Checkout sessions", description: "Secure payment flow", completed: true },
        { id: "p3", title: "Subscription tiers", description: "Free/Pro/Business plans", completed: true },
        { id: "p4", title: "Affiliate system", description: "Full affiliate dashboard", completed: true },
        { id: "p5", title: "Referral tracking", description: "Link generation and tracking", completed: true },
        { id: "p6", title: "Commission tiers", description: "$100-$1000 payout levels", completed: true },
        { id: "p7", title: "Pricing section", description: "Public pricing cards", completed: true },
      ]
    },
    {
      id: "pages",
      title: "Pages & Routes",
      icon: Layout,
      color: "text-orange-500",
      items: [
        { id: "pg1", title: "Index (Landing)", description: "Hero, features, analyzer, pricing", completed: true },
        { id: "pg2", title: "Auth", description: "Login/signup forms", completed: true },
        { id: "pg3", title: "Dashboard", description: "Usage stats and charts", completed: true },
        { id: "pg4", title: "History", description: "Analysis history with filters", completed: true },
        { id: "pg5", title: "Profile", description: "Account settings", completed: true },
        { id: "pg6", title: "Admin", description: "Full admin command center", completed: true },
        { id: "pg7", title: "About", description: "SEO-rich with 80+ backlinks", completed: true },
        { id: "pg8", title: "Blog", description: "Article listing", completed: true },
        { id: "pg9", title: "Careers", description: "Job listings", completed: true },
        { id: "pg10", title: "Contact", description: "Contact form with Resend", completed: true },
        { id: "pg11", title: "API", description: "API documentation", completed: true },
        { id: "pg12", title: "Documentation", description: "Product docs", completed: true },
        { id: "pg13", title: "Help Center", description: "FAQ and articles", completed: true },
        { id: "pg14", title: "Community", description: "Forum links", completed: true },
        { id: "pg15", title: "Status", description: "System status", completed: true },
        { id: "pg16", title: "Security", description: "Security practices + bot protection", completed: true },
        { id: "pg17", title: "Privacy Policy", description: "Legal privacy document", completed: true },
        { id: "pg18", title: "Terms of Service", description: "Legal terms", completed: true },
        { id: "pg19", title: "Cookie Policy", description: "Cookie consent info", completed: true },
        { id: "pg20", title: "GDPR", description: "GDPR compliance info", completed: true },
        { id: "pg21", title: "Bookmarklet", description: "Browser extension preview", completed: true },
        { id: "pg22", title: "Sustainability", description: "GreenWeb carbon platform", completed: true },
        { id: "pg23", title: "Team", description: "Team collaboration hub", completed: true },
        { id: "pg24", title: "Desktop App", description: "Desktop app waitlist", completed: true },
        { id: "pg25", title: "Press Kit", description: "Media resources", completed: true },
        { id: "pg26", title: "Deepfake Quiz", description: "20-question interactive quiz", completed: true },
        { id: "pg27", title: "Shared Analysis", description: "Public share view", completed: true },
      ]
    },
    {
      id: "mobile",
      title: "Mobile & PWA",
      icon: Smartphone,
      color: "text-indigo-500",
      items: [
        { id: "m1", title: "PWA manifest", description: "Full PWA configuration", completed: true },
        { id: "m2", title: "Install prompt", description: "iOS/Android install detection", completed: true },
        { id: "m3", title: "Capacitor config", description: "Native app framework", completed: true },
        { id: "m4", title: "App store metadata", description: "Store listing content", completed: true },
        { id: "m5", title: "Responsive design", description: "Mobile-first UI", completed: true },
        { id: "m6", title: "Touch gestures", description: "Mobile-friendly interactions", completed: true },
      ]
    },
    {
      id: "export",
      title: "Export & Sharing",
      icon: FileText,
      color: "text-teal-500",
      items: [
        { id: "ex1", title: "PDF single report", description: "Individual analysis export", completed: true },
        { id: "ex2", title: "PDF batch report", description: "Multi-file export with summary", completed: true },
        { id: "ex3", title: "CSV history export", description: "History data export", completed: true },
        { id: "ex4", title: "JSON export", description: "Raw data export", completed: true },
        { id: "ex5", title: "Share tokens", description: "Public shareable links", completed: true },
        { id: "ex6", title: "Email reports", description: "Send via Resend", completed: true },
        { id: "ex7", title: "Social sharing", description: "Twitter/LinkedIn/Facebook", completed: true },
      ]
    },
    {
      id: "accessibility",
      title: "Accessibility & UX",
      icon: Users,
      color: "text-rose-500",
      items: [
        { id: "ax1", title: "WCAG 2.1 AA compliance", description: "Web accessibility standards", completed: true },
        { id: "ax2", title: "High contrast mode", description: "Increased contrast option", completed: true },
        { id: "ax3", title: "Dyslexia-friendly font", description: "OpenDyslexic option", completed: true },
        { id: "ax4", title: "Reduce motion", description: "Disable animations", completed: true },
        { id: "ax5", title: "Focus mode", description: "Reduced distractions", completed: true },
        { id: "ax6", title: "Large text option", description: "Increased font size", completed: true },
        { id: "ax7", title: "Keyboard shortcuts", description: "1-6 modes, H, S, Ctrl+E, ?", completed: true },
        { id: "ax8", title: "Screen reader labels", description: "ARIA labels throughout", completed: true },
        { id: "ax9", title: "Focus indicators", description: "Visible focus states", completed: true },
        { id: "ax10", title: "Dark/Light themes", description: "Theme toggle with system detection", completed: true },
      ]
    },
    {
      id: "notifications",
      title: "Notifications & Alerts",
      icon: Mail,
      color: "text-amber-500",
      items: [
        { id: "n1", title: "Browser notifications", description: "Permission request and sending", completed: true },
        { id: "n2", title: "Toast notifications", description: "In-app feedback", completed: true },
        { id: "n3", title: "Sound effects", description: "Audio feedback for actions", completed: true },
        { id: "n4", title: "Email alerts", description: "Resend integration", completed: true },
        { id: "n5", title: "Rare pattern alerts", description: "Automated anomaly emails", completed: true },
        { id: "n6", title: "Hardware threat alerts", description: "Security email notifications", completed: true },
      ]
    },
    {
      id: "sustainability",
      title: "Sustainability (GreenWeb)",
      icon: Leaf,
      color: "text-green-600",
      items: [
        { id: "su1", title: "Carbon auditor", description: "SWD/SCI methodology calculator", completed: true },
        { id: "su2", title: "Carbon badge generator", description: "Embeddable certification badges", completed: true },
        { id: "su3", title: "Digital wellness hub", description: "20-20-20 eye strain timer", completed: true },
        { id: "su4", title: "Learning hub", description: "Developer + Attorney tracks", completed: true },
        { id: "su5", title: "API reference", description: "Carbon metrics endpoints", completed: true },
      ]
    },
    {
      id: "team",
      title: "Team Collaboration (RUP/XP/Lean)",
      icon: MessageSquare,
      color: "text-sky-500",
      items: [
        { id: "t1", title: "Kanban board", description: "Drag-drop with WIP limits", completed: true },
        { id: "t2", title: "Sprint planning", description: "Scrum ceremony support", completed: true },
        { id: "t3", title: "Team chat", description: "Real-time messaging", completed: true },
        { id: "t4", title: "Team analytics", description: "Velocity and PRiSM scores", completed: true },
        { id: "t5", title: "Energy impact markers", description: "Carbon tracking per task", completed: true },
        { id: "t6", title: "XP/RUP badges", description: "Methodology indicators", completed: true },
      ]
    },
    {
      id: "admin",
      title: "Admin Panel",
      icon: Shield,
      color: "text-purple-500",
      items: [
        { id: "ad1", title: "QA Agent (LLM)", description: "25+ automated test scenarios", completed: true },
        { id: "ad2", title: "Test suite", description: "40+ component/integration tests", completed: true },
        { id: "ad3", title: "Security module", description: "Compliance + hardware + bot protection", completed: true },
        { id: "ad4", title: "File registry", description: "170+ file inventory", completed: true },
        { id: "ad5", title: "Documentation center", description: "Tech/dev/user docs", completed: true },
        { id: "ad6", title: "Government tools ref", description: "DARPA/NIST/IQT resources", completed: true },
        { id: "ad7", title: "Marketing channels", description: "YouTube/SEO/social strategy", completed: true },
        { id: "ad8", title: "Project planning", description: "Roadmap, architecture, BOM", completed: true },
        { id: "ad9", title: "Project history", description: "Chronological changelog", completed: true },
        { id: "ad10", title: "Changelog tracker", description: "Version history v2.2.0+", completed: true },
        { id: "ad11", title: "Dependency map", description: "Visual component graph", completed: true },
        { id: "ad12", title: "Sample data", description: "FAQs, reviews, testimonials", completed: true },
        { id: "ad13", title: "Metadata dashboard", description: "Anomaly tracking overview", completed: true },
        { id: "ad14", title: "DevOps tools", description: "SonarQube, OpenSCAP references", completed: true },
        { id: "ad15", title: "Documentation export", description: "JSON/Markdown export", completed: true },
        { id: "ad16", title: "Admin search", description: "Global search across panels", completed: true },
        { id: "ad17", title: "Project checklist", description: "This comprehensive checklist", completed: true },
      ]
    },
    {
      id: "criminal",
      title: "Criminal Threat Detection",
      icon: AlertTriangle,
      color: "text-red-600",
      items: [
        { id: "cr1", title: "Sextortion patterns", description: "Modus operandi detection", completed: true },
        { id: "cr2", title: "Romance scam markers", description: "Fraud pattern matching", completed: true },
        { id: "cr3", title: "Disinformation flags", description: "Misinfo campaign detection", completed: true },
        { id: "cr4", title: "FBI IC3 integration", description: "Reporting pathway", completed: true },
        { id: "cr5", title: "NCMEC reporting", description: "Child safety integration", completed: true },
        { id: "cr6", title: "Victim resources", description: "988, NCMEC CyberTipline links", completed: true },
      ]
    },
    {
      id: "content",
      title: "Content & SEO",
      icon: BookOpen,
      color: "text-fuchsia-500",
      items: [
        { id: "co1", title: "About page (80+ backlinks)", description: "SEO-rich content", completed: true },
        { id: "co2", title: "Victim stories section", description: "Real-world case documentation", completed: true },
        { id: "co3", title: "Help articles (15+)", description: "Knowledge base", completed: true },
        { id: "co4", title: "Publications (14+)", description: "Whitepapers and guides", completed: true },
        { id: "co5", title: "Deepfake quiz (20 questions)", description: "Interactive education", completed: true },
        { id: "co6", title: "Blog system", description: "Article management", completed: true },
        { id: "co7", title: "JSON-LD schema", description: "Structured data for SEO", completed: true },
        { id: "co8", title: "Meta tags", description: "Title, description, OpenGraph", completed: true },
        { id: "co9", title: "Canonical URLs", description: "Proper URL canonicalization", completed: true },
      ]
    },
  ];

  const toggleCategory = (categoryId: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId);
    } else {
      newExpanded.add(categoryId);
    }
    setExpandedCategories(newExpanded);
  };

  const getTotalItems = () => {
    return categories.reduce((total, cat) => total + cat.items.length, 0);
  };

  const getCompletedItems = () => {
    return categories.reduce((total, cat) => 
      total + cat.items.filter(item => item.completed).length, 0
    );
  };

  const totalItems = getTotalItems();
  const completedItems = getCompletedItems();
  const completionPercentage = Math.round((completedItems / totalItems) * 100);

  return (
    <div className="space-y-6">
      {/* Header with overall progress */}
      <Card className="glass border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckSquare className="w-6 h-6 text-primary" />
            Guardaio Project Checklist
          </CardTitle>
          <CardDescription>
            Comprehensive step-by-step documentation of all features, components, and systems
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="text-4xl font-bold text-primary">{completionPercentage}%</div>
                <div>
                  <p className="font-medium">Overall Completion</p>
                  <p className="text-sm text-muted-foreground">
                    {completedItems} of {totalItems} items complete
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <Badge variant="outline" className="gap-1">
                  <CheckCircle className="w-3 h-3 text-emerald-500" />
                  {completedItems} Done
                </Badge>
                <Badge variant="outline">
                  {categories.length} Categories
                </Badge>
              </div>
            </div>
            <Progress value={completionPercentage} className="h-3" />
          </div>
        </CardContent>
      </Card>

      {/* Category list */}
      <ScrollArea className="h-[600px]">
        <div className="space-y-3 pr-4">
          {categories.map((category) => {
            const categoryCompleted = category.items.filter(i => i.completed).length;
            const categoryTotal = category.items.length;
            const categoryPercent = Math.round((categoryCompleted / categoryTotal) * 100);
            const isExpanded = expandedCategories.has(category.id);

            return (
              <Collapsible key={category.id} open={isExpanded}>
                <Card className="glass border-border/50">
                  <CollapsibleTrigger 
                    className="w-full"
                    onClick={() => toggleCategory(category.id)}
                  >
                    <CardHeader className="py-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          {isExpanded ? (
                            <ChevronDown className="w-5 h-5 text-muted-foreground" />
                          ) : (
                            <ChevronRight className="w-5 h-5 text-muted-foreground" />
                          )}
                          <category.icon className={`w-5 h-5 ${category.color}`} />
                          <div className="text-left">
                            <p className="font-semibold">{category.title}</p>
                            <p className="text-xs text-muted-foreground">
                              {categoryCompleted}/{categoryTotal} complete
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="w-24">
                            <Progress value={categoryPercent} className="h-2" />
                          </div>
                          <Badge 
                            variant={categoryPercent === 100 ? "default" : "outline"}
                            className={categoryPercent === 100 ? "bg-emerald-500" : ""}
                          >
                            {categoryPercent}%
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <CardContent className="pt-0">
                      <div className="space-y-2 border-t border-border/50 pt-4">
                        {category.items.map((item, index) => (
                          <motion.div
                            key={item.id}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.02 }}
                            className={`flex items-start gap-3 p-3 rounded-lg ${
                              item.completed ? 'bg-emerald-500/10' : 'bg-muted/50'
                            }`}
                          >
                            {item.completed ? (
                              <CheckSquare className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                            ) : (
                              <Square className="w-5 h-5 text-muted-foreground shrink-0 mt-0.5" />
                            )}
                            <div className="flex-1 min-w-0">
                              <p className={`font-medium text-sm ${
                                item.completed ? 'text-foreground' : 'text-muted-foreground'
                              }`}>
                                {item.title}
                              </p>
                              <p className="text-xs text-muted-foreground truncate">
                                {item.description}
                              </p>
                            </div>
                            {item.completed && (
                              <Badge variant="outline" className="text-emerald-500 text-xs shrink-0">
                                ✓
                              </Badge>
                            )}
                          </motion.div>
                        ))}
                      </div>
                    </CardContent>
                  </CollapsibleContent>
                </Card>
              </Collapsible>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
};

export default ProjectChecklist;
