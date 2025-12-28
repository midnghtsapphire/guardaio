import { useMemo } from "react";
import { motion } from "framer-motion";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import {
  CheckCircle2,
  AlertTriangle,
  XCircle,
  TrendingUp,
  BarChart3,
  PieChartIcon,
} from "lucide-react";
import { format, subDays, eachDayOfInterval, startOfDay } from "date-fns";

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

interface HistoryStatsProps {
  history: AnalysisRecord[];
}

const STATUS_COLORS = {
  safe: "hsl(142, 76%, 36%)",
  warning: "hsl(38, 92%, 50%)",
  danger: "hsl(0, 84%, 60%)",
};

const STATUS_LABELS = {
  safe: "Authentic",
  warning: "Suspicious",
  danger: "Likely Fake",
};

export const HistoryStats = ({ history }: HistoryStatsProps) => {
  // Calculate status distribution
  const statusDistribution = useMemo(() => {
    const counts = { safe: 0, warning: 0, danger: 0 };
    history.forEach((record) => {
      counts[record.status]++;
    });
    return [
      { name: STATUS_LABELS.safe, value: counts.safe, status: "safe" },
      { name: STATUS_LABELS.warning, value: counts.warning, status: "warning" },
      { name: STATUS_LABELS.danger, value: counts.danger, status: "danger" },
    ].filter((item) => item.value > 0);
  }, [history]);

  // Calculate analyses over time (last 14 days)
  const analysesOverTime = useMemo(() => {
    const today = startOfDay(new Date());
    const twoWeeksAgo = subDays(today, 13);
    const days = eachDayOfInterval({ start: twoWeeksAgo, end: today });

    return days.map((day) => {
      const dayStr = format(day, "yyyy-MM-dd");
      const dayRecords = history.filter(
        (record) => format(new Date(record.created_at), "yyyy-MM-dd") === dayStr
      );

      return {
        date: format(day, "MMM d"),
        fullDate: dayStr,
        safe: dayRecords.filter((r) => r.status === "safe").length,
        warning: dayRecords.filter((r) => r.status === "warning").length,
        danger: dayRecords.filter((r) => r.status === "danger").length,
        total: dayRecords.length,
      };
    });
  }, [history]);

  // Calculate averages and totals
  const stats = useMemo(() => {
    const totalAnalyses = history.length;
    const avgConfidence =
      totalAnalyses > 0
        ? Math.round(
            history.reduce((sum, r) => sum + r.confidence, 0) / totalAnalyses
          )
        : 0;
    const safePercentage =
      totalAnalyses > 0
        ? Math.round(
            (history.filter((r) => r.status === "safe").length / totalAnalyses) *
              100
          )
        : 0;
    const avgFindings =
      totalAnalyses > 0
        ? (
            history.reduce((sum, r) => sum + r.findings.length, 0) / totalAnalyses
          ).toFixed(1)
        : "0";

    return { totalAnalyses, avgConfidence, safePercentage, avgFindings };
  }, [history]);

  // File type distribution
  const fileTypeDistribution = useMemo(() => {
    const counts: Record<string, number> = {};
    history.forEach((record) => {
      const type = record.file_type.split("/")[0];
      counts[type] = (counts[type] || 0) + 1;
    });
    return Object.entries(counts).map(([name, value]) => ({
      name: name.charAt(0).toUpperCase() + name.slice(1),
      value,
    }));
  }, [history]);

  if (history.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="glass rounded-xl p-4"
        >
          <div className="flex items-center gap-2 text-muted-foreground mb-1">
            <BarChart3 className="w-4 h-4" />
            <span className="text-xs">Total Analyses</span>
          </div>
          <p className="text-2xl font-bold">{stats.totalAnalyses}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.15 }}
          className="glass rounded-xl p-4"
        >
          <div className="flex items-center gap-2 text-muted-foreground mb-1">
            <TrendingUp className="w-4 h-4" />
            <span className="text-xs">Avg Confidence</span>
          </div>
          <p className="text-2xl font-bold">{stats.avgConfidence}%</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="glass rounded-xl p-4"
        >
          <div className="flex items-center gap-2 text-success mb-1">
            <CheckCircle2 className="w-4 h-4" />
            <span className="text-xs">Authentic Rate</span>
          </div>
          <p className="text-2xl font-bold text-success">{stats.safePercentage}%</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.25 }}
          className="glass rounded-xl p-4"
        >
          <div className="flex items-center gap-2 text-muted-foreground mb-1">
            <PieChartIcon className="w-4 h-4" />
            <span className="text-xs">Avg Findings</span>
          </div>
          <p className="text-2xl font-bold">{stats.avgFindings}</p>
        </motion.div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Status Distribution Pie Chart */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="glass rounded-xl p-6"
        >
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <PieChartIcon className="w-5 h-5 text-primary" />
            Status Distribution
          </h3>
          {statusDistribution.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={statusDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={4}
                  dataKey="value"
                  label={({ name, percent }) =>
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
                  labelLine={false}
                >
                  {statusDistribution.map((entry) => (
                    <Cell
                      key={entry.status}
                      fill={STATUS_COLORS[entry.status as keyof typeof STATUS_COLORS]}
                      stroke="transparent"
                    />
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
            <div className="h-[250px] flex items-center justify-center text-muted-foreground">
              No data available
            </div>
          )}
          <div className="flex justify-center gap-6 mt-4">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-success" />
              <span className="text-sm text-muted-foreground">Authentic</span>
            </div>
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-warning" />
              <span className="text-sm text-muted-foreground">Suspicious</span>
            </div>
            <div className="flex items-center gap-2">
              <XCircle className="w-4 h-4 text-destructive" />
              <span className="text-sm text-muted-foreground">Likely Fake</span>
            </div>
          </div>
        </motion.div>

        {/* Analyses Over Time Bar Chart */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.35 }}
          className="glass rounded-xl p-6"
        >
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-primary" />
            Last 14 Days Activity
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={analysesOverTime} barCategoryGap="20%">
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                axisLine={{ stroke: "hsl(var(--border))" }}
                tickLine={false}
                interval="preserveStartEnd"
              />
              <YAxis
                tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                axisLine={{ stroke: "hsl(var(--border))" }}
                tickLine={false}
                allowDecimals={false}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                }}
                labelStyle={{ color: "hsl(var(--foreground))" }}
              />
              <Legend
                wrapperStyle={{ fontSize: "12px" }}
                iconType="circle"
                iconSize={8}
              />
              <Bar
                dataKey="safe"
                name="Authentic"
                stackId="a"
                fill={STATUS_COLORS.safe}
                radius={[0, 0, 0, 0]}
              />
              <Bar
                dataKey="warning"
                name="Suspicious"
                stackId="a"
                fill={STATUS_COLORS.warning}
                radius={[0, 0, 0, 0]}
              />
              <Bar
                dataKey="danger"
                name="Likely Fake"
                stackId="a"
                fill={STATUS_COLORS.danger}
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* File Type Distribution */}
      {fileTypeDistribution.length > 1 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="glass rounded-xl p-6"
        >
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-primary" />
            File Type Distribution
          </h3>
          <div className="flex flex-wrap gap-4">
            {fileTypeDistribution.map((type, index) => (
              <motion.div
                key={type.name}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.45 + index * 0.05 }}
                className="flex items-center gap-3 bg-muted/50 rounded-lg px-4 py-3"
              >
                <span className="font-medium">{type.name}</span>
                <span className="text-sm text-muted-foreground bg-background/50 px-2 py-0.5 rounded">
                  {type.value} {type.value === 1 ? "file" : "files"}
                </span>
                <span className="text-xs text-muted-foreground">
                  ({Math.round((type.value / history.length) * 100)}%)
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};
