import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Search, FileCode, FileText, Zap, Settings, X, ArrowRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface SearchResult {
  title: string;
  description: string;
  category: string;
  section: string;
  keywords: string[];
}

interface AdminSearchProps {
  onNavigate?: (tab: string) => void;
}

const AdminSearch = ({ onNavigate }: AdminSearchProps) => {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const searchData: SearchResult[] = [
    // Test Suite
    { title: "Run All Tests", description: "Execute comprehensive test suite", category: "tests", section: "Test Suite", keywords: ["test", "run", "execute", "check"] },
    { title: "Component Tests", description: "Test React component functionality", category: "tests", section: "Test Suite", keywords: ["component", "react", "ui", "test"] },
    { title: "Integration Tests", description: "Test API and database integrations", category: "tests", section: "Test Suite", keywords: ["api", "database", "integration", "supabase"] },
    { title: "Security Tests", description: "XSS, CSRF, RLS policy tests", category: "tests", section: "Test Suite", keywords: ["security", "xss", "csrf", "rls", "vulnerability"] },
    { title: "Accessibility Tests", description: "WCAG compliance and keyboard navigation", category: "tests", section: "Test Suite", keywords: ["accessibility", "wcag", "a11y", "keyboard", "screen reader"] },
    
    // Security
    { title: "Security Module", description: "Automated security testing dashboard", category: "security", section: "Security", keywords: ["security", "audit", "scan", "vulnerability"] },
    { title: "WCAG Compliance", description: "Web accessibility testing", category: "security", section: "Security", keywords: ["wcag", "accessibility", "compliance"] },
    { title: "Privacy Tests", description: "GDPR and data protection checks", category: "security", section: "Security", keywords: ["privacy", "gdpr", "data", "protection"] },
    
    // Files
    { title: "File Registry", description: "Complete inventory of project files", category: "files", section: "Files", keywords: ["file", "component", "page", "registry", "inventory"] },
    { title: "Components", description: "27 feature components + 4 admin components", category: "files", section: "Files", keywords: ["component", "react", "tsx"] },
    { title: "Pages", description: "26 page components", category: "files", section: "Files", keywords: ["page", "route", "navigation"] },
    { title: "UI Components", description: "49 shadcn/ui components", category: "files", section: "Files", keywords: ["ui", "shadcn", "button", "card", "dialog"] },
    { title: "Hooks", description: "7 custom React hooks", category: "files", section: "Files", keywords: ["hook", "useState", "useEffect", "custom"] },
    { title: "Edge Functions", description: "9 serverless API functions", category: "files", section: "Files", keywords: ["edge", "function", "api", "supabase", "serverless"] },
    
    // Docs
    { title: "Tech Documentation", description: "Architecture, schema, security docs", category: "docs", section: "Docs", keywords: ["tech", "architecture", "schema", "database"] },
    { title: "Developer Docs", description: "Code examples and getting started", category: "docs", section: "Docs", keywords: ["developer", "code", "example", "tutorial"] },
    { title: "User Docs", description: "Quick start and usage guides", category: "docs", section: "Docs", keywords: ["user", "guide", "tutorial", "help"] },
    { title: "API Reference", description: "Endpoint documentation", category: "docs", section: "Docs", keywords: ["api", "endpoint", "reference", "rest"] },
    
    // Planning
    { title: "Roadmap", description: "5-phase development roadmap", category: "planning", section: "Planning", keywords: ["roadmap", "milestone", "phase", "timeline"] },
    { title: "Architecture", description: "3D layered system architecture", category: "planning", section: "Planning", keywords: ["architecture", "layer", "system", "design"] },
    { title: "Wireframes", description: "UI layout blueprints", category: "planning", section: "Planning", keywords: ["wireframe", "layout", "ui", "design"] },
    { title: "Bill of Materials", description: "Software and hardware requirements", category: "planning", section: "Planning", keywords: ["bom", "requirements", "software", "hardware"] },
    
    // History
    { title: "Project History", description: "Chronological changelog", category: "history", section: "History", keywords: ["history", "changelog", "timeline", "development"] },
    { title: "Version History", description: "Release notes and versions", category: "history", section: "History", keywords: ["version", "release", "changelog"] },
    
    // Changelog
    { title: "Changelog", description: "Version releases and updates", category: "changelog", section: "Changelog", keywords: ["changelog", "version", "release", "update"] },
    
    // Users
    { title: "User Management", description: "View and manage user accounts", category: "users", section: "Users", keywords: ["user", "account", "manage", "admin"] },
    
    // Settings
    { title: "System Settings", description: "Configure system-wide settings", category: "settings", section: "Settings", keywords: ["settings", "config", "system", "preferences"] },
    
    // Database
    { title: "Database Schema", description: "Tables: profiles, analysis_history, user_roles, affiliates, payments", category: "docs", section: "Docs", keywords: ["database", "schema", "table", "sql", "postgres"] },
    { title: "RLS Policies", description: "Row-level security configuration", category: "security", section: "Security", keywords: ["rls", "policy", "security", "access"] },
    
    // Integrations
    { title: "Stripe Integration", description: "Payment processing setup", category: "docs", section: "Docs", keywords: ["stripe", "payment", "subscription", "checkout"] },
    { title: "Supabase Integration", description: "Database and auth configuration", category: "docs", section: "Docs", keywords: ["supabase", "database", "auth", "backend"] },
    { title: "Resend Integration", description: "Email delivery setup", category: "docs", section: "Docs", keywords: ["resend", "email", "notification"] },
  ];

  const results = useMemo(() => {
    if (!query.trim()) return [];
    
    const lowerQuery = query.toLowerCase();
    return searchData.filter(item => 
      item.title.toLowerCase().includes(lowerQuery) ||
      item.description.toLowerCase().includes(lowerQuery) ||
      item.keywords.some(k => k.includes(lowerQuery))
    ).slice(0, 10);
  }, [query]);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "files": return <FileCode className="w-4 h-4" />;
      case "docs": return <FileText className="w-4 h-4" />;
      case "tests": case "security": return <Settings className="w-4 h-4" />;
      default: return <Zap className="w-4 h-4" />;
    }
  };

  const handleSelect = (result: SearchResult) => {
    setIsOpen(false);
    setQuery("");
    onNavigate?.(result.category);
  };

  return (
    <>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search admin panel... (Ctrl+K)"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            if (e.target.value) setIsOpen(true);
          }}
          onFocus={() => query && setIsOpen(true)}
          className="pl-10 pr-10"
        />
        {query && (
          <Button
            size="icon"
            variant="ghost"
            className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
            onClick={() => { setQuery(""); setIsOpen(false); }}
          >
            <X className="w-3 h-3" />
          </Button>
        )}
      </div>

      {isOpen && results.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute top-full left-0 right-0 mt-2 z-50 bg-background border border-border rounded-lg shadow-lg overflow-hidden"
        >
          <ScrollArea className="max-h-80">
            <div className="p-2 space-y-1">
              {results.map((result, i) => (
                <motion.button
                  key={i}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.03 }}
                  onClick={() => handleSelect(result)}
                  className="w-full p-3 rounded-lg hover:bg-muted/50 flex items-start gap-3 text-left transition-colors"
                >
                  <div className="p-2 rounded-lg bg-primary/10">
                    {getCategoryIcon(result.category)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{result.title}</span>
                      <Badge variant="outline" className="text-xs">
                        {result.section}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground truncate">
                      {result.description}
                    </p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-muted-foreground shrink-0" />
                </motion.button>
              ))}
            </div>
          </ScrollArea>
        </motion.div>
      )}
    </>
  );
};

export default AdminSearch;
