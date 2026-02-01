import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  AlertTriangle, 
  Eye, 
  EyeOff, 
  Database, 
  Fingerprint, 
  Clock, 
  Camera, 
  FileCode,
  Sparkles,
  TrendingUp,
  Shield,
  Info
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { 
  ExtendedMetadata, 
  MetadataPattern, 
  AnomalyReport,
  extractExtendedMetadata,
  generateAnomalyReport 
} from "@/lib/metadata-anomaly-tracker";

interface MetadataAnomalyPanelProps {
  file: File;
  detectionContext?: 'deepfake' | 'authentic' | 'unknown';
  onComplete?: (report: AnomalyReport) => void;
}

const MetadataAnomalyPanel = ({ file, detectionContext = 'unknown', onComplete }: MetadataAnomalyPanelProps) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [metadata, setMetadata] = useState<ExtendedMetadata | null>(null);
  const [report, setReport] = useState<AnomalyReport | null>(null);
  const [showRawMetadata, setShowRawMetadata] = useState(false);
  const [expandedSections, setExpandedSections] = useState<string[]>(['patterns']);

  const runAnalysis = async () => {
    setIsAnalyzing(true);
    try {
      const extracted = await extractExtendedMetadata(file);
      setMetadata(extracted);
      
      const anomalyReport = await generateAnomalyReport(extracted, file.name, detectionContext);
      setReport(anomalyReport);
      onComplete?.(anomalyReport);
    } catch (err) {
      console.error('Metadata analysis failed:', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  useEffect(() => {
    runAnalysis();
  }, [file]);

  const toggleSection = (section: string) => {
    setExpandedSections(prev => 
      prev.includes(section) 
        ? prev.filter(s => s !== section)
        : [...prev, section]
    );
  };

  const getPatternIcon = (type: string) => {
    if (type.includes('software')) return FileCode;
    if (type.includes('timestamp')) return Clock;
    if (type.includes('exif') || type.includes('camera')) return Camera;
    if (type.includes('filename')) return Fingerprint;
    return AlertTriangle;
  };

  const getRiskColor = (rarity: number, isSuspicious: boolean) => {
    if (!isSuspicious) return 'text-muted-foreground';
    if (rarity > 80) return 'text-purple-500';
    if (rarity > 50) return 'text-yellow-500';
    return 'text-destructive';
  };

  if (isAnalyzing) {
    return (
      <Card className="glass border-border/50">
        <CardContent className="p-6">
          <div className="flex items-center gap-3">
            <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            <span className="text-muted-foreground">Analyzing metadata patterns...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!report) return null;

  return (
    <Card className="glass border-border/50">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Database className="w-5 h-5 text-primary" />
            <span>Metadata Anomaly Analysis</span>
          </div>
          <div className="flex items-center gap-2">
            <Badge 
              variant={report.overallRiskScore > 50 ? "destructive" : report.overallRiskScore > 25 ? "secondary" : "default"}
              className="gap-1"
            >
              <Shield className="w-3 h-3" />
              Risk: {report.overallRiskScore}%
            </Badge>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowRawMetadata(!showRawMetadata)}
            >
              {showRawMetadata ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Risk Score Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Metadata Risk Score</span>
            <span className="font-medium">{report.overallRiskScore}%</span>
          </div>
          <Progress 
            value={report.overallRiskScore} 
            className={`h-2 ${report.overallRiskScore > 50 ? '[&>div]:bg-destructive' : ''}`}
          />
        </div>

        {/* Never Seen Before Patterns */}
        {report.neverSeenBefore.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-3 rounded-lg bg-purple-500/10 border border-purple-500/30"
          >
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-purple-500" />
              <span className="font-medium text-purple-500">Rare/Novel Patterns Detected</span>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Info className="w-3 h-3 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="max-w-xs">These patterns are extremely rare or have never been seen before. They're being tracked to improve detection accuracy.</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <div className="space-y-1">
              {report.neverSeenBefore.map((pattern, idx) => (
                <div key={idx} className="text-sm text-purple-400">
                  • {pattern.type.replace(/_/g, ' ')}: {JSON.stringify(pattern.data).slice(0, 100)}
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Recommendations */}
        {report.recommendations.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-primary" />
              Detection Insights
            </h4>
            <div className="space-y-1">
              {report.recommendations.map((rec, idx) => (
                <div key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
                  <AlertTriangle className="w-3 h-3 mt-0.5 text-yellow-500 shrink-0" />
                  {rec}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Pattern Details */}
        <Collapsible 
          open={expandedSections.includes('patterns')}
          onOpenChange={() => toggleSection('patterns')}
        >
          <CollapsibleTrigger asChild>
            <Button variant="ghost" className="w-full justify-between p-2 h-auto">
              <span className="text-sm font-medium">Detected Patterns ({report.patterns.length})</span>
              <Badge variant="outline">{report.patterns.length}</Badge>
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <AnimatePresence>
              <div className="space-y-2 mt-2">
                {report.patterns.map((pattern, idx) => {
                  const Icon = getPatternIcon(pattern.type);
                  return (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className="p-2 rounded-lg bg-secondary/50 flex items-start gap-3"
                    >
                      <Icon className={`w-4 h-4 mt-0.5 ${getRiskColor(pattern.rarity, pattern.isSuspicious)}`} />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-sm font-medium">
                            {pattern.type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                          </span>
                          <Badge variant="outline" className="text-xs">
                            Rarity: {pattern.rarity}%
                          </Badge>
                          {pattern.isSuspicious && (
                            <Badge variant="destructive" className="text-xs">
                              Suspicious
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1 truncate">
                          {JSON.stringify(pattern.data)}
                        </p>
                      </div>
                    </motion.div>
                  );
                })}
                {report.patterns.length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No unusual metadata patterns detected
                  </p>
                )}
              </div>
            </AnimatePresence>
          </CollapsibleContent>
        </Collapsible>

        {/* Raw Metadata View */}
        <AnimatePresence>
          {showRawMetadata && metadata && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="p-3 rounded-lg bg-secondary/30 border border-border/50">
                <h4 className="text-sm font-medium mb-2">Raw Metadata</h4>
                <pre className="text-xs text-muted-foreground overflow-x-auto max-h-48 overflow-y-auto">
                  {JSON.stringify(metadata, null, 2)}
                </pre>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Tracking Notice */}
        <div className="text-xs text-muted-foreground flex items-center gap-1 pt-2 border-t border-border/50">
          <Database className="w-3 h-3" />
          Patterns tracked for ML improvement • {report.patterns.length} analyzed
        </div>
      </CardContent>
    </Card>
  );
};

export default MetadataAnomalyPanel;
