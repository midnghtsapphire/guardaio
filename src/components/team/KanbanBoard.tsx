import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Plus, 
  MoreHorizontal, 
  User, 
  Clock, 
  Tag,
  AlertCircle,
  CheckCircle2,
  Circle,
  ArrowRight,
  Leaf,
  Zap
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface Task {
  id: string;
  title: string;
  description?: string;
  priority: "critical" | "high" | "medium" | "low";
  owner: string;
  ownerAvatar: string;
  dueDate?: string;
  tags: string[];
  energyImpact?: "high" | "medium" | "low";
  storyPoints: number;
  subtasks?: { done: number; total: number };
}

interface Column {
  id: string;
  title: string;
  wipLimit: number;
  tasks: Task[];
  color: string;
}

const initialColumns: Column[] = [
  {
    id: "backlog",
    title: "Backlog",
    wipLimit: 20,
    color: "bg-slate-500",
    tasks: [
      {
        id: "1",
        title: "Implement dark mode toggle persistence",
        priority: "medium",
        owner: "Alice Chen",
        ownerAvatar: "AC",
        tags: ["frontend", "UX"],
        energyImpact: "low",
        storyPoints: 3,
      },
      {
        id: "2",
        title: "Add WebSocket reconnection logic",
        priority: "high",
        owner: "Bob Martinez",
        ownerAvatar: "BM",
        tags: ["backend", "realtime"],
        energyImpact: "medium",
        storyPoints: 5,
      },
    ],
  },
  {
    id: "analysis",
    title: "Analysis (RUP)",
    wipLimit: 3,
    color: "bg-blue-500",
    tasks: [
      {
        id: "3",
        title: "P5 Impact Assessment for new auth flow",
        description: "Evaluate social/environmental impact of OAuth integration",
        priority: "high",
        owner: "Carol Davis",
        ownerAvatar: "CD",
        tags: ["sustainability", "compliance"],
        energyImpact: "low",
        storyPoints: 8,
        subtasks: { done: 2, total: 5 },
      },
    ],
  },
  {
    id: "dev",
    title: "Development (XP)",
    wipLimit: 4,
    color: "bg-green-500",
    tasks: [
      {
        id: "4",
        title: "TDD: User session management",
        description: "Pair programming session with coverage target 95%",
        priority: "critical",
        owner: "David Kim",
        ownerAvatar: "DK",
        dueDate: "Today",
        tags: ["TDD", "auth"],
        energyImpact: "medium",
        storyPoints: 8,
        subtasks: { done: 7, total: 10 },
      },
      {
        id: "5",
        title: "Refactor notification service",
        priority: "medium",
        owner: "Eva Wilson",
        ownerAvatar: "EW",
        tags: ["refactor"],
        energyImpact: "high",
        storyPoints: 5,
      },
    ],
  },
  {
    id: "testing",
    title: "Testing",
    wipLimit: 3,
    color: "bg-purple-500",
    tasks: [
      {
        id: "6",
        title: "Integration tests for chat module",
        priority: "high",
        owner: "Frank Moore",
        ownerAvatar: "FM",
        tags: ["testing", "CI/CD"],
        storyPoints: 5,
        subtasks: { done: 12, total: 15 },
      },
    ],
  },
  {
    id: "done",
    title: "Done",
    wipLimit: 999,
    color: "bg-emerald-500",
    tasks: [
      {
        id: "7",
        title: "Set up Scaphandre energy monitoring",
        priority: "medium",
        owner: "Grace Lee",
        ownerAvatar: "GL",
        tags: ["devops", "green"],
        energyImpact: "low",
        storyPoints: 3,
      },
    ],
  },
];

const priorityConfig = {
  critical: { icon: AlertCircle, color: "text-red-500", bg: "bg-red-500/10" },
  high: { icon: ArrowRight, color: "text-orange-500", bg: "bg-orange-500/10" },
  medium: { icon: Circle, color: "text-yellow-500", bg: "bg-yellow-500/10" },
  low: { icon: CheckCircle2, color: "text-green-500", bg: "bg-green-500/10" },
};

const energyConfig = {
  high: { icon: Zap, color: "text-red-500", label: "High Energy" },
  medium: { icon: Zap, color: "text-yellow-500", label: "Med Energy" },
  low: { icon: Leaf, color: "text-green-500", label: "Green" },
};

const KanbanBoard = () => {
  const [columns, setColumns] = useState(initialColumns);
  const [draggedTask, setDraggedTask] = useState<Task | null>(null);

  const handleDragStart = (task: Task) => {
    setDraggedTask(task);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (targetColumnId: string) => {
    if (!draggedTask) return;

    setColumns((prevColumns) => {
      const newColumns = prevColumns.map((col) => ({
        ...col,
        tasks: col.tasks.filter((t) => t.id !== draggedTask.id),
      }));

      const targetColumn = newColumns.find((col) => col.id === targetColumnId);
      if (targetColumn && targetColumn.tasks.length < targetColumn.wipLimit) {
        targetColumn.tasks.push(draggedTask);
      }

      return newColumns;
    });
    setDraggedTask(null);
  };

  const totalPoints = columns.reduce(
    (acc, col) => acc + col.tasks.reduce((sum, t) => sum + t.storyPoints, 0),
    0
  );
  const donePoints = columns
    .find((c) => c.id === "done")
    ?.tasks.reduce((sum, t) => sum + t.storyPoints, 0) || 0;

  return (
    <div className="space-y-6">
      {/* Sprint Header */}
      <Card className="glass border-border/50">
        <CardContent className="py-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h3 className="font-semibold text-lg">Sprint 14: Authentication Overhaul</h3>
              <p className="text-sm text-muted-foreground">8 days remaining • {donePoints}/{totalPoints} points completed</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-48">
                <Progress value={(donePoints / totalPoints) * 100} className="h-2" />
              </div>
              <Badge variant="secondary" className="gap-1">
                <Leaf className="w-3 h-3 text-green-500" />
                Carbon: -23%
              </Badge>
              <Button size="sm" className="gap-2">
                <Plus className="w-4 h-4" />
                Add Task
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Kanban Columns */}
      <div className="flex gap-4 overflow-x-auto pb-4">
        {columns.map((column) => (
          <div
            key={column.id}
            className="flex-shrink-0 w-72"
            onDragOver={handleDragOver}
            onDrop={() => handleDrop(column.id)}
          >
            <Card className="glass border-border/50 h-full">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${column.color}`} />
                    <CardTitle className="text-sm font-medium">{column.title}</CardTitle>
                    <Badge variant="secondary" className="text-xs">
                      {column.tasks.length}/{column.wipLimit}
                    </Badge>
                  </div>
                  <Button variant="ghost" size="icon" className="h-7 w-7">
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                </div>
                {column.tasks.length >= column.wipLimit && (
                  <p className="text-xs text-red-500 flex items-center gap-1 mt-1">
                    <AlertCircle className="w-3 h-3" />
                    WIP limit reached
                  </p>
                )}
              </CardHeader>
              <CardContent className="space-y-3 min-h-[400px]">
                {column.tasks.map((task) => {
                  const PriorityIcon = priorityConfig[task.priority].icon;
                  const EnergyIcon = task.energyImpact ? energyConfig[task.energyImpact].icon : null;

                  return (
                    <motion.div
                      key={task.id}
                      draggable
                      onDragStart={() => handleDragStart(task)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="p-3 rounded-lg bg-background border border-border/50 cursor-grab active:cursor-grabbing shadow-sm hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <PriorityIcon className={`w-4 h-4 ${priorityConfig[task.priority].color}`} />
                          <span className="text-xs font-mono text-muted-foreground">{task.id}</span>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {task.storyPoints} pts
                        </Badge>
                      </div>

                      <h4 className="text-sm font-medium mb-2 line-clamp-2">{task.title}</h4>

                      {task.description && (
                        <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
                          {task.description}
                        </p>
                      )}

                      {task.subtasks && (
                        <div className="mb-2">
                          <div className="flex items-center justify-between text-xs mb-1">
                            <span className="text-muted-foreground">Subtasks</span>
                            <span>{task.subtasks.done}/{task.subtasks.total}</span>
                          </div>
                          <Progress
                            value={(task.subtasks.done / task.subtasks.total) * 100}
                            className="h-1"
                          />
                        </div>
                      )}

                      <div className="flex flex-wrap gap-1 mb-3">
                        {task.tags.map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-xs px-1.5 py-0">
                            {tag}
                          </Badge>
                        ))}
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Avatar className="w-6 h-6">
                            <AvatarFallback className="bg-primary/10 text-primary text-xs">
                              {task.ownerAvatar}
                            </AvatarFallback>
                          </Avatar>
                          {task.dueDate && (
                            <span className="text-xs text-muted-foreground flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {task.dueDate}
                            </span>
                          )}
                        </div>
                        {EnergyIcon && (
                          <EnergyIcon className={`w-4 h-4 ${energyConfig[task.energyImpact!].color}`} />
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </CardContent>
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
};

export default KanbanBoard;
