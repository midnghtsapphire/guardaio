import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Fingerprint, 
  Scan, 
  ScanFace, 
  Palette, 
  Waves, 
  FileWarning,
  ChevronDown,
  ChevronUp,
  Loader2,
  Eye,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Info
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { 
  ForensicResult, 
  runForensicAnalysis 
} from "@/lib/forensic-analysis";
import { 
  FaceDetectionResult, 
  detectFaces, 
  loadFaceApiModels,
  areModelsLoaded 
} from "@/lib/face-detection";

interface ForensicAnalysisPanelProps {
  imageElement: HTMLImageElement | null;
  file: File | null;
  isAnalyzing: boolean;
  onComplete?: (results: { forensic: ForensicResult; face: FaceDetectionResult }) => void;
}

type AnalysisStage = 'idle' | 'loading-models' | 'forensic' | 'face-detection' | 'complete';

const ForensicAnalysisPanel = ({
  imageElement,
  file,
  isAnalyzing,
  onComplete,
}: ForensicAnalysisPanelProps) => {
  const [stage, setStage] = useState<AnalysisStage>('idle');
  const [progress, setProgress] = useState(0);
  const [forensicResult, setForensicResult] = useState<ForensicResult | null>(null);
  const [faceResult, setFaceResult] = useState<FaceDetectionResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    ela: true,
    face: true,
    noise: false,
    histogram: false,
    frequency: false,
    metadata: false,
  });

  // Run analysis when image changes
  useEffect(() => {
    if (!imageElement || !file || !isAnalyzing) return;

    const runAnalysis = async () => {
      setError(null);
      setForensicResult(null);
      setFaceResult(null);
      setProgress(0);

      try {
        // Load face-api models if not loaded
        if (!areModelsLoaded()) {
          setStage('loading-models');
          setProgress(10);
          await loadFaceApiModels();
        }

        // Run forensic analysis
        setStage('forensic');
        setProgress(30);
        const forensic = await runForensicAnalysis(imageElement, file);
        setForensicResult(forensic);
        setProgress(60);

        // Run face detection
        setStage('face-detection');
        const face = await detectFaces(imageElement);
        setFaceResult(face);
        setProgress(100);

        setStage('complete');
        
        if (onComplete) {
          onComplete({ forensic, face });
        }
      } catch (err) {
        console.error('Forensic analysis error:', err);
        setError(err instanceof Error ? err.message : 'Analysis failed');
        setStage('idle');
      }
    };

    runAnalysis();
  }, [imageElement, file, isAnalyzing]);

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const getScoreColor = (score: number) => {
    if (score < 30) return 'text-success';
    if (score < 60) return 'text-warning';
    return 'text-destructive';
  };

  const getScoreBg = (score: number) => {
    if (score < 30) return 'bg-success/10 border-success/30';
    if (score < 60) return 'bg-warning/10 border-warning/30';
    return 'bg-destructive/10 border-destructive/30';
  };

  const getScoreIcon = (score: number) => {
    if (score < 30) return CheckCircle2;
    if (score < 60) return AlertTriangle;
    return XCircle;
  };

  if (!imageElement || !file) {
    return null;
  }

  return (
    <div className="space-y-4">
      {/* Loading State */}
      <AnimatePresence>
        {stage !== 'idle' && stage !== 'complete' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="glass rounded-xl p-4"
          >
            <div className="flex items-center gap-3 mb-3">
              <Loader2 className="w-5 h-5 text-primary animate-spin" />
              <div className="flex-1">
                <p className="text-sm font-medium">
                  {stage === 'loading-models' && 'Loading AI Models...'}
                  {stage === 'forensic' && 'Running Forensic Analysis...'}
                  {stage === 'face-detection' && 'Detecting Faces...'}
                </p>
                <p className="text-xs text-muted-foreground">
                  {stage === 'loading-models' && 'Downloading face detection models'}
                  {stage === 'forensic' && 'ELA, noise, histogram, frequency analysis'}
                  {stage === 'face-detection' && 'Landmark detection and symmetry analysis'}
                </p>
              </div>
              <span className="text-sm font-mono text-primary">{progress}%</span>
            </div>
            <Progress value={progress} className="h-1.5" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error State */}
      {error && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="glass rounded-xl p-4 border border-destructive/30 bg-destructive/10"
        >
          <div className="flex items-center gap-2 text-destructive">
            <XCircle className="w-5 h-5" />
            <span className="font-medium">Analysis Error</span>
          </div>
          <p className="text-sm text-muted-foreground mt-1">{error}</p>
        </motion.div>
      )}

      {/* Results */}
      <AnimatePresence>
        {stage === 'complete' && forensicResult && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            {/* Overall Score */}
            <div className={`rounded-xl p-4 border ${getScoreBg(forensicResult.overallScore)}`}>
              <div className="flex items-center gap-4">
                {(() => {
                  const ScoreIcon = getScoreIcon(forensicResult.overallScore);
                  return <ScoreIcon className={`w-10 h-10 ${getScoreColor(forensicResult.overallScore)}`} />;
                })()}
                <div className="flex-1">
                  <p className="text-lg font-bold">Forensic Analysis Score</p>
                  <p className="text-sm text-muted-foreground">
                    Combined ELA, noise, histogram, and frequency analysis
                  </p>
                </div>
                <div className="text-right">
                  <p className={`text-3xl font-bold font-mono ${getScoreColor(forensicResult.overallScore)}`}>
                    {forensicResult.overallScore}
                  </p>
                  <p className="text-xs text-muted-foreground">suspicion score</p>
                </div>
              </div>
            </div>

            {/* ELA Section */}
            <Collapsible open={expandedSections.ela}>
              <div className="glass rounded-xl overflow-hidden">
                <CollapsibleTrigger asChild>
                  <Button
                    variant="ghost"
                    className="w-full justify-between p-4 h-auto rounded-none"
                    onClick={() => toggleSection('ela')}
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <Fingerprint className="w-5 h-5 text-primary" />
                      </div>
                      <div className="text-left">
                        <p className="font-medium">Error Level Analysis (ELA)</p>
                        <p className="text-xs text-muted-foreground">
                          Reveals hidden edits through compression analysis
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant={forensicResult.ela.score < 30 ? "default" : forensicResult.ela.score < 60 ? "secondary" : "destructive"}>
                        Score: {forensicResult.ela.score}
                      </Badge>
                      {expandedSections.ela ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </div>
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <div className="p-4 pt-0 space-y-4">
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div className="p-3 rounded-lg bg-muted/30">
                        <p className="text-2xl font-bold font-mono">{forensicResult.ela.maxDifference.toFixed(1)}</p>
                        <p className="text-xs text-muted-foreground">Max Difference</p>
                      </div>
                      <div className="p-3 rounded-lg bg-muted/30">
                        <p className="text-2xl font-bold font-mono">{forensicResult.ela.averageDifference.toFixed(2)}</p>
                        <p className="text-xs text-muted-foreground">Avg Difference</p>
                      </div>
                      <div className="p-3 rounded-lg bg-muted/30">
                        <p className="text-2xl font-bold font-mono">{forensicResult.ela.suspiciousAreas.toLocaleString()}</p>
                        <p className="text-xs text-muted-foreground">Suspicious Pixels</p>
                      </div>
                    </div>
                    {forensicResult.ela.imageDataUrl && (
                      <div className="space-y-2">
                        <p className="text-sm font-medium flex items-center gap-2">
                          <Eye className="w-4 h-4" />
                          ELA Visualization
                        </p>
                        <div className="rounded-lg overflow-hidden border border-border">
                          <img 
                            src={forensicResult.ela.imageDataUrl} 
                            alt="ELA Analysis" 
                            className="w-full h-auto"
                          />
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Bright areas indicate regions with different compression levels (potential edits)
                        </p>
                      </div>
                    )}
                  </div>
                </CollapsibleContent>
              </div>
            </Collapsible>

            {/* Face Detection Section */}
            {faceResult && (
              <Collapsible open={expandedSections.face}>
                <div className="glass rounded-xl overflow-hidden">
                  <CollapsibleTrigger asChild>
                    <Button
                      variant="ghost"
                      className="w-full justify-between p-4 h-auto rounded-none"
                      onClick={() => toggleSection('face')}
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-primary/10">
                          <ScanFace className="w-5 h-5 text-primary" />
                        </div>
                        <div className="text-left">
                          <p className="font-medium">Face Detection & Analysis</p>
                          <p className="text-xs text-muted-foreground">
                            {faceResult.facesDetected} face{faceResult.facesDetected !== 1 ? 's' : ''} detected • Symmetry analysis
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge variant={faceResult.overallScore < 30 ? "default" : faceResult.overallScore < 60 ? "secondary" : "destructive"}>
                          Score: {faceResult.overallScore}
                        </Badge>
                        {expandedSections.face ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </div>
                    </Button>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <div className="p-4 pt-0 space-y-4">
                      {faceResult.landmarkOverlayUrl && (
                        <div className="space-y-2">
                          <p className="text-sm font-medium flex items-center gap-2">
                            <Eye className="w-4 h-4" />
                            Facial Landmarks Overlay
                          </p>
                          <div className="rounded-lg overflow-hidden border border-border">
                            <img 
                              src={faceResult.landmarkOverlayUrl} 
                              alt="Face Landmarks" 
                              className="w-full h-auto"
                            />
                          </div>
                        </div>
                      )}
                      
                      {faceResult.faces.length > 0 && (
                        <div className="space-y-3">
                          {faceResult.faces.map((face) => (
                            <div key={face.id} className="p-3 rounded-lg bg-muted/30 space-y-2">
                              <div className="flex items-center justify-between">
                                <span className="font-medium">Face #{face.id}</span>
                                <Badge variant={face.anomalies.length === 0 ? "default" : "destructive"}>
                                  {face.anomalies.length === 0 ? 'No anomalies' : `${face.anomalies.length} anomalies`}
                                </Badge>
                              </div>
                              <div className="grid grid-cols-3 gap-2 text-sm">
                                <div>
                                  <p className="text-muted-foreground text-xs">Symmetry</p>
                                  <p className="font-mono">{(face.symmetry * 100).toFixed(1)}%</p>
                                </div>
                                <div>
                                  <p className="text-muted-foreground text-xs">Sharpness</p>
                                  <p className="font-mono">{face.blurScore.toFixed(0)}%</p>
                                </div>
                                <div>
                                  <p className="text-muted-foreground text-xs">Landmarks</p>
                                  <p className={`font-mono ${face.landmarks.quality === 'good' ? 'text-success' : face.landmarks.quality === 'poor' ? 'text-warning' : 'text-destructive'}`}>
                                    {face.landmarks.quality}
                                  </p>
                                </div>
                              </div>
                              {face.anomalies.length > 0 && (
                                <div className="flex flex-wrap gap-1">
                                  {face.anomalies.map((anomaly, i) => (
                                    <Badge key={i} variant="outline" className="text-xs">
                                      {anomaly}
                                    </Badge>
                                  ))}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}

                      {faceResult.anomalies.length > 0 && (
                        <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/30">
                          <p className="font-medium text-destructive flex items-center gap-2">
                            <AlertTriangle className="w-4 h-4" />
                            Anomalies Detected
                          </p>
                          <ul className="mt-2 space-y-1">
                            {faceResult.anomalies.map((anomaly, i) => (
                              <li key={i} className="text-sm text-muted-foreground">• {anomaly}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </CollapsibleContent>
                </div>
              </Collapsible>
            )}

            {/* Noise Analysis Section */}
            <Collapsible open={expandedSections.noise}>
              <div className="glass rounded-xl overflow-hidden">
                <CollapsibleTrigger asChild>
                  <Button
                    variant="ghost"
                    className="w-full justify-between p-4 h-auto rounded-none"
                    onClick={() => toggleSection('noise')}
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <Scan className="w-5 h-5 text-primary" />
                      </div>
                      <div className="text-left">
                        <p className="font-medium">Noise Analysis</p>
                        <p className="text-xs text-muted-foreground">
                          Detects inconsistent noise patterns
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant={forensicResult.noise.score < 30 ? "default" : forensicResult.noise.score < 60 ? "secondary" : "destructive"}>
                        Score: {forensicResult.noise.score}
                      </Badge>
                      {expandedSections.noise ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </div>
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <div className="p-4 pt-0 space-y-3">
                    <div className="grid grid-cols-2 gap-4 text-center">
                      <div className="p-3 rounded-lg bg-muted/30">
                        <p className="text-2xl font-bold font-mono">{forensicResult.noise.noiseLevel.toFixed(2)}</p>
                        <p className="text-xs text-muted-foreground">Noise Level</p>
                      </div>
                      <div className="p-3 rounded-lg bg-muted/30">
                        <p className="text-2xl font-bold font-mono">{(forensicResult.noise.uniformity * 100).toFixed(1)}%</p>
                        <p className="text-xs text-muted-foreground">Uniformity</p>
                      </div>
                    </div>
                    {forensicResult.noise.anomalies.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {forensicResult.noise.anomalies.map((anomaly, i) => (
                          <Badge key={i} variant="outline" className="text-xs">
                            {anomaly}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </CollapsibleContent>
              </div>
            </Collapsible>

            {/* Histogram Analysis Section */}
            <Collapsible open={expandedSections.histogram}>
              <div className="glass rounded-xl overflow-hidden">
                <CollapsibleTrigger asChild>
                  <Button
                    variant="ghost"
                    className="w-full justify-between p-4 h-auto rounded-none"
                    onClick={() => toggleSection('histogram')}
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <Palette className="w-5 h-5 text-primary" />
                      </div>
                      <div className="text-left">
                        <p className="font-medium">Color Histogram</p>
                        <p className="text-xs text-muted-foreground">
                          Analyzes color distribution patterns
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant={forensicResult.histogram.score < 30 ? "default" : forensicResult.histogram.score < 60 ? "secondary" : "destructive"}>
                        Score: {forensicResult.histogram.score}
                      </Badge>
                      {expandedSections.histogram ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </div>
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <div className="p-4 pt-0 space-y-3">
                    {forensicResult.histogram.anomalies.length > 0 ? (
                      <div className="flex flex-wrap gap-1">
                        {forensicResult.histogram.anomalies.map((anomaly, i) => (
                          <Badge key={i} variant="outline" className="text-xs">
                            {anomaly}
                          </Badge>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">No histogram anomalies detected</p>
                    )}
                  </div>
                </CollapsibleContent>
              </div>
            </Collapsible>

            {/* Frequency Analysis Section */}
            <Collapsible open={expandedSections.frequency}>
              <div className="glass rounded-xl overflow-hidden">
                <CollapsibleTrigger asChild>
                  <Button
                    variant="ghost"
                    className="w-full justify-between p-4 h-auto rounded-none"
                    onClick={() => toggleSection('frequency')}
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <Waves className="w-5 h-5 text-primary" />
                      </div>
                      <div className="text-left">
                        <p className="font-medium">Frequency Analysis</p>
                        <p className="text-xs text-muted-foreground">
                          Detects compression artifacts
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant={forensicResult.frequency.score < 30 ? "default" : forensicResult.frequency.score < 60 ? "secondary" : "destructive"}>
                        Score: {forensicResult.frequency.score}
                      </Badge>
                      {expandedSections.frequency ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </div>
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <div className="p-4 pt-0 space-y-3">
                    <div className="grid grid-cols-2 gap-4 text-center">
                      <div className="p-3 rounded-lg bg-muted/30">
                        <p className="text-2xl font-bold font-mono">{forensicResult.frequency.blockiness.toFixed(2)}</p>
                        <p className="text-xs text-muted-foreground">Blockiness</p>
                      </div>
                      <div className="p-3 rounded-lg bg-muted/30">
                        <p className="text-2xl font-bold font-mono">{forensicResult.frequency.compressionArtifacts.toFixed(2)}</p>
                        <p className="text-xs text-muted-foreground">Compression Artifacts</p>
                      </div>
                    </div>
                    {forensicResult.frequency.anomalies.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {forensicResult.frequency.anomalies.map((anomaly, i) => (
                          <Badge key={i} variant="outline" className="text-xs">
                            {anomaly}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </CollapsibleContent>
              </div>
            </Collapsible>

            {/* Metadata Section */}
            <Collapsible open={expandedSections.metadata}>
              <div className="glass rounded-xl overflow-hidden">
                <CollapsibleTrigger asChild>
                  <Button
                    variant="ghost"
                    className="w-full justify-between p-4 h-auto rounded-none"
                    onClick={() => toggleSection('metadata')}
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <FileWarning className="w-5 h-5 text-primary" />
                      </div>
                      <div className="text-left">
                        <p className="font-medium">Metadata Analysis</p>
                        <p className="text-xs text-muted-foreground">
                          EXIF data and file properties
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant={forensicResult.metadata.suspiciousFlags.length === 0 ? "default" : "destructive"}>
                        {forensicResult.metadata.hasExif ? 'EXIF Found' : 'No EXIF'}
                      </Badge>
                      {expandedSections.metadata ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </div>
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <div className="p-4 pt-0 space-y-3">
                    <div className="text-sm space-y-2">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Has EXIF Data</span>
                        <span className={forensicResult.metadata.hasExif ? 'text-success' : 'text-warning'}>
                          {forensicResult.metadata.hasExif ? 'Yes' : 'No'}
                        </span>
                      </div>
                      {forensicResult.metadata.lastModified && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Last Modified</span>
                          <span>{new Date(forensicResult.metadata.lastModified).toLocaleDateString()}</span>
                        </div>
                      )}
                    </div>
                    {forensicResult.metadata.suspiciousFlags.length > 0 && (
                      <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/30">
                        <p className="font-medium text-destructive flex items-center gap-2 text-sm">
                          <AlertTriangle className="w-4 h-4" />
                          Suspicious Flags
                        </p>
                        <ul className="mt-2 space-y-1">
                          {forensicResult.metadata.suspiciousFlags.map((flag, i) => (
                            <li key={i} className="text-xs text-muted-foreground">• {flag}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </CollapsibleContent>
              </div>
            </Collapsible>

            {/* Suspicious Regions */}
            {forensicResult.suspiciousRegions.length > 0 && (
              <div className="glass rounded-xl p-4">
                <div className="flex items-center gap-2 mb-3">
                  <AlertTriangle className="w-5 h-5 text-warning" />
                  <p className="font-medium">Suspicious Regions Detected</p>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {forensicResult.suspiciousRegions.slice(0, 4).map((region, i) => (
                    <div key={i} className="p-2 rounded-lg bg-muted/30 text-xs">
                      <div className="flex justify-between mb-1">
                        <span>Region {i + 1}</span>
                        <Badge variant="outline" className="text-[10px]">
                          {(region.intensity * 100).toFixed(0)}%
                        </Badge>
                      </div>
                      <p className="text-muted-foreground">{region.reason}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Info Box */}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/30 text-muted-foreground text-sm cursor-help">
                    <Info className="w-4 h-4 flex-shrink-0" />
                    <p>
                      Client-side forensic analysis using ELA, face-api.js, and TensorFlow.js. 
                      Higher scores indicate more suspicious patterns.
                    </p>
                  </div>
                </TooltipTrigger>
                <TooltipContent className="max-w-sm">
                  <p>This analysis runs entirely in your browser using open-source tools:</p>
                  <ul className="mt-1 text-xs">
                    <li>• Error Level Analysis (ELA) for edit detection</li>
                    <li>• face-api.js for face detection & landmarks</li>
                    <li>• TensorFlow.js for ML-powered analysis</li>
                  </ul>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ForensicAnalysisPanel;
