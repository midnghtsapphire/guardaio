import { useState } from "react";
import { motion } from "framer-motion";
import { FileCode, Search, Filter, FolderOpen, Component, FileText, Zap, Settings } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

interface FileEntry {
  name: string;
  path: string;
  description: string;
  type: "component" | "page" | "hook" | "util" | "edge-function" | "context";
}

const FileRegistry = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const components: FileEntry[] = [
    { name: "AffiliateSystem.tsx", path: "src/components/", description: "Affiliate dashboard with link generation, referral tracking, and payout tiers ($100-$1000)", type: "component" },
    { name: "AnalyzerSection.tsx", path: "src/components/", description: "Main media upload and analysis interface with drag-drop, camera capture, and demo samples", type: "component" },
    { name: "AnalyzerSkeleton.tsx", path: "src/components/", description: "Loading skeleton placeholder for analyzer results", type: "component" },
    { name: "AudioAnalyzer.tsx", path: "src/components/", description: "Audio file analysis with waveform visualization and spectral analysis", type: "component" },
    { name: "BatchAnalyzer.tsx", path: "src/components/", description: "Multi-file batch processing with progress tracking and sequential analysis", type: "component" },
    { name: "ComparisonView.tsx", path: "src/components/", description: "Side-by-side image comparison with synchronized zoom and pan", type: "component" },
    { name: "ComplianceBadges.tsx", path: "src/components/", description: "Modular badge system for GDPR, SOC2, ISO 27001, and OSS verification", type: "component" },
    { name: "DemoSamples.tsx", path: "src/components/", description: "Pre-loaded demo samples for testing the analyzer without uploads", type: "component" },
    { name: "EmailShareDialog.tsx", path: "src/components/", description: "Email sharing modal for analysis reports with recipient input", type: "component" },
    { name: "FeaturesSection.tsx", path: "src/components/", description: "Landing page features grid with icons and descriptions", type: "component" },
    { name: "Footer.tsx", path: "src/components/", description: "Site footer with navigation links, social icons, and tour restart", type: "component" },
    { name: "HeatmapOverlay.tsx", path: "src/components/", description: "Visual overlay showing manipulation detection zones on images", type: "component" },
    { name: "HeroSection.tsx", path: "src/components/", description: "Landing page hero with animated gradient, CTA buttons, and stats", type: "component" },
    { name: "HistoryStats.tsx", path: "src/components/", description: "Statistics cards for analysis history (total, authentic, suspicious)", type: "component" },
    { name: "KeyboardShortcutsHelp.tsx", path: "src/components/", description: "Modal displaying all keyboard shortcuts (1-6 modes, H, S, Ctrl+E)", type: "component" },
    { name: "NavLink.tsx", path: "src/components/", description: "Reusable navigation link component with active state styling", type: "component" },
    { name: "Navbar.tsx", path: "src/components/", description: "Main navigation bar with responsive mobile menu and auth state", type: "component" },
    { name: "OnboardingTour.tsx", path: "src/components/", description: "Interactive product tour with step-by-step highlights", type: "component" },
    { name: "PricingSection.tsx", path: "src/components/", description: "Pricing cards with Stripe checkout integration for Pro tier", type: "component" },
    { name: "ProgressRing.tsx", path: "src/components/", description: "Circular progress indicator with percentage display", type: "component" },
    { name: "ReverseImageSearch.tsx", path: "src/components/", description: "Reverse image lookup using external search APIs", type: "component" },
    { name: "SecurityModule.tsx", path: "src/components/", description: "Automated security testing suite (WCAG, XSS, CSP, Privacy)", type: "component" },
    { name: "SocialShareButtons.tsx", path: "src/components/", description: "Social media sharing buttons (Twitter, LinkedIn, Facebook)", type: "component" },
    { name: "ThemeToggle.tsx", path: "src/components/", description: "Light/dark mode toggle with system preference detection", type: "component" },
    { name: "UrlAnalyzer.tsx", path: "src/components/", description: "URL/website content verification and metadata extraction", type: "component" },
    { name: "VoiceDetector.tsx", path: "src/components/", description: "Audio voice cloning detection with live microphone recording", type: "component" },
  ];

  const pages: FileEntry[] = [
    { name: "Index.tsx", path: "src/pages/", description: "Landing page with hero, features, pricing, and tabbed analyzer interface", type: "page" },
    { name: "Auth.tsx", path: "src/pages/", description: "Authentication page with login/signup forms and OAuth providers", type: "page" },
    { name: "Admin.tsx", path: "src/pages/", description: "Admin command center with test suite, security, and user management", type: "page" },
    { name: "AdminLogin.tsx", path: "src/pages/", description: "Admin authentication gateway with role verification", type: "page" },
    { name: "Dashboard.tsx", path: "src/pages/", description: "User dashboard with usage stats and detection rate charts", type: "page" },
    { name: "History.tsx", path: "src/pages/", description: "Analysis history with filtering, search, and bulk actions", type: "page" },
    { name: "Profile.tsx", path: "src/pages/", description: "User profile management with display name and preferences", type: "page" },
    { name: "About.tsx", path: "src/pages/", description: "Company about page with team, mission, and values", type: "page" },
    { name: "Blog.tsx", path: "src/pages/", description: "Blog listing page with article cards and categories", type: "page" },
    { name: "Careers.tsx", path: "src/pages/", description: "Job listings and company culture information", type: "page" },
    { name: "Contact.tsx", path: "src/pages/", description: "Contact form with email integration via Resend", type: "page" },
    { name: "API.tsx", path: "src/pages/", description: "API documentation with code snippets and endpoints", type: "page" },
    { name: "Documentation.tsx", path: "src/pages/", description: "Product documentation and integration guides", type: "page" },
    { name: "HelpCenter.tsx", path: "src/pages/", description: "FAQ and support resources with search", type: "page" },
    { name: "Community.tsx", path: "src/pages/", description: "Community forums and discussion links", type: "page" },
    { name: "Status.tsx", path: "src/pages/", description: "System status page with uptime monitoring", type: "page" },
    { name: "Security.tsx", path: "src/pages/", description: "Security practices and vulnerability reporting", type: "page" },
    { name: "PrivacyPolicy.tsx", path: "src/pages/", description: "Privacy policy legal document", type: "page" },
    { name: "TermsOfService.tsx", path: "src/pages/", description: "Terms of service legal document", type: "page" },
    { name: "CookiePolicy.tsx", path: "src/pages/", description: "Cookie usage and consent policy", type: "page" },
    { name: "GDPR.tsx", path: "src/pages/", description: "GDPR compliance and data rights information", type: "page" },
    { name: "Bookmarklet.tsx", path: "src/pages/", description: "Browser bookmarklet installation and usage", type: "page" },
    { name: "DesktopApp.tsx", path: "src/pages/", description: "Desktop application waitlist and features", type: "page" },
    { name: "PressKit.tsx", path: "src/pages/", description: "Press resources, logos, and media kit", type: "page" },
    { name: "SharedAnalysis.tsx", path: "src/pages/", description: "Shared analysis results view via token", type: "page" },
    { name: "NotFound.tsx", path: "src/pages/", description: "404 error page with navigation", type: "page" },
  ];

  const hooks: FileEntry[] = [
    { name: "use-confetti.ts", path: "src/hooks/", description: "Canvas confetti animations for celebrations", type: "hook" },
    { name: "use-keyboard-shortcuts.ts", path: "src/hooks/", description: "Global keyboard shortcut handler (1-6, H, S, Ctrl+E, ?)", type: "hook" },
    { name: "use-mobile.tsx", path: "src/hooks/", description: "Mobile device and viewport detection", type: "hook" },
    { name: "use-notifications.ts", path: "src/hooks/", description: "Browser notification permissions and sending", type: "hook" },
    { name: "use-sound-effects.ts", path: "src/hooks/", description: "Audio feedback for UI interactions", type: "hook" },
    { name: "use-theme-transition.tsx", path: "src/hooks/", description: "Smooth theme switching animations", type: "hook" },
    { name: "use-toast.ts", path: "src/hooks/", description: "Toast notification system wrapper", type: "hook" },
  ];

  const edgeFunctions: FileEntry[] = [
    { name: "analyze-media", path: "supabase/functions/", description: "Image/video deepfake analysis using Gemini 2.5 Flash AI", type: "edge-function" },
    { name: "analyze-audio", path: "supabase/functions/", description: "Audio voice cloning and manipulation detection", type: "edge-function" },
    { name: "analyze-url", path: "supabase/functions/", description: "URL content verification via Firecrawl metadata", type: "edge-function" },
    { name: "reverse-image-search", path: "supabase/functions/", description: "Reverse image lookup for source tracking", type: "edge-function" },
    { name: "create-checkout", path: "supabase/functions/", description: "Stripe checkout session creation for subscriptions", type: "edge-function" },
    { name: "check-subscription", path: "supabase/functions/", description: "User subscription status verification", type: "edge-function" },
    { name: "send-contact-email", path: "supabase/functions/", description: "Contact form email delivery via Resend", type: "edge-function" },
    { name: "send-analysis-report", path: "supabase/functions/", description: "Analysis report email sharing", type: "edge-function" },
    { name: "get-shared-analysis", path: "supabase/functions/", description: "Retrieve shared analysis by token", type: "edge-function" },
  ];

  const contexts: FileEntry[] = [
    { name: "AuthContext.tsx", path: "src/contexts/", description: "Authentication state management with Supabase Auth", type: "context" },
  ];

  const allFiles = [...components, ...pages, ...hooks, ...edgeFunctions, ...contexts];

  const filteredFiles = allFiles.filter(
    (file) =>
      file.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      file.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "component": return <Component className="w-4 h-4 text-blue-500" />;
      case "page": return <FileText className="w-4 h-4 text-green-500" />;
      case "hook": return <Zap className="w-4 h-4 text-yellow-500" />;
      case "edge-function": return <Settings className="w-4 h-4 text-purple-500" />;
      case "context": return <FolderOpen className="w-4 h-4 text-orange-500" />;
      default: return <FileCode className="w-4 h-4" />;
    }
  };

  const getTypeBadge = (type: string) => {
    const colors: Record<string, string> = {
      component: "bg-blue-500/20 text-blue-400",
      page: "bg-green-500/20 text-green-400",
      hook: "bg-yellow-500/20 text-yellow-400",
      "edge-function": "bg-purple-500/20 text-purple-400",
      context: "bg-orange-500/20 text-orange-400",
    };
    return colors[type] || "bg-muted";
  };

  const FileList = ({ files }: { files: FileEntry[] }) => (
    <div className="space-y-2">
      {files.map((file) => (
        <motion.div
          key={file.path + file.name}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
        >
          <div className="flex items-start gap-3">
            {getTypeIcon(file.type)}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <code className="text-sm font-mono font-medium">{file.name}</code>
                <Badge variant="outline" className={`text-xs ${getTypeBadge(file.type)}`}>
                  {file.type}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground mt-1">{file.description}</p>
              <p className="text-xs text-muted-foreground/60 font-mono mt-0.5">{file.path}</p>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );

  return (
    <Card className="glass border-border/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileCode className="w-5 h-5 text-primary" />
          File Registry
        </CardTitle>
        <CardDescription>
          Complete inventory of all project files with descriptions
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search files..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {searchQuery ? (
          <ScrollArea className="h-[500px]">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground mb-2">
                Found {filteredFiles.length} files matching "{searchQuery}"
              </p>
              <FileList files={filteredFiles} />
            </div>
          </ScrollArea>
        ) : (
          <Tabs defaultValue="components" className="space-y-4">
            <TabsList className="grid grid-cols-5 w-full">
              <TabsTrigger value="components" className="gap-1 text-xs">
                <Component className="w-3 h-3" />
                Components ({components.length})
              </TabsTrigger>
              <TabsTrigger value="pages" className="gap-1 text-xs">
                <FileText className="w-3 h-3" />
                Pages ({pages.length})
              </TabsTrigger>
              <TabsTrigger value="hooks" className="gap-1 text-xs">
                <Zap className="w-3 h-3" />
                Hooks ({hooks.length})
              </TabsTrigger>
              <TabsTrigger value="functions" className="gap-1 text-xs">
                <Settings className="w-3 h-3" />
                Edge Fn ({edgeFunctions.length})
              </TabsTrigger>
              <TabsTrigger value="contexts" className="gap-1 text-xs">
                <FolderOpen className="w-3 h-3" />
                Contexts
              </TabsTrigger>
            </TabsList>

            <ScrollArea className="h-[450px]">
              <TabsContent value="components">
                <FileList files={components} />
              </TabsContent>
              <TabsContent value="pages">
                <FileList files={pages} />
              </TabsContent>
              <TabsContent value="hooks">
                <FileList files={hooks} />
              </TabsContent>
              <TabsContent value="functions">
                <FileList files={edgeFunctions} />
              </TabsContent>
              <TabsContent value="contexts">
                <FileList files={contexts} />
              </TabsContent>
            </ScrollArea>
          </Tabs>
        )}
      </CardContent>
    </Card>
  );
};

export default FileRegistry;
