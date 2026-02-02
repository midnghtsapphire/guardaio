import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import {
  BarChart3,
  Shield,
  AlertTriangle,
  XCircle,
  CheckCircle2,
  TrendingUp,
  Clock,
  FileImage,
  FileVideo,
  FileAudio,
  Calendar,
  ArrowLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts";

interface AnalysisStats {
  total: number;
  safe: number;
  warning: number;
  danger: number;
  avgConfidence: number;
  recentAnalyses: Array<{
    id: string;
    file_name: string;
    status: string;
    confidence: number;
    created_at: string;
    file_type: string;
  }>;
  dailyStats: Array<{
    date: string;
    count: number;
  }>;
  fileTypeStats: Array<{
    type: string;
    count: number;
  }>;
}

const Dashboard = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState<AnalysisStats | null>(null);
  const [loadingStats, setLoadingStats] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth");
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    if (user) {
      fetchStats();
    }
  }, [user]);

  const fetchStats = async () => {
    if (!user) return;

    try {
      setLoadingStats(true);

      // Fetch all analysis history
      const { data, error } = await supabase
        .from("analysis_history")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;

      const analyses = data || [];

      // Calculate stats
      const safe = analyses.filter((a) => a.status === "safe").length;
      const warning = analyses.filter((a) => a.status === "warning").length;
      const danger = analyses.filter((a) => a.status === "danger").length;
      const avgConfidence =
        analyses.length > 0
          ? analyses.reduce((sum, a) => sum + a.confidence, 0) / analyses.length
          : 0;

      // Daily stats for last 7 days
      const last7Days = [...Array(7)].map((_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - (6 - i));
        return date.toISOString().split("T")[0];
      });

      const dailyStats = last7Days.map((date) => ({
        date: new Date(date).toLocaleDateString("en-US", { weekday: "short" }),
        count: analyses.filter(
          (a) => a.created_at.split("T")[0] === date
        ).length,
      }));

      // File type stats
      const fileTypes = analyses.reduce((acc, a) => {
        const type = a.file_type.split("/")[0] || "unknown";
        acc[type] = (acc[type] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const fileTypeStats = Object.entries(fileTypes).map(([type, count]) => ({
        type: type.charAt(0).toUpperCase() + type.slice(1),
        count: count as number,
      }));

      setStats({
        total: analyses.length,
        safe,
        warning,
        danger,
        avgConfidence: Math.round(avgConfidence),
        recentAnalyses: analyses.slice(0, 5),
        dailyStats,
        fileTypeStats,
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      setLoadingStats(false);
    }
  };

  const COLORS = {
    safe: "hsl(var(--success))",
    warning: "hsl(var(--warning))",
    danger: "hsl(var(--destructive))",
  };

  const pieData = stats
    ? [
        { name: "Authentic", value: stats.safe, color: COLORS.safe },
        { name: "Suspicious", value: stats.warning, color: COLORS.warning },
        { name: "Manipulated", value: stats.danger, color: COLORS.danger },
      ].filter((d) => d.value > 0)
    : [];

  const getFileIcon = (type: string) => {
    if (type.includes("image")) return FileImage;
    if (type.includes("video")) return FileVideo;
    if (type.includes("audio")) return FileAudio;
    return FileImage;
  };

  if (loading || loadingStats) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Dashboard - Guardaio</title>
        <meta name="description" content="View your analysis statistics and usage metrics" />
      </Helmet>

      <main className="min-h-screen bg-background">
        <Navbar />

        <div className="container mx-auto px-6 pt-28 pb-16">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <Button
              variant="ghost"
              onClick={() => navigate(-1)}
              className="mb-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <h1 className="font-display text-3xl md:text-4xl font-bold mb-2">
              Analytics <span className="text-gradient">Dashboard</span>
            </h1>
            <p className="text-muted-foreground">
              Track your analysis activity and detection statistics
            </p>
          </motion.div>

          {/* Stats Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
          >
            <Card className="glass border-border/50">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <BarChart3 className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{stats?.total || 0}</p>
                    <p className="text-xs text-muted-foreground">Total Analyses</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="glass border-success/30">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center">
                    <CheckCircle2 className="w-5 h-5 text-success" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-success">{stats?.safe || 0}</p>
                    <p className="text-xs text-muted-foreground">Authentic</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="glass border-warning/30">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-warning/10 flex items-center justify-center">
                    <AlertTriangle className="w-5 h-5 text-warning" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-warning">{stats?.warning || 0}</p>
                    <p className="text-xs text-muted-foreground">Suspicious</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="glass border-destructive/30">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-destructive/10 flex items-center justify-center">
                    <XCircle className="w-5 h-5 text-destructive" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-destructive">{stats?.danger || 0}</p>
                    <p className="text-xs text-muted-foreground">Manipulated</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Charts Row */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {/* Activity Chart */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="glass border-border/50">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-primary" />
                    Activity (Last 7 Days)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[200px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={stats?.dailyStats || []}>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                        <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                        <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "hsl(var(--card))",
                            border: "1px solid hsl(var(--border))",
                            borderRadius: "8px",
                          }}
                        />
                        <Bar dataKey="count" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Detection Distribution */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="glass border-border/50">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Shield className="w-5 h-5 text-primary" />
                    Detection Distribution
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[200px] flex items-center justify-center">
                    {pieData.length > 0 ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={pieData}
                            cx="50%"
                            cy="50%"
                            innerRadius={50}
                            outerRadius={80}
                            paddingAngle={5}
                            dataKey="value"
                          >
                            {pieData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip
                            contentStyle={{
                              backgroundColor: "hsl(var(--card))",
                              border: "1px solid hsl(var(--border))",
                              borderRadius: "8px",
                            }}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                    ) : (
                      <p className="text-muted-foreground text-sm">No data yet</p>
                    )}
                  </div>
                  {pieData.length > 0 && (
                    <div className="flex justify-center gap-4 mt-2">
                      {pieData.map((entry) => (
                        <div key={entry.name} className="flex items-center gap-2">
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: entry.color }}
                          />
                          <span className="text-xs text-muted-foreground">
                            {entry.name} ({entry.value})
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Recent Analyses & Confidence */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Recent Analyses */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card className="glass border-border/50">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Clock className="w-5 h-5 text-primary" />
                    Recent Analyses
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {stats?.recentAnalyses && stats.recentAnalyses.length > 0 ? (
                    <div className="space-y-3">
                      {stats.recentAnalyses.map((analysis) => {
                        const FileIcon = getFileIcon(analysis.file_type);
                        return (
                          <div
                            key={analysis.id}
                            className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/30 transition-colors"
                          >
                            <div className="w-8 h-8 rounded bg-muted/50 flex items-center justify-center">
                              <FileIcon className="w-4 h-4 text-muted-foreground" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium truncate">
                                {analysis.file_name}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {new Date(analysis.created_at).toLocaleDateString()}
                              </p>
                            </div>
                            <div
                              className={`px-2 py-1 rounded text-xs font-medium ${
                                analysis.status === "safe"
                                  ? "bg-success/10 text-success"
                                  : analysis.status === "warning"
                                  ? "bg-warning/10 text-warning"
                                  : "bg-destructive/10 text-destructive"
                              }`}
                            >
                              {analysis.confidence}%
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="text-muted-foreground text-sm text-center py-8">
                      No analyses yet. Start by uploading a file!
                    </p>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            {/* Average Confidence */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Card className="glass border-border/50">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-primary" />
                    Performance Metrics
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-muted-foreground">
                        Average Confidence
                      </span>
                      <span className="text-lg font-bold">
                        {stats?.avgConfidence || 0}%
                      </span>
                    </div>
                    <Progress value={stats?.avgConfidence || 0} className="h-2" />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 rounded-lg bg-muted/30">
                      <p className="text-2xl font-bold text-primary">
                        {stats?.total
                          ? Math.round((stats.safe / stats.total) * 100)
                          : 0}
                        %
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Authentic Rate
                      </p>
                    </div>
                    <div className="text-center p-4 rounded-lg bg-muted/30">
                      <p className="text-2xl font-bold text-primary">
                        {stats?.total
                          ? Math.round(
                              ((stats.warning + stats.danger) / stats.total) * 100
                            )
                          : 0}
                        %
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Detection Rate
                      </p>
                    </div>
                  </div>

                  {/* File Type Distribution */}
                  {stats?.fileTypeStats && stats.fileTypeStats.length > 0 && (
                    <div>
                      <p className="text-sm text-muted-foreground mb-3">
                        File Types Analyzed
                      </p>
                      <div className="space-y-2">
                        {stats.fileTypeStats.map((ft) => (
                          <div key={ft.type} className="flex items-center gap-2">
                            <span className="text-xs w-16">{ft.type}</span>
                            <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                              <div
                                className="h-full bg-primary rounded-full"
                                style={{
                                  width: `${(ft.count / stats.total) * 100}%`,
                                }}
                              />
                            </div>
                            <span className="text-xs text-muted-foreground w-8">
                              {ft.count}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>

        <Footer />
      </main>
    </>
  );
};

export default Dashboard;
