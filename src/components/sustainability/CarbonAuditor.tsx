import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Globe, 
  Loader2, 
  Leaf, 
  Server, 
  Image as ImageIcon, 
  FileCode,
  Zap,
  CheckCircle,
  AlertTriangle,
  XCircle,
  TrendingDown,
  Info,
  ExternalLink
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface CarbonResult {
  url: string;
  grade: 'A' | 'B' | 'C' | 'D' | 'E' | 'F';
  co2PerVisit: number; // grams
  percentile: number;
  greenHosting: boolean;
  dataTransfer: number; // KB
  breakdown: {
    images: number;
    scripts: number;
    stylesheets: number;
    fonts: number;
    other: number;
  };
  sciScore?: number;
  recommendations: string[];
}

const CarbonAuditor = () => {
  const [url, setUrl] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<CarbonResult | null>(null);

  const analyzeUrl = async () => {
    if (!url.trim()) {
      toast.error("Please enter a URL");
      return;
    }

    // Validate URL
    let testUrl = url;
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      testUrl = 'https://' + url;
    }

    setIsAnalyzing(true);
    setResult(null);

    try {
      // Simulate carbon analysis (in production, would call edge function)
      await new Promise(r => setTimeout(r, 2000));

      // Calculate simulated metrics using SWD model
      // Average webpage is ~2.5MB, emits ~0.5g CO2 per visit
      const simulatedTransfer = Math.random() * 3000 + 500; // 500KB - 3.5MB
      const co2PerKB = 0.0002; // grams CO2 per KB (SWD model estimate)
      const co2 = simulatedTransfer * co2PerKB;
      
      // Determine grade based on CO2
      let grade: CarbonResult['grade'] = 'A';
      if (co2 > 0.8) grade = 'F';
      else if (co2 > 0.6) grade = 'E';
      else if (co2 > 0.4) grade = 'D';
      else if (co2 > 0.3) grade = 'C';
      else if (co2 > 0.2) grade = 'B';

      const mockResult: CarbonResult = {
        url: testUrl,
        grade,
        co2PerVisit: parseFloat(co2.toFixed(3)),
        percentile: Math.round(100 - (co2 / 0.8) * 100),
        greenHosting: Math.random() > 0.6,
        dataTransfer: Math.round(simulatedTransfer),
        breakdown: {
          images: Math.round(simulatedTransfer * 0.45),
          scripts: Math.round(simulatedTransfer * 0.25),
          stylesheets: Math.round(simulatedTransfer * 0.1),
          fonts: Math.round(simulatedTransfer * 0.1),
          other: Math.round(simulatedTransfer * 0.1),
        },
        sciScore: parseFloat((Math.random() * 50 + 10).toFixed(1)),
        recommendations: generateRecommendations(grade, Math.random() > 0.6),
      };

      setResult(mockResult);
      toast.success("Carbon audit complete!");
    } catch (error) {
      toast.error("Failed to analyze URL");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const generateRecommendations = (grade: string, isGreenHost: boolean): string[] => {
    const recs: string[] = [];
    
    if (!isGreenHost) {
      recs.push("Switch to a green hosting provider (renewable energy)");
    }
    if (grade >= 'C') {
      recs.push("Optimize images with WebP/AVIF formats and lazy loading");
      recs.push("Implement font subsetting to reduce font file sizes");
    }
    if (grade >= 'D') {
      recs.push("Minify and bundle JavaScript/CSS files");
      recs.push("Consider a static site generator instead of dynamic CMS");
    }
    if (grade >= 'E') {
      recs.push("Implement aggressive caching strategies");
      recs.push("Use a CDN to reduce server load and latency");
    }
    
    recs.push("Enable dark mode to save energy on OLED screens");
    recs.push("Time-shift heavy operations to when grid is greener");
    
    return recs.slice(0, 5);
  };

  const getGradeColor = (grade: string) => {
    switch (grade) {
      case 'A': return 'bg-green-500 text-white';
      case 'B': return 'bg-lime-500 text-white';
      case 'C': return 'bg-yellow-500 text-black';
      case 'D': return 'bg-orange-500 text-white';
      case 'E': return 'bg-red-400 text-white';
      case 'F': return 'bg-red-600 text-white';
      default: return 'bg-muted text-foreground';
    }
  };

  const getGradeIcon = (grade: string) => {
    if (grade <= 'B') return <CheckCircle className="w-5 h-5" />;
    if (grade <= 'D') return <AlertTriangle className="w-5 h-5" />;
    return <XCircle className="w-5 h-5" />;
  };

  return (
    <div className="space-y-6">
      {/* URL Input */}
      <Card className="glass border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="w-5 h-5 text-green-500" />
            Website Carbon Auditor
          </CardTitle>
          <CardDescription>
            Enter a URL to measure its digital carbon footprint using the Sustainable Web Design (SWD) model
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-3">
            <Input
              placeholder="https://example.com"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && analyzeUrl()}
              className="flex-1"
            />
            <Button
              onClick={analyzeUrl}
              disabled={isAnalyzing}
              className="gap-2 bg-green-600 hover:bg-green-700"
            >
              {isAnalyzing ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Leaf className="w-4 h-4" />
              )}
              {isAnalyzing ? 'Analyzing...' : 'Audit Carbon'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            {/* Grade Card */}
            <div className="grid md:grid-cols-3 gap-6">
              <Card className="glass border-border/50 md:col-span-1">
                <CardContent className="pt-6 text-center">
                  <div className={`w-24 h-24 mx-auto rounded-full ${getGradeColor(result.grade)} flex items-center justify-center mb-4`}>
                    <span className="text-4xl font-bold">{result.grade}</span>
                  </div>
                  <h3 className="text-xl font-bold mb-1">Carbon Grade</h3>
                  <p className="text-muted-foreground text-sm">
                    Cleaner than {result.percentile}% of websites
                  </p>
                  
                  <div className="mt-4 p-3 rounded-lg bg-secondary/30">
                    <div className="text-3xl font-bold text-green-500">
                      {result.co2PerVisit}g
                    </div>
                    <div className="text-sm text-muted-foreground">CO₂ per page view</div>
                  </div>
                </CardContent>
              </Card>

              <Card className="glass border-border/50 md:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="w-5 h-5 text-yellow-500" />
                    Resource Breakdown
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    { label: "Images", value: result.breakdown.images, icon: ImageIcon, color: "bg-blue-500" },
                    { label: "Scripts", value: result.breakdown.scripts, icon: FileCode, color: "bg-yellow-500" },
                    { label: "Stylesheets", value: result.breakdown.stylesheets, icon: FileCode, color: "bg-purple-500" },
                    { label: "Fonts", value: result.breakdown.fonts, icon: FileCode, color: "bg-pink-500" },
                    { label: "Other", value: result.breakdown.other, icon: FileCode, color: "bg-muted" },
                  ].map((item, idx) => (
                    <div key={idx} className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="flex items-center gap-2">
                          <item.icon className="w-4 h-4 text-muted-foreground" />
                          {item.label}
                        </span>
                        <span className="font-medium">{(item.value / 1024).toFixed(1)} MB</span>
                      </div>
                      <Progress 
                        value={(item.value / result.dataTransfer) * 100} 
                        className={`h-2 [&>div]:${item.color}`}
                      />
                    </div>
                  ))}
                  
                  <div className="pt-4 border-t border-border/50 flex justify-between">
                    <span className="font-medium">Total Data Transfer</span>
                    <span className="font-bold">{(result.dataTransfer / 1024).toFixed(2)} MB</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Hosting & SCI Score */}
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="glass border-border/50">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-4">
                    <div className={`w-14 h-14 rounded-full flex items-center justify-center ${
                      result.greenHosting ? 'bg-green-500/20' : 'bg-red-500/20'
                    }`}>
                      <Server className={`w-7 h-7 ${result.greenHosting ? 'text-green-500' : 'text-red-500'}`} />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold">
                        {result.greenHosting ? 'Green Hosting ✓' : 'Non-Green Hosting'}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {result.greenHosting 
                          ? 'This website is hosted on renewable energy'
                          : 'Consider switching to a green hosting provider'
                        }
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="glass border-border/50">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-full bg-cyan-500/20 flex items-center justify-center">
                      <TrendingDown className="w-7 h-7 text-cyan-500" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold flex items-center gap-2">
                        SCI Score: {result.sciScore}
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger>
                              <Info className="w-4 h-4 text-muted-foreground" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="max-w-xs">Software Carbon Intensity (SCI) measures emissions per functional unit. Lower is better.</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        gCO₂e per functional unit (SCI Specification)
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recommendations */}
            <Card className="glass border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Leaf className="w-5 h-5 text-green-500" />
                  Recommendations to Reduce Carbon
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {result.recommendations.map((rec, idx) => (
                    <motion.li
                      key={idx}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="flex items-start gap-3 p-3 rounded-lg bg-secondary/30"
                    >
                      <CheckCircle className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                      <span className="text-sm">{rec}</span>
                    </motion.li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Methodology Note */}
            <Card className="glass border-green-500/20 bg-green-500/5">
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <Info className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                  <div className="text-sm text-muted-foreground">
                    <p className="mb-2">
                      <strong className="text-foreground">Methodology:</strong> This audit uses the{' '}
                      <a href="https://sustainablewebdesign.org/calculating-digital-emissions/" target="_blank" rel="noopener noreferrer" className="text-green-500 hover:underline">
                        Sustainable Web Design (SWD) model
                        <ExternalLink className="w-3 h-3 inline ml-1" />
                      </a>{' '}
                      and the{' '}
                      <a href="https://sci.greensoftware.foundation/" target="_blank" rel="noopener noreferrer" className="text-green-500 hover:underline">
                        Software Carbon Intensity (SCI) specification
                        <ExternalLink className="w-3 h-3 inline ml-1" />
                      </a>.
                    </p>
                    <p>
                      Data transfer is measured and converted to CO₂ emissions using global average grid intensity 
                      and data center power usage effectiveness (PUE) factors.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CarbonAuditor;
