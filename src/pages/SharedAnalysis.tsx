import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FileImage,
  FileVideo,
  FileAudio,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Loader2,
  Shield,
  Clock,
  HardDrive,
  Sparkles,
  Home,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";

interface SharedAnalysisData {
  id: string;
  file_name: string;
  file_type: string;
  file_size: number;
  status: "safe" | "warning" | "danger";
  confidence: number;
  findings: string[];
  created_at: string;
}

const SharedAnalysis = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<SharedAnalysisData | null>(null);

  const token = searchParams.get("token");

  useEffect(() => {
    if (!token) {
      setError("No share token provided");
      setLoading(false);
      return;
    }

    const fetchSharedAnalysis = async () => {
      try {
        const { data, error: fnError } = await supabase.functions.invoke(
          "get-shared-analysis",
          {
            body: null,
            headers: {},
          }
        );

        // Since we can't pass query params through invoke, we'll use a direct fetch
        const response = await fetch(
          `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/get-shared-analysis?token=${encodeURIComponent(token)}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.error || "Failed to fetch shared analysis");
        }

        setAnalysis(result.analysis);
      } catch (err) {
        console.error("Error fetching shared analysis:", err);
        setError(err instanceof Error ? err.message : "Failed to load shared analysis");
      } finally {
        setLoading(false);
      }
    };

    fetchSharedAnalysis();
  }, [token]);

  const getFileIcon = (type: string) => {
    if (type.startsWith("image")) return FileImage;
    if (type.startsWith("video")) return FileVideo;
    if (type.startsWith("audio")) return FileAudio;
    return FileImage;
  };

  const getStatusConfig = (status: string) => {
    switch (status) {
      case "safe":
        return { icon: CheckCircle2, color: "text-success", bg: "bg-success/10", label: "Authentic" };
      case "warning":
        return { icon: AlertTriangle, color: "text-warning", bg: "bg-warning/10", label: "Suspicious" };
      case "danger":
        return { icon: XCircle, color: "text-destructive", bg: "bg-destructive/10", label: "Likely Fake" };
      default:
        return { icon: CheckCircle2, color: "text-success", bg: "bg-success/10", label: "Authentic" };
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !analysis) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-6 pt-24 pb-12">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-lg mx-auto glass rounded-2xl p-8 text-center"
          >
            <AlertCircle className="w-16 h-16 text-destructive mx-auto mb-4" />
            <h1 className="font-display text-2xl font-bold mb-2">Analysis Not Found</h1>
            <p className="text-muted-foreground mb-6">
              {error || "This shared analysis link is invalid or has expired."}
            </p>
            <Button onClick={() => navigate("/")} className="gap-2">
              <Home className="w-4 h-4" />
              Go to Home
            </Button>
          </motion.div>
        </div>
      </div>
    );
  }

  const FileIcon = getFileIcon(analysis.file_type);
  const statusConfig = getStatusConfig(analysis.status);
  const StatusIcon = statusConfig.icon;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-6 pt-24 pb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl mx-auto"
        >
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm mb-4">
              <Shield className="w-4 h-4" />
              Shared Analysis Report
            </div>
            <h1 className="font-display text-3xl font-bold mb-2">DeepGuard Analysis</h1>
            <p className="text-muted-foreground">
              Someone shared this deepfake analysis result with you
            </p>
          </div>

          {/* File Info */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass rounded-xl p-6 mb-6"
          >
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center">
                <FileIcon className="w-7 h-7 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="font-semibold text-lg truncate">{analysis.file_name}</h2>
                <p className="text-sm text-muted-foreground">
                  {formatFileSize(analysis.file_size)} • {analysis.file_type.split("/")[0]}
                </p>
              </div>
            </div>
          </motion.div>

          {/* Status Card */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className={`rounded-xl p-6 bg-gradient-to-br ${statusConfig.bg} border ${statusConfig.color.replace("text-", "border-")}/30 mb-6`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <StatusIcon className={`w-12 h-12 ${statusConfig.color}`} />
                <div>
                  <p className={`text-2xl font-bold ${statusConfig.color}`}>
                    {statusConfig.label}
                  </p>
                  <p className="text-sm text-muted-foreground">Analysis Result</p>
                </div>
              </div>
              <div className="text-right">
                <p className={`text-4xl font-bold ${statusConfig.color}`}>
                  {analysis.confidence}%
                </p>
                <p className="text-xs text-muted-foreground">Confidence</p>
              </div>
            </div>
            <div className="mt-4">
              <Progress value={analysis.confidence} className="h-2" />
            </div>
          </motion.div>

          {/* Details Grid */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="glass rounded-lg p-4"
            >
              <div className="flex items-center gap-2 text-muted-foreground mb-1">
                <HardDrive className="w-4 h-4" />
                <span className="text-xs">File Size</span>
              </div>
              <p className="font-semibold">{formatFileSize(analysis.file_size)}</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.25 }}
              className="glass rounded-lg p-4"
            >
              <div className="flex items-center gap-2 text-muted-foreground mb-1">
                <Clock className="w-4 h-4" />
                <span className="text-xs">Analyzed On</span>
              </div>
              <p className="font-semibold text-sm">{formatDate(analysis.created_at)}</p>
            </motion.div>
          </div>

          {/* Findings */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="glass rounded-xl p-6 mb-6"
          >
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-5 h-5 text-primary" />
              <h3 className="font-semibold">AI Analysis Findings</h3>
              <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                {analysis.findings.length} {analysis.findings.length === 1 ? "finding" : "findings"}
              </span>
            </div>

            <ul className="space-y-3">
              {analysis.findings.map((finding, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.35 + index * 0.05 }}
                  className="flex items-start gap-3 p-3 rounded-lg bg-muted/50"
                >
                  <span className="w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-medium flex items-center justify-center shrink-0 mt-0.5">
                    {index + 1}
                  </span>
                  <p className="text-sm text-muted-foreground leading-relaxed">{finding}</p>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-center"
          >
            <p className="text-sm text-muted-foreground mb-4">
              Want to analyze your own media files?
            </p>
            <Button onClick={() => navigate("/#analyzer")} size="lg" className="gap-2">
              <Shield className="w-4 h-4" />
              Try DeepGuard Free
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default SharedAnalysis;
