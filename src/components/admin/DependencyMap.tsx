import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Network, ZoomIn, ZoomOut, Maximize2, 
  Component, FileText, Zap, Settings, Database
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface DependencyNode {
  id: string;
  name: string;
  type: "component" | "page" | "hook" | "context" | "function";
  dependencies: string[];
  usedBy: string[];
}

const DependencyMap = () => {
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1);

  const nodes: DependencyNode[] = [
    // Core Layout
    { id: "App", name: "App.tsx", type: "component", dependencies: ["AuthContext", "Router", "ThemeProvider"], usedBy: [] },
    { id: "Navbar", name: "Navbar", type: "component", dependencies: ["AuthContext", "ThemeToggle", "NavLink"], usedBy: ["Index", "Dashboard", "Admin", "AllPages"] },
    { id: "Footer", name: "Footer", type: "component", dependencies: ["OnboardingTour"], usedBy: ["Index", "Dashboard", "Admin", "AllPages"] },
    
    // Auth
    { id: "AuthContext", name: "AuthContext", type: "context", dependencies: ["supabase"], usedBy: ["App", "Navbar", "Admin", "Dashboard", "Profile", "ProtectedRoutes"] },
    { id: "Auth", name: "Auth Page", type: "page", dependencies: ["AuthContext", "supabase"], usedBy: [] },
    
    // Main Features
    { id: "Index", name: "Index Page", type: "page", dependencies: ["HeroSection", "AnalyzerSection", "FeaturesSection", "PricingSection", "Navbar", "Footer"], usedBy: [] },
    { id: "HeroSection", name: "HeroSection", type: "component", dependencies: ["framer-motion"], usedBy: ["Index"] },
    { id: "AnalyzerSection", name: "AnalyzerSection", type: "component", dependencies: ["BatchAnalyzer", "UrlAnalyzer", "VoiceDetector", "AudioAnalyzer", "DemoSamples", "supabase"], usedBy: ["Index"] },
    { id: "FeaturesSection", name: "FeaturesSection", type: "component", dependencies: ["framer-motion"], usedBy: ["Index"] },
    { id: "PricingSection", name: "PricingSection", type: "component", dependencies: ["supabase", "stripe"], usedBy: ["Index"] },
    
    // Analyzers
    { id: "BatchAnalyzer", name: "BatchAnalyzer", type: "component", dependencies: ["supabase", "analyze-media"], usedBy: ["AnalyzerSection"] },
    { id: "UrlAnalyzer", name: "UrlAnalyzer", type: "component", dependencies: ["supabase", "analyze-url"], usedBy: ["AnalyzerSection"] },
    { id: "VoiceDetector", name: "VoiceDetector", type: "component", dependencies: ["supabase", "analyze-audio", "WebAudioAPI"], usedBy: ["AnalyzerSection"] },
    { id: "AudioAnalyzer", name: "AudioAnalyzer", type: "component", dependencies: ["supabase", "analyze-audio"], usedBy: ["AnalyzerSection"] },
    { id: "ComparisonView", name: "ComparisonView", type: "component", dependencies: ["HeatmapOverlay"], usedBy: ["AnalyzerSection"] },
    { id: "HeatmapOverlay", name: "HeatmapOverlay", type: "component", dependencies: ["CanvasAPI"], usedBy: ["ComparisonView", "AnalyzerSection"] },
    
    // Dashboard & History
    { id: "Dashboard", name: "Dashboard Page", type: "page", dependencies: ["AuthContext", "supabase", "recharts", "HistoryStats", "Navbar", "Footer"], usedBy: [] },
    { id: "History", name: "History Page", type: "page", dependencies: ["AuthContext", "supabase", "Navbar", "Footer"], usedBy: [] },
    { id: "HistoryStats", name: "HistoryStats", type: "component", dependencies: ["supabase"], usedBy: ["Dashboard"] },
    
    // Admin
    { id: "Admin", name: "Admin Page", type: "page", dependencies: ["AuthContext", "SecurityModule", "FileRegistry", "DocumentationCenter", "ProjectPlanning", "ProjectHistory", "ChangelogTracker"], usedBy: [] },
    { id: "SecurityModule", name: "SecurityModule", type: "component", dependencies: [], usedBy: ["Admin"] },
    { id: "FileRegistry", name: "FileRegistry", type: "component", dependencies: [], usedBy: ["Admin"] },
    { id: "DocumentationCenter", name: "DocumentationCenter", type: "component", dependencies: [], usedBy: ["Admin"] },
    { id: "ProjectPlanning", name: "ProjectPlanning", type: "component", dependencies: [], usedBy: ["Admin"] },
    { id: "ProjectHistory", name: "ProjectHistory", type: "component", dependencies: [], usedBy: ["Admin"] },
    { id: "ChangelogTracker", name: "ChangelogTracker", type: "component", dependencies: [], usedBy: ["Admin"] },
    
    // Hooks
    { id: "useKeyboardShortcuts", name: "use-keyboard-shortcuts", type: "hook", dependencies: [], usedBy: ["Index", "Dashboard", "History"] },
    { id: "useConfetti", name: "use-confetti", type: "hook", dependencies: ["canvas-confetti"], usedBy: ["AnalyzerSection"] },
    { id: "useSoundEffects", name: "use-sound-effects", type: "hook", dependencies: ["WebAudioAPI"], usedBy: ["AnalyzerSection", "VoiceDetector"] },
    { id: "useThemeTransition", name: "use-theme-transition", type: "hook", dependencies: [], usedBy: ["ThemeToggle"] },
    
    // Edge Functions
    { id: "analyze-media", name: "analyze-media", type: "function", dependencies: ["GeminiAI"], usedBy: ["AnalyzerSection", "BatchAnalyzer"] },
    { id: "analyze-audio", name: "analyze-audio", type: "function", dependencies: ["GeminiAI"], usedBy: ["AudioAnalyzer", "VoiceDetector"] },
    { id: "analyze-url", name: "analyze-url", type: "function", dependencies: ["Firecrawl"], usedBy: ["UrlAnalyzer"] },
    { id: "create-checkout", name: "create-checkout", type: "function", dependencies: ["Stripe"], usedBy: ["PricingSection"] },
    { id: "send-contact-email", name: "send-contact-email", type: "function", dependencies: ["Resend"], usedBy: ["Contact"] },
  ];

  const getNodeColor = (type: string) => {
    switch (type) {
      case "component": return "bg-blue-500/20 border-blue-500/50 text-blue-400";
      case "page": return "bg-green-500/20 border-green-500/50 text-green-400";
      case "hook": return "bg-yellow-500/20 border-yellow-500/50 text-yellow-400";
      case "context": return "bg-purple-500/20 border-purple-500/50 text-purple-400";
      case "function": return "bg-orange-500/20 border-orange-500/50 text-orange-400";
      default: return "bg-muted";
    }
  };

  const getNodeIcon = (type: string) => {
    switch (type) {
      case "component": return <Component className="w-4 h-4" />;
      case "page": return <FileText className="w-4 h-4" />;
      case "hook": return <Zap className="w-4 h-4" />;
      case "context": return <Database className="w-4 h-4" />;
      case "function": return <Settings className="w-4 h-4" />;
      default: return <Component className="w-4 h-4" />;
    }
  };

  const selectedNodeData = nodes.find(n => n.id === selectedNode);

  const groupedNodes = {
    pages: nodes.filter(n => n.type === "page"),
    components: nodes.filter(n => n.type === "component"),
    hooks: nodes.filter(n => n.type === "hook"),
    contexts: nodes.filter(n => n.type === "context"),
    functions: nodes.filter(n => n.type === "function"),
  };

  return (
    <Card className="glass border-border/50">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Network className="w-5 h-5 text-primary" />
              Component Dependency Map
            </CardTitle>
            <CardDescription>
              Visual representation of component relationships
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Button size="icon" variant="outline" onClick={() => setZoom(z => Math.max(0.5, z - 0.1))}>
              <ZoomOut className="w-4 h-4" />
            </Button>
            <Button size="icon" variant="outline" onClick={() => setZoom(z => Math.min(1.5, z + 0.1))}>
              <ZoomIn className="w-4 h-4" />
            </Button>
            <Button size="icon" variant="outline" onClick={() => setZoom(1)}>
              <Maximize2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-4">
          {/* Node List */}
          <div className="col-span-2">
            <Tabs defaultValue="all" className="space-y-4">
              <TabsList>
                <TabsTrigger value="all">All ({nodes.length})</TabsTrigger>
                <TabsTrigger value="pages">Pages ({groupedNodes.pages.length})</TabsTrigger>
                <TabsTrigger value="components">Components ({groupedNodes.components.length})</TabsTrigger>
                <TabsTrigger value="functions">Functions ({groupedNodes.functions.length})</TabsTrigger>
              </TabsList>

              <ScrollArea className="h-[400px]">
                <TabsContent value="all" className="mt-0">
                  <div 
                    className="grid grid-cols-3 gap-2"
                    style={{ transform: `scale(${zoom})`, transformOrigin: "top left" }}
                  >
                    {nodes.map((node, i) => (
                      <motion.button
                        key={node.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.02 }}
                        onClick={() => setSelectedNode(node.id)}
                        className={`p-3 rounded-lg border-2 text-left transition-all ${getNodeColor(node.type)} ${
                          selectedNode === node.id ? "ring-2 ring-primary" : ""
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          {getNodeIcon(node.type)}
                          <span className="font-medium text-sm truncate">{node.name}</span>
                        </div>
                        <div className="flex gap-1 flex-wrap">
                          <Badge variant="outline" className="text-xs">
                            {node.dependencies.length} deps
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {node.usedBy.length} refs
                          </Badge>
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </TabsContent>

                {Object.entries(groupedNodes).map(([key, group]) => (
                  <TabsContent key={key} value={key} className="mt-0">
                    <div className="grid grid-cols-3 gap-2">
                      {group.map((node, i) => (
                        <motion.button
                          key={node.id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: i * 0.03 }}
                          onClick={() => setSelectedNode(node.id)}
                          className={`p-3 rounded-lg border-2 text-left transition-all ${getNodeColor(node.type)} ${
                            selectedNode === node.id ? "ring-2 ring-primary" : ""
                          }`}
                        >
                          <div className="flex items-center gap-2 mb-1">
                            {getNodeIcon(node.type)}
                            <span className="font-medium text-sm">{node.name}</span>
                          </div>
                          <div className="flex gap-1">
                            <Badge variant="outline" className="text-xs">
                              {node.dependencies.length} deps
                            </Badge>
                          </div>
                        </motion.button>
                      ))}
                    </div>
                  </TabsContent>
                ))}
              </ScrollArea>
            </Tabs>
          </div>

          {/* Details Panel */}
          <div className="border-l border-border pl-4">
            <h4 className="font-semibold mb-3">
              {selectedNodeData ? selectedNodeData.name : "Select a node"}
            </h4>
            
            {selectedNodeData ? (
              <div className="space-y-4">
                <div>
                  <Badge className={getNodeColor(selectedNodeData.type)}>
                    {selectedNodeData.type}
                  </Badge>
                </div>

                <div>
                  <p className="text-xs text-muted-foreground mb-2">Dependencies ({selectedNodeData.dependencies.length})</p>
                  <div className="space-y-1">
                    {selectedNodeData.dependencies.length > 0 ? (
                      selectedNodeData.dependencies.map(dep => (
                        <button
                          key={dep}
                          onClick={() => setSelectedNode(dep)}
                          className="block text-sm text-primary hover:underline"
                        >
                          → {dep}
                        </button>
                      ))
                    ) : (
                      <p className="text-xs text-muted-foreground">No dependencies</p>
                    )}
                  </div>
                </div>

                <div>
                  <p className="text-xs text-muted-foreground mb-2">Used By ({selectedNodeData.usedBy.length})</p>
                  <div className="space-y-1">
                    {selectedNodeData.usedBy.length > 0 ? (
                      selectedNodeData.usedBy.map(ref => (
                        <button
                          key={ref}
                          onClick={() => setSelectedNode(ref)}
                          className="block text-sm text-primary hover:underline"
                        >
                          ← {ref}
                        </button>
                      ))
                    ) : (
                      <p className="text-xs text-muted-foreground">Not referenced</p>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                Click on a node to see its dependencies and references
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DependencyMap;
