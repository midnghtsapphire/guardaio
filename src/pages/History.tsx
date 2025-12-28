import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
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
  History as HistoryIcon,
  Search,
  Filter,
  SortAsc,
  SortDesc,
  Calendar,
  X,
  ChevronDown
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/Navbar";
import { format, isAfter, isBefore, startOfDay, endOfDay } from "date-fns";

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

type SortOption = "date-desc" | "date-asc" | "name-asc" | "name-desc" | "confidence-desc" | "confidence-asc";
type FileTypeFilter = "all" | "image" | "video" | "audio";
type StatusFilter = "all" | "safe" | "warning" | "danger";

const History = () => {
  const [history, setHistory] = useState<AnalysisRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);
  
  // Filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [fileTypeFilter, setFileTypeFilter] = useState<FileTypeFilter>("all");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [sortOption, setSortOption] = useState<SortOption>("date-desc");
  const [dateFrom, setDateFrom] = useState<Date | undefined>();
  const [dateTo, setDateTo] = useState<Date | undefined>();
  const [showFilters, setShowFilters] = useState(false);
  
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

  // Filtered and sorted history
  const filteredHistory = useMemo(() => {
    let result = [...history];

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(item =>
        item.file_name.toLowerCase().includes(query) ||
        item.findings.some(f => f.toLowerCase().includes(query))
      );
    }

    // File type filter
    if (fileTypeFilter !== "all") {
      result = result.filter(item => item.file_type.startsWith(fileTypeFilter));
    }

    // Status filter
    if (statusFilter !== "all") {
      result = result.filter(item => item.status === statusFilter);
    }

    // Date range filter
    if (dateFrom) {
      result = result.filter(item => 
        isAfter(new Date(item.created_at), startOfDay(dateFrom)) ||
        format(new Date(item.created_at), "yyyy-MM-dd") === format(dateFrom, "yyyy-MM-dd")
      );
    }
    if (dateTo) {
      result = result.filter(item => 
        isBefore(new Date(item.created_at), endOfDay(dateTo)) ||
        format(new Date(item.created_at), "yyyy-MM-dd") === format(dateTo, "yyyy-MM-dd")
      );
    }

    // Sorting
    result.sort((a, b) => {
      switch (sortOption) {
        case "date-desc":
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        case "date-asc":
          return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
        case "name-asc":
          return a.file_name.localeCompare(b.file_name);
        case "name-desc":
          return b.file_name.localeCompare(a.file_name);
        case "confidence-desc":
          return b.confidence - a.confidence;
        case "confidence-asc":
          return a.confidence - b.confidence;
        default:
          return 0;
      }
    });

    return result;
  }, [history, searchQuery, fileTypeFilter, statusFilter, sortOption, dateFrom, dateTo]);

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (fileTypeFilter !== "all") count++;
    if (statusFilter !== "all") count++;
    if (dateFrom) count++;
    if (dateTo) count++;
    return count;
  }, [fileTypeFilter, statusFilter, dateFrom, dateTo]);

  const clearAllFilters = () => {
    setSearchQuery("");
    setFileTypeFilter("all");
    setStatusFilter("all");
    setDateFrom(undefined);
    setDateTo(undefined);
    setSortOption("date-desc");
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
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
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
                {filteredHistory.length !== history.length && (
                  <span className="text-primary"> • {filteredHistory.length} shown</span>
                )}
              </p>
            </div>
          </div>

          {history.length > 0 && (
            <motion.div 
              className="mb-6 space-y-4"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {/* Search and main controls */}
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by file name or findings..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                  {searchQuery && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
                      onClick={() => setSearchQuery("")}
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  )}
                </div>

                <div className="flex gap-2">
                  <Button
                    variant={showFilters ? "secondary" : "outline"}
                    onClick={() => setShowFilters(!showFilters)}
                    className="relative"
                  >
                    <Filter className="w-4 h-4 mr-2" />
                    Filters
                    {activeFilterCount > 0 && (
                      <Badge variant="default" className="ml-2 h-5 w-5 p-0 flex items-center justify-center text-xs">
                        {activeFilterCount}
                      </Badge>
                    )}
                  </Button>

                  <Select value={sortOption} onValueChange={(v) => setSortOption(v as SortOption)}>
                    <SelectTrigger className="w-[180px]">
                      {sortOption.includes("desc") ? (
                        <SortDesc className="w-4 h-4 mr-2" />
                      ) : (
                        <SortAsc className="w-4 h-4 mr-2" />
                      )}
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="date-desc">Newest first</SelectItem>
                      <SelectItem value="date-asc">Oldest first</SelectItem>
                      <SelectItem value="name-asc">Name A-Z</SelectItem>
                      <SelectItem value="name-desc">Name Z-A</SelectItem>
                      <SelectItem value="confidence-desc">Highest confidence</SelectItem>
                      <SelectItem value="confidence-asc">Lowest confidence</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Expandable filter panel */}
              <AnimatePresence>
                {showFilters && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="glass rounded-xl p-4 space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {/* File Type Filter */}
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-muted-foreground">File Type</label>
                          <Select value={fileTypeFilter} onValueChange={(v) => setFileTypeFilter(v as FileTypeFilter)}>
                            <SelectTrigger>
                              <SelectValue placeholder="All types" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">All types</SelectItem>
                              <SelectItem value="image">
                                <div className="flex items-center gap-2">
                                  <FileImage className="w-4 h-4" />
                                  Images
                                </div>
                              </SelectItem>
                              <SelectItem value="video">
                                <div className="flex items-center gap-2">
                                  <FileVideo className="w-4 h-4" />
                                  Videos
                                </div>
                              </SelectItem>
                              <SelectItem value="audio">
                                <div className="flex items-center gap-2">
                                  <FileAudio className="w-4 h-4" />
                                  Audio
                                </div>
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        {/* Status Filter */}
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-muted-foreground">Status</label>
                          <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as StatusFilter)}>
                            <SelectTrigger>
                              <SelectValue placeholder="All statuses" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">All statuses</SelectItem>
                              <SelectItem value="safe">
                                <div className="flex items-center gap-2">
                                  <CheckCircle2 className="w-4 h-4 text-success" />
                                  Authentic
                                </div>
                              </SelectItem>
                              <SelectItem value="warning">
                                <div className="flex items-center gap-2">
                                  <AlertTriangle className="w-4 h-4 text-warning" />
                                  Suspicious
                                </div>
                              </SelectItem>
                              <SelectItem value="danger">
                                <div className="flex items-center gap-2">
                                  <XCircle className="w-4 h-4 text-destructive" />
                                  Likely Fake
                                </div>
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        {/* Date From */}
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-muted-foreground">From Date</label>
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button variant="outline" className="w-full justify-start text-left font-normal">
                                <Calendar className="w-4 h-4 mr-2" />
                                {dateFrom ? format(dateFrom, "MMM d, yyyy") : "Select date"}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <CalendarComponent
                                mode="single"
                                selected={dateFrom}
                                onSelect={setDateFrom}
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                        </div>

                        {/* Date To */}
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-muted-foreground">To Date</label>
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button variant="outline" className="w-full justify-start text-left font-normal">
                                <Calendar className="w-4 h-4 mr-2" />
                                {dateTo ? format(dateTo, "MMM d, yyyy") : "Select date"}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <CalendarComponent
                                mode="single"
                                selected={dateTo}
                                onSelect={setDateTo}
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                        </div>
                      </div>

                      {/* Active filters and clear button */}
                      {activeFilterCount > 0 && (
                        <div className="flex items-center justify-between pt-2 border-t border-border">
                          <div className="flex items-center gap-2 flex-wrap">
                            {fileTypeFilter !== "all" && (
                              <Badge variant="secondary" className="gap-1">
                                Type: {fileTypeFilter}
                                <X 
                                  className="w-3 h-3 cursor-pointer" 
                                  onClick={() => setFileTypeFilter("all")}
                                />
                              </Badge>
                            )}
                            {statusFilter !== "all" && (
                              <Badge variant="secondary" className="gap-1">
                                Status: {statusFilter}
                                <X 
                                  className="w-3 h-3 cursor-pointer" 
                                  onClick={() => setStatusFilter("all")}
                                />
                              </Badge>
                            )}
                            {dateFrom && (
                              <Badge variant="secondary" className="gap-1">
                                From: {format(dateFrom, "MMM d")}
                                <X 
                                  className="w-3 h-3 cursor-pointer" 
                                  onClick={() => setDateFrom(undefined)}
                                />
                              </Badge>
                            )}
                            {dateTo && (
                              <Badge variant="secondary" className="gap-1">
                                To: {format(dateTo, "MMM d")}
                                <X 
                                  className="w-3 h-3 cursor-pointer" 
                                  onClick={() => setDateTo(undefined)}
                                />
                              </Badge>
                            )}
                          </div>
                          <Button variant="ghost" size="sm" onClick={clearAllFilters}>
                            Clear all
                          </Button>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}

          {history.length === 0 ? (
            <div className="glass rounded-2xl p-12 text-center">
              <HistoryIcon className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h2 className="font-display text-xl font-semibold mb-2">No analyses yet</h2>
              <p className="text-muted-foreground mb-6">
                Start by uploading a file to analyze
              </p>
              <Button variant="default" onClick={() => navigate("/#analyzer")}>
                Go to Analyzer
              </Button>
            </div>
          ) : filteredHistory.length === 0 ? (
            <motion.div 
              className="glass rounded-2xl p-12 text-center"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <Search className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h2 className="font-display text-xl font-semibold mb-2">No results found</h2>
              <p className="text-muted-foreground mb-6">
                Try adjusting your search or filters
              </p>
              <Button variant="outline" onClick={clearAllFilters}>
                Clear all filters
              </Button>
            </motion.div>
          ) : (
            <div className="space-y-4">
              <AnimatePresence mode="popLayout">
                {filteredHistory.map((record, index) => {
                  const FileIcon = getFileIcon(record.file_type);
                  const statusConfig = getStatusConfig(record.status);
                  const StatusIcon = statusConfig.icon;

                  return (
                    <motion.div
                      key={record.id}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ delay: index * 0.03 }}
                      className="glass rounded-xl p-6 hover:bg-card/60 transition-colors"
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
                                className="text-muted-foreground hover:text-destructive hover:bg-destructive/10"
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
              </AnimatePresence>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default History;
