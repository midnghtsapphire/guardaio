import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Calendar, 
  Target, 
  Users, 
  TrendingUp, 
  Clock, 
  CheckCircle2,
  AlertTriangle,
  Play,
  Pause,
  RotateCcw,
  ChevronRight,
  Leaf,
  Award
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Sprint {
  id: string;
  name: string;
  goal: string;
  startDate: string;
  endDate: string;
  status: "active" | "completed" | "planned";
  velocity: number;
  targetVelocity: number;
  storyPoints: { total: number; completed: number };
  tasks: { total: number; completed: number };
  team: string[];
  ceremonies: { name: string; date: string; completed: boolean }[];
  sustainability: { carbonReduction: number; energyEfficiency: number };
}

const sprints: Sprint[] = [
  {
    id: "sprint-14",
    name: "Sprint 14: Authentication Overhaul",
    goal: "Implement OAuth 2.0 and improve session management security",
    startDate: "2026-01-20",
    endDate: "2026-02-03",
    status: "active",
    velocity: 42,
    targetVelocity: 48,
    storyPoints: { total: 48, completed: 35 },
    tasks: { total: 24, completed: 18 },
    team: ["Alice", "Bob", "Carol", "David"],
    ceremonies: [
      { name: "Sprint Planning", date: "Jan 20", completed: true },
      { name: "Daily Standups", date: "Daily", completed: true },
      { name: "Backlog Refinement", date: "Jan 27", completed: true },
      { name: "Sprint Review", date: "Feb 3", completed: false },
      { name: "Retrospective", date: "Feb 3", completed: false },
    ],
    sustainability: { carbonReduction: 23, energyEfficiency: 87 },
  },
  {
    id: "sprint-15",
    name: "Sprint 15: Real-Time Collaboration",
    goal: "Add WebSocket-based live editing and presence indicators",
    startDate: "2026-02-03",
    endDate: "2026-02-17",
    status: "planned",
    velocity: 0,
    targetVelocity: 50,
    storyPoints: { total: 50, completed: 0 },
    tasks: { total: 28, completed: 0 },
    team: ["Alice", "Eva", "Frank", "Grace"],
    ceremonies: [
      { name: "Sprint Planning", date: "Feb 3", completed: false },
      { name: "Daily Standups", date: "Daily", completed: false },
      { name: "Backlog Refinement", date: "Feb 10", completed: false },
      { name: "Sprint Review", date: "Feb 17", completed: false },
      { name: "Retrospective", date: "Feb 17", completed: false },
    ],
    sustainability: { carbonReduction: 0, energyEfficiency: 0 },
  },
];

const SprintPlanning = () => {
  const [selectedSprint, setSelectedSprint] = useState(sprints[0]);

  const burndownData = [
    { day: "Day 1", remaining: 48, ideal: 48 },
    { day: "Day 2", remaining: 45, ideal: 44 },
    { day: "Day 3", remaining: 42, ideal: 40 },
    { day: "Day 4", remaining: 38, ideal: 36 },
    { day: "Day 5", remaining: 35, ideal: 32 },
    { day: "Day 6", remaining: 32, ideal: 28 },
    { day: "Day 7", remaining: 28, ideal: 24 },
    { day: "Day 8", remaining: 24, ideal: 20 },
    { day: "Day 9", remaining: 20, ideal: 16 },
    { day: "Day 10", remaining: 13, ideal: 12 },
  ];

  return (
    <div className="space-y-6">
      {/* Sprint Selector */}
      <div className="flex flex-wrap gap-3">
        {sprints.map((sprint) => (
          <Button
            key={sprint.id}
            variant={selectedSprint.id === sprint.id ? "default" : "outline"}
            onClick={() => setSelectedSprint(sprint)}
            className="gap-2"
          >
            {sprint.status === "active" && <Play className="w-4 h-4 text-green-500" />}
            {sprint.status === "planned" && <Clock className="w-4 h-4" />}
            {sprint.status === "completed" && <CheckCircle2 className="w-4 h-4" />}
            {sprint.name.split(":")[0]}
          </Button>
        ))}
      </div>

      {/* Sprint Overview */}
      <Card className="glass border-border/50">
        <CardHeader>
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <Badge 
                variant={selectedSprint.status === "active" ? "default" : "secondary"}
                className="mb-2"
              >
                {selectedSprint.status.toUpperCase()}
              </Badge>
              <CardTitle className="text-xl">{selectedSprint.name}</CardTitle>
              <CardDescription className="mt-1">{selectedSprint.goal}</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="gap-1">
                <Calendar className="w-3 h-3" />
                {selectedSprint.startDate} → {selectedSprint.endDate}
              </Badge>
              {selectedSprint.status === "active" && (
                <Badge variant="secondary" className="gap-1">
                  <Clock className="w-3 h-3" />
                  8 days left
                </Badge>
              )}
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Metrics Grid */}
      <div className="grid md:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="glass border-border/50">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-2">
                <Target className="w-5 h-5 text-blue-500" />
                <span className="text-xs text-muted-foreground">Story Points</span>
              </div>
              <div className="text-2xl font-bold">
                {selectedSprint.storyPoints.completed}/{selectedSprint.storyPoints.total}
              </div>
              <Progress 
                value={(selectedSprint.storyPoints.completed / selectedSprint.storyPoints.total) * 100} 
                className="h-2 mt-2" 
              />
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="glass border-border/50">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-2">
                <TrendingUp className="w-5 h-5 text-green-500" />
                <span className="text-xs text-muted-foreground">Velocity</span>
              </div>
              <div className="text-2xl font-bold">
                {selectedSprint.velocity}
                <span className="text-sm text-muted-foreground font-normal">
                  /{selectedSprint.targetVelocity}
                </span>
              </div>
              <Progress 
                value={(selectedSprint.velocity / selectedSprint.targetVelocity) * 100} 
                className="h-2 mt-2" 
              />
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="glass border-border/50">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-2">
                <Leaf className="w-5 h-5 text-emerald-500" />
                <span className="text-xs text-muted-foreground">Carbon Reduction</span>
              </div>
              <div className="text-2xl font-bold text-emerald-500">
                -{selectedSprint.sustainability.carbonReduction}%
              </div>
              <p className="text-xs text-muted-foreground mt-1">vs. baseline</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="glass border-border/50">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-2">
                <Users className="w-5 h-5 text-purple-500" />
                <span className="text-xs text-muted-foreground">Team</span>
              </div>
              <div className="text-2xl font-bold">{selectedSprint.team.length}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {selectedSprint.team.join(", ")}
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Sprint Details */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Burndown Chart Placeholder */}
        <Card className="glass border-border/50">
          <CardHeader>
            <CardTitle className="text-lg">Burndown Chart</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-end gap-2">
              {burndownData.map((point, idx) => (
                <div key={idx} className="flex-1 flex flex-col items-center gap-1">
                  <div className="w-full flex flex-col items-center gap-1">
                    <div 
                      className="w-full bg-primary/20 rounded-t transition-all"
                      style={{ height: `${(point.remaining / 48) * 200}px` }}
                    />
                    <div 
                      className="w-1 bg-muted-foreground/30 rounded"
                      style={{ height: `${(point.ideal / 48) * 200}px`, position: "absolute" }}
                    />
                  </div>
                  <span className="text-xs text-muted-foreground">{idx + 1}</span>
                </div>
              ))}
            </div>
            <div className="flex items-center justify-center gap-6 mt-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-primary/20" />
                <span className="text-muted-foreground">Actual</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-muted-foreground/30" />
                <span className="text-muted-foreground">Ideal</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Ceremonies */}
        <Card className="glass border-border/50">
          <CardHeader>
            <CardTitle className="text-lg">Scrum Ceremonies</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {selectedSprint.ceremonies.map((ceremony, idx) => (
              <div
                key={idx}
                className={`flex items-center justify-between p-3 rounded-lg transition-colors ${
                  ceremony.completed 
                    ? "bg-green-500/10 border border-green-500/30" 
                    : "bg-secondary/50"
                }`}
              >
                <div className="flex items-center gap-3">
                  {ceremony.completed ? (
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                  ) : (
                    <Clock className="w-5 h-5 text-muted-foreground" />
                  )}
                  <div>
                    <p className="font-medium text-sm">{ceremony.name}</p>
                    <p className="text-xs text-muted-foreground">{ceremony.date}</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Retrospective Notes */}
      {selectedSprint.status === "active" && (
        <Card className="glass border-border/50">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <RotateCcw className="w-5 h-5 text-primary" />
              Retrospective Board
            </CardTitle>
            <CardDescription>Add notes for the upcoming retrospective</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/30 min-h-[150px]">
                <h4 className="font-medium text-green-500 mb-3 flex items-center gap-2">
                  <Award className="w-4 h-4" />
                  What went well
                </h4>
                <ul className="text-sm space-y-2 text-muted-foreground">
                  <li>• TDD coverage exceeded targets</li>
                  <li>• Pair programming sessions productive</li>
                  <li>• Green coding metrics improved</li>
                </ul>
              </div>
              <div className="p-4 rounded-lg bg-orange-500/10 border border-orange-500/30 min-h-[150px]">
                <h4 className="font-medium text-orange-500 mb-3 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4" />
                  Needs improvement
                </h4>
                <ul className="text-sm space-y-2 text-muted-foreground">
                  <li>• Code review turnaround time</li>
                  <li>• Documentation updates lagging</li>
                </ul>
              </div>
              <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/30 min-h-[150px]">
                <h4 className="font-medium text-blue-500 mb-3 flex items-center gap-2">
                  <Target className="w-4 h-4" />
                  Action items
                </h4>
                <ul className="text-sm space-y-2 text-muted-foreground">
                  <li>• Implement review SLA alerts</li>
                  <li>• Add doc-check to CI pipeline</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SprintPlanning;
