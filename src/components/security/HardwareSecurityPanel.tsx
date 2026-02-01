import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  Cpu, Shield, AlertTriangle, CheckCircle, XCircle, Play, Loader2, 
  Activity, Thermometer, Zap, Clock, Link2, Hash, Eye, RefreshCw,
  Lock, Server, ChevronDown, ChevronUp
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { 
  MICROARCH_EVENT_TESTS, 
  runCOVERTTest, 
  simulateSideChannelReading,
  detectERMTrigger,
  generateHardwareIntegrityReport,
  type SideChannelReading,
  type COVERTResult,
  type HardwareIntegrityReport
} from "@/lib/hardware-security";
import { toast } from "sonner";

const HardwareSecurityPanel = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [activeTab, setActiveTab] = useState("overview");
  const [report, setReport] = useState<HardwareIntegrityReport | null>(null);
  const [sideChannelReadings, setSideChannelReadings] = useState<SideChannelReading[]>([]);
  const [liveMonitoring, setLiveMonitoring] = useState(false);
  const [expandedTests, setExpandedTests] = useState<Set<string>>(new Set());

  // Live side-channel monitoring
  useEffect(() => {
    if (!liveMonitoring) return;
    
    const interval = setInterval(() => {
      const newReading = simulateSideChannelReading();
      setSideChannelReadings(prev => [...prev.slice(-29), newReading]);
      
      // Check for ERM triggers
      const ermCheck = detectERMTrigger([...sideChannelReadings, newReading]);
      if (ermCheck.detected) {
        toast.error("ERM Trigger Detected!", {
          description: `Rate of change: ${ermCheck.rateOfChange}°C/s exceeds threshold`
        });
      }
    }, 1000);
    
    return () => clearInterval(interval);
  }, [liveMonitoring, sideChannelReadings]);

  const runFullAnalysis = async () => {
    setIsRunning(true);
    setProgress(0);
    
    // Simulate progressive analysis
    for (let i = 0; i <= 100; i += 5) {
      await new Promise(r => setTimeout(r, 100));
      setProgress(i);
    }
    
    const deviceId = `DEV-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
    const newReport = generateHardwareIntegrityReport(deviceId);
    setReport(newReport);
    setIsRunning(false);
    
    if (newReport.overallScore >= 80) {
      toast.success("Hardware Integrity Verified", {
        description: `Score: ${newReport.overallScore}/100 - No threats detected`
      });
    } else if (newReport.overallScore >= 50) {
      toast.warning("Potential Anomalies Detected", {
        description: `Score: ${newReport.overallScore}/100 - Review recommendations`
      });
    } else {
      toast.error("Critical Security Issues", {
        description: `Score: ${newReport.overallScore}/100 - Immediate action required`
      });
    }
  };

  const toggleTestExpansion = (testId: string) => {
    setExpandedTests(prev => {
      const newSet = new Set(prev);
      if (newSet.has(testId)) {
        newSet.delete(testId);
      } else {
        newSet.add(testId);
      }
      return newSet;
    });
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-500";
    if (score >= 50) return "text-yellow-500";
    return "text-red-500";
  };

  const getRiskBadge = (risk: string) => {
    switch (risk) {
      case "low": return <Badge className="bg-green-500/20 text-green-500">Low Risk</Badge>;
      case "medium": return <Badge className="bg-yellow-500/20 text-yellow-500">Medium Risk</Badge>;
      case "high": return <Badge className="bg-orange-500/20 text-orange-500">High Risk</Badge>;
      case "critical": return <Badge className="bg-red-500/20 text-red-500">Critical</Badge>;
      default: return <Badge variant="outline">Unknown</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <Card className="glass border-border/50">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Cpu className="w-5 h-5 text-primary" />
                Hardware Security & Supply Chain Integrity
              </CardTitle>
              <CardDescription>
                COVERT microarchitectural testing, Root of Trust validation, and side-channel analysis
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button
                variant={liveMonitoring ? "destructive" : "outline"}
                size="sm"
                onClick={() => setLiveMonitoring(!liveMonitoring)}
              >
                <Activity className="w-4 h-4 mr-2" />
                {liveMonitoring ? "Stop Monitor" : "Live Monitor"}
              </Button>
              <Button onClick={runFullAnalysis} disabled={isRunning}>
                {isRunning ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Play className="w-4 h-4 mr-2" />
                )}
                Run Full Analysis
              </Button>
            </div>
          </div>
        </CardHeader>
        
        {isRunning && (
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Analyzing hardware integrity...</span>
                <span>{progress}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          </CardContent>
        )}
      </Card>

      {/* Live Side-Channel Monitor */}
      {liveMonitoring && (
        <Card className="glass border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Activity className="w-4 h-4 text-green-500 animate-pulse" />
              Live Side-Channel Monitor
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-4 gap-4">
              <div className="p-3 rounded-lg bg-secondary/50">
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                  <Zap className="w-3 h-3" />
                  Power Draw
                </div>
                <div className="text-2xl font-mono">
                  {sideChannelReadings.length > 0 
                    ? `${sideChannelReadings[sideChannelReadings.length - 1].powerDraw.toFixed(1)}mW`
                    : "--"}
                </div>
              </div>
              <div className="p-3 rounded-lg bg-secondary/50">
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                  <Thermometer className="w-3 h-3" />
                  Thermal
                </div>
                <div className="text-2xl font-mono">
                  {sideChannelReadings.length > 0 
                    ? `${sideChannelReadings[sideChannelReadings.length - 1].thermalTemp.toFixed(1)}°C`
                    : "--"}
                </div>
              </div>
              <div className="p-3 rounded-lg bg-secondary/50">
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                  <Clock className="w-3 h-3" />
                  Timing
                </div>
                <div className="text-2xl font-mono">
                  {sideChannelReadings.length > 0 
                    ? `${sideChannelReadings[sideChannelReadings.length - 1].timingDelay.toFixed(0)}μs`
                    : "--"}
                </div>
              </div>
              <div className="p-3 rounded-lg bg-secondary/50">
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                  <AlertTriangle className="w-3 h-3" />
                  Anomaly Score
                </div>
                <div className={`text-2xl font-mono ${
                  sideChannelReadings.length > 0 && sideChannelReadings[sideChannelReadings.length - 1].anomalyScore > 30
                    ? "text-red-500" : "text-green-500"
                }`}>
                  {sideChannelReadings.length > 0 
                    ? sideChannelReadings[sideChannelReadings.length - 1].anomalyScore
                    : "--"}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Main Results */}
      {report && (
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="flex flex-wrap">
            <TabsTrigger value="overview" className="gap-2">
              <Shield className="w-4 h-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="covert" className="gap-2">
              <Cpu className="w-4 h-4" />
              COVERT Tests
            </TabsTrigger>
            <TabsTrigger value="sidechannel" className="gap-2">
              <Activity className="w-4 h-4" />
              Side-Channel
            </TabsTrigger>
            <TabsTrigger value="rot" className="gap-2">
              <Lock className="w-4 h-4" />
              Root of Trust
            </TabsTrigger>
            <TabsTrigger value="traceability" className="gap-2">
              <Link2 className="w-4 h-4" />
              Traceability
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-4">
            <div className="grid md:grid-cols-3 gap-4">
              <Card className="glass border-border/50">
                <CardContent className="pt-6 text-center">
                  <div className={`text-5xl font-bold ${getScoreColor(report.overallScore)}`}>
                    {report.overallScore}
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">Overall Security Score</p>
                  <div className="mt-4">
                    {getRiskBadge(report.sideChannelAnalysis.overallRisk)}
                  </div>
                </CardContent>
              </Card>
              
              <Card className="glass border-border/50">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-2 mb-3">
                    <Server className="w-4 h-4 text-primary" />
                    <span className="font-medium">Device ID</span>
                  </div>
                  <code className="text-lg font-mono">{report.deviceId}</code>
                  <p className="text-xs text-muted-foreground mt-2">
                    Analyzed: {report.timestamp.toLocaleString()}
                  </p>
                </CardContent>
              </Card>

              <Card className="glass border-border/50">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-2 mb-3">
                    <Hash className="w-4 h-4 text-primary" />
                    <span className="font-medium">TPM Status</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {report.rootOfTrustStatus.attestationValid ? (
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-500" />
                    )}
                    <span>TPM {report.rootOfTrustStatus.tpmVersion}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    {report.rootOfTrustStatus.measurementLog.filter(m => m.isValid).length}/
                    {report.rootOfTrustStatus.measurementLog.length} PCRs Valid
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Recommendations */}
            <Card className="glass border-border/50">
              <CardHeader>
                <CardTitle className="text-lg">Security Recommendations</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {report.recommendations.map((rec, i) => (
                    <motion.li
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className={`flex items-start gap-2 p-3 rounded-lg ${
                        rec.includes("CRITICAL") ? "bg-red-500/10 text-red-400" :
                        rec.includes("WARNING") ? "bg-yellow-500/10 text-yellow-400" :
                        "bg-green-500/10 text-green-400"
                      }`}
                    >
                      {rec.includes("CRITICAL") ? <XCircle className="w-4 h-4 mt-0.5 flex-shrink-0" /> :
                       rec.includes("WARNING") ? <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" /> :
                       <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />}
                      <span className="text-sm">{rec}</span>
                    </motion.li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </TabsContent>

          {/* COVERT Tests Tab */}
          <TabsContent value="covert" className="space-y-4">
            <Card className="glass border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Cpu className="w-5 h-5 text-primary" />
                  COVERT Microarchitectural Event Testing
                </CardTitle>
                <CardDescription>
                  Rare event activation to detect dormant hardware Trojans
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {report.covertTestResults.map((result, i) => {
                  const test = MICROARCH_EVENT_TESTS.find(t => t.id === result.testId);
                  const isExpanded = expandedTests.has(result.testId);
                  
                  return (
                    <Collapsible key={result.testId} open={isExpanded}>
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className={`p-4 rounded-lg border ${
                          result.status === "passed" ? "bg-green-500/5 border-green-500/20" :
                          result.status === "anomaly" ? "bg-yellow-500/5 border-yellow-500/20" :
                          "bg-red-500/5 border-red-500/20"
                        }`}
                      >
                        <CollapsibleTrigger 
                          className="w-full"
                          onClick={() => toggleTestExpansion(result.testId)}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              {result.status === "passed" ? (
                                <CheckCircle className="w-5 h-5 text-green-500" />
                              ) : result.status === "anomaly" ? (
                                <AlertTriangle className="w-5 h-5 text-yellow-500" />
                              ) : (
                                <XCircle className="w-5 h-5 text-red-500" />
                              )}
                              <div className="text-left">
                                <p className="font-medium">{result.testName}</p>
                                <p className="text-xs text-muted-foreground">
                                  {test?.category} • {result.rareEventsTriggered}/{result.expectedEvents} events
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              <Badge variant="outline">
                                {result.trojanProbability.toFixed(1)}% risk
                              </Badge>
                              {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                            </div>
                          </div>
                        </CollapsibleTrigger>
                        
                        <CollapsibleContent>
                          <div className="mt-4 pt-4 border-t border-border/50 space-y-3">
                            <div>
                              <p className="text-xs text-muted-foreground mb-1">Description</p>
                              <p className="text-sm">{test?.description}</p>
                            </div>
                            <div>
                              <p className="text-xs text-muted-foreground mb-1">Test Logic</p>
                              <pre className="text-xs bg-black/20 p-2 rounded overflow-x-auto">
                                {test?.testCode}
                              </pre>
                            </div>
                            <div>
                              <p className="text-xs text-muted-foreground mb-1">Trojan Indicators</p>
                              <div className="flex flex-wrap gap-1">
                                {test?.trojanIndicators.map((ind, j) => (
                                  <Badge key={j} variant="outline" className="text-xs">
                                    {ind}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </div>
                        </CollapsibleContent>
                      </motion.div>
                    </Collapsible>
                  );
                })}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Side-Channel Tab */}
          <TabsContent value="sidechannel" className="space-y-4">
            <div className="grid md:grid-cols-3 gap-4">
              <Card className={`glass border-border/50 ${
                report.sideChannelAnalysis.powerProfile.isAnomalous ? "ring-2 ring-red-500/50" : ""
              }`}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Zap className="w-4 h-4" />
                    Power Profile
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Baseline</span>
                      <span className="font-mono">{report.sideChannelAnalysis.powerProfile.baseline}mW</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Current</span>
                      <span className="font-mono">{report.sideChannelAnalysis.powerProfile.current.toFixed(1)}mW</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Deviation</span>
                      <span className={`font-mono ${
                        report.sideChannelAnalysis.powerProfile.deviation > 20 ? "text-red-500" : "text-green-500"
                      }`}>
                        {report.sideChannelAnalysis.powerProfile.deviation.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className={`glass border-border/50 ${
                report.sideChannelAnalysis.timingProfile.isAnomalous ? "ring-2 ring-red-500/50" : ""
              }`}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    Timing Profile
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Baseline</span>
                      <span className="font-mono">{report.sideChannelAnalysis.timingProfile.baselineLatency}μs</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Current</span>
                      <span className="font-mono">{report.sideChannelAnalysis.timingProfile.currentLatency.toFixed(1)}μs</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Jitter</span>
                      <span className={`font-mono ${
                        report.sideChannelAnalysis.timingProfile.jitter > 15 ? "text-red-500" : "text-green-500"
                      }`}>
                        ±{report.sideChannelAnalysis.timingProfile.jitter.toFixed(1)}μs
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className={`glass border-border/50 ${
                report.sideChannelAnalysis.thermalProfile.isAnomalous ? "ring-2 ring-red-500/50" : ""
              }`}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Thermometer className="w-4 h-4" />
                    Thermal Profile (ERM Detection)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Baseline</span>
                      <span className="font-mono">{report.sideChannelAnalysis.thermalProfile.baseline}°C</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Current</span>
                      <span className="font-mono">{report.sideChannelAnalysis.thermalProfile.current.toFixed(1)}°C</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">dV/dt</span>
                      <span className={`font-mono ${
                        report.sideChannelAnalysis.thermalProfile.rateOfChange > 5 ? "text-red-500" : "text-green-500"
                      }`}>
                        {report.sideChannelAnalysis.thermalProfile.rateOfChange}°C/s
                      </span>
                    </div>
                  </div>
                  {report.sideChannelAnalysis.thermalProfile.isAnomalous && (
                    <div className="mt-3 p-2 bg-red-500/10 rounded text-xs text-red-400">
                      ⚠️ ERM trigger pattern detected - rate-based evasion possible
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Root of Trust Tab */}
          <TabsContent value="rot" className="space-y-4">
            <Card className="glass border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lock className="w-5 h-5 text-primary" />
                  Root of Trust & TPM Measurements
                </CardTitle>
                <CardDescription>
                  Hardware-based authentication and boot chain verification
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-4 gap-4">
                  <div className="p-3 rounded-lg bg-secondary/50">
                    <p className="text-xs text-muted-foreground">TPM Present</p>
                    <p className="font-medium flex items-center gap-2">
                      {report.rootOfTrustStatus.tpmPresent ? (
                        <><CheckCircle className="w-4 h-4 text-green-500" /> Yes</>
                      ) : (
                        <><XCircle className="w-4 h-4 text-red-500" /> No</>
                      )}
                    </p>
                  </div>
                  <div className="p-3 rounded-lg bg-secondary/50">
                    <p className="text-xs text-muted-foreground">TPM Version</p>
                    <p className="font-medium">{report.rootOfTrustStatus.tpmVersion}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-secondary/50">
                    <p className="text-xs text-muted-foreground">Secure Boot</p>
                    <p className="font-medium flex items-center gap-2">
                      {report.rootOfTrustStatus.secureBootEnabled ? (
                        <><CheckCircle className="w-4 h-4 text-green-500" /> Enabled</>
                      ) : (
                        <><XCircle className="w-4 h-4 text-red-500" /> Disabled</>
                      )}
                    </p>
                  </div>
                  <div className="p-3 rounded-lg bg-secondary/50">
                    <p className="text-xs text-muted-foreground">Attestation</p>
                    <p className="font-medium flex items-center gap-2">
                      {report.rootOfTrustStatus.attestationValid ? (
                        <><CheckCircle className="w-4 h-4 text-green-500" /> Valid</>
                      ) : (
                        <><XCircle className="w-4 h-4 text-red-500" /> Invalid</>
                      )}
                    </p>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-3">PCR Measurement Log</h4>
                  <div className="space-y-2">
                    {report.rootOfTrustStatus.measurementLog.map((entry, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.03 }}
                        className={`flex items-center justify-between p-2 rounded ${
                          entry.isValid ? "bg-green-500/5" : "bg-red-500/10"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          {entry.isValid ? (
                            <CheckCircle className="w-4 h-4 text-green-500" />
                          ) : (
                            <XCircle className="w-4 h-4 text-red-500" />
                          )}
                          <span className="text-sm">PCR[{entry.pcr}]</span>
                          <span className="text-sm text-muted-foreground">{entry.component}</span>
                        </div>
                        <code className="text-xs font-mono text-muted-foreground">{entry.hash}</code>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Traceability Tab */}
          <TabsContent value="traceability" className="space-y-4">
            <Card className="glass border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Link2 className="w-5 h-5 text-primary" />
                  Cryptographic Supply Chain Traceability
                </CardTitle>
                <CardDescription>
                  SHA-3 linked records for component pedigree verification
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-4 gap-4 mb-6">
                  <div className="p-3 rounded-lg bg-secondary/50 text-center">
                    <p className="text-2xl font-bold">{report.traceabilityChain.chainLength}</p>
                    <p className="text-xs text-muted-foreground">Chain Length</p>
                  </div>
                  <div className="p-3 rounded-lg bg-secondary/50 text-center">
                    <p className="text-2xl font-bold text-green-500">{report.traceabilityChain.verifiedRecords}</p>
                    <p className="text-xs text-muted-foreground">Verified Records</p>
                  </div>
                  <div className="p-3 rounded-lg bg-secondary/50 text-center">
                    <p className="text-2xl font-bold text-red-500">{report.traceabilityChain.brokenLinks}</p>
                    <p className="text-xs text-muted-foreground">Broken Links</p>
                  </div>
                  <div className="p-3 rounded-lg bg-secondary/50 text-center">
                    {report.traceabilityChain.originVerified ? (
                      <CheckCircle className="w-8 h-8 text-green-500 mx-auto" />
                    ) : (
                      <XCircle className="w-8 h-8 text-red-500 mx-auto" />
                    )}
                    <p className="text-xs text-muted-foreground">Origin Verified</p>
                  </div>
                </div>

                {/* Visual Chain */}
                <div className="relative">
                  <div className="flex items-center justify-between">
                    {["MAKE", "SHIP", "RECEIVE", "ASSEMBLE", "VERIFY"].map((event, i) => (
                      <div key={event} className="flex flex-col items-center">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                          i < report.traceabilityChain.verifiedRecords 
                            ? "bg-green-500/20 text-green-500" 
                            : "bg-muted text-muted-foreground"
                        }`}>
                          {i < report.traceabilityChain.verifiedRecords ? (
                            <CheckCircle className="w-6 h-6" />
                          ) : (
                            <Hash className="w-6 h-6" />
                          )}
                        </div>
                        <span className="text-xs mt-2">{event}</span>
                      </div>
                    ))}
                  </div>
                  <div className="absolute top-6 left-0 right-0 h-0.5 bg-border -z-10">
                    <div 
                      className="h-full bg-green-500 transition-all"
                      style={{ width: `${(report.traceabilityChain.verifiedRecords / 5) * 100}%` }}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}

      {/* Empty State */}
      {!report && !isRunning && (
        <Card className="glass border-border/50">
          <CardContent className="py-12 text-center">
            <Cpu className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No Analysis Available</h3>
            <p className="text-muted-foreground mb-4">
              Run a full hardware security analysis to detect supply chain tampering
            </p>
            <Button onClick={runFullAnalysis}>
              <Play className="w-4 h-4 mr-2" />
              Start Analysis
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default HardwareSecurityPanel;
