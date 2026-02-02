import { useState, useCallback, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, FileImage, FileVideo, FileAudio, X, CheckCircle2, AlertTriangle, XCircle, Loader2, Shield, Sparkles, Zap, Files, Trash2, Link, Search, Volume2, Bell, BellOff, Volume1, VolumeX, Eye, EyeOff, SlidersHorizontal, Download, Mail, Link2, Check, Scale, Keyboard, Fingerprint } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Slider } from "@/components/ui/slider";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useNotifications } from "@/hooks/use-notifications";
import { useSoundEffects } from "@/hooks/use-sound-effects";
import { useKeyboardShortcuts, keyboardShortcutsList } from "@/hooks/use-keyboard-shortcuts";
import { fireCelebration } from "@/hooks/use-confetti";
import UrlAnalyzer from "@/components/UrlAnalyzer";
import ReverseImageSearch from "@/components/ReverseImageSearch";
import AudioAnalyzer from "@/components/AudioAnalyzer";
import HeatmapOverlay, { HeatmapRegion } from "@/components/HeatmapOverlay";
import { exportAnalysisToPDF } from "@/lib/pdf-export";
import { exportBatchAnalysisToPDF } from "@/lib/batch-pdf-export";
import EmailShareDialog from "@/components/EmailShareDialog";
import ComparisonView from "@/components/ComparisonView";
import DemoSamples from "@/components/DemoSamples";
import AnalyzerSkeleton from "@/components/AnalyzerSkeleton";
import ProgressRing from "@/components/ProgressRing";
import SocialShareButtons from "@/components/SocialShareButtons";
import ForensicAnalysisPanel from "@/components/ForensicAnalysisPanel";

type AnalysisResult = {
  status: "safe" | "warning" | "danger";
  confidence: number;
  findings: string[];
  heatmapRegions?: HeatmapRegion[];
};

type UrlAnalysisResult = AnalysisResult & {
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

type BatchFile = {
  id: string;
  file: File;
  status: "pending" | "analyzing" | "complete" | "error";
  result?: AnalysisResult;
  error?: string;
  progress: number;
};

type AnalysisMode = "file" | "batch" | "url" | "reverse" | "audio" | "compare";

const analysisStages: AnalysisStage[] = [
  { name: "Uploading", icon: Upload, description: "Preparing file for analysis" },
  { name: "Scanning", icon: Shield, description: "Running security scan" },
  { name: "AI Analysis", icon: Sparkles, description: "Deep learning detection" },
  { name: "Finalizing", icon: Zap, description: "Generating report" },
];

const urlAnalysisStages: AnalysisStage[] = [
  { name: "Fetching", icon: Link, description: "Capturing page content" },
  { name: "Scanning", icon: Shield, description: "Analyzing visual elements" },
  { name: "AI Analysis", icon: Sparkles, description: "Deep learning detection" },
  { name: "Finalizing", icon: Zap, description: "Generating report" },
];

interface AnalyzerSectionProps {
  externalImageUrl?: string | null;
  onExternalImageProcessed?: () => void;
}

const AnalyzerSection = ({ externalImageUrl, onExternalImageProcessed }: AnalyzerSectionProps = {}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [filePreviewUrl, setFilePreviewUrl] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [progress, setProgress] = useState(0);
  const [currentStage, setCurrentStage] = useState(0);
  const [showHeatmap, setShowHeatmap] = useState(true);
  const { toast } = useToast();
  const { user } = useAuth();
  const { isSupported: notificationsSupported, permission, requestPermission, notifyAnalysisComplete } = useNotifications();
  const { playAnalysisComplete, setEnabled: setSoundEnabled, isEnabled: isSoundEnabled } = useSoundEffects();
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [soundEnabled, setSoundEnabledState] = useState(true);

  // Sensitivity control state
  const [sensitivity, setSensitivity] = useState(50);
  const [showSensitivityPanel, setShowSensitivityPanel] = useState(false);

  // Email share dialog state
  const [showEmailDialog, setShowEmailDialog] = useState(false);

  // Copy link state
  const [lastAnalysisId, setLastAnalysisId] = useState<string | null>(null);
  const [copyingLink, setCopyingLink] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);

  // Analysis mode state
  const [analysisMode, setAnalysisMode] = useState<AnalysisMode>("file");
  
  // Batch analysis state
  const [batchFiles, setBatchFiles] = useState<BatchFile[]>([]);
  const [batchAnalyzing, setBatchAnalyzing] = useState(false);
  
  // Forensic analysis state
  const [showForensicPanel, setShowForensicPanel] = useState(false);
  const [imageElement, setImageElement] = useState<HTMLImageElement | null>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  // Handle export for keyboard shortcut
  const handleKeyboardExport = useCallback(() => {
    if (analysisMode === "batch" && batchFiles.length > 0 && batchFiles.every(f => f.status === "complete" || f.status === "error")) {
      const exportData = batchFiles.map(bf => ({
        fileName: bf.file.name,
        fileType: bf.file.type,
        fileSize: bf.file.size,
        result: bf.result,
        error: bf.error,
      }));
      exportBatchAnalysisToPDF(exportData, sensitivity);
      toast({ title: "Report exported", description: "Batch analysis PDF downloaded" });
    } else if (analysisMode === "file" && result && file) {
      exportAnalysisToPDF(result, file.name, file.type, file.size, filePreviewUrl, sensitivity);
      toast({ title: "Report exported", description: "Analysis PDF downloaded" });
    } else {
      toast({ title: "Nothing to export", description: "Complete an analysis first", variant: "destructive" });
    }
  }, [analysisMode, batchFiles, result, file, filePreviewUrl, sensitivity, toast]);

  // Handle mode change for keyboard shortcut
  const handleKeyboardModeChange = useCallback((mode: AnalysisMode) => {
    if (analyzing || batchAnalyzing) return;
    setAnalysisMode(mode);
    // Clear file state inline to avoid circular dependency
    if (mode !== "file") {
      if (filePreviewUrl) URL.revokeObjectURL(filePreviewUrl);
      setFile(null);
      setFilePreviewUrl(null);
      setResult(null);
      setProgress(0);
      setCurrentStage(0);
      setShowHeatmap(true);
      setLastAnalysisId(null);
      setLinkCopied(false);
    }
    // Clear batch files inline
    if (mode !== "batch") {
      setBatchFiles([]);
    }
  }, [analyzing, batchAnalyzing, filePreviewUrl]);

  // Keyboard shortcuts
  useKeyboardShortcuts({
    onModeChange: handleKeyboardModeChange,
    onToggleHeatmap: () => setShowHeatmap(prev => !prev),
    onExport: handleKeyboardExport,
    onToggleSensitivity: () => setShowSensitivityPanel(prev => !prev),
    disabled: analyzing || batchAnalyzing,
  });

  // Sync notifications state with permission
  useEffect(() => {
    setNotificationsEnabled(permission === "granted");
  }, [permission]);

  const toggleNotifications = async () => {
    if (permission === "granted") {
      setNotificationsEnabled(!notificationsEnabled);
    } else {
      const granted = await requestPermission();
      setNotificationsEnabled(granted);
      if (granted) {
        toast({
          title: "Notifications enabled",
          description: "You'll be notified when analysis is complete",
        });
      }
    }
  };

  const toggleSound = () => {
    const newState = !soundEnabled;
    setSoundEnabledState(newState);
    setSoundEnabled(newState);
  };

  useEffect(() => {
    if (externalImageUrl) {
      setAnalysisMode("reverse");
    }
  }, [externalImageUrl]);
  // Simulate progress during analysis
  useEffect(() => {
    if (!analyzing) {
      setProgress(0);
      setCurrentStage(0);
      return;
    }

    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 95) return prev;
        const increment = Math.random() * 8 + 2;
        return Math.min(prev + increment, 95);
      });
    }, 300);

    const stageInterval = setInterval(() => {
      setCurrentStage((prev) => {
        if (prev >= analysisStages.length - 1) return prev;
        return prev + 1;
      });
    }, 1500);

    return () => {
      clearInterval(progressInterval);
      clearInterval(stageInterval);
    };
  }, [analyzing]);

  // Complete progress when result arrives
  useEffect(() => {
    if (result && analyzing) {
      setProgress(100);
      setCurrentStage(analysisStages.length - 1);
    }
  }, [result, analyzing]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (analysisMode === "batch") {
      const droppedFiles = Array.from(e.dataTransfer.files);
      addBatchFiles(droppedFiles);
    } else if (analysisMode === "file") {
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile) {
        processFile(droppedFile);
      }
    }
  }, [analysisMode]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (!selectedFiles) return;

    if (analysisMode === "batch") {
      addBatchFiles(Array.from(selectedFiles));
    } else {
      const selectedFile = selectedFiles[0];
      if (selectedFile) {
        processFile(selectedFile);
      }
    }
    
    // Reset the input
    e.target.value = "";
  };

  const addBatchFiles = (files: File[]) => {
    const validFiles = files.filter(f => {
      if (f.size > 10 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: `${f.name} exceeds 10MB limit`,
          variant: "destructive",
        });
        return false;
      }
      return true;
    });

    const newBatchFiles: BatchFile[] = validFiles.map(f => ({
      id: crypto.randomUUID(),
      file: f,
      status: "pending",
      progress: 0,
    }));

    setBatchFiles(prev => [...prev, ...newBatchFiles]);
  };

  const removeBatchFile = (id: string) => {
    setBatchFiles(prev => prev.filter(f => f.id !== id));
  };

  const clearBatchFiles = () => {
    setBatchFiles([]);
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

  const saveToHistory = async (selectedFile: File, analysisResult: AnalysisResult): Promise<string | null> => {
    if (!user) return null;

    try {
      const { data, error } = await supabase.from("analysis_history").insert({
        user_id: user.id,
        file_name: selectedFile.name,
        file_type: selectedFile.type,
        file_size: selectedFile.size,
        status: analysisResult.status,
        confidence: analysisResult.confidence,
        findings: analysisResult.findings,
      }).select("id").single();

      if (error) throw error;
      return data?.id || null;
    } catch (error) {
      console.error("Error saving to history:", error);
      return null;
    }
  };

  const generateShareLink = async () => {
    if (!lastAnalysisId || !user) {
      toast({
        title: "Cannot share",
        description: "Please sign in and analyze a file first",
        variant: "destructive",
      });
      return;
    }

    setCopyingLink(true);
    setLinkCopied(false);

    try {
      // Generate a unique share token
      const shareToken = crypto.randomUUID();

      // Update the analysis with the share token
      const { error } = await supabase
        .from("analysis_history")
        .update({ share_token: shareToken })
        .eq("id", lastAnalysisId)
        .eq("user_id", user.id);

      if (error) throw error;

      // Generate the shareable URL
      const shareUrl = `${window.location.origin}/shared?token=${shareToken}`;

      // Copy to clipboard
      await navigator.clipboard.writeText(shareUrl);

      setLinkCopied(true);
      toast({
        title: "Link copied!",
        description: "Shareable link has been copied to your clipboard",
      });

      // Reset the copied state after 3 seconds
      setTimeout(() => setLinkCopied(false), 3000);
    } catch (error) {
      console.error("Error generating share link:", error);
      toast({
        title: "Failed to generate link",
        description: error instanceof Error ? error.message : "Could not create shareable link",
        variant: "destructive",
      });
    } finally {
      setCopyingLink(false);
    }
  };

  const analyzeFile = async (selectedFile: File): Promise<AnalysisResult> => {
    const normalizeAnalysisResult = (raw: any): AnalysisResult => {
      const status: AnalysisResult["status"] =
        raw?.status === "safe" || raw?.status === "warning" || raw?.status === "danger"
          ? raw.status
          : "warning";

      const confidenceRaw = typeof raw?.confidence === "number" ? raw.confidence : 0;
      const confidence = Math.max(0, Math.min(100, Math.round(confidenceRaw)));

      const findings = Array.isArray(raw?.findings)
        ? raw.findings.filter((f: unknown): f is string => typeof f === "string")
        : ["No findings returned from analysis."];

      const heatmapRegions = Array.isArray(raw?.heatmapRegions) ? raw.heatmapRegions : undefined;

      return {
        status,
        confidence,
        findings,
        heatmapRegions,
      };
    };

    let fileBase64 = "";
    if (selectedFile.type.startsWith("image/")) {
      fileBase64 = await fileToBase64(selectedFile);
    }

    const { data, error } = await supabase.functions.invoke("analyze-media", {
      body: {
        fileName: selectedFile.name,
        fileType: selectedFile.type,
        fileBase64: fileBase64,
        sensitivity: sensitivity,
      },
    });

    if (error) throw error;
    if (data.error) throw new Error(data.error);

    return normalizeAnalysisResult(data);
  };

  const getSensitivityLabel = (value: number) => {
    if (value <= 33) return { label: "Low", color: "text-success" };
    if (value <= 66) return { label: "Medium", color: "text-warning" };
    return { label: "High", color: "text-destructive" };
  };

  const processFile = async (selectedFile: File) => {
    console.log("processFile called:", selectedFile.name, selectedFile.type, selectedFile.size);
    
    if (selectedFile.size > 10 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please upload a file smaller than 10MB",
        variant: "destructive",
      });
      return;
    }

    setFile(selectedFile);
    setResult(null);
    setAnalyzing(true);
    setProgress(0);
    setCurrentStage(0);
    setShowHeatmap(true);
    setLastAnalysisId(null);
    setLinkCopied(false);

    // Create preview URL for images and videos
    try {
      if (selectedFile.type.startsWith("image/")) {
        const url = URL.createObjectURL(selectedFile);
        setFilePreviewUrl(url);
        
        // Create image element for forensic analysis
        const img = new Image();
        img.onload = () => setImageElement(img);
        img.src = url;
      } else if (selectedFile.type.startsWith("video/")) {
        console.log("Creating video preview URL");
        const url = URL.createObjectURL(selectedFile);
        setFilePreviewUrl(url);
        setImageElement(null);
      } else {
        setFilePreviewUrl(null);
        setImageElement(null);
      }
    } catch (previewError) {
      console.error("Error creating preview:", previewError);
      setFilePreviewUrl(null);
      setImageElement(null);
    }

    try {
      console.log("Starting analysis for:", selectedFile.name);
      const analysisResult = await analyzeFile(selectedFile);
      console.log("Analysis complete:", analysisResult);
      setResult(analysisResult);

      const analysisId = await saveToHistory(selectedFile, analysisResult);
      setLastAnalysisId(analysisId);

      // Play sound effect for analysis result
      if (soundEnabled) {
        playAnalysisComplete(analysisResult.status);
      }

      // Fire confetti celebration for authentic files
      if (analysisResult.status === "safe") {
        fireCelebration();
      }

      // Send browser notification if enabled
      if (notificationsEnabled) {
        notifyAnalysisComplete(analysisResult.status, selectedFile.name);
      }

      if (user) {
        toast({
          title: "Analysis complete",
          description: "Result saved to your history",
        });
      }
    } catch (error) {
      console.error("Analysis error:", error);
      toast({
        title: "Analysis failed",
        description: error instanceof Error ? error.message : "Failed to analyze file. Please try again.",
        variant: "destructive",
      });
      setFile(null);
      setFilePreviewUrl(null);
      setResult(null);
    } finally {
      setAnalyzing(false);
    }
  };

  const startBatchAnalysis = async () => {
    if (batchFiles.length === 0) return;

    setBatchAnalyzing(true);
    
    for (let i = 0; i < batchFiles.length; i++) {
      const batchFile = batchFiles[i];
      if (batchFile.status !== "pending") continue;

      // Update status to analyzing
      setBatchFiles(prev => prev.map(f => 
        f.id === batchFile.id ? { ...f, status: "analyzing" as const, progress: 0 } : f
      ));

      // Simulate progress
      const progressInterval = setInterval(() => {
        setBatchFiles(prev => prev.map(f => {
          if (f.id !== batchFile.id || f.status !== "analyzing") return f;
          const newProgress = Math.min(f.progress + Math.random() * 15 + 5, 90);
          return { ...f, progress: newProgress };
        }));
      }, 300);

      try {
        const analysisResult = await analyzeFile(batchFile.file);
        
        clearInterval(progressInterval);
        
        setBatchFiles(prev => prev.map(f => 
          f.id === batchFile.id ? { ...f, status: "complete" as const, result: analysisResult, progress: 100 } : f
        ));

        await saveToHistory(batchFile.file, analysisResult);
      } catch (error) {
        clearInterval(progressInterval);
        
        setBatchFiles(prev => prev.map(f => 
          f.id === batchFile.id ? { 
            ...f, 
            status: "error" as const, 
            error: error instanceof Error ? error.message : "Analysis failed",
            progress: 0 
          } : f
        ));
      }
    }

    setBatchAnalyzing(false);
    
    const completedCount = batchFiles.filter(f => f.status === "complete" || f.result).length + 
      batchFiles.filter(f => f.status === "pending").length;

    // Determine overall status for sound/notification
    const safeCount = batchFiles.filter(f => f.result?.status === "safe").length;
    const warningCount = batchFiles.filter(f => f.result?.status === "warning").length;
    const dangerCount = batchFiles.filter(f => f.result?.status === "danger").length;
    const overallStatus = dangerCount > 0 ? "danger" : warningCount > 0 ? "warning" : "safe";

    // Play sound effect for batch completion
    if (soundEnabled) {
      playAnalysisComplete(overallStatus);
    }

    // Fire confetti if overall status is safe
    if (overallStatus === "safe") {
      fireCelebration();
    }

    // Send browser notification for batch completion
    if (notificationsEnabled) {
      notifyAnalysisComplete(overallStatus, `${batchFiles.length} files analyzed`);
    }
    
    toast({
      title: "Batch analysis complete",
      description: `Analyzed ${batchFiles.length} files`,
    });
  };

  const clearFile = () => {
    if (filePreviewUrl) {
      URL.revokeObjectURL(filePreviewUrl);
    }
    setFile(null);
    setFilePreviewUrl(null);
    setResult(null);
    setProgress(0);
    setCurrentStage(0);
    setShowHeatmap(true);
    setLastAnalysisId(null);
    setLinkCopied(false);
  };

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

  const batchComplete = batchFiles.length > 0 && batchFiles.every(f => f.status === "complete" || f.status === "error");
  const batchPending = batchFiles.some(f => f.status === "pending");

  return (
    <section id="analyzer" className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 gradient-glow opacity-30" />
      
      {/* Animated background particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 rounded-full bg-primary/20"
            animate={{
              x: [0, Math.random() * 100 - 50],
              y: [0, Math.random() * 100 - 50],
              opacity: [0.2, 0.5, 0.2],
            }}
            transition={{
              duration: 4 + Math.random() * 2,
              repeat: Infinity,
              repeatType: "reverse",
            }}
            style={{
              left: `${10 + i * 15}%`,
              top: `${20 + (i % 3) * 25}%`,
            }}
          />
        ))}
      </div>
      
      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ type: "spring", delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-6"
          >
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium">Powered by Advanced AI</span>
          </motion.div>
          
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">
            Try the <span className="text-gradient">Analyzer</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            Upload any image, video, or audio file to detect potential AI manipulation
            {!user && (
              <span className="block mt-2 text-sm text-primary/80">
                Sign in to save your analysis history
              </span>
            )}
          </p>

          {/* Mode toggle */}
          <div className="flex items-center justify-center gap-2 mt-6 flex-wrap">
            <Button
              variant={analysisMode === "file" ? "default" : "outline"}
              size="sm"
              onClick={() => {
                setAnalysisMode("file");
                clearBatchFiles();
              }}
              disabled={batchAnalyzing || analyzing}
            >
              <Upload className="w-4 h-4 mr-2" />
              Single File
            </Button>
            <Button
              variant={analysisMode === "batch" ? "default" : "outline"}
              size="sm"
              onClick={() => {
                setAnalysisMode("batch");
                clearFile();
              }}
              disabled={analyzing || batchAnalyzing}
            >
              <Files className="w-4 h-4 mr-2" />
              Batch Analysis
            </Button>
            <Button
              variant={analysisMode === "url" ? "default" : "outline"}
              size="sm"
              onClick={() => {
                setAnalysisMode("url");
                clearFile();
                clearBatchFiles();
              }}
              disabled={analyzing || batchAnalyzing}
            >
              <Link className="w-4 h-4 mr-2" />
              Analyze URL
            </Button>
            <Button
              variant={analysisMode === "reverse" ? "default" : "outline"}
              size="sm"
              onClick={() => {
                setAnalysisMode("reverse");
                clearFile();
                clearBatchFiles();
              }}
              disabled={analyzing || batchAnalyzing}
            >
              <Search className="w-4 h-4 mr-2" />
              Reverse Search
            </Button>
            <Button
              variant={analysisMode === "audio" ? "default" : "outline"}
              size="sm"
              onClick={() => {
                setAnalysisMode("audio");
                clearFile();
                clearBatchFiles();
              }}
              disabled={analyzing || batchAnalyzing}
            >
              <Volume2 className="w-4 h-4 mr-2" />
              Voice Detection
            </Button>
            <Button
              variant={analysisMode === "compare" ? "default" : "outline"}
              size="sm"
              onClick={() => {
                setAnalysisMode("compare");
                clearFile();
                clearBatchFiles();
              }}
              disabled={analyzing || batchAnalyzing}
            >
              <Scale className="w-4 h-4 mr-2" />
              Compare
            </Button>
            {/* Notification toggle */}
            {notificationsSupported && (
              <Button
                variant={notificationsEnabled ? "default" : "outline"}
                size="sm"
                onClick={toggleNotifications}
                title={notificationsEnabled ? "Notifications enabled" : "Enable notifications"}
              >
                {notificationsEnabled ? (
                  <Bell className="w-4 h-4" />
                ) : (
                  <BellOff className="w-4 h-4" />
                )}
              </Button>
            )}
            {/* Sound toggle */}
            <Button
              variant={soundEnabled ? "default" : "outline"}
              size="sm"
              onClick={toggleSound}
              title={soundEnabled ? "Sound effects enabled" : "Sound effects disabled"}
            >
              {soundEnabled ? (
                <Volume1 className="w-4 h-4" />
              ) : (
                <VolumeX className="w-4 h-4" />
              )}
            </Button>
            {/* Sensitivity toggle */}
            <Button
              variant={showSensitivityPanel ? "default" : "outline"}
              size="sm"
              onClick={() => setShowSensitivityPanel(!showSensitivityPanel)}
              title="Adjust detection sensitivity (S)"
            >
              <SlidersHorizontal className="w-4 h-4" />
            </Button>
            {/* Keyboard shortcuts tooltip */}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="hidden md:flex"
                    title="Keyboard shortcuts"
                  >
                    <Keyboard className="w-4 h-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="max-w-xs">
                  <div className="space-y-1.5 text-xs">
                    <p className="font-semibold text-sm mb-2">Keyboard Shortcuts</p>
                    {keyboardShortcutsList.map((shortcut) => (
                      <div key={shortcut.key} className="flex items-center justify-between gap-4">
                        <span className="text-muted-foreground">{shortcut.description}</span>
                        <kbd className="px-1.5 py-0.5 rounded bg-muted font-mono text-[10px]">
                          {shortcut.key}
                        </kbd>
                      </div>
                    ))}
                  </div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

          {/* Sensitivity Panel */}
          <AnimatePresence>
            {showSensitivityPanel && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-4 max-w-md mx-auto"
              >
                <div className="glass rounded-xl p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-sm font-medium flex items-center gap-2">
                      <SlidersHorizontal className="w-4 h-4 text-primary" />
                      Detection Sensitivity
                    </h4>
                    <span className={`text-sm font-semibold ${getSensitivityLabel(sensitivity).color}`}>
                      {getSensitivityLabel(sensitivity).label} ({sensitivity}%)
                    </span>
                  </div>
                  <Slider
                    value={[sensitivity]}
                    onValueChange={(value) => setSensitivity(value[0])}
                    min={0}
                    max={100}
                    step={1}
                    className="w-full"
                    disabled={analyzing || batchAnalyzing}
                  />
                  <div className="flex justify-between mt-2 text-xs text-muted-foreground">
                    <span>Lenient</span>
                    <span>Balanced</span>
                    <span>Strict</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-3">
                    {sensitivity <= 33 
                      ? "Low: Only flags obvious manipulation. Best for reducing false positives."
                      : sensitivity <= 66
                      ? "Medium: Balanced detection for most use cases."
                      : "High: Aggressive detection, flags even subtle anomalies. May increase false positives."}
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto"
        >
          {analysisMode === "compare" ? (
            // Comparison mode
            <ComparisonView sensitivity={sensitivity} />
          ) : analysisMode === "audio" ? (
            // Audio deepfake detection mode
            <AudioAnalyzer user={user} toast={toast} />
          ) : analysisMode === "reverse" ? (
            // Reverse image search mode
            <ReverseImageSearch 
              initialImageUrl={externalImageUrl || undefined} 
              onClose={() => {
                onExternalImageProcessed?.();
              }}
            />
          ) : analysisMode === "url" ? (
            // URL analysis mode
            <UrlAnalyzer />
          ) : analysisMode === "batch" ? (
            // Batch mode UI
            <div className="space-y-4">
              {/* Drop zone for batch */}
              <div
                className={`relative rounded-2xl border-2 border-dashed transition-all duration-500 backdrop-blur-sm p-8 ${
                  isDragging
                    ? "border-primary bg-primary/10 scale-[1.02] shadow-lg shadow-primary/20"
                    : "border-border hover:border-primary/50 hover:bg-card/30"
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <AnimatePresence>
                  {isDragging && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/20 to-transparent pointer-events-none"
                    />
                  )}
                </AnimatePresence>

                <div className="text-center">
                  <motion.div 
                    className={`w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center transition-all duration-300 ${
                      isDragging ? "bg-primary/20 scale-110" : "glass"
                    }`}
                    animate={isDragging ? { scale: [1.1, 1.15, 1.1] } : {}}
                    transition={{ duration: 1, repeat: Infinity }}
                  >
                    <Files className={`w-8 h-8 transition-colors duration-300 ${isDragging ? "text-primary" : "text-muted-foreground"}`} />
                  </motion.div>
                  
                  <h3 className="font-display text-lg font-semibold mb-2">
                    {isDragging ? "Drop files to add" : "Drop multiple files here"}
                  </h3>
                  <p className="text-muted-foreground text-sm mb-4">
                    or click to browse • Up to 10MB per file
                  </p>
                  
                  <input
                    type="file"
                    accept="image/*,video/*,audio/*"
                    onChange={handleFileSelect}
                    className="hidden"
                    id="batch-file-upload"
                    multiple
                    disabled={batchAnalyzing}
                  />
                  <label htmlFor="batch-file-upload">
                    <Button variant="outline" size="sm" asChild disabled={batchAnalyzing}>
                      <span className="cursor-pointer">
                        <Upload className="w-4 h-4 mr-2" />
                        Add Files
                      </span>
                    </Button>
                  </label>
                </div>
              </div>

              {/* Batch file list */}
              {batchFiles.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="glass rounded-xl p-4 space-y-3"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-sm">
                      Files ({batchFiles.length})
                    </h4>
                    {!batchAnalyzing && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={clearBatchFiles}
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="w-4 h-4 mr-1" />
                        Clear All
                      </Button>
                    )}
                  </div>

                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {batchFiles.map((batchFile) => {
                      const FileIcon = getFileIcon(batchFile.file.type);
                      const statusConfig = batchFile.result ? getStatusConfig(batchFile.result.status) : null;
                      
                      return (
                        <motion.div
                          key={batchFile.id}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 10 }}
                          className={`flex items-center gap-3 p-3 rounded-lg border transition-colors ${
                            batchFile.status === "complete" 
                              ? `${statusConfig?.bg} ${statusConfig?.border}` 
                              : batchFile.status === "error"
                              ? "bg-destructive/10 border-destructive/30"
                              : batchFile.status === "analyzing"
                              ? "bg-primary/10 border-primary/30"
                              : "bg-muted/30 border-border"
                          }`}
                        >
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                            batchFile.status === "complete" 
                              ? statusConfig?.bg 
                              : batchFile.status === "error"
                              ? "bg-destructive/20"
                              : "bg-muted/50"
                          }`}>
                            {batchFile.status === "analyzing" ? (
                              <Loader2 className="w-5 h-5 text-primary animate-spin" />
                            ) : batchFile.status === "complete" && statusConfig ? (
                              <statusConfig.icon className={`w-5 h-5 ${statusConfig.color}`} />
                            ) : batchFile.status === "error" ? (
                              <XCircle className="w-5 h-5 text-destructive" />
                            ) : (
                              <FileIcon className="w-5 h-5 text-muted-foreground" />
                            )}
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{batchFile.file.name}</p>
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-muted-foreground">
                                {formatFileSize(batchFile.file.size)}
                              </span>
                              {batchFile.status === "complete" && batchFile.result && (
                                <span className={`text-xs font-medium ${statusConfig?.color}`}>
                                  {statusConfig?.label} • {batchFile.result.confidence}%
                                </span>
                              )}
                              {batchFile.status === "error" && (
                                <span className="text-xs text-destructive">
                                  {batchFile.error}
                                </span>
                              )}
                            </div>
                            {batchFile.status === "analyzing" && (
                              <Progress value={batchFile.progress} className="h-1 mt-1" />
                            )}
                          </div>
                          
                          {batchFile.status === "pending" && !batchAnalyzing && (
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => removeBatchFile(batchFile.id)}
                              className="shrink-0 h-8 w-8 hover:bg-destructive/10 hover:text-destructive"
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          )}
                        </motion.div>
                      );
                    })}
                  </div>

                  {/* Batch actions */}
                  <div className="flex items-center gap-2 pt-2 border-t border-border">
                    {batchPending && !batchAnalyzing && (
                      <Button onClick={startBatchAnalysis} className="flex-1">
                        <Sparkles className="w-4 h-4 mr-2" />
                        Analyze {batchFiles.filter(f => f.status === "pending").length} Files
                      </Button>
                    )}
                    {batchAnalyzing && (
                      <div className="flex-1 flex items-center justify-center gap-2 py-2">
                        <Loader2 className="w-4 h-4 animate-spin text-primary" />
                        <span className="text-sm text-muted-foreground">
                          Analyzing {batchFiles.filter(f => f.status === "analyzing").length > 0 ? 
                            `${batchFiles.findIndex(f => f.status === "analyzing") + 1} of ${batchFiles.length}` : 
                            "..."
                          }
                        </span>
                      </div>
                    )}
                    {batchComplete && (
                      <>
                        <Button variant="outline" onClick={clearBatchFiles} className="flex-1">
                          <Upload className="w-4 h-4 mr-2" />
                          Analyze More Files
                        </Button>
                        <Button 
                          variant="default" 
                          onClick={() => {
                            const exportData = batchFiles.map(bf => ({
                              fileName: bf.file.name,
                              fileType: bf.file.type,
                              fileSize: bf.file.size,
                              result: bf.result,
                              error: bf.error,
                            }));
                            exportBatchAnalysisToPDF(exportData, sensitivity);
                            toast({
                              title: "Report exported",
                              description: "Batch analysis report has been downloaded as PDF",
                            });
                          }}
                          className="flex-1"
                        >
                          <Download className="w-4 h-4 mr-2" />
                          Export PDF Report
                        </Button>
                      </>
                    )}
                  </div>
                </motion.div>
              )}
            </div>
          ) : (
            // Single file mode UI (existing)
            <div
              className={`relative rounded-2xl border-2 border-dashed transition-all duration-500 backdrop-blur-sm ${
                isDragging
                  ? "border-primary bg-primary/10 scale-[1.02] shadow-lg shadow-primary/20"
                  : file
                  ? "border-border/50 bg-card/50"
                  : "border-border hover:border-primary/50 hover:bg-card/30"
              } ${file ? "p-8" : "p-12"}`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              {/* Drag overlay animation */}
              <AnimatePresence>
                {isDragging && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/20 to-transparent pointer-events-none"
                  />
                )}
              </AnimatePresence>

              <AnimatePresence mode="wait">
                {!file ? (
                  <motion.div
                    key="upload"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="text-center"
                  >
                    <motion.div 
                      className={`w-24 h-24 rounded-full mx-auto mb-6 flex items-center justify-center transition-all duration-300 ${
                        isDragging 
                          ? "bg-primary/20 scale-110" 
                          : "glass"
                      }`}
                      animate={isDragging ? { scale: [1.1, 1.15, 1.1] } : {}}
                      transition={{ duration: 1, repeat: Infinity }}
                    >
                      <Upload className={`w-10 h-10 transition-colors duration-300 ${isDragging ? "text-primary" : "text-muted-foreground"}`} />
                    </motion.div>
                    
                    <h3 className="font-display text-xl font-semibold mb-2">
                      {isDragging ? "Drop to analyze" : "Drag & drop your file"}
                    </h3>
                    <p className="text-muted-foreground mb-6">
                      or click to browse • Images, videos, audio (max 10MB)
                    </p>
                    
                    {/* File type badges */}
                    <div className="flex items-center justify-center gap-3 mb-6">
                      {[
                        { icon: FileImage, label: "Images" },
                        { icon: FileVideo, label: "Videos" },
                        { icon: FileAudio, label: "Audio" },
                      ].map(({ icon: Icon, label }) => (
                        <div key={label} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-muted/50 text-xs text-muted-foreground">
                          <Icon className="w-3.5 h-3.5" />
                          {label}
                        </div>
                      ))}
                    </div>
                    
                    <input
                      type="file"
                      accept="image/*,video/*,audio/*"
                      onChange={handleFileSelect}
                      className="hidden"
                      id="file-upload"
                    />
                    <label htmlFor="file-upload">
                      <Button variant="default" size="lg" asChild className="group">
                        <span className="cursor-pointer">
                          <Upload className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
                          Browse Files
                        </span>
                      </Button>
                    </label>

                    {/* Demo samples */}
                    <DemoSamples
                      onSelectSample={processFile}
                      disabled={analyzing}
                    />
                  </motion.div>
                ) : (
                  <motion.div
                    key="file"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                  >
                    {/* File info header with progress ring */}
                    <div className="flex items-center gap-4 mb-6">
                      {analyzing ? (
                        <ProgressRing progress={progress} size={64} strokeWidth={4}>
                          <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center">
                            {(() => {
                              const FileIcon = getFileIcon(file.type);
                              return <FileIcon className="w-6 h-6 text-primary" />;
                            })()}
                          </div>
                        </ProgressRing>
                      ) : (
                        <motion.div 
                          className="w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: "spring", delay: 0.1 }}
                        >
                          {(() => {
                            const FileIcon = getFileIcon(file.type);
                            return <FileIcon className="w-7 h-7 text-primary" />;
                          })()}
                        </motion.div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold truncate text-lg">{file.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {formatFileSize(file.size)} • {file.type.split('/')[0]}
                        </p>
                      </div>
                      {!analyzing && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={clearFile}
                          className="shrink-0 hover:bg-destructive/10 hover:text-destructive"
                        >
                          <X className="w-5 h-5" />
                        </Button>
                      )}
                    </div>

                    {analyzing ? (
                      <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="space-y-6"
                      >
                        {/* Progress bar */}
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Analyzing...</span>
                            <span className="font-mono text-primary">{Math.round(progress)}%</span>
                          </div>
                          <Progress value={progress} className="h-2" />
                        </div>

                        {/* Analysis stages */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                          {analysisStages.map((stage, index) => {
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
                                
                                {/* Pulse animation for active stage */}
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
                          <motion.div
                            className="flex items-center gap-1"
                          >
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
                            {analysisStages[currentStage]?.description || "Processing..."}
                          </span>
                        </div>

                        {/* Results skeleton preview */}
                        <AnalyzerSkeleton />
                      </motion.div>
                    ) : result ? (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="space-y-6"
                      >
                        {(() => {
                          const config = getStatusConfig(result.status);
                          const StatusIcon = config.icon;
                          return (
                            <motion.div 
                              className={`relative rounded-xl p-6 overflow-hidden bg-gradient-to-br ${config.gradient} border ${config.border}`}
                              initial={{ y: 20 }}
                              animate={{ y: 0 }}
                            >
                              {/* Animated background shimmer */}
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
                                    Analysis complete
                                  </p>
                                </div>
                                <motion.div 
                                  className="text-right"
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  transition={{ type: "spring", delay: 0.4 }}
                                >
                                  <div className={`text-4xl font-display font-bold ${config.color}`}>
                                    {result.confidence}%
                                  </div>
                                  <p className="text-xs text-muted-foreground">confidence</p>
                                </motion.div>
                              </div>
                            </motion.div>
                          );
                        })()}

                        {/* Video preview for videos */}
                        {filePreviewUrl && file?.type.startsWith("video/") && (
                          <motion.div 
                            className="glass rounded-xl p-4"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.25 }}
                          >
                            <h4 className="font-display font-semibold flex items-center gap-2 mb-3">
                              <FileVideo className="w-4 h-4 text-primary" />
                              Video Preview
                            </h4>
                            <video 
                              src={filePreviewUrl} 
                              controls 
                                className="w-full rounded-lg max-h-[400px] bg-muted"
                              preload="metadata"
                            />
                            <p className="text-xs text-muted-foreground mt-2 text-center">
                              Video analyzed for deepfake patterns
                            </p>
                          </motion.div>
                        )}

                        {/* Heatmap visualization for images */}
                        {filePreviewUrl && file?.type.startsWith("image/") && result.heatmapRegions && result.heatmapRegions.length > 0 && (
                          <motion.div 
                            className="glass rounded-xl p-4"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.25 }}
                          >
                            <div className="flex items-center justify-between mb-3">
                              <h4 className="font-display font-semibold flex items-center gap-2">
                                <Eye className="w-4 h-4 text-primary" />
                                Detection Heatmap
                              </h4>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setShowHeatmap(!showHeatmap)}
                                className="h-8 px-2 text-xs"
                              >
                                {showHeatmap ? (
                                  <>
                                    <EyeOff className="w-3.5 h-3.5 mr-1" />
                                    Hide
                                  </>
                                ) : (
                                  <>
                                    <Eye className="w-3.5 h-3.5 mr-1" />
                                    Show
                                  </>
                                )}
                              </Button>
                            </div>
                            
                            <AnimatePresence>
                              {showHeatmap && (
                                <motion.div
                                  initial={{ opacity: 0, height: 0 }}
                                  animate={{ opacity: 1, height: "auto" }}
                                  exit={{ opacity: 0, height: 0 }}
                                  transition={{ duration: 0.3 }}
                                >
                                  <HeatmapOverlay
                                    imageUrl={filePreviewUrl}
                                    regions={result.heatmapRegions}
                                  />
                                  <p className="text-xs text-muted-foreground mt-2 text-center">
                                    Hover over highlighted regions to see details
                                  </p>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </motion.div>
                        )}

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
                            {(result.findings ?? []).map((finding, index) => (
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

                        {/* Social Share Buttons */}
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.5 }}
                          className="flex items-center justify-between"
                        >
                          <span className="text-sm text-muted-foreground">Share result:</span>
                          <SocialShareButtons
                            title={result.status === "safe" ? "Authentic Content Verified" : result.status === "warning" ? "Suspicious Content Detected" : "Manipulated Content Detected"}
                            text={`Analysis of ${file.name}`}
                            status={result.status}
                            confidence={result.confidence}
                          />
                        </motion.div>

                        {/* Forensic Analysis Button */}
                        {file?.type.startsWith("image/") && imageElement && (
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.55 }}
                          >
                            <Button
                              variant={showForensicPanel ? "default" : "outline"}
                              onClick={() => setShowForensicPanel(!showForensicPanel)}
                              className="w-full gap-2"
                            >
                              <Fingerprint className="w-4 h-4" />
                              {showForensicPanel ? "Hide Forensic Analysis" : "Run Client-Side Forensic Analysis"}
                            </Button>
                            <p className="text-xs text-muted-foreground mt-2 text-center">
                              Uses face-api.js, TensorFlow.js, and ELA for local analysis
                            </p>
                          </motion.div>
                        )}

                        {/* Forensic Analysis Panel */}
                        <AnimatePresence>
                          {showForensicPanel && file?.type.startsWith("image/") && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              exit={{ opacity: 0, height: 0 }}
                            >
                              <ForensicAnalysisPanel
                                imageElement={imageElement}
                                file={file}
                                isAnalyzing={showForensicPanel}
                              />
                            </motion.div>
                          )}
                        </AnimatePresence>

                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.6 }}
                          className="flex flex-wrap gap-2"
                        >
                          <Button 
                            variant="default" 
                            onClick={() => {
                              if (file && result) {
                                exportAnalysisToPDF(
                                  result,
                                  file.name,
                                  file.type,
                                  file.size,
                                  filePreviewUrl,
                                  sensitivity
                                );
                                toast({
                                  title: "Report exported",
                                  description: "PDF report has been downloaded",
                                });
                              }
                            }} 
                            className="flex-1 min-w-[140px] group"
                          >
                            <Download className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
                            Export PDF
                          </Button>
                          <Button 
                            variant="secondary" 
                            onClick={() => setShowEmailDialog(true)}
                            className="flex-1 min-w-[120px] group"
                          >
                            <Mail className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
                            Email
                          </Button>
                          <Button 
                            variant="secondary" 
                            onClick={generateShareLink}
                            disabled={copyingLink || !user}
                            className="flex-1 min-w-[120px] group"
                            title={!user ? "Sign in to share links" : "Copy shareable link"}
                          >
                            {copyingLink ? (
                              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            ) : linkCopied ? (
                              <Check className="w-4 h-4 mr-2 text-success" />
                            ) : (
                              <Link2 className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
                            )}
                            {linkCopied ? "Copied!" : "Copy Link"}
                          </Button>
                          <Button variant="outline" onClick={clearFile} className="flex-1 min-w-[120px] group">
                            <Upload className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
                            Analyze Another
                          </Button>
                        </motion.div>
                      </motion.div>
                    ) : null}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </motion.div>
      </div>

      {/* Email Share Dialog */}
      {file && result && (
        <EmailShareDialog
          open={showEmailDialog}
          onOpenChange={setShowEmailDialog}
          result={result}
          fileName={file.name}
          fileType={file.type}
          fileSize={file.size}
          sensitivity={sensitivity}
        />
      )}
    </section>
  );
};

export default AnalyzerSection;
