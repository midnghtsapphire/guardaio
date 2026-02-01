import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, Upload, X, CheckCircle2, AlertTriangle, XCircle, Loader2, Shield, Sparkles, Zap, Volume2, Waves, StopCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/integrations/supabase/client";
import AudioForensicPanel from "@/components/AudioForensicPanel";
type VoiceAnalysis = {
  naturalness: "high" | "medium" | "low" | "uncertain";
  consistencyIssues: string[];
  emotionalAuthenticity: "authentic" | "synthetic" | "uncertain";
};

type AudioAnalysisResult = {
  status: "safe" | "warning" | "danger";
  confidence: number;
  findings: string[];
  voiceAnalysis?: VoiceAnalysis;
  technicalIndicators?: string[];
  recommendation?: string;
  fileName?: string;
  fileType?: string;
};

type AnalysisStage = {
  name: string;
  icon: typeof Shield;
  description: string;
};

const analysisStages: AnalysisStage[] = [
  { name: "Processing", icon: Waves, description: "Extracting audio features" },
  { name: "Voice Analysis", icon: Volume2, description: "Analyzing voice patterns" },
  { name: "AI Detection", icon: Sparkles, description: "Detecting synthetic speech" },
  { name: "Finalizing", icon: Zap, description: "Generating report" },
];

interface AudioAnalyzerProps {
  user: { id: string } | null;
  toast: (options: { title: string; description?: string; variant?: "destructive" }) => void;
}

const AudioAnalyzer = ({ user, toast }: AudioAnalyzerProps) => {
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentStage, setCurrentStage] = useState(0);
  const [result, setResult] = useState<AudioAnalysisResult | null>(null);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const getStatusConfig = (status: string) => {
    switch (status) {
      case "safe":
        return { icon: CheckCircle2, color: "text-success", bg: "bg-success/10", border: "border-success/30", label: "Authentic Voice", gradient: "from-success/20 to-success/5" };
      case "warning":
        return { icon: AlertTriangle, color: "text-warning", bg: "bg-warning/10", border: "border-warning/30", label: "Suspicious Audio", gradient: "from-warning/20 to-warning/5" };
      case "danger":
        return { icon: XCircle, color: "text-destructive", bg: "bg-destructive/10", border: "border-destructive/30", label: "AI-Generated Voice", gradient: "from-destructive/20 to-destructive/5" };
      default:
        return { icon: CheckCircle2, color: "text-success", bg: "bg-success/10", border: "border-success/30", label: "Authentic", gradient: "from-success/20 to-success/5" };
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("audio/")) {
      toast({
        title: "Invalid file type",
        description: "Please upload an audio file (MP3, WAV, etc.)",
        variant: "destructive",
      });
      return;
    }

    if (file.size > 25 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please upload an audio file under 25MB",
        variant: "destructive",
      });
      return;
    }

    setAudioFile(file);
    setRecordedBlob(null);
    setResult(null);
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          audioChunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        setRecordedBlob(blob);
        setAudioFile(null);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      toast({
        title: "Microphone access denied",
        description: "Please enable microphone access to record audio",
        variant: "destructive",
      });
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const fileToBase64 = (file: File | Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const base64 = reader.result as string;
        const base64Data = base64.split(",")[1];
        resolve(base64Data);
      };
      reader.onerror = (error) => reject(error);
    });
  };

  const analyzeAudio = async () => {
    const audioSource = audioFile || recordedBlob;
    if (!audioSource) return;

    setAnalyzing(true);
    setProgress(0);
    setCurrentStage(0);
    setResult(null);

    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) return prev;
        return prev + Math.random() * 8 + 2;
      });
    }, 400);

    const stageInterval = setInterval(() => {
      setCurrentStage((prev) => {
        if (prev >= analysisStages.length - 1) return prev;
        return prev + 1;
      });
    }, 2000);

    try {
      const audioBase64 = await fileToBase64(audioSource);
      const fileName = audioFile?.name || "recorded_audio.webm";
      const fileType = audioFile?.type || "audio/webm";

      const { data, error } = await supabase.functions.invoke("analyze-audio", {
        body: {
          audioBase64,
          fileName,
          fileType,
        },
      });

      clearInterval(progressInterval);
      clearInterval(stageInterval);

      if (error) throw error;
      if (data.error) throw new Error(data.error);

      setProgress(100);
      setCurrentStage(analysisStages.length - 1);
      setResult(data as AudioAnalysisResult);

      // Save to history if user is logged in
      if (user) {
        try {
          await supabase.from("analysis_history").insert({
            user_id: user.id,
            file_name: fileName,
            file_type: fileType,
            file_size: audioSource.size,
            status: data.status,
            confidence: data.confidence,
            findings: data.findings || [],
          });
        } catch (saveError) {
          console.error("Error saving to history:", saveError);
        }
      }

      toast({
        title: "Analysis complete",
        description: user ? "Result saved to your history" : undefined,
      });
    } catch (error) {
      clearInterval(progressInterval);
      clearInterval(stageInterval);
      console.error("Audio analysis error:", error);
      toast({
        title: "Analysis failed",
        description: error instanceof Error ? error.message : "Failed to analyze audio",
        variant: "destructive",
      });
    } finally {
      setAnalyzing(false);
    }
  };

  const clearAudio = () => {
    setAudioFile(null);
    setRecordedBlob(null);
    setResult(null);
    setProgress(0);
    setCurrentStage(0);
  };

  const hasAudio = audioFile || recordedBlob;

  return (
    <div className="space-y-4">
      {/* Input area */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass rounded-2xl p-6"
      >
        <div className="text-center mb-6">
          <motion.div 
            className="w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center glass"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring" }}
          >
            <Volume2 className="w-8 h-8 text-primary" />
          </motion.div>
          
          <h3 className="font-display text-lg font-semibold mb-2">
            Audio Deepfake Detection
          </h3>
          <p className="text-muted-foreground text-sm">
            Analyze voice recordings for AI-generated speech and voice cloning
          </p>
        </div>

        {/* Audio input options */}
        <div className="flex flex-col gap-4">
          {/* Record button */}
          <div className="flex justify-center">
            {isRecording ? (
              <Button
                onClick={stopRecording}
                variant="destructive"
                size="lg"
                className="gap-2"
              >
                <StopCircle className="w-5 h-5" />
                Stop Recording
                <motion.div
                  className="w-2 h-2 rounded-full bg-white"
                  animate={{ opacity: [1, 0.3, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                />
              </Button>
            ) : (
              <Button
                onClick={startRecording}
                variant="outline"
                size="lg"
                className="gap-2"
                disabled={analyzing}
              >
                <Mic className="w-5 h-5" />
                Record Audio
              </Button>
            )}
          </div>

          {/* Divider */}
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-border" />
            <span className="text-xs text-muted-foreground">or</span>
            <div className="flex-1 h-px bg-border" />
          </div>

          {/* File upload */}
          <div className="flex items-center justify-center">
            <label className="cursor-pointer">
              <input
                type="file"
                accept="audio/*"
                onChange={handleFileSelect}
                className="hidden"
                disabled={analyzing || isRecording}
              />
              <div className="flex items-center gap-2 px-4 py-2 rounded-lg border border-dashed border-border hover:border-primary/50 hover:bg-muted/30 transition-colors">
                <Upload className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  {audioFile ? audioFile.name : "Upload audio file"}
                </span>
              </div>
            </label>
          </div>

          {/* Recorded audio indicator */}
          <AnimatePresence>
            {recordedBlob && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="flex items-center justify-center gap-2 p-3 rounded-lg bg-primary/10 border border-primary/20"
              >
                <Waves className="w-4 h-4 text-primary" />
                <span className="text-sm text-primary">Recording ready for analysis</span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={clearAudio}
                >
                  <X className="w-3 h-3" />
                </Button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Analyze button */}
          <Button
            onClick={analyzeAudio}
            disabled={analyzing || !hasAudio || isRecording}
            className="w-full"
          >
            {analyzing ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 mr-2" />
                Detect AI Voice
              </>
            )}
          </Button>
        </div>
      </motion.div>

      {/* Analysis progress */}
      <AnimatePresence>
        {analyzing && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="glass rounded-xl p-6 space-y-6"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Analyzing audio...</span>
                <span className="font-mono text-primary">{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {analysisStages.map((stage, index) => {
                const StageIcon = stage.icon;
                const isActive = index === currentStage;
                const isComplete = index < currentStage;
                
                return (
                  <motion.div
                    key={stage.name}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`relative p-3 rounded-xl border transition-all duration-300 ${
                      isActive 
                        ? "bg-primary/10 border-primary/30" 
                        : isComplete 
                        ? "bg-success/10 border-success/30" 
                        : "bg-muted/30 border-border/50"
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      {isActive ? (
                        <Loader2 className="w-4 h-4 text-primary animate-spin" />
                      ) : isComplete ? (
                        <CheckCircle2 className="w-4 h-4 text-success" />
                      ) : (
                        <StageIcon className="w-4 h-4 text-muted-foreground" />
                      )}
                      <span className={`text-xs font-medium ${
                        isActive ? "text-primary" : isComplete ? "text-success" : "text-muted-foreground"
                      }`}>
                        {stage.name}
                      </span>
                    </div>
                    <p className="text-[10px] text-muted-foreground leading-tight">
                      {stage.description}
                    </p>
                  </motion.div>
                );
              })}
            </div>

            {/* Audio visualization */}
            <div className="flex items-center justify-center gap-3 py-4">
              <motion.div className="flex items-center gap-1">
                {[...Array(8)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="w-1 bg-primary/60 rounded-full"
                    animate={{
                      height: [8, 24, 8],
                      opacity: [0.4, 1, 0.4],
                    }}
                    transition={{
                      duration: 0.8,
                      repeat: Infinity,
                      delay: i * 0.1,
                    }}
                  />
                ))}
              </motion.div>
              <span className="text-sm text-muted-foreground">
                {analysisStages[currentStage]?.description || "Processing..."}
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Result */}
      <AnimatePresence>
        {result && !analyzing && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="space-y-4"
          >
            {/* Main result card */}
            {(() => {
              const config = getStatusConfig(result.status);
              const StatusIcon = config.icon;
              return (
                <motion.div 
                  className={`relative rounded-xl p-6 overflow-hidden bg-gradient-to-br ${config.gradient} border ${config.border}`}
                  initial={{ y: 20 }}
                  animate={{ y: 0 }}
                >
                  <div className="relative flex items-center gap-4">
                    <motion.div
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ type: "spring", delay: 0.2 }}
                    >
                      <StatusIcon className={`w-14 h-14 ${config.color}`} />
                    </motion.div>
                    <div className="flex-1">
                      <motion.p 
                        className={`font-display text-2xl font-bold ${config.color}`}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                      >
                        {config.label}
                      </motion.p>
                      <p className="text-muted-foreground">
                        Confidence: {result.confidence}%
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })()}

            {/* Voice Analysis */}
            {result.voiceAnalysis && (
              <div className="glass rounded-xl p-4">
                <h4 className="font-medium text-sm mb-3 flex items-center gap-2">
                  <Volume2 className="w-4 h-4 text-primary" />
                  Voice Analysis
                </h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Naturalness</span>
                    <span className={`font-medium capitalize ${
                      result.voiceAnalysis.naturalness === "high" ? "text-success" :
                      result.voiceAnalysis.naturalness === "low" ? "text-destructive" : "text-warning"
                    }`}>
                      {result.voiceAnalysis.naturalness}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Emotional Authenticity</span>
                    <span className={`font-medium capitalize ${
                      result.voiceAnalysis.emotionalAuthenticity === "authentic" ? "text-success" :
                      result.voiceAnalysis.emotionalAuthenticity === "synthetic" ? "text-destructive" : "text-warning"
                    }`}>
                      {result.voiceAnalysis.emotionalAuthenticity}
                    </span>
                  </div>
                  {result.voiceAnalysis.consistencyIssues?.length > 0 && (
                    <div className="mt-2 pt-2 border-t border-border">
                      <span className="text-xs text-muted-foreground">Issues found:</span>
                      <ul className="mt-1 space-y-1">
                        {result.voiceAnalysis.consistencyIssues.map((issue, i) => (
                          <li key={i} className="text-xs text-warning flex items-start gap-1">
                            <AlertTriangle className="w-3 h-3 mt-0.5 shrink-0" />
                            {issue}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Technical Indicators */}
            {result.technicalIndicators && result.technicalIndicators.length > 0 && (
              <div className="glass rounded-xl p-4">
                <h4 className="font-medium text-sm mb-3">Technical Indicators</h4>
                <ul className="space-y-1.5">
                  {result.technicalIndicators.map((indicator, i) => (
                    <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                      <Shield className="w-3.5 h-3.5 mt-0.5 shrink-0 text-primary" />
                      {indicator}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Findings */}
            {result.findings.length > 0 && (
              <div className="glass rounded-xl p-4">
                <h4 className="font-medium text-sm mb-3">Detailed Findings</h4>
                <ul className="space-y-1.5">
                  {result.findings.map((finding, i) => (
                    <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                      <Sparkles className="w-3.5 h-3.5 mt-0.5 shrink-0 text-primary" />
                      {finding}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Recommendation */}
            {result.recommendation && (
              <div className="glass rounded-xl p-4 border border-primary/20 bg-primary/5">
                <h4 className="font-medium text-sm mb-2">Recommendation</h4>
                <p className="text-sm text-muted-foreground">{result.recommendation}</p>
              </div>
            )}

            {/* Client-Side Forensic Analysis */}
            <AudioForensicPanel audioBlob={audioFile || recordedBlob} />

            {/* Clear button */}
            <Button variant="outline" onClick={clearAudio} className="w-full">
              Analyze Another Audio
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AudioAnalyzer;
