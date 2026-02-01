import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Mic, MicOff, Upload, Loader2, CheckCircle, AlertTriangle, Volume2, AudioWaveform } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface VoiceAnalysisResult {
  isAuthentic: boolean;
  confidence: number;
  findings: string[];
  spectralAnalysis?: {
    naturalness: number;
    consistency: number;
    artifacts: string[];
  };
}

const VoiceDetector = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<VoiceAnalysisResult | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        setAudioBlob(blob);
        setAudioUrl(URL.createObjectURL(blob));
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      toast.info("Recording started...");
    } catch (err) {
      console.error("Microphone error:", err);
      toast.error("Could not access microphone");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      toast.success("Recording stopped");
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAudioBlob(file);
      setAudioUrl(URL.createObjectURL(file));
      setResult(null);
    }
  };

  const analyzeVoice = async () => {
    if (!audioBlob) return;

    setIsAnalyzing(true);
    setResult(null);

    try {
      const base64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(audioBlob);
      });

      const { data, error } = await supabase.functions.invoke("analyze-audio", {
        body: {
          audio: base64,
          audioType: audioBlob.type || "audio/webm",
        },
      });

      if (error) throw error;

      setResult({
        isAuthentic: data.status === "authentic",
        confidence: data.confidence,
        findings: data.findings || [],
        spectralAnalysis: data.spectralAnalysis,
      });

      toast.success("Voice analysis complete!");
    } catch (err) {
      console.error("Analysis error:", err);
      toast.error("Failed to analyze voice");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const clearRecording = () => {
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
    }
    setAudioBlob(null);
    setAudioUrl(null);
    setResult(null);
  };

  return (
    <Card className="glass border-border/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Volume2 className="w-5 h-5 text-primary" />
          Voice Clone Detection
        </CardTitle>
        <CardDescription>
          Detect AI-cloned voices and synthetic speech patterns
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Recording Controls */}
        <div className="flex flex-col items-center gap-4">
          <motion.button
            onClick={isRecording ? stopRecording : startRecording}
            className={`w-24 h-24 rounded-full flex items-center justify-center transition-all ${
              isRecording
                ? "bg-destructive shadow-lg shadow-destructive/50"
                : "bg-primary shadow-lg shadow-primary/50"
            }`}
            whileTap={{ scale: 0.95 }}
            animate={isRecording ? { scale: [1, 1.1, 1] } : {}}
            transition={{ repeat: isRecording ? Infinity : 0, duration: 1 }}
          >
            {isRecording ? (
              <MicOff className="w-10 h-10 text-primary-foreground" />
            ) : (
              <Mic className="w-10 h-10 text-primary-foreground" />
            )}
          </motion.button>
          <p className="text-sm text-muted-foreground">
            {isRecording ? "Click to stop recording" : "Click to start recording"}
          </p>
        </div>

        {/* Waveform Visualization */}
        {isRecording && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center justify-center gap-1 h-16"
          >
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                className="w-1 bg-primary rounded-full"
                animate={{
                  height: [10, Math.random() * 40 + 10, 10],
                }}
                transition={{
                  repeat: Infinity,
                  duration: 0.5 + Math.random() * 0.5,
                  delay: i * 0.05,
                }}
              />
            ))}
          </motion.div>
        )}

        {/* File Upload Alternative */}
        <div className="text-center">
          <span className="text-sm text-muted-foreground">or</span>
          <input
            type="file"
            accept="audio/*"
            onChange={handleFileUpload}
            className="hidden"
            id="voice-file-input"
          />
          <Button asChild variant="outline" className="ml-2" size="sm">
            <label htmlFor="voice-file-input" className="cursor-pointer gap-2">
              <Upload className="w-4 h-4" />
              Upload Audio
            </label>
          </Button>
        </div>

        {/* Audio Preview */}
        {audioUrl && (
          <div className="space-y-4">
            <audio src={audioUrl} controls className="w-full" />
            <div className="flex gap-2">
              <Button
                onClick={analyzeVoice}
                disabled={isAnalyzing}
                className="flex-1 gap-2"
              >
                {isAnalyzing ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <AudioWaveform className="w-4 h-4" />
                )}
                {isAnalyzing ? "Analyzing..." : "Analyze Voice"}
              </Button>
              <Button variant="outline" onClick={clearRecording}>
                Clear
              </Button>
            </div>
          </div>
        )}

        {/* Results */}
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4 p-4 rounded-lg bg-secondary/50"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {result.isAuthentic ? (
                  <CheckCircle className="w-6 h-6 text-green-500" />
                ) : (
                  <AlertTriangle className="w-6 h-6 text-destructive" />
                )}
                <span className="font-semibold">
                  {result.isAuthentic ? "Authentic Voice" : "Potential Voice Clone"}
                </span>
              </div>
              <Badge variant={result.isAuthentic ? "default" : "destructive"}>
                {result.confidence}% confidence
              </Badge>
            </div>

            {result.spectralAnalysis && (
              <div className="space-y-2">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Naturalness</span>
                    <span>{result.spectralAnalysis.naturalness}%</span>
                  </div>
                  <Progress value={result.spectralAnalysis.naturalness} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Consistency</span>
                    <span>{result.spectralAnalysis.consistency}%</span>
                  </div>
                  <Progress value={result.spectralAnalysis.consistency} className="h-2" />
                </div>
              </div>
            )}

            {result.findings.length > 0 && (
              <div className="space-y-1">
                <p className="text-sm font-medium">Findings:</p>
                <ul className="text-sm text-muted-foreground space-y-1">
                  {result.findings.map((finding, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-primary">•</span>
                      {finding}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
};

export default VoiceDetector;
