import { Download, FileJson, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

interface ExportData {
  projectInfo: {
    name: string;
    version: string;
    lastUpdated: string;
  };
  files: {
    components: number;
    pages: number;
    hooks: number;
    edgeFunctions: number;
    uiComponents: number;
    total: number;
  };
  database: {
    tables: string[];
    functions: string[];
  };
  integrations: string[];
  changelog: {
    version: string;
    date: string;
    changes: number;
  }[];
}

const DocumentationExport = () => {
  const exportData: ExportData = {
    projectInfo: {
      name: "DeepGuard",
      version: "2.2.0",
      lastUpdated: new Date().toISOString(),
    },
    files: {
      components: 42,
      pages: 28,
      hooks: 7,
      edgeFunctions: 12,
      uiComponents: 49,
      total: 170,
    },
    database: {
      tables: [
        "profiles",
        "analysis_history",
        "user_roles",
        "affiliates",
        "affiliate_referrals",
        "payments",
        "batch_analyses",
        "compliance_tests",
        "metadata_anomalies",
        "known_software_signatures",
      ],
      functions: [
        "has_role(_user_id, _role)",
        "generate_affiliate_code()",
        "handle_new_user()",
        "update_updated_at_column()",
        "calculate_rarity_score(occurrence, total_count)",
      ],
    },
    integrations: [
      "Supabase (Database, Auth, Edge Functions, RLS)",
      "Stripe (Payment Processing, Subscriptions)",
      "Resend (Email Delivery, HTML Templates)",
      "Firecrawl (URL Crawling, Metadata Extraction)",
      "Lovable AI (Gemini 2.5 Flash, GPT-5)",
      "TensorFlow.js (Client-side ML)",
      "face-api.js (Facial Landmark Detection)",
      "Web Audio API (Spectral Analysis)",
    ],
    changelog: [
      { version: "2.2.0", date: "February 1, 2026", changes: 5 },
      { version: "2.1.0", date: "February 1, 2026", changes: 7 },
      { version: "2.0.0", date: "February 1, 2026", changes: 8 },
      { version: "1.9.0", date: "February 1, 2026", changes: 8 },
      { version: "1.8.0", date: "January 28, 2026", changes: 5 },
      { version: "1.7.0", date: "January 25, 2026", changes: 5 },
      { version: "1.6.0", date: "January 22, 2026", changes: 5 },
      { version: "1.5.0", date: "January 18, 2026", changes: 5 },
      { version: "1.0.0", date: "January 15, 2026", changes: 7 },
    ],
  };

  const exportAsJSON = () => {
    const fullExport = {
      ...exportData,
      exportedAt: new Date().toISOString(),
      fileRegistry: {
        components: [
          "AffiliateSystem.tsx", "AnalyzerSection.tsx", "AnalyzerSkeleton.tsx", "AudioAnalyzer.tsx",
          "AudioForensicPanel.tsx", "BatchAnalyzer.tsx", "ComparisonView.tsx", "ComplianceBadges.tsx", 
          "DemoSamples.tsx", "EmailShareDialog.tsx", "FeaturesSection.tsx", "Footer.tsx", 
          "ForensicAnalysisPanel.tsx", "HeatmapOverlay.tsx", "HeroSection.tsx", "HistoryStats.tsx", 
          "KeyboardShortcutsHelp.tsx", "MobileInstallPrompt.tsx", "NavLink.tsx", "Navbar.tsx", 
          "OnboardingTour.tsx", "PricingSection.tsx", "ProgressRing.tsx", "ReverseImageSearch.tsx", 
          "SecurityModule.tsx", "SocialShareButtons.tsx", "ThemeToggle.tsx", "UrlAnalyzer.tsx", 
          "VoiceDetector.tsx", "MetadataAnomalyPanel.tsx", "AccessibilityMenu.tsx",
        ],
        adminComponents: [
          "AdminSearch.tsx", "ChangelogTracker.tsx", "DependencyMap.tsx", "DevOpsTools.tsx",
          "DocumentationCenter.tsx", "DocumentationExport.tsx", "FileRegistry.tsx", 
          "GovernmentToolsReference.tsx", "MarketingChannels.tsx", "MetadataAnomalyDashboard.tsx",
          "ProjectHistory.tsx", "ProjectPlanning.tsx", "QAAgent.tsx", "SampleData.tsx",
        ],
        sustainabilityComponents: [
          "CarbonAuditor.tsx", "CarbonBadgeGenerator.tsx", "DigitalWellnessHub.tsx",
          "SustainabilityAPIReference.tsx", "SustainabilityLearningHub.tsx",
        ],
        teamComponents: [
          "KanbanBoard.tsx", "SprintPlanning.tsx", "TeamAnalytics.tsx", "TeamChat.tsx",
        ],
        securityComponents: [
          "HardwareSecurityPanel.tsx",
        ],
        pages: [
          "Index.tsx", "Auth.tsx", "Admin.tsx", "AdminLogin.tsx", "Dashboard.tsx", "History.tsx",
          "Profile.tsx", "About.tsx", "Blog.tsx", "Careers.tsx", "Contact.tsx", "API.tsx",
          "Documentation.tsx", "HelpCenter.tsx", "Community.tsx", "Status.tsx", "Security.tsx",
          "PrivacyPolicy.tsx", "TermsOfService.tsx", "CookiePolicy.tsx", "GDPR.tsx", "Bookmarklet.tsx",
          "DesktopApp.tsx", "PressKit.tsx", "SharedAnalysis.tsx", "DeepfakeQuiz.tsx", 
          "Sustainability.tsx", "Team.tsx", "NotFound.tsx",
        ],
        hooks: [
          "use-confetti.ts", "use-keyboard-shortcuts.ts", "use-mobile.tsx", "use-notifications.ts",
          "use-sound-effects.ts", "use-theme-transition.tsx", "use-toast.ts",
        ],
        utils: [
          "utils.ts", "pdf-export.ts", "batch-pdf-export.ts", "forensic-analysis.ts",
          "face-detection.ts", "audio-forensics.ts", "metadata-anomaly-tracker.ts",
          "criminal-signature-tracker.ts", "hardware-security.ts", "mobile-deploy.ts",
        ],
        edgeFunctions: [
          "analyze-media", "analyze-audio", "analyze-url", "reverse-image-search",
          "create-checkout", "check-subscription", "send-contact-email", "send-analysis-report",
          "get-shared-analysis", "rare-pattern-alert", "hardware-integrity-report", "hardware-threat-alert",
        ],
      },
    };

    const blob = new Blob([JSON.stringify(fullExport, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `deepguard-docs-${new Date().toISOString().split("T")[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Documentation exported as JSON");
  };

  const exportAsMarkdown = () => {
    const md = `# DeepGuard Documentation

## Project Information
- **Name:** ${exportData.projectInfo.name}
- **Version:** ${exportData.projectInfo.version}
- **Last Updated:** ${exportData.projectInfo.lastUpdated}

## File Statistics
| Category | Count |
|----------|-------|
| Components | ${exportData.files.components} |
| Pages | ${exportData.files.pages} |
| Hooks | ${exportData.files.hooks} |
| Edge Functions | ${exportData.files.edgeFunctions} |
| UI Components | ${exportData.files.uiComponents} |
| **Total** | **${exportData.files.total}** |

## Database Schema

### Tables
${exportData.database.tables.map(t => `- \`${t}\``).join("\n")}

### Functions
${exportData.database.functions.map(f => `- \`${f}\``).join("\n")}

## Integrations
${exportData.integrations.map(i => `- ${i}`).join("\n")}

## Version History
| Version | Date | Changes |
|---------|------|---------|
${exportData.changelog.map(c => `| ${c.version} | ${c.date} | ${c.changes} |`).join("\n")}

---
*Exported on ${new Date().toLocaleString()}*
`;

    const blob = new Blob([md], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `deepguard-docs-${new Date().toISOString().split("T")[0]}.md`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Documentation exported as Markdown");
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Download className="w-4 h-4" />
          Export Docs
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onClick={exportAsJSON} className="gap-2">
          <FileJson className="w-4 h-4" />
          Export as JSON
        </DropdownMenuItem>
        <DropdownMenuItem onClick={exportAsMarkdown} className="gap-2">
          <FileText className="w-4 h-4" />
          Export as Markdown
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default DocumentationExport;
