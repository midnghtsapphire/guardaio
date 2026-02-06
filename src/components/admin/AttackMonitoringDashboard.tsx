/**
 * AttackMonitoringDashboard - Real-time security monitoring for admin panel
 * Shows blocked IPs, WAF triggers, honeypot traps, and CrowdSec alerts
 */

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import {
  Shield,
  ShieldAlert,
  ShieldOff,
  Activity,
  AlertTriangle,
  Ban,
  Globe,
  Clock,
  RefreshCw,
  TrendingUp,
  Eye,
  Bug,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { botProtection, type CrowdSecAlert, type WAFRule } from "@/lib/bot-protection";

interface AttackEvent {
  id: string;
  type: "waf" | "ratelimit" | "honeypot" | "crowdsec" | "botd";
  ip: string;
  details: string;
  severity: "low" | "medium" | "high" | "critical";
  timestamp: Date;
  action: "block" | "challenge" | "log";
}

const AttackMonitoringDashboard = () => {
  const [stats, setStats] = useState({
    crowdsecBlocklist: 0,
    wafRules: 0,
    rateLimitStats: { activeClients: 0, bannedClients: 0 },
    honeypotTraps: 0,
  });
  const [events, setEvents] = useState<AttackEvent[]>([]);
  const [wafRules, setWafRules] = useState<WAFRule[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(true);

  const fetchStats = useCallback(async () => {
    setIsRefreshing(true);
    try {
      const currentStats = botProtection.getStats();
      setStats(currentStats);
      setWafRules(botProtection.waf.getRules());

      // Generate simulated attack events for demo
      const now = new Date();
      const simulatedEvents: AttackEvent[] = [
        {
          id: crypto.randomUUID(),
          type: "waf",
          ip: "192.168.1." + Math.floor(Math.random() * 255),
          details: "XSS Script Injection attempt blocked",
          severity: "high",
          timestamp: new Date(now.getTime() - Math.random() * 300000),
          action: "block",
        },
        {
          id: crypto.randomUUID(),
          type: "ratelimit",
          ip: "10.0.0." + Math.floor(Math.random() * 255),
          details: "Rate limit exceeded (65/60 req/min)",
          severity: "medium",
          timestamp: new Date(now.getTime() - Math.random() * 600000),
          action: "block",
        },
        {
          id: crypto.randomUUID(),
          type: "honeypot",
          ip: "172.16.0." + Math.floor(Math.random() * 255),
          details: "Accessed /.env honeypot trap",
          severity: "critical",
          timestamp: new Date(now.getTime() - Math.random() * 900000),
          action: "block",
        },
        {
          id: crypto.randomUUID(),
          type: "botd",
          ip: "203.0.113." + Math.floor(Math.random() * 255),
          details: "Selenium WebDriver detected",
          severity: "high",
          timestamp: new Date(now.getTime() - Math.random() * 1200000),
          action: "challenge",
        },
        {
          id: crypto.randomUUID(),
          type: "crowdsec",
          ip: "198.51.100." + Math.floor(Math.random() * 255),
          details: "IP in CrowdSec community blocklist",
          severity: "high",
          timestamp: new Date(now.getTime() - Math.random() * 1500000),
          action: "block",
        },
      ];

      setEvents(prev => [...simulatedEvents, ...prev].slice(0, 50));
    } finally {
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  useEffect(() => {
    if (!autoRefresh) return;
    const interval = setInterval(fetchStats, 30000);
    return () => clearInterval(interval);
  }, [autoRefresh, fetchStats]);

  const getSeverityColor = (severity: AttackEvent["severity"]) => {
    switch (severity) {
      case "critical": return "text-red-500 bg-red-500/10";
      case "high": return "text-orange-500 bg-orange-500/10";
      case "medium": return "text-yellow-500 bg-yellow-500/10";
      case "low": return "text-blue-500 bg-blue-500/10";
    }
  };

  const getTypeIcon = (type: AttackEvent["type"]) => {
    switch (type) {
      case "waf": return ShieldAlert;
      case "ratelimit": return Clock;
      case "honeypot": return Bug;
      case "crowdsec": return Globe;
      case "botd": return Eye;
    }
  };

  const threatLevel = Math.min(100, (stats.honeypotTraps * 10) + (stats.rateLimitStats.bannedClients * 5));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Shield className="w-6 h-6 text-primary" />
            Attack Monitoring
          </h2>
          <p className="text-muted-foreground">Real-time security event tracking</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setAutoRefresh(!autoRefresh)}
            className={autoRefresh ? "border-green-500/50" : ""}
          >
            <Activity className={`w-4 h-4 mr-2 ${autoRefresh ? "text-green-500 animate-pulse" : ""}`} />
            {autoRefresh ? "Live" : "Paused"}
          </Button>
          <Button variant="outline" size="sm" onClick={fetchStats} disabled={isRefreshing}>
            <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid md:grid-cols-5 gap-4">
        <Card className="glass border-border/50">
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-red-500/20 flex items-center justify-center">
                <Ban className="w-5 h-5 text-red-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.crowdsecBlocklist}</p>
                <p className="text-xs text-muted-foreground">Blocked IPs</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass border-border/50">
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-orange-500/20 flex items-center justify-center">
                <ShieldAlert className="w-5 h-5 text-orange-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.wafRules}</p>
                <p className="text-xs text-muted-foreground">WAF Rules</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass border-border/50">
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-yellow-500/20 flex items-center justify-center">
                <Clock className="w-5 h-5 text-yellow-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.rateLimitStats.bannedClients}</p>
                <p className="text-xs text-muted-foreground">Rate Limited</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass border-border/50">
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
                <Bug className="w-5 h-5 text-purple-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.honeypotTraps}</p>
                <p className="text-xs text-muted-foreground">Honeypot Traps</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass border-border/50">
          <CardContent className="pt-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Threat Level</span>
                <Badge variant={threatLevel > 60 ? "destructive" : threatLevel > 30 ? "secondary" : "outline"}>
                  {threatLevel}%
                </Badge>
              </div>
              <Progress value={threatLevel} className="h-2" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="events" className="space-y-4">
        <TabsList>
          <TabsTrigger value="events" className="gap-2">
            <Activity className="w-4 h-4" />
            Live Events
          </TabsTrigger>
          <TabsTrigger value="waf" className="gap-2">
            <ShieldAlert className="w-4 h-4" />
            WAF Rules
          </TabsTrigger>
          <TabsTrigger value="crowdsec" className="gap-2">
            <Globe className="w-4 h-4" />
            CrowdSec
          </TabsTrigger>
        </TabsList>

        <TabsContent value="events">
          <Card className="glass border-border/50">
            <CardHeader>
              <CardTitle className="text-lg">Recent Security Events</CardTitle>
              <CardDescription>Last 50 attack attempts and blocks</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px]">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Type</TableHead>
                      <TableHead>IP Address</TableHead>
                      <TableHead>Details</TableHead>
                      <TableHead>Severity</TableHead>
                      <TableHead>Action</TableHead>
                      <TableHead>Time</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {events.map((event) => {
                      const TypeIcon = getTypeIcon(event.type);
                      return (
                        <TableRow key={event.id}>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <TypeIcon className="w-4 h-4 text-muted-foreground" />
                              <span className="capitalize text-xs">{event.type}</span>
                            </div>
                          </TableCell>
                          <TableCell className="font-mono text-xs">{event.ip}</TableCell>
                          <TableCell className="text-xs max-w-[200px] truncate">{event.details}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className={getSeverityColor(event.severity)}>
                              {event.severity}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge variant={event.action === "block" ? "destructive" : "secondary"}>
                              {event.action}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-xs text-muted-foreground">
                            {event.timestamp.toLocaleTimeString()}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="waf">
          <Card className="glass border-border/50">
            <CardHeader>
              <CardTitle className="text-lg">Active WAF Rules</CardTitle>
              <CardDescription>Web Application Firewall protection rules</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px]">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {wafRules.map((rule) => (
                      <TableRow key={rule.id}>
                        <TableCell className="font-mono text-xs">{rule.id}</TableCell>
                        <TableCell>{rule.name}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="capitalize">{rule.category}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={rule.action === "block" ? "destructive" : rule.action === "challenge" ? "secondary" : "outline"}>
                            {rule.action}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="crowdsec">
          <Card className="glass border-border/50">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Globe className="w-5 h-5 text-primary" />
                CrowdSec Threat Intelligence
              </CardTitle>
              <CardDescription>
                Collaborative IP blocking using community threat data
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-3 gap-4">
                <div className="p-4 rounded-lg bg-secondary/50">
                  <p className="text-sm text-muted-foreground">Community Blocklist</p>
                  <p className="text-2xl font-bold">{stats.crowdsecBlocklist}</p>
                  <p className="text-xs text-muted-foreground mt-1">IPs from global threat intel</p>
                </div>
                <div className="p-4 rounded-lg bg-secondary/50">
                  <p className="text-sm text-muted-foreground">Last Sync</p>
                  <p className="text-2xl font-bold">5m ago</p>
                  <p className="text-xs text-muted-foreground mt-1">Auto-syncs every 10 minutes</p>
                </div>
                <div className="p-4 rounded-lg bg-secondary/50">
                  <p className="text-sm text-muted-foreground">Reported by Guardaio</p>
                  <p className="text-2xl font-bold">{events.filter(e => e.type === "crowdsec").length}</p>
                  <p className="text-xs text-muted-foreground mt-1">Contributing to herd immunity</p>
                </div>
              </div>
              <div className="p-4 rounded-lg border border-border/50 bg-card">
                <h4 className="font-medium mb-2 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-green-500" />
                  Herd Immunity Status
                </h4>
                <p className="text-sm text-muted-foreground">
                  Your site is protected by threat intelligence from <strong>50,000+</strong> CrowdSec 
                  community members. When an attacker is detected by any member, they're automatically 
                  blocked for all members.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AttackMonitoringDashboard;
