import { useState } from "react";
import { motion } from "framer-motion";
import { FileCode, Search, FolderOpen, Component, FileText, Zap, Settings, Database, Palette, Wrench } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";

interface FileEntry {
  name: string;
  path: string;
  description: string;
  type: "component" | "page" | "hook" | "util" | "edge-function" | "context" | "ui" | "config" | "integration";
}

const FileRegistry = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const components: FileEntry[] = [
    { name: "AffiliateSystem.tsx", path: "src/components/", description: "Affiliate dashboard with link generation, referral tracking, and payout tiers ($100-$1000)", type: "component" },
    { name: "AnalyzerSection.tsx", path: "src/components/", description: "Main media upload and analysis interface with drag-drop, camera capture, demo samples, and forensic analysis integration", type: "component" },
    { name: "AnalyzerSkeleton.tsx", path: "src/components/", description: "Loading skeleton placeholder for analyzer results", type: "component" },
    { name: "AudioAnalyzer.tsx", path: "src/components/", description: "Audio file analysis with waveform visualization, spectral analysis, and client-side forensics", type: "component" },
    { name: "AudioForensicPanel.tsx", path: "src/components/", description: "Client-side audio forensics: spectral FFT, temporal patterns, voice analysis, noise profiling via Web Audio API", type: "component" },
    { name: "BatchAnalyzer.tsx", path: "src/components/", description: "Multi-file batch processing with forensic analysis, progress tracking, PDF/JSON export", type: "component" },
    { name: "ComparisonView.tsx", path: "src/components/", description: "Side-by-side image comparison with synchronized zoom and pan", type: "component" },
    { name: "ComplianceBadges.tsx", path: "src/components/", description: "Modular badge system for GDPR, SOC2, ISO 27001, and OSS verification", type: "component" },
    { name: "DemoSamples.tsx", path: "src/components/", description: "Pre-loaded demo samples for testing the analyzer without uploads", type: "component" },
    { name: "EmailShareDialog.tsx", path: "src/components/", description: "Email sharing modal for analysis reports with recipient input", type: "component" },
    { name: "FeaturesSection.tsx", path: "src/components/", description: "Landing page features grid with icons and descriptions", type: "component" },
    { name: "Footer.tsx", path: "src/components/", description: "Site footer with navigation links, social icons, and tour restart", type: "component" },
    { name: "ForensicAnalysisPanel.tsx", path: "src/components/", description: "Client-side image forensics: ELA, face detection, noise, histogram, frequency analysis", type: "component" },
    { name: "HeatmapOverlay.tsx", path: "src/components/", description: "Visual overlay showing manipulation detection zones on images", type: "component" },
    { name: "HeroSection.tsx", path: "src/components/", description: "Landing page hero with animated gradient, CTA buttons, and stats", type: "component" },
    { name: "HistoryStats.tsx", path: "src/components/", description: "Statistics cards for analysis history (total, authentic, suspicious)", type: "component" },
    { name: "KeyboardShortcutsHelp.tsx", path: "src/components/", description: "Modal displaying all keyboard shortcuts (1-6 modes, H, S, Ctrl+E)", type: "component" },
    { name: "MobileInstallPrompt.tsx", path: "src/components/", description: "PWA install prompt for mobile devices with iOS/Android detection", type: "component" },
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

  const adminComponents: FileEntry[] = [
    { name: "FileRegistry.tsx", path: "src/components/admin/", description: "Complete project file inventory with search and categorization", type: "component" },
    { name: "DocumentationCenter.tsx", path: "src/components/admin/", description: "Tech, developer, and user documentation hub", type: "component" },
    { name: "ProjectPlanning.tsx", path: "src/components/admin/", description: "Roadmap, architecture, wireframes, and BOM", type: "component" },
    { name: "ProjectHistory.tsx", path: "src/components/admin/", description: "Chronological changelog of all project development", type: "component" },
    { name: "ChangelogTracker.tsx", path: "src/components/admin/", description: "Version history with features, fixes, and security updates", type: "component" },
    { name: "AdminSearch.tsx", path: "src/components/admin/", description: "Global search across admin panel components", type: "component" },
    { name: "DependencyMap.tsx", path: "src/components/admin/", description: "Visual component dependency graph with zoom/pan", type: "component" },
    { name: "DocumentationExport.tsx", path: "src/components/admin/", description: "Export documentation as JSON or Markdown", type: "component" },
    { name: "SampleData.tsx", path: "src/components/admin/", description: "Test data repository for FAQs, reviews, and testimonials", type: "component" },
  ];

  const helpComponents: FileEntry[] = [
    { name: "HelpArticles.tsx", path: "src/components/help/", description: "Searchable knowledge base with 15+ articles across 6 categories", type: "component" },
    { name: "HelpPublications.tsx", path: "src/components/help/", description: "Whitepapers, research papers, case studies, and guides (14 publications)", type: "component" },
  ];

  const aboutComponents: FileEntry[] = [
    { name: "VictimStoriesSection.tsx", path: "src/components/about/", description: "Family tragedies, teen sextortion deaths, marketplace violence, USA stats, video testimonies, documentaries with 30+ backlinks", type: "component" },
  ];

  const pages: FileEntry[] = [
    { name: "Index.tsx", path: "src/pages/", description: "Landing page with hero, features, pricing, and tabbed analyzer interface", type: "page" },
    { name: "Auth.tsx", path: "src/pages/", description: "Authentication page with login/signup forms and OAuth providers", type: "page" },
    { name: "Admin.tsx", path: "src/pages/", description: "Admin command center with test suite, security, files, docs, planning, and history tabs", type: "page" },
    { name: "AdminLogin.tsx", path: "src/pages/", description: "Admin authentication gateway with role verification", type: "page" },
    { name: "Dashboard.tsx", path: "src/pages/", description: "User dashboard with usage stats and detection rate charts", type: "page" },
    { name: "History.tsx", path: "src/pages/", description: "Analysis history with filtering, search, and bulk actions", type: "page" },
    { name: "Profile.tsx", path: "src/pages/", description: "User profile management with display name and preferences", type: "page" },
    { name: "About.tsx", path: "src/pages/", description: "SEO-rich about page with 80+ backlinks, real deepfake cases, FBI warnings, scam types, detection tips, victim stories", type: "page" },
    { name: "Blog.tsx", path: "src/pages/", description: "Blog listing page with article cards and categories", type: "page" },
    { name: "Careers.tsx", path: "src/pages/", description: "Job listings and company culture information", type: "page" },
    { name: "Contact.tsx", path: "src/pages/", description: "Contact form with Resend email integration", type: "page" },
    { name: "API.tsx", path: "src/pages/", description: "API documentation with forensic endpoints, code snippets in cURL/Python/JS", type: "page" },
    { name: "Documentation.tsx", path: "src/pages/", description: "Product documentation and integration guides", type: "page" },
    { name: "HelpCenter.tsx", path: "src/pages/", description: "FAQ, articles, and publications with tabbed navigation", type: "page" },
    { name: "Community.tsx", path: "src/pages/", description: "Community forums and discussion links", type: "page" },
    { name: "Status.tsx", path: "src/pages/", description: "System status page with uptime monitoring", type: "page" },
    { name: "Security.tsx", path: "src/pages/", description: "Security practices and vulnerability reporting", type: "page" },
    { name: "PrivacyPolicy.tsx", path: "src/pages/", description: "Privacy policy legal document", type: "page" },
    { name: "TermsOfService.tsx", path: "src/pages/", description: "Terms of service legal document", type: "page" },
    { name: "CookiePolicy.tsx", path: "src/pages/", description: "Cookie usage and consent policy", type: "page" },
    { name: "GDPR.tsx", path: "src/pages/", description: "GDPR compliance and data rights information", type: "page" },
    { name: "Bookmarklet.tsx", path: "src/pages/", description: "Browser bookmarklet, extension preview, PWA mobile app section", type: "page" },
    { name: "DesktopApp.tsx", path: "src/pages/", description: "Desktop application waitlist and features", type: "page" },
    { name: "PressKit.tsx", path: "src/pages/", description: "Press resources, logos, and media kit", type: "page" },
    { name: "SharedAnalysis.tsx", path: "src/pages/", description: "Shared analysis results view via token", type: "page" },
    { name: "DeepfakeQuiz.tsx", path: "src/pages/", description: "Interactive 20-question deepfake detection quiz with 5 categories, expert explanations, and scoring", type: "page" },
    { name: "NotFound.tsx", path: "src/pages/", description: "404 error page with navigation", type: "page" },
  ];

  const mobileConfig: FileEntry[] = [
    { name: "capacitor.config.ts", path: "./", description: "Capacitor configuration for iOS/Android native app deployment", type: "config" },
    { name: "mobile-deploy.ts", path: "src/lib/", description: "Mobile deployment utilities, app store metadata, build commands, and CLI reference", type: "util" },
    { name: "MobileInstallPrompt.tsx", path: "src/components/", description: "PWA install prompt component for mobile browsers", type: "component" },
    { name: "manifest.json", path: "public/", description: "PWA manifest with icons, shortcuts, and app metadata", type: "config" },
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

  const utils: FileEntry[] = [
    { name: "utils.ts", path: "src/lib/", description: "Utility functions including cn() for class merging", type: "util" },
    { name: "pdf-export.ts", path: "src/lib/", description: "Single analysis PDF report generation with jsPDF", type: "util" },
    { name: "batch-pdf-export.ts", path: "src/lib/", description: "Batch analysis PDF export with summary stats and forensic results", type: "util" },
    { name: "forensic-analysis.ts", path: "src/lib/", description: "Client-side image forensics: ELA, noise, histogram, frequency, metadata extraction", type: "util" },
    { name: "face-detection.ts", path: "src/lib/", description: "Face detection using @vladmandic/face-api: 68-point landmarks, symmetry, expressions, blur", type: "util" },
    { name: "audio-forensics.ts", path: "src/lib/", description: "Audio forensic analysis: spectral FFT, temporal patterns, voice analysis, noise profiling", type: "util" },
  ];

  const uiComponents: FileEntry[] = [
    { name: "accordion.tsx", path: "src/components/ui/", description: "Collapsible accordion component (Radix)", type: "ui" },
    { name: "alert-dialog.tsx", path: "src/components/ui/", description: "Modal alert dialog with confirm/cancel (Radix)", type: "ui" },
    { name: "alert.tsx", path: "src/components/ui/", description: "Alert message component with variants", type: "ui" },
    { name: "aspect-ratio.tsx", path: "src/components/ui/", description: "Responsive aspect ratio container (Radix)", type: "ui" },
    { name: "avatar.tsx", path: "src/components/ui/", description: "User avatar with fallback (Radix)", type: "ui" },
    { name: "badge.tsx", path: "src/components/ui/", description: "Badge/tag component with variants", type: "ui" },
    { name: "breadcrumb.tsx", path: "src/components/ui/", description: "Navigation breadcrumb trail", type: "ui" },
    { name: "button.tsx", path: "src/components/ui/", description: "Button component with multiple variants and sizes", type: "ui" },
    { name: "calendar.tsx", path: "src/components/ui/", description: "Date picker calendar (react-day-picker)", type: "ui" },
    { name: "card.tsx", path: "src/components/ui/", description: "Card container with header, content, footer", type: "ui" },
    { name: "carousel.tsx", path: "src/components/ui/", description: "Image/content carousel (Embla)", type: "ui" },
    { name: "chart.tsx", path: "src/components/ui/", description: "Chart wrapper for Recharts integration", type: "ui" },
    { name: "checkbox.tsx", path: "src/components/ui/", description: "Checkbox input (Radix)", type: "ui" },
    { name: "collapsible.tsx", path: "src/components/ui/", description: "Collapsible content section (Radix)", type: "ui" },
    { name: "command.tsx", path: "src/components/ui/", description: "Command palette/search (cmdk)", type: "ui" },
    { name: "context-menu.tsx", path: "src/components/ui/", description: "Right-click context menu (Radix)", type: "ui" },
    { name: "dialog.tsx", path: "src/components/ui/", description: "Modal dialog component (Radix)", type: "ui" },
    { name: "drawer.tsx", path: "src/components/ui/", description: "Slide-out drawer component (Vaul)", type: "ui" },
    { name: "dropdown-menu.tsx", path: "src/components/ui/", description: "Dropdown menu (Radix)", type: "ui" },
    { name: "form.tsx", path: "src/components/ui/", description: "Form wrapper with react-hook-form integration", type: "ui" },
    { name: "hover-card.tsx", path: "src/components/ui/", description: "Hover tooltip card (Radix)", type: "ui" },
    { name: "input-otp.tsx", path: "src/components/ui/", description: "OTP/PIN input fields", type: "ui" },
    { name: "input.tsx", path: "src/components/ui/", description: "Text input component", type: "ui" },
    { name: "label.tsx", path: "src/components/ui/", description: "Form label component (Radix)", type: "ui" },
    { name: "menubar.tsx", path: "src/components/ui/", description: "Horizontal menu bar (Radix)", type: "ui" },
    { name: "navigation-menu.tsx", path: "src/components/ui/", description: "Navigation menu with dropdowns (Radix)", type: "ui" },
    { name: "pagination.tsx", path: "src/components/ui/", description: "Pagination controls", type: "ui" },
    { name: "popover.tsx", path: "src/components/ui/", description: "Popover tooltip (Radix)", type: "ui" },
    { name: "progress.tsx", path: "src/components/ui/", description: "Progress bar (Radix)", type: "ui" },
    { name: "radio-group.tsx", path: "src/components/ui/", description: "Radio button group (Radix)", type: "ui" },
    { name: "resizable.tsx", path: "src/components/ui/", description: "Resizable panels (react-resizable-panels)", type: "ui" },
    { name: "scroll-area.tsx", path: "src/components/ui/", description: "Custom scrollbar container (Radix)", type: "ui" },
    { name: "select.tsx", path: "src/components/ui/", description: "Select dropdown (Radix)", type: "ui" },
    { name: "separator.tsx", path: "src/components/ui/", description: "Visual separator line (Radix)", type: "ui" },
    { name: "sheet.tsx", path: "src/components/ui/", description: "Side sheet/drawer (Radix Dialog)", type: "ui" },
    { name: "sidebar.tsx", path: "src/components/ui/", description: "Collapsible sidebar navigation", type: "ui" },
    { name: "skeleton.tsx", path: "src/components/ui/", description: "Loading skeleton placeholder", type: "ui" },
    { name: "slider.tsx", path: "src/components/ui/", description: "Range slider (Radix)", type: "ui" },
    { name: "sonner.tsx", path: "src/components/ui/", description: "Toast notifications (Sonner)", type: "ui" },
    { name: "switch.tsx", path: "src/components/ui/", description: "Toggle switch (Radix)", type: "ui" },
    { name: "table.tsx", path: "src/components/ui/", description: "Data table components", type: "ui" },
    { name: "tabs.tsx", path: "src/components/ui/", description: "Tab navigation (Radix)", type: "ui" },
    { name: "textarea.tsx", path: "src/components/ui/", description: "Multi-line text input", type: "ui" },
    { name: "toast.tsx", path: "src/components/ui/", description: "Toast notification component", type: "ui" },
    { name: "toaster.tsx", path: "src/components/ui/", description: "Toast container/provider", type: "ui" },
    { name: "toggle-group.tsx", path: "src/components/ui/", description: "Toggle button group (Radix)", type: "ui" },
    { name: "toggle.tsx", path: "src/components/ui/", description: "Toggle button (Radix)", type: "ui" },
    { name: "tooltip.tsx", path: "src/components/ui/", description: "Hover tooltip (Radix)", type: "ui" },
    { name: "use-toast.ts", path: "src/components/ui/", description: "Toast hook for programmatic toasts", type: "ui" },
  ];

  const edgeFunctions: FileEntry[] = [
    { name: "analyze-media/index.ts", path: "supabase/functions/", description: "Image/video deepfake analysis using Gemini 2.5 Flash AI", type: "edge-function" },
    { name: "analyze-audio/index.ts", path: "supabase/functions/", description: "Audio voice cloning and manipulation detection", type: "edge-function" },
    { name: "analyze-url/index.ts", path: "supabase/functions/", description: "URL content verification via Firecrawl metadata", type: "edge-function" },
    { name: "reverse-image-search/index.ts", path: "supabase/functions/", description: "Reverse image lookup for source tracking", type: "edge-function" },
    { name: "create-checkout/index.ts", path: "supabase/functions/", description: "Stripe checkout session creation for subscriptions", type: "edge-function" },
    { name: "check-subscription/index.ts", path: "supabase/functions/", description: "User subscription status verification", type: "edge-function" },
    { name: "send-contact-email/index.ts", path: "supabase/functions/", description: "Contact form email delivery via Resend", type: "edge-function" },
    { name: "send-analysis-report/index.ts", path: "supabase/functions/", description: "Analysis report email sharing", type: "edge-function" },
    { name: "get-shared-analysis/index.ts", path: "supabase/functions/", description: "Retrieve shared analysis by token", type: "edge-function" },
  ];

  const contexts: FileEntry[] = [
    { name: "AuthContext.tsx", path: "src/contexts/", description: "Authentication state management with Supabase Auth", type: "context" },
  ];

  const integrations: FileEntry[] = [
    { name: "client.ts", path: "src/integrations/supabase/", description: "Supabase client initialization (auto-generated)", type: "integration" },
    { name: "types.ts", path: "src/integrations/supabase/", description: "Database TypeScript types (auto-generated)", type: "integration" },
    { name: "index.ts", path: "src/integrations/lovable/", description: "Lovable platform integration exports", type: "integration" },
  ];

  const configFiles: FileEntry[] = [
    { name: "App.tsx", path: "src/", description: "Root app component with router and providers", type: "config" },
    { name: "App.css", path: "src/", description: "Global app styles and animations", type: "config" },
    { name: "main.tsx", path: "src/", description: "React app entry point with providers", type: "config" },
    { name: "index.css", path: "src/", description: "Tailwind imports and CSS custom properties", type: "config" },
    { name: "vite-env.d.ts", path: "src/", description: "Vite environment type declarations", type: "config" },
    { name: "tailwind.config.ts", path: "", description: "Tailwind CSS configuration with custom theme", type: "config" },
    { name: "vite.config.ts", path: "", description: "Vite build configuration", type: "config" },
    { name: "tsconfig.json", path: "", description: "TypeScript compiler configuration", type: "config" },
    { name: "tsconfig.app.json", path: "", description: "TypeScript app-specific config", type: "config" },
    { name: "tsconfig.node.json", path: "", description: "TypeScript Node.js config", type: "config" },
    { name: "components.json", path: "", description: "shadcn/ui component configuration", type: "config" },
    { name: "eslint.config.js", path: "", description: "ESLint linting configuration", type: "config" },
    { name: "postcss.config.js", path: "", description: "PostCSS configuration for Tailwind", type: "config" },
    { name: "index.html", path: "", description: "HTML entry point with meta tags", type: "config" },
    { name: ".env", path: "", description: "Environment variables (Supabase keys)", type: "config" },
    { name: "config.toml", path: "supabase/", description: "Supabase project configuration", type: "config" },
  ];

  const allFiles = [
    ...components, 
    ...adminComponents, 
    ...helpComponents,
    ...pages, 
    ...hooks, 
    ...utils, 
    ...uiComponents, 
    ...edgeFunctions, 
    ...contexts, 
    ...integrations, 
    ...configFiles
  ];

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
      case "util": return <Wrench className="w-4 h-4 text-cyan-500" />;
      case "edge-function": return <Settings className="w-4 h-4 text-purple-500" />;
      case "context": return <FolderOpen className="w-4 h-4 text-orange-500" />;
      case "ui": return <Palette className="w-4 h-4 text-pink-500" />;
      case "integration": return <Database className="w-4 h-4 text-indigo-500" />;
      case "config": return <FileCode className="w-4 h-4 text-slate-500" />;
      default: return <FileCode className="w-4 h-4" />;
    }
  };

  const getTypeBadge = (type: string) => {
    const colors: Record<string, string> = {
      component: "bg-blue-500/20 text-blue-400",
      page: "bg-green-500/20 text-green-400",
      hook: "bg-yellow-500/20 text-yellow-400",
      util: "bg-cyan-500/20 text-cyan-400",
      "edge-function": "bg-purple-500/20 text-purple-400",
      context: "bg-orange-500/20 text-orange-400",
      ui: "bg-pink-500/20 text-pink-400",
      integration: "bg-indigo-500/20 text-indigo-400",
      config: "bg-slate-500/20 text-slate-400",
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
              <p className="text-xs text-muted-foreground/60 font-mono mt-0.5">{file.path}{file.name}</p>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );

  const totalFiles = allFiles.length;

  return (
    <Card className="glass border-border/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileCode className="w-5 h-5 text-primary" />
          File Registry
          <Badge variant="outline" className="ml-2">{totalFiles} files</Badge>
        </CardTitle>
        <CardDescription>
          Complete inventory of all project files (.tsx, .ts, .css, .json, .html, .toml)
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
            <TabsList className="flex flex-wrap gap-1 h-auto">
              <TabsTrigger value="components" className="gap-1 text-xs">
                <Component className="w-3 h-3" />
                Components ({components.length + adminComponents.length})
              </TabsTrigger>
              <TabsTrigger value="pages" className="gap-1 text-xs">
                <FileText className="w-3 h-3" />
                Pages ({pages.length})
              </TabsTrigger>
              <TabsTrigger value="ui" className="gap-1 text-xs">
                <Palette className="w-3 h-3" />
                UI ({uiComponents.length})
              </TabsTrigger>
              <TabsTrigger value="hooks" className="gap-1 text-xs">
                <Zap className="w-3 h-3" />
                Hooks ({hooks.length})
              </TabsTrigger>
              <TabsTrigger value="functions" className="gap-1 text-xs">
                <Settings className="w-3 h-3" />
                Edge ({edgeFunctions.length})
              </TabsTrigger>
              <TabsTrigger value="utils" className="gap-1 text-xs">
                <Wrench className="w-3 h-3" />
                Utils ({utils.length})
              </TabsTrigger>
              <TabsTrigger value="config" className="gap-1 text-xs">
                <FileCode className="w-3 h-3" />
                Config ({configFiles.length})
              </TabsTrigger>
            </TabsList>

            <ScrollArea className="h-[450px]">
              <TabsContent value="components" className="mt-0">
                <p className="text-xs text-muted-foreground mb-3">Feature Components</p>
                <FileList files={components} />
                <p className="text-xs text-muted-foreground mb-3 mt-4">Admin Components</p>
                <FileList files={adminComponents} />
              </TabsContent>
              <TabsContent value="pages" className="mt-0">
                <FileList files={pages} />
              </TabsContent>
              <TabsContent value="ui" className="mt-0">
                <FileList files={uiComponents} />
              </TabsContent>
              <TabsContent value="hooks" className="mt-0">
                <FileList files={hooks} />
              </TabsContent>
              <TabsContent value="functions" className="mt-0">
                <FileList files={edgeFunctions} />
              </TabsContent>
              <TabsContent value="utils" className="mt-0">
                <FileList files={utils} />
                <p className="text-xs text-muted-foreground mb-3 mt-4">Contexts</p>
                <FileList files={contexts} />
                <p className="text-xs text-muted-foreground mb-3 mt-4">Integrations</p>
                <FileList files={integrations} />
              </TabsContent>
              <TabsContent value="config" className="mt-0">
                <FileList files={configFiles} />
              </TabsContent>
            </ScrollArea>
          </Tabs>
        )}
      </CardContent>
    </Card>
  );
};

export default FileRegistry;
