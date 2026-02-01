import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Upload, FileImage, FileVideo, FileAudio, X, CheckCircle2, AlertTriangle, 
  XCircle, Loader2, Scale, Sparkles, ArrowLeftRight, RefreshCw, Eye, EyeOff
} from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Slider } from "@/components/ui/slider";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import HeatmapOverlay, { HeatmapRegion } from "@/components/HeatmapOverlay";
import { cn } from "@/lib/utils";

type AnalysisResult = {
  status: "safe" | "warning" | "danger";
  confidence: number;
  findings: string[];
  heatmapRegions?: HeatmapRegion[];
};

type ComparisonSide = {
  file: File | null;
  previewUrl: string | null;
  analyzing: boolean;
  result: AnalysisResult | null;
  progress: number;
  error: string | null;
};

const initialSide: ComparisonSide = {
  file: null,
  previewUrl: null,
  analyzing: false,
  result: null,
  progress: 0,
  error: null,
};

interface ComparisonViewProps {
  sensitivity?: number;
}

const ComparisonView = ({ sensitivity = 50 }: ComparisonViewProps) => {
  const [leftSide, setLeftSide] = useState<ComparisonSide>(initialSide);
  const [rightSide, setRightSide] = useState<ComparisonSide>(initialSide);
  const [isDraggingLeft, setIsDraggingLeft] = useState(false);
  const [isDraggingRight, setIsDraggingRight] = useState(false);
  const [showHeatmap, setShowHeatmap] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const getFileIcon = (type: string) => {
    if (type.startsWith("image")) return FileImage;
    if (type.startsWith("video")) return FileVideo;
    if (type.startsWith("audio")) return FileAudio;
    return FileImage;
  };

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

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const base64 = reader.result as string;
        const base64Data = base64.split(",")[1];
        resolve(base64Data);
      };
      reader.onerror = (error) => reject(error);
    });
  };

  const analyzeFile = async (file: File): Promise<AnalysisResult> => {
    let fileBase64 = "";
    if (file.type.startsWith("image/")) {
      fileBase64 = await fileToBase64(file);
    }

    const { data, error } = await supabase.functions.invoke("analyze-media", {
      body: {
        fileName: file.name,
        fileType: file.type,
        fileBase64: fileBase64,
        sensitivity: sensitivity,
      },
    });

    if (error) throw error;
    if (data.error) throw new Error(data.error);

    return data as AnalysisResult;
  };

  const saveToHistory = async (file: File, result: AnalysisResult) => {
    if (!user) return;

    try {
      await supabase.from("analysis_history").insert({
        user_id: user.id,
        file_name: file.name,
        file_type: file.type,
        file_size: file.size,
        status: result.status,
        confidence: result.confidence,
        findings: result.findings,
      });
    } catch (error) {
      console.error("Error saving to history:", error);
    }
  };

  const processFile = async (
    file: File, 
    side: "left" | "right",
    setSide: React.Dispatch<React.SetStateAction<ComparisonSide>>
  ) => {
    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please upload a file smaller than 10MB",
        variant: "destructive",
      });
      return;
    }

    const previewUrl = file.type.startsWith("image/") 
      ? URL.createObjectURL(file) 
      : null;

    setSide({
      file,
      previewUrl,
      analyzing: true,
      result: null,
      progress: 0,
      error: null,
    });

    // Simulate progress
    const progressInterval = setInterval(() => {
      setSide(prev => ({
        ...prev,
        progress: Math.min(prev.progress + Math.random() * 10 + 5, 90)
      }));
    }, 300);

    try {
      const result = await analyzeFile(file);
      clearInterval(progressInterval);
      
      setSide({
        file,
        previewUrl,
        analyzing: false,
        result,
        progress: 100,
        error: null,
      });

      await saveToHistory(file, result);
    } catch (error) {
      clearInterval(progressInterval);
      setSide({
        file,
        previewUrl,
        analyzing: false,
        result: null,
        progress: 0,
        error: error instanceof Error ? error.message : "Analysis failed",
      });
      toast({
        title: "Analysis failed",
        description: error instanceof Error ? error.message : "Could not analyze file",
        variant: "destructive",
      });
    }
  };

  const handleDragOver = useCallback((e: React.DragEvent, side: "left" | "right") => {
    e.preventDefault();
    if (side === "left") setIsDraggingLeft(true);
    else setIsDraggingRight(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent, side: "left" | "right") => {
    e.preventDefault();
    if (side === "left") setIsDraggingLeft(false);
    else setIsDraggingRight(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent, side: "left" | "right") => {
    e.preventDefault();
    if (side === "left") setIsDraggingLeft(false);
    else setIsDraggingRight(false);

    const file = e.dataTransfer.files[0];
    if (file) {
      if (side === "left") {
        processFile(file, "left", setLeftSide);
      } else {
        processFile(file, "right", setRightSide);
      }
    }
  }, [sensitivity]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>, side: "left" | "right") => {
    const file = e.target.files?.[0];
    if (file) {
      if (side === "left") {
        processFile(file, "left", setLeftSide);
      } else {
        processFile(file, "right", setRightSide);
      }
    }
    e.target.value = "";
  };

  const clearSide = (side: "left" | "right") => {
    const setSide = side === "left" ? setLeftSide : setRightSide;
    const currentSide = side === "left" ? leftSide : rightSide;
    
    if (currentSide.previewUrl) {
      URL.revokeObjectURL(currentSide.previewUrl);
    }
    setSide(initialSide);
  };

  const clearBoth = () => {
    clearSide("left");
    clearSide("right");
  };

  const swapSides = () => {
    const tempLeft = { ...leftSide };
    setLeftSide({ ...rightSide });
    setRightSide(tempLeft);
  };

  const renderDropZone = (side: "left" | "right") => {
    const isDragging = side === "left" ? isDraggingLeft : isDraggingRight;
    const sideState = side === "left" ? leftSide : rightSide;
    const inputId = `compare-file-${side}`;

    return (
      <div
        className={cn(
          "relative rounded-xl border-2 border-dashed transition-all duration-300 backdrop-blur-sm min-h-[300px] flex flex-col",
          isDragging
            ? "border-primary bg-primary/10 scale-[1.02]"
            : "border-border hover:border-primary/50 hover:bg-card/30"
        )}
        onDragOver={(e) => handleDragOver(e, side)}
        onDragLeave={(e) => handleDragLeave(e, side)}
        onDrop={(e) => handleDrop(e, side)}
      >
        <AnimatePresence mode="wait">
          {!sideState.file ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex-1 flex flex-col items-center justify-center p-6 text-center"
            >
              <motion.div 
                className={cn(
                  "w-14 h-14 rounded-full flex items-center justify-center mb-3 transition-all",
                  isDragging ? "bg-primary/20 scale-110" : "glass"
                )}
                animate={isDragging ? { scale: [1.1, 1.15, 1.1] } : {}}
                transition={{ duration: 1, repeat: Infinity }}
              >
                <Upload className={cn(
                  "w-6 h-6 transition-colors",
                  isDragging ? "text-primary" : "text-muted-foreground"
                )} />
              </motion.div>
              
              <h4 className="font-display font-semibold mb-1">
                {isDragging ? "Drop here" : `File ${side === "left" ? "A" : "B"}`}
              </h4>
              <p className="text-xs text-muted-foreground mb-3">
                Drag & drop or click to browse
              </p>
              
              <input
                type="file"
                accept="image/*,video/*,audio/*"
                onChange={(e) => handleFileSelect(e, side)}
                className="hidden"
                id={inputId}
              />
              <label htmlFor={inputId}>
                <Button variant="outline" size="sm" asChild>
                  <span className="cursor-pointer">
                    <Upload className="w-3.5 h-3.5 mr-1.5" />
                    Browse
                  </span>
                </Button>
              </label>
            </motion.div>
          ) : (
            <motion.div
              key="file"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex-1 flex flex-col p-4"
            >
              {/* File header */}
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center border border-primary/20 shrink-0">
                  {(() => {
                    const FileIcon = getFileIcon(sideState.file.type);
                    return <FileIcon className="w-5 h-5 text-primary" />;
                  })()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{sideState.file.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatFileSize(sideState.file.size)}
                  </p>
                </div>
                {!sideState.analyzing && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => clearSide(side)}
                    className="shrink-0 h-8 w-8 hover:bg-destructive/10 hover:text-destructive"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                )}
              </div>

              {/* Preview */}
              {sideState.previewUrl && (
                <div className="relative rounded-lg overflow-hidden mb-3 bg-muted/30 flex-shrink-0">
                  {showHeatmap && sideState.result?.heatmapRegions && sideState.result.heatmapRegions.length > 0 ? (
                    <HeatmapOverlay
                      imageUrl={sideState.previewUrl}
                      regions={sideState.result.heatmapRegions}
                      className="w-full"
                    />
                  ) : (
                    <img
                      src={sideState.previewUrl}
                      alt="Preview"
                      className="w-full h-32 object-contain"
                    />
                  )}
                </div>
              )}

              {/* Analysis state */}
              {sideState.analyzing ? (
                <div className="flex-1 flex flex-col justify-center space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground flex items-center gap-1.5">
                      <Loader2 className="w-3.5 h-3.5 animate-spin text-primary" />
                      Analyzing...
                    </span>
                    <span className="font-mono text-primary">{Math.round(sideState.progress)}%</span>
                  </div>
                  <Progress value={sideState.progress} className="h-1.5" />
                </div>
              ) : sideState.result ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex-1 flex flex-col"
                >
                  {(() => {
                    const config = getStatusConfig(sideState.result.status);
                    const StatusIcon = config.icon;
                    return (
                      <>
                        <div className={cn(
                          "rounded-lg p-3 mb-3 border",
                          config.bg, config.border
                        )}>
                          <div className="flex items-center gap-3">
                            <StatusIcon className={cn("w-8 h-8", config.color)} />
                            <div className="flex-1">
                              <p className={cn("font-semibold", config.color)}>
                                {config.label}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {sideState.result.confidence}% confidence
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Findings summary */}
                        <div className="flex-1 overflow-auto">
                          <p className="text-xs font-medium text-muted-foreground mb-2">
                            Findings ({sideState.result.findings.length})
                          </p>
                          <ul className="space-y-1.5 text-xs">
                            {sideState.result.findings.slice(0, 3).map((finding, i) => (
                              <li key={i} className="flex items-start gap-2 text-muted-foreground">
                                <span className="w-1 h-1 rounded-full bg-primary mt-1.5 shrink-0" />
                                <span className="line-clamp-2">{finding}</span>
                              </li>
                            ))}
                            {sideState.result.findings.length > 3 && (
                              <li className="text-primary text-xs">
                                +{sideState.result.findings.length - 3} more
                              </li>
                            )}
                          </ul>
                        </div>
                      </>
                    );
                  })()}
                </motion.div>
              ) : sideState.error ? (
                <div className="flex-1 flex items-center justify-center">
                  <div className="text-center">
                    <XCircle className="w-8 h-8 text-destructive mx-auto mb-2" />
                    <p className="text-sm text-destructive">{sideState.error}</p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => clearSide(side)}
                      className="mt-2"
                    >
                      Try Again
                    </Button>
                  </div>
                </div>
              ) : null}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  const renderComparisonSummary = () => {
    if (!leftSide.result || !rightSide.result) return null;

    const leftConfig = getStatusConfig(leftSide.result.status);
    const rightConfig = getStatusConfig(rightSide.result.status);
    const LeftIcon = leftConfig.icon;
    const RightIcon = rightConfig.icon;

    const confidenceDiff = leftSide.result.confidence - rightSide.result.confidence;
    const statusComparison = leftSide.result.status === rightSide.result.status 
      ? "same" 
      : leftSide.result.status === "safe" 
        ? "left-safer" 
        : rightSide.result.status === "safe" 
          ? "right-safer" 
          : "different";

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-6 glass rounded-xl p-6"
      >
        <h4 className="font-display font-semibold mb-4 flex items-center gap-2">
          <Scale className="w-5 h-5 text-primary" />
          Comparison Summary
        </h4>

        <div className="grid grid-cols-3 gap-4">
          {/* Left result */}
          <div className={cn("rounded-lg p-4 text-center border", leftConfig.bg, leftConfig.border)}>
            <LeftIcon className={cn("w-8 h-8 mx-auto mb-2", leftConfig.color)} />
            <p className={cn("font-semibold", leftConfig.color)}>{leftConfig.label}</p>
            <p className="text-2xl font-display font-bold mt-1">{leftSide.result.confidence}%</p>
            <p className="text-xs text-muted-foreground">File A</p>
          </div>

          {/* Comparison */}
          <div className="flex flex-col items-center justify-center">
            <ArrowLeftRight className="w-6 h-6 text-muted-foreground mb-2" />
            <div className="text-center">
              {statusComparison === "same" ? (
                <p className="text-sm font-medium text-muted-foreground">Same verdict</p>
              ) : (
                <p className="text-sm font-medium">
                  {statusComparison === "left-safer" ? "File A is safer" : 
                   statusComparison === "right-safer" ? "File B is safer" : 
                   "Different verdicts"}
                </p>
              )}
              {confidenceDiff !== 0 && (
                <p className={cn(
                  "text-xs mt-1",
                  confidenceDiff > 0 ? "text-success" : "text-destructive"
                )}>
                  {confidenceDiff > 0 ? "+" : ""}{confidenceDiff}% difference
                </p>
              )}
            </div>
          </div>

          {/* Right result */}
          <div className={cn("rounded-lg p-4 text-center border", rightConfig.bg, rightConfig.border)}>
            <RightIcon className={cn("w-8 h-8 mx-auto mb-2", rightConfig.color)} />
            <p className={cn("font-semibold", rightConfig.color)}>{rightConfig.label}</p>
            <p className="text-2xl font-display font-bold mt-1">{rightSide.result.confidence}%</p>
            <p className="text-xs text-muted-foreground">File B</p>
          </div>
        </div>

        {/* Unique findings */}
        <div className="mt-4 grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <p className="text-xs font-medium text-muted-foreground">File A unique findings:</p>
            <ul className="space-y-1 text-xs">
              {leftSide.result.findings
                .filter(f => !rightSide.result?.findings.includes(f))
                .slice(0, 2)
                .map((finding, i) => (
                  <li key={i} className="flex items-start gap-2 text-muted-foreground">
                    <span className={cn("w-1.5 h-1.5 rounded-full mt-1.5 shrink-0", leftConfig.color.replace("text-", "bg-"))} />
                    {finding}
                  </li>
                ))}
            </ul>
          </div>
          <div className="space-y-2">
            <p className="text-xs font-medium text-muted-foreground">File B unique findings:</p>
            <ul className="space-y-1 text-xs">
              {rightSide.result.findings
                .filter(f => !leftSide.result?.findings.includes(f))
                .slice(0, 2)
                .map((finding, i) => (
                  <li key={i} className="flex items-start gap-2 text-muted-foreground">
                    <span className={cn("w-1.5 h-1.5 rounded-full mt-1.5 shrink-0", rightConfig.color.replace("text-", "bg-"))} />
                    {finding}
                  </li>
                ))}
            </ul>
          </div>
        </div>
      </motion.div>
    );
  };

  const hasAnyFile = leftSide.file || rightSide.file;
  const bothComplete = leftSide.result && rightSide.result;
  const anyAnalyzing = leftSide.analyzing || rightSide.analyzing;

  return (
    <div className="space-y-4">
      {/* Header with actions */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-2">
          <Scale className="w-5 h-5 text-primary" />
          <h3 className="font-display font-semibold">Side-by-Side Comparison</h3>
        </div>
        <div className="flex items-center gap-4">
          {/* Heatmap toggle */}
          {(leftSide.result?.heatmapRegions?.length || rightSide.result?.heatmapRegions?.length) && (
            <div className="flex items-center gap-2">
              <Switch
                id="heatmap-toggle"
                checked={showHeatmap}
                onCheckedChange={setShowHeatmap}
              />
              <Label 
                htmlFor="heatmap-toggle" 
                className="flex items-center gap-1.5 text-sm cursor-pointer"
              >
                {showHeatmap ? (
                  <Eye className="w-4 h-4 text-primary" />
                ) : (
                  <EyeOff className="w-4 h-4 text-muted-foreground" />
                )}
                Heatmap
              </Label>
            </div>
          )}
          
          {hasAnyFile && (
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={swapSides}
                disabled={anyAnalyzing}
              >
                <RefreshCw className="w-3.5 h-3.5 mr-1.5" />
                Swap
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={clearBoth}
                disabled={anyAnalyzing}
                className="text-destructive hover:text-destructive hover:bg-destructive/10"
              >
                <X className="w-3.5 h-3.5 mr-1.5" />
                Clear All
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Comparison grid */}
      <div className="grid md:grid-cols-2 gap-4">
        {renderDropZone("left")}
        {renderDropZone("right")}
      </div>

      {/* Comparison summary */}
      {bothComplete && renderComparisonSummary()}
    </div>
  );
};

export default ComparisonView;
