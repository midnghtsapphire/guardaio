import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Waves, Activity, Volume2, Mic, BarChart3, 
  ChevronDown, ChevronRight, Loader2, AlertTriangle, 
  CheckCircle2, Info
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { analyzeAudioForensics, AudioForensicResult } from "@/lib/audio-forensics";

interface AudioForensicPanelProps {
  audioBlob: Blob | null;
}

const AudioForensicPanel = ({ audioBlob }: AudioForensicPanelProps) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState<AudioForensicResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [openSections, setOpenSections] = useState<string[]>(["spectral"]);

  const toggleSection = (section: string) => {
    setOpenSections(prev => 
      prev.includes(section) 
        ? prev.filter(s => s !== section)
        : [...prev, section]
    );
  };

  const runForensicAnalysis = async () => {
    if (!audioBlob) return;
    
    setIsAnalyzing(true);
    setError(null);
    setResults(null);

    try {
      const forensicResults = await analyzeAudioForensics(audioBlob);
      setResults(forensicResults);
      setOpenSections(["spectral", "temporal", "voice", "noise"]);
    } catch (err) {
      console.error("Audio forensic analysis error:", err);
      setError("Failed to perform forensic analysis. The audio format may not be supported.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 70) return "text-success";
    if (score >= 40) return "text-warning";
    return "text-destructive";
  };

  const getScoreBg = (score: number) => {
    if (score >= 70) return "bg-success/10 border-success/30";
    if (score >= 40) return "bg-warning/10 border-warning/30";
    return "bg-destructive/10 border-destructive/30";
  };

  if (!audioBlob) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass rounded-xl p-4 space-y-4"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-primary" />
          <h4 className="font-semibold">Client-Side Forensic Analysis</h4>
        </div>
        <Button
          onClick={runForensicAnalysis}
          disabled={isAnalyzing}
          size="sm"
          variant="outline"
        >
          {isAnalyzing ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Analyzing...
            </>
          ) : results ? (
            <>
              <Activity className="w-4 h-4 mr-2" />
              Re-analyze
            </>
          ) : (
            <>
              <Waves className="w-4 h-4 mr-2" />
              Run Forensic Analysis
            </>
          )}
        </Button>
      </div>

      <p className="text-xs text-muted-foreground">
        Advanced audio analysis using Web Audio API: spectral analysis, temporal patterns, 
        voice characteristics, and noise profiling.
      </p>

      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="p-3 rounded-lg bg-destructive/10 border border-destructive/30 text-sm text-destructive"
          >
            {error}
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {results && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-3"
          >
            {/* Overall Score */}
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              className={`rounded-lg p-4 border ${getScoreBg(results.overallScore)}`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Authenticity Score</p>
                  <p className="text-xs text-muted-foreground">Based on spectral and temporal analysis</p>
                </div>
                <div className={`text-3xl font-bold ${getScoreColor(results.overallScore)}`}>
                  {results.overallScore}%
                </div>
              </div>
              <Progress value={results.overallScore} className="h-2 mt-3" />
            </motion.div>

            {/* Spectral Analysis */}
            <Collapsible 
              open={openSections.includes("spectral")}
              onOpenChange={() => toggleSection("spectral")}
            >
              <CollapsibleTrigger className="flex items-center justify-between w-full p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                <div className="flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-primary" />
                  <span className="font-medium text-sm">Spectral Analysis</span>
                  <Badge variant="outline" className="text-xs">
                    {results.spectralAnalysis.naturalness}% natural
                  </Badge>
                </div>
                {openSections.includes("spectral") ? (
                  <ChevronDown className="w-4 h-4" />
                ) : (
                  <ChevronRight className="w-4 h-4" />
                )}
              </CollapsibleTrigger>
              <CollapsibleContent className="p-3 space-y-2">
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="p-2 rounded bg-muted/20">
                    <p className="text-xs text-muted-foreground">Distribution</p>
                    <p className="font-medium">{results.spectralAnalysis.frequencyDistribution}</p>
                  </div>
                  <div className="p-2 rounded bg-muted/20">
                    <p className="text-xs text-muted-foreground">Dominant Frequencies</p>
                    <p className="font-medium text-xs">
                      {results.spectralAnalysis.dominantFrequencies.slice(0, 3).join(", ")} Hz
                    </p>
                  </div>
                </div>
                {results.spectralAnalysis.artifactsDetected.length > 0 && (
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3 text-warning" />
                      Artifacts Detected:
                    </p>
                    {results.spectralAnalysis.artifactsDetected.map((artifact, i) => (
                      <p key={i} className="text-xs text-warning bg-warning/10 p-2 rounded">
                        {artifact}
                      </p>
                    ))}
                  </div>
                )}
              </CollapsibleContent>
            </Collapsible>

            {/* Temporal Analysis */}
            <Collapsible 
              open={openSections.includes("temporal")}
              onOpenChange={() => toggleSection("temporal")}
            >
              <CollapsibleTrigger className="flex items-center justify-between w-full p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-primary" />
                  <span className="font-medium text-sm">Temporal Patterns</span>
                  <Badge variant="outline" className="text-xs">
                    {results.temporalAnalysis.rhythmConsistency}% consistent
                  </Badge>
                </div>
                {openSections.includes("temporal") ? (
                  <ChevronDown className="w-4 h-4" />
                ) : (
                  <ChevronRight className="w-4 h-4" />
                )}
              </CollapsibleTrigger>
              <CollapsibleContent className="p-3 space-y-2">
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="p-2 rounded bg-muted/20">
                    <p className="text-xs text-muted-foreground">Silence Patterns</p>
                    <p className="font-medium text-xs">{results.temporalAnalysis.silencePatterns}</p>
                  </div>
                  <div className="p-2 rounded bg-muted/20">
                    <p className="text-xs text-muted-foreground">Transitions</p>
                    <p className="font-medium text-xs">{results.temporalAnalysis.transitionSmoothness}</p>
                  </div>
                </div>
                {results.temporalAnalysis.anomalies.length > 0 && (
                  <div className="space-y-1">
                    {results.temporalAnalysis.anomalies.map((anomaly, i) => (
                      <p key={i} className="text-xs text-warning bg-warning/10 p-2 rounded flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3" />
                        {anomaly}
                      </p>
                    ))}
                  </div>
                )}
              </CollapsibleContent>
            </Collapsible>

            {/* Voice Patterns */}
            <Collapsible 
              open={openSections.includes("voice")}
              onOpenChange={() => toggleSection("voice")}
            >
              <CollapsibleTrigger className="flex items-center justify-between w-full p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                <div className="flex items-center gap-2">
                  <Mic className="w-4 h-4 text-primary" />
                  <span className="font-medium text-sm">Voice Analysis</span>
                  <Badge variant="outline" className="text-xs">
                    {results.voicePatterns.pitchVariation}% variation
                  </Badge>
                </div>
                {openSections.includes("voice") ? (
                  <ChevronDown className="w-4 h-4" />
                ) : (
                  <ChevronRight className="w-4 h-4" />
                )}
              </CollapsibleTrigger>
              <CollapsibleContent className="p-3 space-y-2">
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="p-2 rounded bg-muted/20">
                    <p className="text-xs text-muted-foreground">Formant Consistency</p>
                    <p className="font-medium text-xs">{results.voicePatterns.formantConsistency}</p>
                  </div>
                  <div className="p-2 rounded bg-muted/20">
                    <p className="text-xs text-muted-foreground">Breath Patterns</p>
                    <p className="font-medium text-xs">{results.voicePatterns.breathPatterns}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  {results.voicePatterns.naturalPauses ? (
                    <CheckCircle2 className="w-3 h-3 text-success" />
                  ) : (
                    <AlertTriangle className="w-3 h-3 text-warning" />
                  )}
                  <span>
                    {results.voicePatterns.naturalPauses 
                      ? "Natural pauses detected in speech"
                      : "No natural pauses detected (possible continuous synthesis)"
                    }
                  </span>
                </div>
              </CollapsibleContent>
            </Collapsible>

            {/* Noise Profile */}
            <Collapsible 
              open={openSections.includes("noise")}
              onOpenChange={() => toggleSection("noise")}
            >
              <CollapsibleTrigger className="flex items-center justify-between w-full p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                <div className="flex items-center gap-2">
                  <Volume2 className="w-4 h-4 text-primary" />
                  <span className="font-medium text-sm">Noise Profile</span>
                </div>
                {openSections.includes("noise") ? (
                  <ChevronDown className="w-4 h-4" />
                ) : (
                  <ChevronRight className="w-4 h-4" />
                )}
              </CollapsibleTrigger>
              <CollapsibleContent className="p-3 space-y-2">
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="p-2 rounded bg-muted/20">
                    <p className="text-xs text-muted-foreground">Background Noise</p>
                    <p className="font-medium text-xs">{results.noiseProfile.backgroundNoise}</p>
                  </div>
                  <div className="p-2 rounded bg-muted/20">
                    <p className="text-xs text-muted-foreground">Noise Floor</p>
                    <p className="font-medium text-xs">{results.noiseProfile.noiseFloor}%</p>
                  </div>
                </div>
                {results.noiseProfile.inconsistencies.length > 0 && (
                  <div className="space-y-1">
                    {results.noiseProfile.inconsistencies.map((issue, i) => (
                      <p key={i} className="text-xs text-warning bg-warning/10 p-2 rounded flex items-center gap-1">
                        <Info className="w-3 h-3" />
                        {issue}
                      </p>
                    ))}
                  </div>
                )}
              </CollapsibleContent>
            </Collapsible>

            {/* Key Findings */}
            <div className="p-3 rounded-lg bg-muted/20">
              <p className="text-xs font-medium mb-2 flex items-center gap-1">
                <Info className="w-3 h-3 text-primary" />
                Key Findings ({results.findings.length})
              </p>
              <ul className="space-y-1">
                {results.findings.slice(0, 5).map((finding, i) => (
                  <li key={i} className="text-xs text-muted-foreground flex items-start gap-1">
                    <span className="text-primary">•</span>
                    {finding}
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default AudioForensicPanel;
