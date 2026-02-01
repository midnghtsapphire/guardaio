import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, Search, Telescope, Youtube, CheckCircle2, AlertTriangle, XCircle, Loader2, Shield, Sparkles, Zap, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/integrations/supabase/client";

type UrlAnalysisResult = {
  status: "safe" | "warning" | "danger";
  confidence: number;
  findings: string[];
  platform?: string;
  contentType?: string;
  riskFactors?: string[];
  recommendation?: string;
  sourceUrl?: string;
  screenshot?: string;
  analysisType?: string;
};

type AnalysisStage = {
  name: string;
  icon: typeof Shield;
  description: string;
};

const urlAnalysisStages: AnalysisStage[] = [
  { name: "Fetching", icon: Link, description: "Capturing page content" },
  { name: "Scanning", icon: Shield, description: "Analyzing visual elements" },
  { name: "AI Analysis", icon: Sparkles, description: "Deep learning detection" },
  { name: "Finalizing", icon: Zap, description: "Generating report" },
];

const platformIcons: Record<string, typeof Youtube> = {
  youtube: Youtube,
  facebook: Link,
  instagram: Link,
  tiktok: Link,
  twitter: Link,
};

import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

const UrlAnalyzer = () => {
  const { user } = useAuth();
  const [urlInput, setUrlInput] = useState("");
  const [urlAnalysisType, setUrlAnalysisType] = useState<"quick" | "deep">("quick");
  const [urlResult, setUrlResult] = useState<UrlAnalysisResult | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentStage, setCurrentStage] = useState(0);

  const getStatusConfig = (status: string) => {
    switch (status) {
      case "safe":
        return { icon: CheckCircle2, color: "text-success", bg: "bg-success/10", border: "border-success/30", label: "Authentic", gradient: "from-success/20 to-success/5" };
      case "warning":
        return { icon: AlertTriangle, color: "text-warning", bg: "bg-warning/10", border: "border-warning/30", label: "Suspicious", gradient: "from-warning/20 to-warning/5" };
      case "danger":
        return { icon: XCircle, color: "text-destructive", bg: "bg-destructive/10", border: "border-destructive/30", label: "Likely Fake", gradient: "from-destructive/20 to-destructive/5" };
      default:
        return { icon: CheckCircle2, color: "text-success", bg: "bg-success/10", border: "border-success/30", label: "Authentic", gradient: "from-success/20 to-success/5" };
    }
  };

  const detectPlatform = (url: string): string => {
    const patterns: Record<string, RegExp> = {
      youtube: /youtube\.com|youtu\.be/i,
      facebook: /facebook\.com|fb\.com|fb\.watch/i,
      instagram: /instagram\.com/i,
      tiktok: /tiktok\.com/i,
      twitter: /twitter\.com|x\.com/i,
    };
    for (const [platform, pattern] of Object.entries(patterns)) {
      if (pattern.test(url)) return platform;
    }
    return "unknown";
  };

  const analyzeUrl = async () => {
    if (!urlInput.trim()) {
      toast.error("Please paste a URL from YouTube, Facebook, TikTok, or other platforms");
      return;
    }

    setUrlResult(null);
    setAnalyzing(true);
    setProgress(0);
    setCurrentStage(0);

    // Simulate progress
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) return prev;
        const increment = Math.random() * 6 + 2;
        return Math.min(prev + increment, 90);
      });
    }, 400);

    const stageInterval = setInterval(() => {
      setCurrentStage((prev) => {
        if (prev >= urlAnalysisStages.length - 1) return prev;
        return prev + 1;
      });
    }, 2000);

    try {
      const { data, error } = await supabase.functions.invoke("analyze-url", {
        body: {
          url: urlInput,
          analysisType: urlAnalysisType,
        },
      });

      clearInterval(progressInterval);
      clearInterval(stageInterval);

      if (error) throw error;
      if (data.error) throw new Error(data.error);

      setProgress(100);
      setCurrentStage(urlAnalysisStages.length - 1);
      setUrlResult(data as UrlAnalysisResult);

      // Save to history if user is logged in
      if (user) {
        try {
          await supabase.from("analysis_history").insert({
            user_id: user.id,
            file_name: data.sourceUrl || urlInput,
            file_type: `url/${data.platform || "unknown"}`,
            file_size: 0,
            status: data.status,
            confidence: data.confidence,
            findings: data.findings || [],
          });
        } catch (saveError) {
          console.error("Error saving to history:", saveError);
        }
      }

      toast.success(user ? "Analysis complete - saved to history" : "Analysis complete");
    } catch (error) {
      clearInterval(progressInterval);
      clearInterval(stageInterval);
      console.error("URL analysis error:", error);
      toast.error(error instanceof Error ? error.message : "Failed to analyze URL");
    } finally {
      setAnalyzing(false);
    }
  };

  const clearUrlAnalysis = () => {
    setUrlInput("");
    setUrlResult(null);
    setProgress(0);
    setCurrentStage(0);
  };

  const platform = urlInput ? detectPlatform(urlInput) : null;
  const PlatformIcon = platform && platformIcons[platform] ? platformIcons[platform] : Link;

  return (
    <div className="space-y-4">
      {/* URL input area */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass rounded-2xl p-6"
      >
        <div className="text-center mb-6">
          <motion.div 
            className="w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center glass"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring" }}
          >
            <Link className="w-8 h-8 text-primary" />
          </motion.div>
          
          <h3 className="font-display text-lg font-semibold mb-2">
            Paste a URL to analyze
          </h3>
          <p className="text-muted-foreground text-sm">
            Works with YouTube, Facebook, Instagram, TikTok, Twitter/X, and more
          </p>
        </div>

        {/* Platform badges */}
        <div className="flex items-center justify-center gap-2 mb-6 flex-wrap">
          {["YouTube", "Facebook", "TikTok", "Twitter", "Instagram"].map((name) => (
            <div 
              key={name} 
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs transition-colors ${
                platform === name.toLowerCase() 
                  ? "bg-primary/20 text-primary border border-primary/30" 
                  : "bg-muted/50 text-muted-foreground"
              }`}
            >
              {name}
            </div>
          ))}
        </div>

        {/* URL input */}
        <div className="flex gap-2 mb-4">
          <div className="relative flex-1">
            <div className="absolute left-3 top-1/2 -translate-y-1/2">
              <PlatformIcon className={`w-4 h-4 ${platform ? "text-primary" : "text-muted-foreground"}`} />
            </div>
            <Input
              type="url"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              placeholder="https://youtube.com/watch?v=..."
              className="pl-10"
              disabled={analyzing}
            />
          </div>
        </div>

        {/* Analysis type toggle */}
        <div className="flex items-center justify-center gap-2 mb-4">
          <Button
            variant={urlAnalysisType === "quick" ? "default" : "outline"}
            size="sm"
            onClick={() => setUrlAnalysisType("quick")}
            disabled={analyzing}
          >
            <Search className="w-4 h-4 mr-2" />
            Quick Scan
          </Button>
          <Button
            variant={urlAnalysisType === "deep" ? "default" : "outline"}
            size="sm"
            onClick={() => setUrlAnalysisType("deep")}
            disabled={analyzing}
          >
            <Telescope className="w-4 h-4 mr-2" />
            Deep Analysis
          </Button>
        </div>

        <p className="text-xs text-muted-foreground text-center mb-4">
          {urlAnalysisType === "quick" 
            ? "Fast scan for obvious manipulation signs (~10 seconds)" 
            : "Thorough multi-factor analysis with detailed findings (~20 seconds)"
          }
        </p>

        <Button 
          onClick={analyzeUrl} 
          disabled={analyzing || !urlInput.trim()} 
          className="w-full"
        >
          {analyzing ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Analyzing...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 mr-2" />
              Analyze URL
            </>
          )}
        </Button>
      </motion.div>

      {/* Analysis progress */}
      <AnimatePresence>
        {analyzing && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="glass rounded-xl p-6 space-y-6"
          >
            {/* Progress bar */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Analyzing URL...</span>
                <span className="font-mono text-primary">{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>

            {/* Analysis stages */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {urlAnalysisStages.map((stage, index) => {
                const StageIcon = stage.icon;
                const isActive = index === currentStage;
                const isComplete = index < currentStage;
                
                return (
                  <motion.div
                    key={stage.name}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`relative p-3 rounded-xl border transition-all duration-300 ${
                      isActive 
                        ? "bg-primary/10 border-primary/30" 
                        : isComplete 
                        ? "bg-success/10 border-success/30" 
                        : "bg-muted/30 border-border/50"
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      {isActive ? (
                        <Loader2 className="w-4 h-4 text-primary animate-spin" />
                      ) : isComplete ? (
                        <CheckCircle2 className="w-4 h-4 text-success" />
                      ) : (
                        <StageIcon className="w-4 h-4 text-muted-foreground" />
                      )}
                      <span className={`text-xs font-medium ${
                        isActive ? "text-primary" : isComplete ? "text-success" : "text-muted-foreground"
                      }`}>
                        {stage.name}
                      </span>
                    </div>
                    <p className="text-[10px] text-muted-foreground leading-tight">
                      {stage.description}
                    </p>
                    
                    {isActive && (
                      <motion.div
                        className="absolute inset-0 rounded-xl border border-primary/50"
                        animate={{ opacity: [0.5, 0, 0.5] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      />
                    )}
                  </motion.div>
                );
              })}
            </div>

            {/* Scanning animation */}
            <div className="flex items-center justify-center gap-3 py-4">
              <motion.div className="flex items-center gap-1">
                {[...Array(4)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="w-1.5 h-8 bg-primary/40 rounded-full"
                    animate={{
                      scaleY: [0.3, 1, 0.3],
                      opacity: [0.4, 1, 0.4],
                    }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      delay: i * 0.15,
                    }}
                  />
                ))}
              </motion.div>
              <span className="text-sm text-muted-foreground">
                {urlAnalysisStages[currentStage]?.description || "Processing..."}
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* URL Analysis result */}
      <AnimatePresence>
        {urlResult && !analyzing && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="space-y-4"
          >
            {/* Screenshot preview */}
            {urlResult.screenshot && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass rounded-xl p-4"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium">Analyzed Content</span>
                  {urlResult.sourceUrl && (
                    <a
                      href={urlResult.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-primary hover:underline flex items-center gap-1"
                    >
                      Open source <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
                <div className="rounded-lg overflow-hidden border border-border max-h-48 overflow-y-auto">
                  <img 
                    src={urlResult.screenshot} 
                    alt="Screenshot of analyzed content" 
                    className="w-full"
                  />
                </div>
                {urlResult.platform && (
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-xs text-muted-foreground">Platform:</span>
                    <span className="text-xs font-medium capitalize bg-muted/50 px-2 py-0.5 rounded">
                      {urlResult.platform}
                    </span>
                    {urlResult.contentType && (
                      <>
                        <span className="text-xs text-muted-foreground">•</span>
                        <span className="text-xs capitalize bg-muted/50 px-2 py-0.5 rounded">
                          {urlResult.contentType}
                        </span>
                      </>
                    )}
                  </div>
                )}
              </motion.div>
            )}

            {/* Result card */}
            {(() => {
              const config = getStatusConfig(urlResult.status);
              const StatusIcon = config.icon;
              return (
                <motion.div 
                  className={`relative rounded-xl p-6 overflow-hidden bg-gradient-to-br ${config.gradient} border ${config.border}`}
                  initial={{ y: 20 }}
                  animate={{ y: 0 }}
                >
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent"
                    animate={{ x: ["-100%", "100%"] }}
                    transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
                  />
                  
                  <div className="relative flex items-center gap-4">
                    <motion.div
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ type: "spring", delay: 0.2 }}
                    >
                      <StatusIcon className={`w-14 h-14 ${config.color}`} />
                    </motion.div>
                    <div className="flex-1">
                      <motion.p 
                        className={`font-display text-2xl font-bold ${config.color}`}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                      >
                        {config.label}
                      </motion.p>
                      <p className="text-muted-foreground">
                        {urlResult.analysisType === "deep" ? "Deep analysis" : "Quick scan"} complete
                      </p>
                    </div>
                    <motion.div 
                      className="text-right"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", delay: 0.4 }}
                    >
                      <div className={`text-4xl font-display font-bold ${config.color}`}>
                        {urlResult.confidence}%
                      </div>
                      <p className="text-xs text-muted-foreground">confidence</p>
                    </motion.div>
                  </div>
                </motion.div>
              );
            })()}

            {/* Findings */}
            {urlResult.findings && urlResult.findings.length > 0 && (
              <motion.div 
                className="glass rounded-xl p-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <h4 className="font-display font-semibold mb-4 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-primary" />
                  AI Analysis Findings
                </h4>
                <ul className="space-y-3">
                  {urlResult.findings.map((finding, index) => (
                    <motion.li
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 + index * 0.1 }}
                      className="flex items-start gap-3 text-muted-foreground"
                    >
                      <span className="w-2 h-2 rounded-full bg-primary mt-2 shrink-0" />
                      {finding}
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            )}

            {/* Risk factors */}
            {urlResult.riskFactors && urlResult.riskFactors.length > 0 && (
              <motion.div 
                className="glass rounded-xl p-6 border-warning/30"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <h4 className="font-display font-semibold mb-4 flex items-center gap-2 text-warning">
                  <AlertTriangle className="w-4 h-4" />
                  Risk Factors
                </h4>
                <ul className="space-y-2">
                  {urlResult.riskFactors.map((factor, index) => (
                    <motion.li
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 + index * 0.1 }}
                      className="flex items-start gap-3 text-muted-foreground text-sm"
                    >
                      <span className="w-2 h-2 rounded-full bg-warning mt-1.5 shrink-0" />
                      {factor}
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            )}

            {/* Recommendation */}
            {urlResult.recommendation && (
              <motion.div 
                className="glass rounded-xl p-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <p className="text-sm">
                  <span className="font-medium">Recommendation: </span>
                  <span className="text-muted-foreground">{urlResult.recommendation}</span>
                </p>
              </motion.div>
            )}

            {/* Analyze another */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              <Button variant="outline" onClick={clearUrlAnalysis} className="w-full group">
                <Link className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
                Analyze Another URL
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default UrlAnalyzer;
