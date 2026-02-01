import { useState } from "react";
import { motion } from "framer-motion";
import { 
  History, Calendar, MessageSquare, Code, Database, 
  CheckCircle2, HelpCircle, Zap, Shield, CreditCard,
  FileText, Users, Globe, Mail, ChevronDown, ChevronUp
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface HistoryEntry {
  date: string;
  type: "request" | "question" | "implementation" | "database" | "integration";
  title: string;
  description: string;
  items?: string[];
}

const ProjectHistory = () => {
  const [expandedEntries, setExpandedEntries] = useState<Set<number>>(new Set([0, 1, 2]));

  const toggleEntry = (index: number) => {
    const newExpanded = new Set(expandedEntries);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedEntries(newExpanded);
  };

  const history: HistoryEntry[] = [
    {
      date: "February 1, 2026 - Current Session",
      type: "implementation",
      title: "Help Center Articles & Publications System",
      description: "Added comprehensive articles, publications, and sub-categories using XP methodology",
      items: [
        "USER REQUEST: Add articles and publications with sub-categories using XP programming",
        "Created src/components/help/HelpArticles.tsx - 15+ searchable articles across 6 categories",
        "  - Categories: Getting Started, Account & Billing, Uploading & Analysis, Understanding Results, API & Integrations, Security & Privacy",
        "  - Sub-categories with collapsible navigation",
        "  - Full article content with markdown-style formatting",
        "  - Tag-based filtering and search functionality",
        "Created src/components/help/HelpPublications.tsx - 14 publications including:",
        "  - 3 Whitepapers: State of Deepfake Detection, Enterprise Security, Audio Deepfakes",
        "  - 3 Research Papers: GAN Artifact Detection, Temporal Consistency, Lip Sync Analysis",
        "  - 3 Case Studies: Reuters verification, Financial fraud prevention, Election security",
        "  - 2 Technical Docs: API Specification, Model Architecture",
        "  - 3 Guides: Media Literacy, Journalist Handbook, Legal Considerations",
        "Updated src/pages/HelpCenter.tsx with tabbed navigation (Overview, Articles, Publications)",
        "Updated src/components/admin/FileRegistry.tsx with new help components",
        "Updated src/components/admin/ProjectHistory.tsx with current session log",
      ],
    },
    {
      date: "February 1, 2026 - Earlier",
      type: "implementation",
      title: "Contact Info Sync & Admin Documentation Center",
      description: "Updated contact information site-wide and built comprehensive admin documentation center",
      items: [
        "USER REQUEST: Update email to 'support' and address to PO Box 1433, Wellington Colorado 80549",
        "Updated TermsOfService.tsx contact section",
        "Updated PrivacyPolicy.tsx contact section", 
        "Updated GDPR.tsx DPO contact and mailto link",
        "Updated CookiePolicy.tsx contact section",
        "Updated Contact.tsx - removed phone, European office, changed to MST timezone",
        "USER REQUEST: Add file registry, docs, project planning to admin panel",
        "Created src/components/admin/FileRegistry.tsx - Complete file inventory with 100+ files",
        "Created src/components/admin/DocumentationCenter.tsx - Tech, dev, user docs",
        "Created src/components/admin/ProjectPlanning.tsx - Roadmap, architecture, wireframes, BOM",
        "Created src/components/admin/ProjectHistory.tsx - Chronological changelog",
        "Updated Admin.tsx with Files, Docs, Planning, History tabs",
        "USER REQUEST: Add changelog, admin search, sample data, dependency map, documentation export",
        "Created src/components/admin/ChangelogTracker.tsx - Version history with filtering",
        "Created src/components/admin/AdminSearch.tsx - Global admin panel search",
        "Created src/components/admin/DependencyMap.tsx - Component dependency visualization",
        "Created src/components/admin/DocumentationExport.tsx - JSON/Markdown export",
        "Created src/components/admin/SampleData.tsx - FAQs, reviews, testimonials test data",
      ],
    },
    {
      date: "February 1, 2026 - Earlier",
      type: "integration",
      title: "Stripe Integration & Comprehensive Feature Rollout",
      description: "Enabled Stripe payments, created database schema, and implemented advanced analyzers",
      items: [
        "USER PROVIDED: Stripe API key for payment integration",
        "APPROVED: Stripe integration enablement",
        "Created Stripe product 'DeepGuard Pro' at $29.00/month",
        "DATABASE MIGRATION: Created user_roles table with admin/moderator/user enum",
        "DATABASE MIGRATION: Created affiliates table with referral tracking",
        "DATABASE MIGRATION: Created affiliate_referrals table",
        "DATABASE MIGRATION: Created payments table with Stripe integration",
        "DATABASE MIGRATION: Created batch_analyses table for multi-file processing",
        "DATABASE MIGRATION: Created compliance_tests table for security testing",
        "Created has_role() and generate_affiliate_code() database functions",
        "Created RLS policies for all new tables",
        "Created src/components/BatchAnalyzer.tsx - Multi-file batch processing",
        "Created src/components/VoiceDetector.tsx - Audio recording and analysis",
        "Created src/components/SecurityModule.tsx - WCAG, XSS, CSP, Privacy testing",
        "Created src/components/ComplianceBadges.tsx - GDPR, SOC2, ISO badges",
        "Created src/components/AffiliateSystem.tsx - Referral dashboard with payouts",
        "Created src/pages/Admin.tsx - Command center with 40+ test suite",
        "Created src/pages/AdminLogin.tsx - Admin authentication",
        "Created supabase/functions/create-checkout/index.ts - Stripe checkout",
        "Created supabase/functions/check-subscription/index.ts - Subscription verification",
        "Created supabase/functions/send-contact-email/index.ts - Resend email integration",
        "Updated Index.tsx with tabbed analyzer interface",
        "Updated PricingSection.tsx with Stripe checkout flow",
      ],
    },
    {
      date: "January 2026 - Foundation Phase",
      type: "implementation",
      title: "Core Application Infrastructure",
      description: "Built foundation including authentication, database, and core analyzer",
      items: [
        "Project initialized with React + Vite + TypeScript + Tailwind",
        "Integrated shadcn/ui component library (50+ components)",
        "Connected Supabase for database and authentication",
        "DATABASE: Created profiles table with user data",
        "DATABASE: Created analysis_history table for storing results",
        "Created AuthContext.tsx for authentication state management",
        "Created src/components/Navbar.tsx - Responsive navigation",
        "Created src/components/HeroSection.tsx - Animated landing hero",
        "Created src/components/AnalyzerSection.tsx - Main upload interface",
        "Created src/components/FeaturesSection.tsx - Feature grid",
        "Created src/components/PricingSection.tsx - Pricing cards",
        "Created src/components/Footer.tsx - Site footer",
        "Created src/pages/Auth.tsx - Login/signup forms",
        "Created src/pages/Dashboard.tsx - User analytics",
        "Created src/pages/History.tsx - Analysis history with filters",
        "Created src/pages/Profile.tsx - User profile management",
        "Created supabase/functions/analyze-media/index.ts - Gemini AI analysis",
      ],
    },
    {
      date: "January 2026 - Documentation Phase",
      type: "implementation",
      title: "Legal & Corporate Pages",
      description: "Created comprehensive legal documentation and corporate pages",
      items: [
        "Created src/pages/PrivacyPolicy.tsx - Privacy policy with 7 sections",
        "Created src/pages/TermsOfService.tsx - Terms with 12 sections",
        "Created src/pages/CookiePolicy.tsx - Cookie usage with table",
        "Created src/pages/GDPR.tsx - GDPR compliance with 8 data rights",
        "Created src/pages/About.tsx - Company mission and team",
        "Created src/pages/Blog.tsx - Blog listing with categories",
        "Created src/pages/Careers.tsx - Job listings",
        "Created src/pages/Contact.tsx - Contact form with categories",
        "Created src/pages/API.tsx - API documentation with code snippets",
        "Created src/pages/Documentation.tsx - Product docs",
        "Created src/pages/HelpCenter.tsx - FAQ and support",
        "Created src/pages/Status.tsx - System status monitoring",
        "Created src/pages/Security.tsx - Security practices",
        "Created src/pages/Community.tsx - Community links",
        "Created src/pages/PressKit.tsx - Press resources",
        "Created src/pages/Bookmarklet.tsx - Browser extension",
        "Created src/pages/DesktopApp.tsx - Desktop app waitlist",
      ],
    },
    {
      date: "January 2026 - Analysis Features",
      type: "implementation",
      title: "Advanced Analysis Modules",
      description: "Implemented multiple analysis modes and visualization features",
      items: [
        "Created src/components/AudioAnalyzer.tsx - Audio waveform analysis",
        "Created src/components/UrlAnalyzer.tsx - URL content verification",
        "Created src/components/ReverseImageSearch.tsx - Reverse image lookup",
        "Created src/components/ComparisonView.tsx - Side-by-side comparison",
        "Created src/components/HeatmapOverlay.tsx - Manipulation visualization",
        "Created src/components/DemoSamples.tsx - Demo file samples",
        "Created src/components/EmailShareDialog.tsx - Email sharing",
        "Created src/components/SocialShareButtons.tsx - Social sharing",
        "Created supabase/functions/analyze-audio/index.ts - Audio AI analysis",
        "Created supabase/functions/analyze-url/index.ts - Firecrawl integration",
        "Created supabase/functions/reverse-image-search/index.ts - Image lookup",
        "Created supabase/functions/send-analysis-report/index.ts - Email reports",
        "Created supabase/functions/get-shared-analysis/index.ts - Share tokens",
      ],
    },
    {
      date: "January 2026 - UX Enhancements",
      type: "implementation",
      title: "User Experience & Hooks",
      description: "Created custom hooks and UX enhancement features",
      items: [
        "Created src/hooks/use-keyboard-shortcuts.ts - Global shortcuts (1-6, H, S, ?, Ctrl+E)",
        "Created src/hooks/use-confetti.ts - Celebration animations",
        "Created src/hooks/use-sound-effects.ts - Audio feedback",
        "Created src/hooks/use-notifications.ts - Browser notifications",
        "Created src/hooks/use-mobile.tsx - Mobile detection",
        "Created src/hooks/use-theme-transition.tsx - Theme animations",
        "Created src/components/OnboardingTour.tsx - Product tour",
        "Created src/components/KeyboardShortcutsHelp.tsx - Shortcuts modal",
        "Created src/components/ThemeToggle.tsx - Dark/light mode",
        "Created src/components/ProgressRing.tsx - Circular progress",
        "Created src/components/HistoryStats.tsx - Statistics cards",
        "Created src/lib/pdf-export.ts - PDF report generation",
        "Created src/lib/batch-pdf-export.ts - Batch PDF export",
      ],
    },
    {
      date: "Project Configuration",
      type: "database",
      title: "Database Schema & Configuration",
      description: "Complete database schema with RLS policies",
      items: [
        "TABLE: profiles (id, user_id, display_name, email, created_at, updated_at)",
        "TABLE: analysis_history (id, user_id, file_name, file_type, file_size, status, confidence, findings, share_token)",
        "TABLE: user_roles (id, user_id, role: admin|moderator|user)",
        "TABLE: affiliates (id, user_id, affiliate_code, name, email, commission_rate, total_earnings, pending_payout, status)",
        "TABLE: affiliate_referrals (id, affiliate_id, referred_user_id, payment_id, commission_amount, status)",
        "TABLE: payments (id, user_id, stripe_payment_id, stripe_customer_id, amount, currency, tier, affiliate_code, status)",
        "TABLE: batch_analyses (id, user_id, name, total_files, completed_files, status, results, completed_at)",
        "TABLE: compliance_tests (id, test_name, category, status, passed, details, run_by, run_at)",
        "FUNCTION: has_role(_user_id, _role) - Check user role",
        "FUNCTION: generate_affiliate_code() - Generate AF+8 char code",
        "FUNCTION: handle_new_user() - Auto-create profile on signup",
        "FUNCTION: update_updated_at_column() - Timestamp trigger",
        "RLS: All tables have row-level security enabled",
        "RLS: Users can only access their own data",
        "RLS: Admins have elevated access via has_role()",
      ],
    },
    {
      date: "Integrations & Secrets",
      type: "integration",
      title: "External Service Integrations",
      description: "Connected external services and APIs",
      items: [
        "INTEGRATION: Supabase - Database, Auth, Edge Functions, Storage",
        "INTEGRATION: Stripe - Payment processing (Pro tier $29/month)",
        "INTEGRATION: Resend - Transactional emails (contact, reports)",
        "INTEGRATION: Firecrawl - URL metadata extraction (connector)",
        "INTEGRATION: Lovable AI - Gemini 2.5 Flash for media analysis",
        "SECRET: SUPABASE_URL - Database endpoint",
        "SECRET: SUPABASE_ANON_KEY - Public API key",
        "SECRET: SUPABASE_SERVICE_ROLE_KEY - Admin API key",
        "SECRET: STRIPE_SECRET_KEY - Payment processing",
        "SECRET: RESEND_API_KEY - Email delivery",
        "SECRET: FIRECRAWL_API_KEY - URL crawling (connector managed)",
        "SECRET: LOVABLE_API_KEY - AI model access",
      ],
    },
  ];

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "request": return <MessageSquare className="w-4 h-4" />;
      case "question": return <HelpCircle className="w-4 h-4" />;
      case "implementation": return <Code className="w-4 h-4" />;
      case "database": return <Database className="w-4 h-4" />;
      case "integration": return <Zap className="w-4 h-4" />;
      default: return <CheckCircle2 className="w-4 h-4" />;
    }
  };

  const getTypeBadge = (type: string) => {
    const styles: Record<string, string> = {
      request: "bg-blue-500/20 text-blue-400",
      question: "bg-yellow-500/20 text-yellow-400",
      implementation: "bg-green-500/20 text-green-400",
      database: "bg-purple-500/20 text-purple-400",
      integration: "bg-orange-500/20 text-orange-400",
    };
    return styles[type] || "";
  };

  const getItemIcon = (item: string) => {
    if (item.startsWith("USER REQUEST:") || item.startsWith("USER PROVIDED:")) {
      return <MessageSquare className="w-3 h-3 text-blue-400" />;
    }
    if (item.startsWith("APPROVED:")) {
      return <CheckCircle2 className="w-3 h-3 text-green-400" />;
    }
    if (item.startsWith("DATABASE") || item.startsWith("TABLE:") || item.startsWith("FUNCTION:") || item.startsWith("RLS:")) {
      return <Database className="w-3 h-3 text-purple-400" />;
    }
    if (item.startsWith("INTEGRATION:") || item.startsWith("SECRET:")) {
      return <Zap className="w-3 h-3 text-orange-400" />;
    }
    if (item.startsWith("Created supabase/functions/")) {
      return <Globe className="w-3 h-3 text-cyan-400" />;
    }
    if (item.startsWith("Created src/pages/")) {
      return <FileText className="w-3 h-3 text-green-400" />;
    }
    if (item.startsWith("Created src/components/")) {
      return <Code className="w-3 h-3 text-blue-400" />;
    }
    if (item.startsWith("Created src/hooks/") || item.startsWith("Created src/lib/")) {
      return <Zap className="w-3 h-3 text-yellow-400" />;
    }
    if (item.startsWith("Updated")) {
      return <CheckCircle2 className="w-3 h-3 text-green-400" />;
    }
    return <ChevronDown className="w-3 h-3 text-muted-foreground" />;
  };

  return (
    <Card className="glass border-border/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <History className="w-5 h-5 text-primary" />
          Project History
          <Badge variant="outline" className="ml-2">{history.length} entries</Badge>
        </CardTitle>
        <CardDescription>
          Chronological changelog of all development requests, questions, and implementations
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[550px]">
          <div className="space-y-4">
            {history.map((entry, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="rounded-lg border border-border/50 overflow-hidden"
              >
                <Button
                  variant="ghost"
                  className="w-full p-4 h-auto justify-between hover:bg-muted/50"
                  onClick={() => toggleEntry(index)}
                >
                  <div className="flex items-start gap-3 text-left">
                    <div className={`p-2 rounded-lg ${getTypeBadge(entry.type)}`}>
                      {getTypeIcon(entry.type)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-semibold">{entry.title}</span>
                        <Badge variant="outline" className={`text-xs ${getTypeBadge(entry.type)}`}>
                          {entry.type}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                        <Calendar className="w-3 h-3" />
                        {entry.date}
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">{entry.description}</p>
                    </div>
                  </div>
                  {expandedEntries.has(index) ? (
                    <ChevronUp className="w-4 h-4 shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 shrink-0" />
                  )}
                </Button>

                {expandedEntries.has(index) && entry.items && (
                  <div className="px-4 pb-4 pt-0">
                    <div className="p-3 rounded-lg bg-muted/30 space-y-2">
                      {entry.items.map((item, i) => (
                        <div key={i} className="flex items-start gap-2 text-xs">
                          {getItemIcon(item)}
                          <span className={
                            item.startsWith("USER") ? "text-blue-400" :
                            item.startsWith("APPROVED") ? "text-green-400" :
                            "text-muted-foreground"
                          }>
                            {item}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default ProjectHistory;
