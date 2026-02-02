import { useState } from "react";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet-async";
import { 
  MessageSquare, 
  Kanban, 
  Calendar,
  Users,
  GitBranch,
  BarChart3,
  Plus,
  Settings,
  Zap,
  Target
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import TeamChat from "@/components/team/TeamChat";
import KanbanBoard from "@/components/team/KanbanBoard";
import SprintPlanning from "@/components/team/SprintPlanning";
import TeamAnalytics from "@/components/team/TeamAnalytics";

const Team = () => {
  return (
    <>
      <Helmet>
        <title>Team Collaboration Hub | Guardaio</title>
        <meta name="description" content="Open source team collaboration platform with real-time chat, kanban boards, and sprint planning. Built with RUP, XP, Lean, and Scrum methodologies." />
      </Helmet>

      <div className="min-h-screen bg-background">
        <Navbar />

        <main className="pt-32 pb-20">
          <div className="container mx-auto px-6">
            {/* Hero Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-12"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/30 mb-6">
                <Users className="w-4 h-4 text-primary" />
                <span className="text-sm text-primary font-medium">Hybrid Agile Platform</span>
              </div>
              
              <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">
                Team Collaboration Hub
              </h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
                RUP governance, XP engineering, Scrum sprints, and Lean optimization. 
                All in one open-source platform.
              </p>

              {/* Methodology Badges */}
              <div className="flex flex-wrap justify-center gap-3 mb-12">
                {[
                  { label: "RUP", desc: "Governance", color: "bg-blue-500/10 text-blue-500 border-blue-500/30" },
                  { label: "XP", desc: "Engineering", color: "bg-green-500/10 text-green-500 border-green-500/30" },
                  { label: "Scrum", desc: "Sprints", color: "bg-purple-500/10 text-purple-500 border-purple-500/30" },
                  { label: "Lean", desc: "Optimization", color: "bg-orange-500/10 text-orange-500 border-orange-500/30" },
                  { label: "PRiSM", desc: "Sustainability", color: "bg-emerald-500/10 text-emerald-500 border-emerald-500/30" },
                ].map((method) => (
                  <div
                    key={method.label}
                    className={`px-4 py-2 rounded-lg border ${method.color}`}
                  >
                    <span className="font-bold">{method.label}</span>
                    <span className="text-xs ml-2 opacity-75">{method.desc}</span>
                  </div>
                ))}
              </div>

              {/* Stats Grid */}
              <div className="grid md:grid-cols-4 gap-4 max-w-4xl mx-auto mb-12">
                {[
                  { icon: MessageSquare, label: "Messages Today", value: "1,247", color: "text-blue-500" },
                  { icon: Kanban, label: "Tasks in Progress", value: "34", color: "text-green-500" },
                  { icon: Calendar, label: "Active Sprints", value: "3", color: "text-purple-500" },
                  { icon: Target, label: "Velocity Score", value: "87%", color: "text-orange-500" },
                ].map((stat, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="p-4 rounded-xl bg-secondary/30 border border-border/50"
                  >
                    <stat.icon className={`w-6 h-6 ${stat.color} mx-auto mb-2`} />
                    <div className="text-2xl font-bold">{stat.value}</div>
                    <div className="text-sm text-muted-foreground">{stat.label}</div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Main Tabs */}
            <Tabs defaultValue="chat" className="space-y-8">
              <TabsList className="flex flex-wrap justify-center gap-1">
                <TabsTrigger value="chat" className="gap-2">
                  <MessageSquare className="w-4 h-4" />
                  Real-Time Chat
                </TabsTrigger>
                <TabsTrigger value="kanban" className="gap-2">
                  <Kanban className="w-4 h-4" />
                  Kanban Board
                </TabsTrigger>
                <TabsTrigger value="sprints" className="gap-2">
                  <Calendar className="w-4 h-4" />
                  Sprint Planning
                </TabsTrigger>
                <TabsTrigger value="analytics" className="gap-2">
                  <BarChart3 className="w-4 h-4" />
                  Analytics
                </TabsTrigger>
              </TabsList>

              <TabsContent value="chat">
                <TeamChat />
              </TabsContent>

              <TabsContent value="kanban">
                <KanbanBoard />
              </TabsContent>

              <TabsContent value="sprints">
                <SprintPlanning />
              </TabsContent>

              <TabsContent value="analytics">
                <TeamAnalytics />
              </TabsContent>
            </Tabs>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default Team;
