import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  Shield, 
  Bot, 
  Lock, 
  Zap, 
  AlertTriangle, 
  CheckCircle,
  Activity,
  Globe,
  Server,
  Eye,
  Cpu,
  Network,
  RefreshCw,
  Play
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  botProtection, 
  BotDetector, 
  type BotDetectionResult,
  type WAFRule 
} from "@/lib/bot-protection";

const BotProtectionPanel = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [botResult, setBotResult] = useState<BotDetectionResult | null>(null);
  const [stats, setStats] = useState<ReturnType<typeof botProtection.getStats> | null>(null);
  const [wafRules, setWafRules] = useState<WAFRule[]>([]);

  useEffect(() => {
    // Initialize and get stats
    botProtection.initialize().then(() => {
      setStats(botProtection.getStats());
      setWafRules(botProtection.waf.getRules());
    });
  }, []);

  const runBotDetection = async () => {
    setIsRunning(true);
    const detector = new BotDetector();
    const result = await detector.detect();
    setBotResult(result);
    setIsRunning(false);
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence < 30) return "text-green-500";
    if (confidence < 60) return "text-yellow-500";
    return "text-red-500";
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case 'allow': return "bg-green-500/20 text-green-500";
      case 'challenge': return "bg-yellow-500/20 text-yellow-500";
      case 'block': return "bg-red-500/20 text-red-500";
      default: return "bg-muted";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-2xl font-bold flex items-center gap-2">
            <Bot className="w-6 h-6 text-primary" />
            Bot Protection Suite
          </h2>
          <p className="text-muted-foreground text-sm mt-1">
            Multi-layer defense against bot swarms and malicious traffic
          </p>
        </div>
        <Button onClick={() => setStats(botProtection.getStats())} variant="outline" size="sm">
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh Stats
        </Button>
      </div>

      {/* Protection Layers Overview */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="glass border-border/50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center">
                <Globe className="w-6 h-6 text-blue-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats?.crowdsecBlocklist || 0}</p>
                <p className="text-sm text-muted-foreground">CrowdSec IPs</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass border-border/50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center">
                <Shield className="w-6 h-6 text-purple-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats?.wafRules || 0}</p>
                <p className="text-sm text-muted-foreground">WAF Rules</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass border-border/50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-orange-500/20 flex items-center justify-center">
                <Activity className="w-6 h-6 text-orange-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats?.rateLimitStats.activeClients || 0}</p>
                <p className="text-sm text-muted-foreground">Active Clients</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass border-border/50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-red-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats?.honeypotTraps || 0}</p>
                <p className="text-sm text-muted-foreground">Honeypot Traps</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="layers" className="space-y-4">
        <TabsList>
          <TabsTrigger value="layers">Protection Layers</TabsTrigger>
          <TabsTrigger value="detection">Bot Detection</TabsTrigger>
          <TabsTrigger value="waf">WAF Rules</TabsTrigger>
          <TabsTrigger value="pow">Proof of Work</TabsTrigger>
        </TabsList>

        {/* Protection Layers */}
        <TabsContent value="layers" className="space-y-4">
          <div className="grid gap-4">
            {[
              {
                name: "CrowdSec Collaborative Blocking",
                description: "Leverages community threat intelligence. IPs that attacked other CrowdSec users are preemptively blocked.",
                icon: Globe,
                color: "blue",
                status: "active"
              },
              {
                name: "BunkerWeb WAF Engine",
                description: "NGINX-based WAF with antibot features, bad behavior detection, and external blacklist integration.",
                icon: Shield,
                color: "purple",
                status: "active"
              },
              {
                name: "ALTCHA Proof-of-Work",
                description: "Privacy-first challenge system. Forces bots to expend CPU cycles before accessing analysis endpoints.",
                icon: Cpu,
                color: "green",
                status: "active"
              },
              {
                name: "BotD Client Detection",
                description: "JavaScript library detecting Selenium, Puppeteer, and headless browsers via fingerprinting.",
                icon: Eye,
                color: "yellow",
                status: "active"
              },
              {
                name: "Rate Limiting (Leaky Bucket)",
                description: "60 requests/minute with burst allowance. Penalties for exceeding limits.",
                icon: Activity,
                color: "orange",
                status: "active"
              },
              {
                name: "Honeypot Traps",
                description: "Hidden endpoints and form fields that trap bots scanning site structure.",
                icon: AlertTriangle,
                color: "red",
                status: "active"
              }
            ].map((layer, i) => (
              <motion.div
                key={layer.name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <Card className="glass border-border/50">
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-4">
                      <div className={`w-10 h-10 rounded-lg bg-${layer.color}-500/20 flex items-center justify-center shrink-0`}>
                        <layer.icon className={`w-5 h-5 text-${layer.color}-500`} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h3 className="font-semibold">{layer.name}</h3>
                          <Badge variant="outline" className="bg-green-500/20 text-green-500">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Active
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">{layer.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        {/* Bot Detection */}
        <TabsContent value="detection" className="space-y-4">
          <Card className="glass border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bot className="w-5 h-5 text-primary" />
                Client-Side Bot Detection
              </CardTitle>
              <CardDescription>
                Run BotD detection to analyze the current browser session
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button onClick={runBotDetection} disabled={isRunning} className="gap-2">
                {isRunning ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <Play className="w-4 h-4" />
                )}
                Run Detection
              </Button>

              {botResult && (
                <div className="space-y-4 mt-4">
                  <div className="flex items-center justify-between p-4 rounded-lg bg-secondary/50">
                    <div>
                      <p className="text-sm text-muted-foreground">Detection Result</p>
                      <p className={`text-2xl font-bold ${getConfidenceColor(botResult.confidence)}`}>
                        {botResult.confidence.toFixed(1)}% Bot Confidence
                      </p>
                    </div>
                    <Badge className={getActionColor(botResult.recommendation)}>
                      {botResult.recommendation.toUpperCase()}
                    </Badge>
                  </div>

                  {botResult.fingerprint && (
                    <div className="p-3 rounded-lg bg-muted/50">
                      <p className="text-xs text-muted-foreground">Browser Fingerprint</p>
                      <code className="text-sm font-mono">{botResult.fingerprint}</code>
                    </div>
                  )}

                  <div className="space-y-2">
                    <p className="text-sm font-medium">Detection Signals</p>
                    {botResult.signals.map((signal) => (
                      <div
                        key={signal.name}
                        className={`flex items-center justify-between p-3 rounded-lg ${
                          signal.detected ? "bg-red-500/10" : "bg-green-500/10"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          {signal.detected ? (
                            <AlertTriangle className="w-4 h-4 text-red-500" />
                          ) : (
                            <CheckCircle className="w-4 h-4 text-green-500" />
                          )}
                          <div>
                            <p className="text-sm font-medium">{signal.name}</p>
                            <p className="text-xs text-muted-foreground">{signal.description}</p>
                          </div>
                        </div>
                        <Badge variant="outline">Weight: {signal.weight}</Badge>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* WAF Rules */}
        <TabsContent value="waf" className="space-y-4">
          <Card className="glass border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-primary" />
                WAF Rules Engine
              </CardTitle>
              <CardDescription>
                BunkerWeb-style firewall rules for XSS, SQLi, and bot detection
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {wafRules.map((rule) => (
                  <div
                    key={rule.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-secondary/50"
                  >
                    <div className="flex items-center gap-3">
                      <Lock className="w-4 h-4 text-primary" />
                      <div>
                        <p className="text-sm font-medium">{rule.name}</p>
                        <p className="text-xs text-muted-foreground">ID: {rule.id}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{rule.category}</Badge>
                      <Badge 
                        className={
                          rule.action === 'block' ? 'bg-red-500/20 text-red-500' :
                          rule.action === 'challenge' ? 'bg-yellow-500/20 text-yellow-500' :
                          'bg-blue-500/20 text-blue-500'
                        }
                      >
                        {rule.action}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Proof of Work */}
        <TabsContent value="pow" className="space-y-4">
          <Card className="glass border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-primary" />
                ALTCHA Proof-of-Work System
              </CardTitle>
              <CardDescription>
                Computational challenges that make bot attacks expensive
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 rounded-lg bg-secondary/50">
                  <h4 className="font-medium mb-2">How It Works</h4>
                  <ul className="text-sm text-muted-foreground space-y-2">
                    <li className="flex items-start gap-2">
                      <span className="text-primary">1.</span>
                      Server generates a cryptographic challenge with salt
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary">2.</span>
                      Client must find nonce producing hash with N leading zeros
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary">3.</span>
                      Solution verified server-side before granting access
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary">4.</span>
                      Bots must expend CPU cycles, slowing swarm attacks
                    </li>
                  </ul>
                </div>
                <div className="p-4 rounded-lg bg-secondary/50">
                  <h4 className="font-medium mb-2">Configuration</h4>
                  <div className="space-y-3">
                    <div>
                      <p className="text-xs text-muted-foreground">Difficulty</p>
                      <p className="font-mono">20 leading zeros</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Algorithm</p>
                      <p className="font-mono">SHA-256</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Challenge Expiry</p>
                      <p className="font-mono">5 minutes</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Privacy</p>
                      <Badge variant="outline" className="text-green-500">No cookies/tracking</Badge>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BotProtectionPanel;
