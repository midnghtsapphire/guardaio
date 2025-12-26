import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, FileImage, FileVideo, FileAudio, X, CheckCircle2, AlertTriangle, XCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

type AnalysisResult = {
  status: "safe" | "warning" | "danger";
  confidence: number;
  findings: string[];
};

const AnalyzerSection = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const { toast } = useToast();

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
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      processFile(droppedFile);
    }
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      processFile(selectedFile);
    }
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const base64 = reader.result as string;
        // Remove the data URL prefix (e.g., "data:image/png;base64,")
        const base64Data = base64.split(",")[1];
        resolve(base64Data);
      };
      reader.onerror = (error) => reject(error);
    });
  };

  const processFile = async (selectedFile: File) => {
    // Check file size (max 10MB for API)
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

    try {
      // Convert file to base64 for images
      let fileBase64 = "";
      if (selectedFile.type.startsWith("image/")) {
        fileBase64 = await fileToBase64(selectedFile);
      }

      // Call the edge function
      const { data, error } = await supabase.functions.invoke("analyze-media", {
        body: {
          fileName: selectedFile.name,
          fileType: selectedFile.type,
          fileBase64: fileBase64,
        },
      });

      if (error) {
        throw error;
      }

      if (data.error) {
        throw new Error(data.error);
      }

      setResult(data as AnalysisResult);
    } catch (error) {
      console.error("Analysis error:", error);
      toast({
        title: "Analysis failed",
        description: error instanceof Error ? error.message : "Failed to analyze file",
        variant: "destructive",
      });
      setFile(null);
    } finally {
      setAnalyzing(false);
    }
  };

  const clearFile = () => {
    setFile(null);
    setResult(null);
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
        return { icon: CheckCircle2, color: "text-success", bg: "bg-success/10", border: "border-success/30", label: "Authentic" };
      case "warning":
        return { icon: AlertTriangle, color: "text-warning", bg: "bg-warning/10", border: "border-warning/30", label: "Suspicious" };
      case "danger":
        return { icon: XCircle, color: "text-destructive", bg: "bg-destructive/10", border: "border-destructive/30", label: "Likely Fake" };
      default:
        return { icon: CheckCircle2, color: "text-success", bg: "bg-success/10", border: "border-success/30", label: "Authentic" };
    }
  };

  return (
    <section id="analyzer" className="py-24 relative">
      <div className="absolute inset-0 gradient-glow opacity-30" />
      
      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">
            Try the <span className="text-gradient">Analyzer</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            Upload any image, video, or audio file to detect potential AI manipulation
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto"
        >
          <div
            className={`relative rounded-2xl border-2 border-dashed transition-all duration-300 ${
              isDragging
                ? "border-primary bg-primary/5"
                : "border-border hover:border-primary/50"
            } ${file ? "p-8" : "p-12"}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <AnimatePresence mode="wait">
              {!file ? (
                <motion.div
                  key="upload"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-center"
                >
                  <div className="w-20 h-20 rounded-full glass mx-auto mb-6 flex items-center justify-center">
                    <Upload className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="font-display text-xl font-semibold mb-2">
                    Drop your file here
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    or click to browse • Supports images, videos, and audio (max 10MB)
                  </p>
                  <input
                    type="file"
                    accept="image/*,video/*,audio/*"
                    onChange={handleFileSelect}
                    className="hidden"
                    id="file-upload"
                  />
                  <label htmlFor="file-upload">
                    <Button variant="glass" size="lg" asChild>
                      <span className="cursor-pointer">Browse Files</span>
                    </Button>
                  </label>
                </motion.div>
              ) : (
                <motion.div
                  key="file"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  {/* File info */}
                  <div className="flex items-center gap-4 mb-8">
                    <div className="w-14 h-14 rounded-xl glass flex items-center justify-center">
                      {(() => {
                        const FileIcon = getFileIcon(file.type);
                        return <FileIcon className="w-6 h-6 text-primary" />;
                      })()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{file.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={clearFile}
                      className="shrink-0"
                    >
                      <X className="w-5 h-5" />
                    </Button>
                  </div>

                  {/* Analysis state */}
                  {analyzing ? (
                    <div className="text-center py-8">
                      <Loader2 className="w-12 h-12 text-primary mx-auto mb-4 animate-spin" />
                      <p className="font-display text-lg font-medium">Analyzing with AI...</p>
                      <p className="text-sm text-muted-foreground">
                        Running deep learning detection models
                      </p>
                    </div>
                  ) : result ? (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="space-y-6"
                    >
                      {/* Result header */}
                      {(() => {
                        const config = getStatusConfig(result.status);
                        const StatusIcon = config.icon;
                        return (
                          <div className={`rounded-xl p-6 ${config.bg} border ${config.border}`}>
                            <div className="flex items-center gap-4">
                              <StatusIcon className={`w-12 h-12 ${config.color}`} />
                              <div className="flex-1">
                                <p className={`font-display text-2xl font-bold ${config.color}`}>
                                  {config.label}
                                </p>
                                <p className="text-muted-foreground">
                                  {result.confidence}% confidence
                                </p>
                              </div>
                              <div className="text-right">
                                <div className={`text-4xl font-display font-bold ${config.color}`}>
                                  {result.confidence}%
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })()}

                      {/* Findings */}
                      <div className="glass rounded-xl p-6">
                        <h4 className="font-display font-semibold mb-4">AI Analysis Findings</h4>
                        <ul className="space-y-3">
                          {result.findings.map((finding, index) => (
                            <motion.li
                              key={index}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.1 }}
                              className="flex items-start gap-3 text-muted-foreground"
                            >
                              <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                              {finding}
                            </motion.li>
                          ))}
                        </ul>
                      </div>

                      <Button variant="glass" onClick={clearFile} className="w-full">
                        Analyze Another File
                      </Button>
                    </motion.div>
                  ) : null}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default AnalyzerSection;
