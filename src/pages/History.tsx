import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  ArrowLeft, 
  FileImage, 
  FileVideo, 
  FileAudio, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle,
  Trash2,
  Loader2,
  History as HistoryIcon
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/Navbar";

interface AnalysisRecord {
  id: string;
  file_name: string;
  file_type: string;
  file_size: number;
  status: "safe" | "warning" | "danger";
  confidence: number;
  findings: string[];
  created_at: string;
}

const History = () => {
  const [history, setHistory] = useState<AnalysisRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);
  
  const { user, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (user) {
      fetchHistory();
    }
  }, [user]);

  const fetchHistory = async () => {
    try {
      const { data, error } = await supabase
        .from("analysis_history")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setHistory((data || []).map(item => ({
        ...item,
        status: item.status as "safe" | "warning" | "danger"
      })));
    } catch (error) {
      console.error("Error fetching history:", error);
      toast({
        title: "Error",
        description: "Failed to load analysis history",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const deleteRecord = async (id: string) => {
    setDeleting(id);
    try {
      const { error } = await supabase
        .from("analysis_history")
        .delete()
        .eq("id", id);

      if (error) throw error;
      
      setHistory(history.filter(item => item.id !== id));
      toast({
        title: "Deleted",
        description: "Analysis record removed",
      });
    } catch (error) {
      console.error("Error deleting record:", error);
      toast({
        title: "Error",
        description: "Failed to delete record",
        variant: "destructive",
      });
    } finally {
      setDeleting(null);
    }
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
    return (bytes / 1024 / 1024).toFixed(2) + " MB";
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-6 pt-24 pb-12">
        <Button
          variant="ghost"
          onClick={() => navigate("/")}
          className="mb-8"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center gap-4 mb-8">
            <div className="w-14 h-14 rounded-xl glass flex items-center justify-center">
              <HistoryIcon className="w-7 h-7 text-primary" />
            </div>
            <div>
              <h1 className="font-display text-3xl font-bold">Analysis History</h1>
              <p className="text-muted-foreground">
                {history.length} {history.length === 1 ? "analysis" : "analyses"} performed
              </p>
            </div>
          </div>

          {history.length === 0 ? (
            <div className="glass rounded-2xl p-12 text-center">
              <HistoryIcon className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h2 className="font-display text-xl font-semibold mb-2">No analyses yet</h2>
              <p className="text-muted-foreground mb-6">
                Start by uploading a file to analyze
              </p>
              <Button variant="hero" onClick={() => navigate("/#analyzer")}>
                Go to Analyzer
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {history.map((record, index) => {
                const FileIcon = getFileIcon(record.file_type);
                const statusConfig = getStatusConfig(record.status);
                const StatusIcon = statusConfig.icon;

                return (
                  <motion.div
                    key={record.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="glass rounded-xl p-6"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                        <FileIcon className="w-6 h-6 text-primary" />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <h3 className="font-medium truncate">{record.file_name}</h3>
                            <p className="text-sm text-muted-foreground">
                              {formatFileSize(record.file_size)} • {formatDate(record.created_at)}
                            </p>
                          </div>
                          
                          <div className="flex items-center gap-3 shrink-0">
                            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full ${statusConfig.bg}`}>
                              <StatusIcon className={`w-4 h-4 ${statusConfig.color}`} />
                              <span className={`text-sm font-medium ${statusConfig.color}`}>
                                {statusConfig.label}
                              </span>
                              <span className={`text-sm ${statusConfig.color}`}>
                                {record.confidence}%
                              </span>
                            </div>
                            
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => deleteRecord(record.id)}
                              disabled={deleting === record.id}
                              className="text-muted-foreground hover:text-destructive"
                            >
                              {deleting === record.id ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                              ) : (
                                <Trash2 className="w-4 h-4" />
                              )}
                            </Button>
                          </div>
                        </div>
                        
                        <div className="mt-3 flex flex-wrap gap-2">
                          {record.findings.slice(0, 3).map((finding, idx) => (
                            <span
                              key={idx}
                              className="text-xs bg-muted px-2 py-1 rounded-md text-muted-foreground"
                            >
                              {finding.length > 50 ? finding.slice(0, 50) + "..." : finding}
                            </span>
                          ))}
                          {record.findings.length > 3 && (
                            <span className="text-xs text-muted-foreground">
                              +{record.findings.length - 3} more
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default History;
