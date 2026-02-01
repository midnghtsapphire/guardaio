import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, FileImage, FileVideo, FileAudio, Trash2, Play, CheckCircle, XCircle, Loader2, Download, FolderOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

interface BatchFile {
  id: string;
  file: File;
  status: "pending" | "analyzing" | "complete" | "error";
  result?: {
    confidence: number;
    status: string;
    findings: string[];
  };
}

const BatchAnalyzer = () => {
  const { user } = useAuth();
  const [files, setFiles] = useState<BatchFile[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [overallProgress, setOverallProgress] = useState(0);

  const getFileIcon = (type: string) => {
    if (type.startsWith("image/")) return FileImage;
    if (type.startsWith("video/")) return FileVideo;
    if (type.startsWith("audio/")) return FileAudio;
    return FileImage;
  };

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    const newFiles: BatchFile[] = selectedFiles.map((file) => ({
      id: crypto.randomUUID(),
      file,
      status: "pending",
    }));
    setFiles((prev) => [...prev, ...newFiles]);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const droppedFiles = Array.from(e.dataTransfer.files);
    const newFiles: BatchFile[] = droppedFiles.map((file) => ({
      id: crypto.randomUUID(),
      file,
      status: "pending",
    }));
    setFiles((prev) => [...prev, ...newFiles]);
  }, []);

  const removeFile = (id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  };

  const analyzeFile = async (batchFile: BatchFile): Promise<BatchFile> => {
    try {
      const base64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(batchFile.file);
      });

      const { data, error } = await supabase.functions.invoke("analyze-media", {
        body: {
          media: base64,
          mediaType: batchFile.file.type,
          fileName: batchFile.file.name,
        },
      });

      if (error) throw error;

      return {
        ...batchFile,
        status: "complete",
        result: {
          confidence: data.confidence,
          status: data.status,
          findings: data.findings || [],
        },
      };
    } catch (err) {
      console.error("Analysis error:", err);
      return { ...batchFile, status: "error" };
    }
  };

  const startBatchAnalysis = async () => {
    if (!user) {
      toast.error("Please sign in to use batch analysis");
      return;
    }

    setIsAnalyzing(true);
    setOverallProgress(0);

    const pendingFiles = files.filter((f) => f.status === "pending");
    const totalFiles = pendingFiles.length;
    let completed = 0;

    for (const file of pendingFiles) {
      setFiles((prev) =>
        prev.map((f) => (f.id === file.id ? { ...f, status: "analyzing" } : f))
      );

      const result = await analyzeFile(file);
      
      setFiles((prev) =>
        prev.map((f) => (f.id === file.id ? result : f))
      );

      completed++;
      setOverallProgress((completed / totalFiles) * 100);
    }

    setIsAnalyzing(false);
    toast.success(`Batch analysis complete! ${completed} files processed.`);
  };

  const exportResults = () => {
    const results = files
      .filter((f) => f.status === "complete")
      .map((f) => ({
        fileName: f.file.name,
        fileType: f.file.type,
        fileSize: f.file.size,
        confidence: f.result?.confidence,
        status: f.result?.status,
        findings: f.result?.findings,
      }));

    const blob = new Blob([JSON.stringify(results, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `batch-analysis-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const pendingCount = files.filter((f) => f.status === "pending").length;
  const completeCount = files.filter((f) => f.status === "complete").length;
  const errorCount = files.filter((f) => f.status === "error").length;

  return (
    <Card className="glass border-border/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FolderOpen className="w-5 h-5 text-primary" />
          Batch Analysis
        </CardTitle>
        <CardDescription>
          Upload multiple files for bulk deepfake detection analysis
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Drop Zone */}
        <div
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          className="border-2 border-dashed border-border rounded-xl p-8 text-center hover:border-primary/50 transition-colors"
        >
          <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground mb-4">
            Drag & drop files here, or click to browse
          </p>
          <input
            type="file"
            multiple
            accept="image/*,video/*,audio/*"
            onChange={handleFileSelect}
            className="hidden"
            id="batch-file-input"
          />
          <Button asChild variant="outline">
            <label htmlFor="batch-file-input" className="cursor-pointer">
              Select Files
            </label>
          </Button>
        </div>

        {/* Stats */}
        {files.length > 0 && (
          <div className="flex gap-4 flex-wrap">
            <Badge variant="outline" className="gap-1">
              {files.length} Total
            </Badge>
            <Badge variant="outline" className="gap-1 text-yellow-500">
              {pendingCount} Pending
            </Badge>
            <Badge variant="outline" className="gap-1 text-green-500">
              {completeCount} Complete
            </Badge>
            {errorCount > 0 && (
              <Badge variant="outline" className="gap-1 text-red-500">
                {errorCount} Errors
              </Badge>
            )}
          </div>
        )}

        {/* Progress Bar */}
        {isAnalyzing && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Analyzing...</span>
              <span>{Math.round(overallProgress)}%</span>
            </div>
            <Progress value={overallProgress} className="h-2" />
          </div>
        )}

        {/* File List */}
        <div className="space-y-2 max-h-80 overflow-y-auto">
          <AnimatePresence>
            {files.map((file) => {
              const Icon = getFileIcon(file.file.type);
              return (
                <motion.div
                  key={file.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="flex items-center gap-3 p-3 rounded-lg bg-secondary/50"
                >
                  <Icon className="w-5 h-5 text-primary shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{file.file.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {(file.file.size / 1024).toFixed(1)} KB
                    </p>
                  </div>
                  
                  {file.status === "pending" && (
                    <Badge variant="outline" className="text-yellow-500">Pending</Badge>
                  )}
                  {file.status === "analyzing" && (
                    <Loader2 className="w-4 h-4 animate-spin text-primary" />
                  )}
                  {file.status === "complete" && file.result && (
                    <Badge
                      variant={file.result.status === "authentic" ? "default" : "destructive"}
                      className="gap-1"
                    >
                      {file.result.status === "authentic" ? (
                        <CheckCircle className="w-3 h-3" />
                      ) : (
                        <XCircle className="w-3 h-3" />
                      )}
                      {file.result.confidence}%
                    </Badge>
                  )}
                  {file.status === "error" && (
                    <Badge variant="destructive">Error</Badge>
                  )}
                  
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeFile(file.id)}
                    disabled={file.status === "analyzing"}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* Actions */}
        {files.length > 0 && (
          <div className="flex gap-3">
            <Button
              onClick={startBatchAnalysis}
              disabled={isAnalyzing || pendingCount === 0}
              className="flex-1 gap-2"
            >
              {isAnalyzing ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Play className="w-4 h-4" />
              )}
              {isAnalyzing ? "Analyzing..." : `Analyze ${pendingCount} Files`}
            </Button>
            {completeCount > 0 && (
              <Button variant="outline" onClick={exportResults} className="gap-2">
                <Download className="w-4 h-4" />
                Export
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default BatchAnalyzer;
