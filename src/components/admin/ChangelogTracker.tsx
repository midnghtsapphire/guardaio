import { useState } from "react";
import { motion } from "framer-motion";
import { 
  GitCommit, GitBranch, Tag, Calendar, User, 
  ChevronDown, ChevronUp, Plus, Bug, Zap, Shield,
  Sparkles, Wrench, AlertTriangle
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface ChangelogEntry {
  version: string;
  date: string;
  type: "major" | "minor" | "patch";
  changes: {
    category: "feature" | "fix" | "security" | "performance" | "breaking" | "docs";
    description: string;
  }[];
}

const ChangelogTracker = () => {
  const [expandedVersions, setExpandedVersions] = useState<Set<string>>(new Set(["2.0.0", "1.9.0"]));
  const [filterCategory, setFilterCategory] = useState<string>("all");

  const toggleVersion = (version: string) => {
    const newExpanded = new Set(expandedVersions);
    if (newExpanded.has(version)) {
      newExpanded.delete(version);
    } else {
      newExpanded.add(version);
    }
    setExpandedVersions(newExpanded);
  };

  const changelog: ChangelogEntry[] = [
    {
      version: "2.0.0",
      date: "February 1, 2026",
      type: "major",
      changes: [
        { category: "feature", description: "Admin documentation center with file registry, tech docs, and project planning" },
        { category: "feature", description: "Project history with chronological changelog of all development" },
        { category: "feature", description: "Component dependency map visualization" },
        { category: "feature", description: "Export functionality for documentation (PDF/JSON)" },
        { category: "feature", description: "Global admin search across all sections" },
        { category: "feature", description: "Changelog tracker with version history" },
        { category: "docs", description: "Complete file registry with 100+ files documented" },
        { category: "docs", description: "Tech, developer, and user documentation" },
      ],
    },
    {
      version: "1.9.0",
      date: "February 1, 2026",
      type: "minor",
      changes: [
        { category: "feature", description: "Stripe payment integration for Pro subscriptions" },
        { category: "feature", description: "Affiliate program with referral tracking and payouts" },
        { category: "feature", description: "Batch analyzer for multi-file processing" },
        { category: "feature", description: "Voice detector with live microphone recording" },
        { category: "feature", description: "Security module with automated WCAG/XSS testing" },
        { category: "feature", description: "Compliance badges for GDPR, SOC2, ISO 27001" },
        { category: "security", description: "User roles system with admin/moderator/user permissions" },
        { category: "security", description: "RLS policies on all database tables" },
      ],
    },
    {
      version: "1.8.0",
      date: "January 28, 2026",
      type: "minor",
      changes: [
        { category: "feature", description: "URL analyzer for website content verification" },
        { category: "feature", description: "Reverse image search integration" },
        { category: "feature", description: "Email sharing for analysis reports" },
        { category: "feature", description: "PDF export for individual and batch results" },
        { category: "performance", description: "Optimized media analysis response times" },
      ],
    },
    {
      version: "1.7.0",
      date: "January 25, 2026",
      type: "minor",
      changes: [
        { category: "feature", description: "Audio analyzer with spectral waveform visualization" },
        { category: "feature", description: "Comparison view for side-by-side analysis" },
        { category: "feature", description: "Heatmap overlay for manipulation detection" },
        { category: "feature", description: "Demo samples for testing without uploads" },
        { category: "fix", description: "Fixed file upload progress indicator" },
      ],
    },
    {
      version: "1.6.0",
      date: "January 22, 2026",
      type: "minor",
      changes: [
        { category: "feature", description: "Dashboard with usage analytics and charts" },
        { category: "feature", description: "History page with filtering and search" },
        { category: "feature", description: "Profile management page" },
        { category: "feature", description: "Keyboard shortcuts (1-6, H, S, Ctrl+E, ?)" },
        { category: "docs", description: "Help center with FAQ" },
      ],
    },
    {
      version: "1.5.0",
      date: "January 18, 2026",
      type: "minor",
      changes: [
        { category: "feature", description: "Legal pages: Privacy, Terms, GDPR, Cookies" },
        { category: "feature", description: "Corporate pages: About, Blog, Careers, Press" },
        { category: "feature", description: "Contact form with email integration" },
        { category: "feature", description: "API documentation with code snippets" },
        { category: "docs", description: "Complete documentation site" },
      ],
    },
    {
      version: "1.0.0",
      date: "January 15, 2026",
      type: "major",
      changes: [
        { category: "feature", description: "Initial release with core deepfake detection" },
        { category: "feature", description: "User authentication with Supabase Auth" },
        { category: "feature", description: "Image and video analysis using Gemini AI" },
        { category: "feature", description: "Responsive landing page with hero and features" },
        { category: "feature", description: "Pricing section with tier cards" },
        { category: "security", description: "End-to-end encryption for uploads" },
        { category: "security", description: "Automatic file deletion within 24 hours" },
      ],
    },
  ];

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "feature": return <Plus className="w-3 h-3" />;
      case "fix": return <Bug className="w-3 h-3" />;
      case "security": return <Shield className="w-3 h-3" />;
      case "performance": return <Zap className="w-3 h-3" />;
      case "breaking": return <AlertTriangle className="w-3 h-3" />;
      case "docs": return <Sparkles className="w-3 h-3" />;
      default: return <Wrench className="w-3 h-3" />;
    }
  };

  const getCategoryBadge = (category: string) => {
    const styles: Record<string, string> = {
      feature: "bg-green-500/20 text-green-400",
      fix: "bg-red-500/20 text-red-400",
      security: "bg-purple-500/20 text-purple-400",
      performance: "bg-yellow-500/20 text-yellow-400",
      breaking: "bg-orange-500/20 text-orange-400",
      docs: "bg-blue-500/20 text-blue-400",
    };
    return styles[category] || "bg-muted";
  };

  const getVersionBadge = (type: string) => {
    const styles: Record<string, string> = {
      major: "bg-red-500/20 text-red-400 border-red-500/50",
      minor: "bg-green-500/20 text-green-400 border-green-500/50",
      patch: "bg-blue-500/20 text-blue-400 border-blue-500/50",
    };
    return styles[type] || "";
  };

  const filteredChangelog = changelog.map(entry => ({
    ...entry,
    changes: filterCategory === "all" 
      ? entry.changes 
      : entry.changes.filter(c => c.category === filterCategory)
  })).filter(entry => entry.changes.length > 0);

  const categories = ["all", "feature", "fix", "security", "performance", "docs"];

  return (
    <Card className="glass border-border/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <GitCommit className="w-5 h-5 text-primary" />
          Changelog Tracker
          <Badge variant="outline" className="ml-2">v2.0.0</Badge>
        </CardTitle>
        <CardDescription>
          Version history and release notes
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Filter */}
        <div className="flex gap-2 flex-wrap">
          {categories.map(cat => (
            <Button
              key={cat}
              size="sm"
              variant={filterCategory === cat ? "default" : "outline"}
              onClick={() => setFilterCategory(cat)}
              className="gap-1 capitalize"
            >
              {cat !== "all" && getCategoryIcon(cat)}
              {cat}
            </Button>
          ))}
        </div>

        <ScrollArea className="h-[450px]">
          <div className="space-y-3">
            {filteredChangelog.map((entry, index) => (
              <motion.div
                key={entry.version}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="rounded-lg border border-border/50 overflow-hidden"
              >
                <Button
                  variant="ghost"
                  className="w-full p-4 h-auto justify-between hover:bg-muted/50"
                  onClick={() => toggleVersion(entry.version)}
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/20">
                      <Tag className="w-4 h-4 text-primary" />
                    </div>
                    <div className="text-left">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold font-mono">v{entry.version}</span>
                        <Badge variant="outline" className={`text-xs ${getVersionBadge(entry.type)}`}>
                          {entry.type}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {entry.changes.length} changes
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                        <Calendar className="w-3 h-3" />
                        {entry.date}
                      </p>
                    </div>
                  </div>
                  {expandedVersions.has(entry.version) ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </Button>

                {expandedVersions.has(entry.version) && (
                  <div className="px-4 pb-4">
                    <div className="space-y-2">
                      {entry.changes.map((change, i) => (
                        <div
                          key={i}
                          className="flex items-start gap-2 p-2 rounded-lg bg-muted/30"
                        >
                          <Badge 
                            variant="outline" 
                            className={`text-xs gap-1 shrink-0 ${getCategoryBadge(change.category)}`}
                          >
                            {getCategoryIcon(change.category)}
                            {change.category}
                          </Badge>
                          <span className="text-sm text-muted-foreground">
                            {change.description}
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

export default ChangelogTracker;
