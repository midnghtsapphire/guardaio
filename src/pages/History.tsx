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
  ChevronDown,
  Download,
  FileSpreadsheet,
  FileText,
  Eye,
  Clock,
  HardDrive,
  Sparkles,
  RefreshCw,
  Upload
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/Navbar";
import { format, isAfter, isBefore, startOfDay, endOfDay } from "date-fns";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

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
  const [bulkDeleting, setBulkDeleting] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [detailRecord, setDetailRecord] = useState<AnalysisRecord | null>(null);
  
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

  // Export to CSV
  const exportToCSV = () => {
    const dataToExport = filteredHistory.length > 0 ? filteredHistory : history;
    
    if (dataToExport.length === 0) {
      toast({
        title: "No data to export",
        description: "There are no records to export",
        variant: "destructive",
      });
      return;
    }

    const headers = ["File Name", "File Type", "File Size", "Status", "Confidence", "Findings", "Date"];
    const rows = dataToExport.map(record => [
      record.file_name,
      record.file_type,
      formatFileSize(record.file_size),
      getStatusConfig(record.status).label,
      `${record.confidence}%`,
      record.findings.join("; "),
      formatDate(record.created_at)
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `deepguard-analysis-history-${format(new Date(), "yyyy-MM-dd")}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: "Export successful",
      description: `Exported ${dataToExport.length} records to CSV`,
    });
  };

  // Export to PDF
  const exportToPDF = () => {
    const dataToExport = filteredHistory.length > 0 ? filteredHistory : history;
    
    if (dataToExport.length === 0) {
      toast({
        title: "No data to export",
        description: "There are no records to export",
        variant: "destructive",
      });
      return;
    }

    const doc = new jsPDF();
    
    // Add title
    doc.setFontSize(20);
    doc.setTextColor(99, 102, 241); // Primary color
    doc.text("DeepGuard Analysis History", 14, 22);
    
    // Add export date
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Exported on ${format(new Date(), "MMMM d, yyyy 'at' h:mm a")}`, 14, 30);
    doc.text(`Total records: ${dataToExport.length}`, 14, 36);

    // Prepare table data
    const tableData = dataToExport.map(record => [
      record.file_name.length > 25 ? record.file_name.slice(0, 25) + "..." : record.file_name,
      record.file_type.split("/")[0],
      formatFileSize(record.file_size),
      getStatusConfig(record.status).label,
      `${record.confidence}%`,
      format(new Date(record.created_at), "MMM d, yyyy")
    ]);

    // Add table
    autoTable(doc, {
      head: [["File Name", "Type", "Size", "Status", "Confidence", "Date"]],
      body: tableData,
      startY: 42,
      styles: {
        fontSize: 8,
        cellPadding: 3,
      },
      headStyles: {
        fillColor: [99, 102, 241],
        textColor: 255,
        fontStyle: "bold",
      },
      alternateRowStyles: {
        fillColor: [245, 245, 250],
      },
      columnStyles: {
        0: { cellWidth: 50 },
        1: { cellWidth: 20 },
        2: { cellWidth: 25 },
        3: { cellWidth: 25 },
        4: { cellWidth: 25 },
        5: { cellWidth: 35 },
      },
    });

    // Add findings section if space allows
    let yPosition = (doc as any).lastAutoTable.finalY + 15;
    
    if (yPosition < 250) {
      doc.setFontSize(12);
      doc.setTextColor(99, 102, 241);
      doc.text("Detailed Findings", 14, yPosition);
      yPosition += 8;
      
      doc.setFontSize(8);
      doc.setTextColor(60);
      
      dataToExport.slice(0, 5).forEach(record => {
        if (yPosition > 270) return;
        
        doc.setFont(undefined, "bold");
        doc.text(record.file_name.slice(0, 40), 14, yPosition);
        yPosition += 4;
        
        doc.setFont(undefined, "normal");
        record.findings.slice(0, 2).forEach(finding => {
          if (yPosition > 270) return;
          const truncatedFinding = finding.length > 80 ? finding.slice(0, 80) + "..." : finding;
          doc.text(`• ${truncatedFinding}`, 16, yPosition);
          yPosition += 4;
        });
        yPosition += 3;
      });
    }

    // Save the PDF
    doc.save(`deepguard-analysis-history-${format(new Date(), "yyyy-MM-dd")}.pdf`);

    toast({
      title: "Export successful",
      description: `Exported ${dataToExport.length} records to PDF`,
    });
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
      setSelectedIds(prev => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
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

  // Bulk selection handlers
  const toggleSelectAll = () => {
    if (selectedIds.size === filteredHistory.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredHistory.map(r => r.id)));
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const clearSelection = () => {
    setSelectedIds(new Set());
  };

  const bulkDelete = async () => {
    if (selectedIds.size === 0) return;
    
    setBulkDeleting(true);
    try {
      const idsToDelete = Array.from(selectedIds);
      const { error } = await supabase
        .from("analysis_history")
        .delete()
        .in("id", idsToDelete);

      if (error) throw error;
      
      setHistory(history.filter(item => !selectedIds.has(item.id)));
      const deletedCount = selectedIds.size;
      setSelectedIds(new Set());
      
      toast({
        title: "Deleted",
        description: `${deletedCount} ${deletedCount === 1 ? "record" : "records"} removed`,
      });
    } catch (error) {
      console.error("Error bulk deleting:", error);
      toast({
        title: "Error",
        description: "Failed to delete records",
        variant: "destructive",
      });
    } finally {
      setBulkDeleting(false);
    }
  };

  const isAllSelected = filteredHistory.length > 0 && selectedIds.size === filteredHistory.length;
  const isSomeSelected = selectedIds.size > 0 && selectedIds.size < filteredHistory.length;

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

                <div className="flex gap-2 flex-wrap">
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

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" className="gap-2">
                        <Download className="w-4 h-4" />
                        Export
                        <ChevronDown className="w-3 h-3" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={exportToCSV} className="gap-2 cursor-pointer">
                        <FileSpreadsheet className="w-4 h-4" />
                        Export as CSV
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={exportToPDF} className="gap-2 cursor-pointer">
                        <FileText className="w-4 h-4" />
                        Export as PDF
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
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
              {/* Bulk selection header */}
              <motion.div 
                className="flex items-center justify-between glass rounded-xl px-4 py-3"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="flex items-center gap-3">
                  <Checkbox
                    checked={isAllSelected}
                    onCheckedChange={toggleSelectAll}
                    className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                    aria-label="Select all"
                  />
                  <span className="text-sm text-muted-foreground">
                    {selectedIds.size > 0 
                      ? `${selectedIds.size} of ${filteredHistory.length} selected`
                      : `Select all (${filteredHistory.length})`
                    }
                  </span>
                </div>
                
                <AnimatePresence>
                  {selectedIds.size > 0 && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      className="flex items-center gap-2"
                    >
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={clearSelection}
                        className="text-muted-foreground"
                      >
                        <X className="w-4 h-4 mr-1" />
                        Clear
                      </Button>
                      
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="destructive"
                            size="sm"
                            disabled={bulkDeleting}
                            className="gap-2"
                          >
                            {bulkDeleting ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <Trash2 className="w-4 h-4" />
                            )}
                            Delete {selectedIds.size} {selectedIds.size === 1 ? "item" : "items"}
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete {selectedIds.size} {selectedIds.size === 1 ? "record" : "records"}?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone. The selected analysis records will be permanently deleted.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={bulkDelete}
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>

              <AnimatePresence mode="popLayout">
                {filteredHistory.map((record, index) => {
                  const FileIcon = getFileIcon(record.file_type);
                  const statusConfig = getStatusConfig(record.status);
                  const StatusIcon = statusConfig.icon;
                  const isSelected = selectedIds.has(record.id);

                  return (
                    <motion.div
                      key={record.id}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ delay: index * 0.03 }}
                      className={`glass rounded-xl p-6 transition-all cursor-pointer ${
                        isSelected 
                          ? "bg-primary/5 border border-primary/30 ring-1 ring-primary/20" 
                          : "hover:bg-card/60"
                      }`}
                      onClick={() => toggleSelect(record.id)}
                    >
                      <div className="flex items-start gap-4">
                        <div className="flex items-center gap-3">
                          <Checkbox
                            checked={isSelected}
                            onCheckedChange={() => toggleSelect(record.id)}
                            onClick={(e) => e.stopPropagation()}
                            className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                            aria-label={`Select ${record.file_name}`}
                          />
                          <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                            <FileIcon className="w-6 h-6 text-primary" />
                          </div>
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-4">
                            <div>
                              <h3 className="font-medium truncate">{record.file_name}</h3>
                              <p className="text-sm text-muted-foreground">
                                {formatFileSize(record.file_size)} • {formatDate(record.created_at)}
                              </p>
                            </div>
                            
                            <div className="flex items-center gap-2 shrink-0">
                              <div className={`hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full ${statusConfig.bg}`}>
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
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setDetailRecord(record);
                                }}
                                className="text-muted-foreground hover:text-primary hover:bg-primary/10"
                                title="View details"
                              >
                                <Eye className="w-4 h-4" />
                              </Button>
                              
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  deleteRecord(record.id);
                                }}
                                disabled={deleting === record.id}
                                className="text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                                title="Delete"
                              >
                                {deleting === record.id ? (
                                  <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                  <Trash2 className="w-4 h-4" />
                                )}
                              </Button>
                            </div>
                          </div>
                          
                          {/* Mobile status badge */}
                          <div className={`sm:hidden mt-2 inline-flex items-center gap-2 px-3 py-1.5 rounded-full ${statusConfig.bg}`}>
                            <StatusIcon className={`w-4 h-4 ${statusConfig.color}`} />
                            <span className={`text-sm font-medium ${statusConfig.color}`}>
                              {statusConfig.label} • {record.confidence}%
                            </span>
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
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setDetailRecord(record);
                                }}
                                className="text-xs text-primary hover:underline"
                              >
                                +{record.findings.length - 3} more
                              </button>
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

      {/* Detail Modal */}
      <Dialog open={!!detailRecord} onOpenChange={(open) => !open && setDetailRecord(null)}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-hidden flex flex-col">
          {detailRecord && (() => {
            const FileIcon = getFileIcon(detailRecord.file_type);
            const statusConfig = getStatusConfig(detailRecord.status);
            const StatusIcon = statusConfig.icon;
            
            return (
              <>
                <DialogHeader className="shrink-0">
                  <DialogTitle className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <FileIcon className="w-5 h-5 text-primary" />
                    </div>
                    <span className="truncate">{detailRecord.file_name}</span>
                  </DialogTitle>
                  <DialogDescription>
                    Detailed analysis report
                  </DialogDescription>
                </DialogHeader>

                <div className="flex-1 overflow-y-auto space-y-6 pr-2">
                  {/* Status Card */}
                  <motion.div 
                    className={`rounded-xl p-5 bg-gradient-to-br ${statusConfig.bg} border ${statusConfig.color.replace('text-', 'border-')}/30`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <StatusIcon className={`w-10 h-10 ${statusConfig.color}`} />
                        <div>
                          <p className={`text-xl font-bold ${statusConfig.color}`}>
                            {statusConfig.label}
                          </p>
                          <p className="text-sm text-muted-foreground">Analysis Result</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`text-3xl font-bold ${statusConfig.color}`}>
                          {detailRecord.confidence}%
                        </p>
                        <p className="text-xs text-muted-foreground">Confidence</p>
                      </div>
                    </div>
                    
                    <div className="mt-4">
                      <Progress 
                        value={detailRecord.confidence} 
                        className="h-2"
                      />
                    </div>
                  </motion.div>

                  {/* File Details */}
                  <div className="grid grid-cols-2 gap-4">
                    <motion.div 
                      className="glass rounded-lg p-4"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 }}
                    >
                      <div className="flex items-center gap-2 text-muted-foreground mb-1">
                        <HardDrive className="w-4 h-4" />
                        <span className="text-xs">File Size</span>
                      </div>
                      <p className="font-semibold">{formatFileSize(detailRecord.file_size)}</p>
                    </motion.div>
                    
                    <motion.div 
                      className="glass rounded-lg p-4"
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.15 }}
                    >
                      <div className="flex items-center gap-2 text-muted-foreground mb-1">
                        <FileImage className="w-4 h-4" />
                        <span className="text-xs">File Type</span>
                      </div>
                      <p className="font-semibold capitalize">{detailRecord.file_type.split('/')[0]}</p>
                    </motion.div>
                    
                    <motion.div 
                      className="glass rounded-lg p-4 col-span-2"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                    >
                      <div className="flex items-center gap-2 text-muted-foreground mb-1">
                        <Clock className="w-4 h-4" />
                        <span className="text-xs">Analyzed On</span>
                      </div>
                      <p className="font-semibold">{formatDate(detailRecord.created_at)}</p>
                    </motion.div>
                  </div>

                  {/* Findings */}
                  <motion.div 
                    className="glass rounded-xl p-5"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.25 }}
                  >
                    <div className="flex items-center gap-2 mb-4">
                      <Sparkles className="w-5 h-5 text-primary" />
                      <h3 className="font-semibold">AI Analysis Findings</h3>
                      <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                        {detailRecord.findings.length} {detailRecord.findings.length === 1 ? 'finding' : 'findings'}
                      </span>
                    </div>
                    
                    <ul className="space-y-3">
                      {detailRecord.findings.map((finding, index) => (
                        <motion.li
                          key={index}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.3 + index * 0.05 }}
                          className="flex items-start gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                        >
                          <span className="w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-medium flex items-center justify-center shrink-0 mt-0.5">
                            {index + 1}
                          </span>
                          <p className="text-sm text-muted-foreground leading-relaxed">{finding}</p>
                        </motion.li>
                      ))}
                    </ul>
                  </motion.div>
                </div>

                {/* Footer Actions */}
                <div className="shrink-0 pt-4 border-t border-border flex flex-col sm:flex-row justify-between gap-3">
                  <Button
                    variant="outline"
                    onClick={() => {
                      const fileName = detailRecord.file_name;
                      setDetailRecord(null);
                      navigate("/#analyzer");
                      toast({
                        title: "Re-analyze file",
                        description: `Upload "${fileName}" again to run a new analysis`,
                        action: (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              const analyzerSection = document.getElementById("analyzer");
                              if (analyzerSection) {
                                analyzerSection.scrollIntoView({ behavior: "smooth" });
                              }
                            }}
                          >
                            <Upload className="w-3 h-3 mr-1" />
                            Go
                          </Button>
                        ),
                      });
                    }}
                    className="gap-2"
                  >
                    <RefreshCw className="w-4 h-4" />
                    Re-analyze File
                  </Button>
                  
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      onClick={() => setDetailRecord(null)}
                    >
                      Close
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => {
                        deleteRecord(detailRecord.id);
                        setDetailRecord(null);
                      }}
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete
                    </Button>
                  </div>
                </div>
              </>
            );
          })()}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default History;
