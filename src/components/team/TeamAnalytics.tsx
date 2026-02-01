import { motion } from "framer-motion";
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  Target, 
  Clock, 
  Zap,
  BarChart3,
  PieChart,
  Activity,
  Leaf,
  Award,
  GitBranch,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

const TeamAnalytics = () => {
  const velocityHistory = [
    { sprint: "Sprint 10", velocity: 38, target: 40 },
    { sprint: "Sprint 11", velocity: 42, target: 42 },
    { sprint: "Sprint 12", velocity: 45, target: 44 },
    { sprint: "Sprint 13", velocity: 48, target: 46 },
    { sprint: "Sprint 14", velocity: 42, target: 48 },
  ];

  const teamMembers = [
    { name: "Alice Chen", role: "Lead Dev", velocity: 12, commits: 47, reviews: 23 },
    { name: "Bob Martinez", role: "Backend", velocity: 10, commits: 38, reviews: 31 },
    { name: "Carol Davis", role: "DevOps", velocity: 8, commits: 22, reviews: 18 },
    { name: "David Kim", role: "Frontend", velocity: 11, commits: 41, reviews: 15 },
    { name: "Eva Wilson", role: "QA Lead", velocity: 6, commits: 15, reviews: 42 },
  ];

  const sustainabilityMetrics = [
    { label: "Energy Efficiency", value: 87, trend: "+5%", positive: true },
    { label: "Carbon per Deploy", value: 23, unit: "gCO2", trend: "-12%", positive: true },
    { label: "Green Host Usage", value: 100, unit: "%", trend: "0%", positive: true },
    { label: "Idle Resource Waste", value: 3, unit: "%", trend: "-8%", positive: true },
  ];

  const qualityMetrics = [
    { label: "Code Coverage", value: 94, target: 90, status: "good" },
    { label: "Bug Escape Rate", value: 2, target: 5, status: "good" },
    { label: "Technical Debt", value: 12, target: 15, status: "good" },
    { label: "Doc Coverage", value: 78, target: 85, status: "warning" },
  ];

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid md:grid-cols-4 gap-4">
        {[
          { icon: TrendingUp, label: "Avg Velocity", value: "45", subtext: "pts/sprint", color: "text-blue-500", trend: "+12%" },
          { icon: Clock, label: "Cycle Time", value: "2.3", subtext: "days", color: "text-green-500", trend: "-18%" },
          { icon: Target, label: "Sprint Goal Hit", value: "87%", subtext: "success rate", color: "text-purple-500", trend: "+5%" },
          { icon: Leaf, label: "Carbon Score", value: "A+", subtext: "sustainability", color: "text-emerald-500", trend: "Top 5%" },
        ].map((metric, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
          >
            <Card className="glass border-border/50">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-2">
                  <metric.icon className={`w-5 h-5 ${metric.color}`} />
                  <Badge variant="secondary" className="text-xs">
                    {metric.trend}
                  </Badge>
                </div>
                <div className="text-3xl font-bold">{metric.value}</div>
                <p className="text-sm text-muted-foreground">{metric.subtext}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Velocity Trend */}
        <Card className="glass border-border/50">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-primary" />
              Velocity Trend
            </CardTitle>
            <CardDescription>Story points completed per sprint</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-48 flex items-end gap-3">
              {velocityHistory.map((sprint, idx) => (
                <div key={idx} className="flex-1 flex flex-col items-center gap-2">
                  <div className="w-full flex flex-col items-center gap-1">
                    <div 
                      className={`w-full rounded-t transition-all ${
                        sprint.velocity >= sprint.target ? "bg-green-500/60" : "bg-orange-500/60"
                      }`}
                      style={{ height: `${(sprint.velocity / 60) * 180}px` }}
                    />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-medium">{sprint.velocity}</p>
                    <p className="text-xs text-muted-foreground">S{10 + idx}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex items-center justify-center gap-6 mt-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-green-500/60" />
                <span className="text-muted-foreground">Met target</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-orange-500/60" />
                <span className="text-muted-foreground">Below target</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Sustainability Metrics */}
        <Card className="glass border-border/50">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Leaf className="w-5 h-5 text-emerald-500" />
              Green Software Metrics
            </CardTitle>
            <CardDescription>PRiSM sustainability tracking</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {sustainabilityMetrics.map((metric, idx) => (
              <div key={idx} className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium">{metric.label}</span>
                    <div className="flex items-center gap-2">
                      <span className="font-bold">
                        {metric.value}{metric.unit ? ` ${metric.unit}` : ""}
                      </span>
                      <Badge 
                        variant={metric.positive ? "default" : "destructive"}
                        className="text-xs"
                      >
                        {metric.trend}
                      </Badge>
                    </div>
                  </div>
                  <Progress value={metric.value} className="h-2" />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Team Performance */}
      <Card className="glass border-border/50">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Users className="w-5 h-5 text-primary" />
            Team Performance
          </CardTitle>
          <CardDescription>Individual contribution metrics this sprint</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border/50">
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Member</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Role</th>
                  <th className="text-center py-3 px-4 text-sm font-medium text-muted-foreground">Velocity</th>
                  <th className="text-center py-3 px-4 text-sm font-medium text-muted-foreground">Commits</th>
                  <th className="text-center py-3 px-4 text-sm font-medium text-muted-foreground">Reviews</th>
                  <th className="text-center py-3 px-4 text-sm font-medium text-muted-foreground">Impact</th>
                </tr>
              </thead>
              <tbody>
                {teamMembers.map((member, idx) => (
                  <tr key={idx} className="border-b border-border/30 hover:bg-secondary/30 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium text-primary">
                          {member.name.split(" ").map(n => n[0]).join("")}
                        </div>
                        <span className="font-medium">{member.name}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <Badge variant="secondary">{member.role}</Badge>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className="font-bold">{member.velocity}</span>
                      <span className="text-muted-foreground text-sm"> pts</span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <GitBranch className="w-4 h-4 text-muted-foreground" />
                        {member.commits}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <CheckCircle2 className="w-4 h-4 text-muted-foreground" />
                        {member.reviews}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <div className="w-full bg-secondary/50 rounded-full h-2">
                        <div 
                          className="bg-primary h-2 rounded-full"
                          style={{ width: `${(member.velocity / 15) * 100}%` }}
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Quality & Technical Health */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="glass border-border/50">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Activity className="w-5 h-5 text-primary" />
              Code Quality (XP Metrics)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {qualityMetrics.map((metric, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 rounded-lg bg-secondary/30">
                <div className="flex items-center gap-3">
                  {metric.status === "good" ? (
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-orange-500" />
                  )}
                  <span className="font-medium">{metric.label}</span>
                </div>
                <div className="text-right">
                  <span className="font-bold">{metric.value}%</span>
                  <span className="text-sm text-muted-foreground ml-1">/ {metric.target}%</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="glass border-border/50">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Award className="w-5 h-5 text-yellow-500" />
              Sprint Achievements
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              { title: "Zero Bug Sprint", desc: "No critical bugs shipped", icon: "🎯" },
              { title: "Green Champion", desc: "Reduced carbon by 23%", icon: "🌱" },
              { title: "Coverage King", desc: "94% test coverage achieved", icon: "👑" },
              { title: "Pair Pro", desc: "50+ pair programming hours", icon: "🤝" },
            ].map((achievement, idx) => (
              <div key={idx} className="flex items-center gap-3 p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/30">
                <span className="text-2xl">{achievement.icon}</span>
                <div>
                  <p className="font-medium">{achievement.title}</p>
                  <p className="text-xs text-muted-foreground">{achievement.desc}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TeamAnalytics;
