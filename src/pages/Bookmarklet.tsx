import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { Bookmark, GripVertical, MousePointer, Image, CheckCircle, Copy, ExternalLink, Chrome, Download, Smartphone, Activity, ClipboardCheck, Save, RotateCcw, ChevronDown, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import guardaioHeroLogo from "@/assets/guardaio-hero-logo.jpg";

interface ChecklistItem {
  id: string;
  label: string;
  description?: string;
}

interface ChecklistCategory {
  id: string;
  title: string;
  icon: string;
  items: ChecklistItem[];
}

const testingCategories: ChecklistCategory[] = [
  {
    id: "core-pages",
    title: "Core Pages",
    icon: "🏠",
    items: [
      { id: "home", label: "Homepage loads correctly", description: "Verify hero, features, and CTA sections" },
      { id: "about", label: "About page", description: "Team info and mission statement" },
      { id: "contact", label: "Contact form works", description: "Form validation and submission" },
      { id: "blog", label: "Blog page", description: "Articles display correctly" },
      { id: "careers", label: "Careers page", description: "Job listings render" },
      { id: "press", label: "Press Kit page", description: "Media assets available" },
    ]
  },
  {
    id: "analysis-features",
    title: "Analysis Features",
    icon: "🔍",
    items: [
      { id: "single-upload", label: "Single file upload", description: "Upload and analyze one image" },
      { id: "batch-upload", label: "Batch analysis", description: "Multiple files at once" },
      { id: "url-analyzer", label: "URL analyzer", description: "Analyze image from URL" },
      { id: "reverse-search", label: "Reverse image search", description: "Find image origins" },
      { id: "audio-analysis", label: "Audio/voice analysis", description: "Deepfake voice detection" },
      { id: "comparison-view", label: "Side-by-side comparison", description: "Compare two images" },
      { id: "heatmap-overlay", label: "Heatmap visualization", description: "Shows manipulation areas" },
    ]
  },
  {
    id: "forensics",
    title: "Forensic Tools",
    icon: "🔬",
    items: [
      { id: "ela-analysis", label: "ELA analysis", description: "Error Level Analysis" },
      { id: "noise-analysis", label: "Noise pattern detection", description: "Detect inconsistencies" },
      { id: "metadata-extraction", label: "Metadata extraction", description: "EXIF data parsing" },
      { id: "face-detection", label: "Face detection", description: "Facial landmark analysis" },
      { id: "spectral-analysis", label: "Spectral analysis", description: "Audio frequency patterns" },
    ]
  },
  {
    id: "security",
    title: "Security & Bot Protection",
    icon: "🛡️",
    items: [
      { id: "crowdsec", label: "CrowdSec IP blocking", description: "Collaborative threat intelligence" },
      { id: "bunkerweb", label: "BunkerWeb WAF rules", description: "XSS, SQLi, bot detection" },
      { id: "altcha-pow", label: "ALTCHA Proof-of-Work", description: "SHA-256 challenges" },
      { id: "botd-fingerprint", label: "BotD fingerprinting", description: "Selenium/Puppeteer detection" },
      { id: "rate-limiting", label: "Rate limiting", description: "60 req/min leaky bucket" },
      { id: "honeypots", label: "Honeypot endpoints", description: "Hidden trap endpoints" },
    ]
  },
  {
    id: "authentication",
    title: "Authentication & User",
    icon: "👤",
    items: [
      { id: "login", label: "User login", description: "Email/password auth" },
      { id: "signup", label: "User registration", description: "Create new account" },
      { id: "profile", label: "Profile page", description: "User settings and info" },
      { id: "history", label: "Analysis history", description: "Past analyses saved" },
      { id: "dashboard", label: "Dashboard", description: "User analytics" },
    ]
  },
  {
    id: "admin",
    title: "Admin Panel",
    icon: "⚙️",
    items: [
      { id: "admin-login", label: "Admin login", description: "Secure admin access" },
      { id: "admin-dashboard", label: "Admin dashboard", description: "Overview stats" },
      { id: "file-registry", label: "File registry", description: "170+ file inventory" },
      { id: "project-checklist", label: "Project checklist", description: "200+ item tracker" },
      { id: "documentation", label: "Documentation center", description: "Technical docs" },
      { id: "qa-agent", label: "QA Agent", description: "25+ test scenarios" },
      { id: "bot-protection-panel", label: "Bot protection panel", description: "Security monitoring" },
    ]
  },
  {
    id: "legal",
    title: "Legal & Compliance",
    icon: "📜",
    items: [
      { id: "privacy-policy", label: "Privacy Policy", description: "GDPR compliant" },
      { id: "terms", label: "Terms of Service", description: "Legal terms" },
      { id: "cookies", label: "Cookie Policy", description: "Cookie usage info" },
      { id: "gdpr", label: "GDPR page", description: "Data rights info" },
    ]
  },
  {
    id: "integrations",
    title: "Integrations & API",
    icon: "🔗",
    items: [
      { id: "api-docs", label: "API documentation", description: "Endpoint reference" },
      { id: "bookmarklet", label: "Bookmarklet works", description: "Browser integration" },
      { id: "share-analysis", label: "Share analysis", description: "Shareable links" },
      { id: "pdf-export", label: "PDF export", description: "Report generation" },
      { id: "email-share", label: "Email sharing", description: "Send reports" },
    ]
  },
  {
    id: "ui-ux",
    title: "UI/UX & Accessibility",
    icon: "🎨",
    items: [
      { id: "dark-mode", label: "Dark mode", description: "Theme toggle works" },
      { id: "light-mode", label: "Light mode", description: "Theme toggle works" },
      { id: "responsive-mobile", label: "Mobile responsive", description: "Works on phones" },
      { id: "responsive-tablet", label: "Tablet responsive", description: "Works on tablets" },
      { id: "keyboard-nav", label: "Keyboard navigation", description: "Accessibility" },
      { id: "screen-reader", label: "Screen reader support", description: "ARIA labels" },
    ]
  },
  {
    id: "sustainability",
    title: "Sustainability & Green",
    icon: "🌱",
    items: [
      { id: "carbon-auditor", label: "Carbon auditor", description: "Energy tracking" },
      { id: "carbon-badge", label: "Carbon badge generator", description: "Sustainability badges" },
      { id: "wellness-hub", label: "Digital wellness hub", description: "Well-being features" },
      { id: "prism-compliance", label: "PRiSM compliance", description: "Green PM standards" },
    ]
  },
  {
    id: "methodology",
    title: "RUP/XP/Lean/Scrum",
    icon: "📊",
    items: [
      { id: "kanban-board", label: "Kanban board", description: "Task management with WIP limits" },
      { id: "sprint-planning", label: "Sprint planning", description: "Scrum ceremonies" },
      { id: "team-analytics", label: "Team analytics", description: "Velocity tracking" },
      { id: "team-chat", label: "Team chat", description: "Real-time collaboration" },
    ]
  },
];

const STORAGE_KEY = "guardaio-testing-checklist";

const Bookmarklet = () => {
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});
  const [openCategories, setOpenCategories] = useState<Record<string, boolean>>({});

  // Load saved state from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setCheckedItems(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to load checklist state:", e);
      }
    }
    // Open all categories by default
    const allOpen: Record<string, boolean> = {};
    testingCategories.forEach(cat => { allOpen[cat.id] = true; });
    setOpenCategories(allOpen);
  }, []);

  // Save state to localStorage when it changes
  useEffect(() => {
    if (Object.keys(checkedItems).length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(checkedItems));
    }
  }, [checkedItems]);

  const toggleItem = (itemId: string) => {
    setCheckedItems(prev => ({ ...prev, [itemId]: !prev[itemId] }));
  };

  const toggleCategory = (categoryId: string) => {
    setOpenCategories(prev => ({ ...prev, [categoryId]: !prev[categoryId] }));
  };

  const resetChecklist = () => {
    setCheckedItems({});
    localStorage.removeItem(STORAGE_KEY);
    toast({ title: "Checklist Reset", description: "All items have been unchecked" });
  };

  const getProgress = () => {
    const totalItems = testingCategories.reduce((acc, cat) => acc + cat.items.length, 0);
    const checkedCount = Object.values(checkedItems).filter(Boolean).length;
    return { total: totalItems, checked: checkedCount, percentage: Math.round((checkedCount / totalItems) * 100) };
  };

  const getCategoryProgress = (categoryId: string) => {
    const category = testingCategories.find(c => c.id === categoryId);
    if (!category) return { checked: 0, total: 0 };
    const checked = category.items.filter(item => checkedItems[item.id]).length;
    return { checked, total: category.items.length };
  };

  // Get the base URL for the app
  const baseUrl = window.location.origin;

  // Bookmarklet code
  const bookmarkletCode = `javascript:(function(){
    var imgs=document.querySelectorAll('img');
    if(imgs.length===0){alert('No images found on this page.');return;}
    var overlay=document.createElement('div');
    overlay.id='guardaio-overlay';
    overlay.style.cssText='position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.8);z-index:999999;display:flex;flex-direction:column;align-items:center;justify-content:center;font-family:system-ui,-apple-system,sans-serif;';
    overlay.innerHTML='<div style="color:white;font-size:24px;margin-bottom:20px;font-weight:bold;">🛡️ Guardaio</div><div style="color:white;font-size:16px;margin-bottom:20px;">Click on any image to analyze it for AI manipulation</div><div style="color:rgba(255,255,255,0.6);font-size:14px;">Press ESC to cancel</div>';
    document.body.appendChild(overlay);
    var style=document.createElement('style');
    style.textContent='#guardaio-overlay img{cursor:crosshair !important;outline:3px solid #22c55e !important;transition:outline 0.2s;}#guardaio-overlay img:hover{outline:3px solid #3b82f6 !important;}';
    document.head.appendChild(style);
    imgs.forEach(function(img){img.style.position='relative';img.style.zIndex='1000000';img.style.cursor='crosshair';});
    function cleanup(){overlay.remove();style.remove();imgs.forEach(function(img){img.style.position='';img.style.zIndex='';img.style.cursor='';});}
    overlay.onclick=function(e){if(e.target===overlay)cleanup();};
    document.onkeydown=function(e){if(e.key==='Escape')cleanup();};
    imgs.forEach(function(img){
      img.onclick=function(e){
        e.preventDefault();
        e.stopPropagation();
        var src=img.src;
        cleanup();
        window.open('${baseUrl}/?analyze='+encodeURIComponent(src),'_blank','width=800,height=700');
      };
    });
  })();`;

  const handleCopy = () => {
    navigator.clipboard.writeText(bookmarkletCode);
    setCopied(true);
    toast({
      title: "Copied!",
      description: "Bookmarklet code copied to clipboard",
    });
    setTimeout(() => setCopied(false), 2000);
  };

  const progress = getProgress();

  return (
    <>
      <Helmet>
        <title>Guardaio Testing Checklist - Test All Features</title>
        <meta
          name="description"
          content="Interactive testing checklist for Guardaio. Check off features as you test them to ensure everything works correctly."
        />
      </Helmet>

      <Navbar />

      <main className="min-h-screen pt-24 pb-20 relative overflow-hidden">
        {/* Security Bars Background Effect */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {/* Vertical bars - prison/security vibe */}
          <div className="absolute inset-0 opacity-[0.03]">
            {[...Array(20)].map((_, i) => (
              <div 
                key={i}
                className="absolute top-0 bottom-0 w-1 bg-foreground"
                style={{ left: `${(i + 1) * 5}%` }}
              />
            ))}
          </div>
          {/* Gradient overlay for depth */}
          <div className="absolute inset-0 bg-gradient-to-b from-background via-transparent to-background" />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-transparent to-background" />
        </div>

        <div className="container mx-auto px-6 relative z-10">
          {/* Hero Logo Section */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="flex justify-center mb-8"
          >
            <div className="relative">
              {/* Glow effect behind logo */}
              <div className="absolute inset-0 blur-3xl opacity-30 bg-primary rounded-full scale-75" />
              <img 
                src={guardaioHeroLogo} 
                alt="Guardaio - Deepfake Analyzer" 
                className="relative w-80 md:w-[500px] lg:w-[600px] h-auto rounded-2xl shadow-2xl border border-border/20"
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-center max-w-3xl mx-auto mb-12"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
              <ClipboardCheck className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium">Interactive Testing Checklist</span>
            </div>

            <h1 className="font-display text-4xl md:text-5xl font-bold mb-6">
              Test <span className="text-gradient">Everything</span>
            </h1>

            <p className="text-lg text-muted-foreground mb-8">
              Check off each feature as you test it. Progress is saved automatically.
            </p>

            {/* Progress Bar */}
            <div className="max-w-md mx-auto">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">{progress.checked} / {progress.total} completed</span>
                <span className="text-sm font-bold text-primary">{progress.percentage}%</span>
              </div>
              <div className="h-3 bg-muted rounded-full overflow-hidden">
                <motion.div 
                  className="h-full gradient-primary"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress.percentage}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            </div>

            <div className="flex justify-center gap-3 mt-6">
              <Button variant="outline" size="sm" onClick={resetChecklist} className="gap-2">
                <RotateCcw className="w-4 h-4" />
                Reset All
              </Button>
            </div>
          </motion.div>

          {/* Testing Checklist */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="max-w-4xl mx-auto space-y-4"
          >
            {testingCategories.map((category, catIndex) => {
              const catProgress = getCategoryProgress(category.id);
              const isComplete = catProgress.checked === catProgress.total;
              
              return (
                <Collapsible 
                  key={category.id} 
                  open={openCategories[category.id]} 
                  onOpenChange={() => toggleCategory(category.id)}
                >
                  <Card className={`overflow-hidden transition-all ${isComplete ? 'border-green-500/50 bg-green-500/5' : 'border-border/50'}`}>
                    <CollapsibleTrigger className="w-full">
                      <div className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors cursor-pointer">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{category.icon}</span>
                          <div className="text-left">
                            <h3 className="font-semibold flex items-center gap-2">
                              {category.title}
                              {isComplete && <CheckCircle className="w-4 h-4 text-green-500" />}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              {catProgress.checked} / {catProgress.total} items
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Badge variant={isComplete ? "default" : "secondary"}>
                            {Math.round((catProgress.checked / catProgress.total) * 100)}%
                          </Badge>
                          {openCategories[category.id] ? (
                            <ChevronDown className="w-5 h-5 text-muted-foreground" />
                          ) : (
                            <ChevronRight className="w-5 h-5 text-muted-foreground" />
                          )}
                        </div>
                      </div>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <div className="px-4 pb-4 space-y-2">
                        {category.items.map((item) => (
                          <div 
                            key={item.id}
                            className={`flex items-start gap-3 p-3 rounded-lg border transition-all cursor-pointer hover:bg-muted/50 ${
                              checkedItems[item.id] 
                                ? 'bg-green-500/10 border-green-500/30' 
                                : 'bg-card/50 border-border/50'
                            }`}
                            onClick={() => toggleItem(item.id)}
                          >
                            <Checkbox 
                              id={item.id}
                              checked={checkedItems[item.id] || false}
                              onCheckedChange={() => toggleItem(item.id)}
                              className="mt-0.5"
                            />
                            <div className="flex-1">
                              <label 
                                htmlFor={item.id}
                                className={`font-medium cursor-pointer ${checkedItems[item.id] ? 'line-through text-muted-foreground' : ''}`}
                              >
                                {item.label}
                              </label>
                              {item.description && (
                                <p className="text-sm text-muted-foreground">{item.description}</p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </CollapsibleContent>
                  </Card>
                </Collapsible>
              );
            })}
          </motion.div>

          {/* Bookmarklet Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="max-w-4xl mx-auto mt-16"
          >
            <h2 className="font-display text-2xl font-bold text-center mb-8 flex items-center justify-center gap-2">
              <Bookmark className="w-6 h-6 text-primary" />
              Browser Bookmarklet
            </h2>

            <Card className="p-8 bg-card/50 backdrop-blur border-primary/20">
              <p className="text-muted-foreground mb-4 text-center">
                Drag this button to your bookmarks bar:
              </p>

              <div className="flex justify-center">
                <a
                  href={bookmarkletCode}
                  onClick={(e) => e.preventDefault()}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl gradient-primary text-primary-foreground font-semibold shadow-glow hover:shadow-glow-lg transition-all cursor-grab active:cursor-grabbing"
                  draggable="true"
                >
                  <Bookmark className="w-5 h-5" />
                  🛡️ Guardaio Analyzer
                </a>
              </div>

              <p className="text-xs text-muted-foreground mt-4 text-center">
                Can't drag? Right-click and "Bookmark This Link"
              </p>

              <div className="flex justify-center mt-4">
                <Button variant="outline" onClick={handleCopy} className="gap-2">
                  {copied ? (
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                  {copied ? "Copied!" : "Copy Code"}
                </Button>
              </div>
            </Card>
          </motion.div>
        </div>
      </main>

      <Footer />
    </>
  );
};

export default Bookmarklet;
