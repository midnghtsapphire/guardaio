import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Send, Loader2, User, CheckCircle2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { HeatmapRegion } from "@/components/HeatmapOverlay";

interface AnalysisResult {
  status: "safe" | "warning" | "danger";
  confidence: number;
  findings: string[];
  heatmapRegions?: HeatmapRegion[];
}

interface EmailShareDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  result: AnalysisResult;
  fileName: string;
  fileType: string;
  fileSize: number;
  sensitivity: number;
  shareUrl?: string;
}

const EmailShareDialog = ({
  open,
  onOpenChange,
  result,
  fileName,
  fileType,
  fileSize,
  sensitivity,
  shareUrl,
}: EmailShareDialogProps) => {
  const [recipientEmail, setRecipientEmail] = useState("");
  const [recipientName, setRecipientName] = useState("");
  const [senderName, setSenderName] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const { toast } = useToast();

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSend = async () => {
    if (!validateEmail(recipientEmail)) {
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address",
        variant: "destructive",
      });
      return;
    }

    setSending(true);
    try {
      const { data, error } = await supabase.functions.invoke("send-analysis-report", {
        body: {
          recipientEmail,
          recipientName: recipientName || undefined,
          senderName: senderName || undefined,
          fileName,
          fileType,
          fileSize,
          status: result.status,
          confidence: result.confidence,
          findings: result.findings,
          sensitivity,
          shareUrl,
        },
      });

      if (error) throw error;
      if (!data.success) throw new Error(data.error || "Failed to send email");

      setSent(true);
      toast({
        title: "Report sent!",
        description: `Analysis report has been sent to ${recipientEmail}`,
      });

      // Reset and close after a delay
      setTimeout(() => {
        setSent(false);
        setRecipientEmail("");
        setRecipientName("");
        setSenderName("");
        onOpenChange(false);
      }, 2000);
    } catch (error) {
      console.error("Error sending email:", error);
      toast({
        title: "Failed to send",
        description: error instanceof Error ? error.message : "Could not send the report",
        variant: "destructive",
      });
    } finally {
      setSending(false);
    }
  };

  const handleClose = () => {
    if (!sending) {
      setSent(false);
      setRecipientEmail("");
      setRecipientName("");
      setSenderName("");
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Mail className="w-5 h-5 text-primary" />
            Share Analysis Report
          </DialogTitle>
          <DialogDescription>
            Send this analysis report via email to share your findings.
          </DialogDescription>
        </DialogHeader>

        {sent ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center py-8"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", delay: 0.1 }}
              className="w-16 h-16 rounded-full bg-success/20 flex items-center justify-center mb-4"
            >
              <CheckCircle2 className="w-8 h-8 text-success" />
            </motion.div>
            <p className="text-lg font-medium">Report Sent!</p>
            <p className="text-sm text-muted-foreground">
              Check {recipientEmail} for the report
            </p>
          </motion.div>
        ) : (
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="recipientEmail">Recipient Email *</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="recipientEmail"
                  type="email"
                  placeholder="recipient@example.com"
                  value={recipientEmail}
                  onChange={(e) => setRecipientEmail(e.target.value)}
                  className="pl-10"
                  disabled={sending}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="recipientName">Recipient Name (optional)</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="recipientName"
                  type="text"
                  placeholder="John Doe"
                  value={recipientName}
                  onChange={(e) => setRecipientName(e.target.value)}
                  className="pl-10"
                  disabled={sending}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="senderName">Your Name (optional)</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="senderName"
                  type="text"
                  placeholder="Your name"
                  value={senderName}
                  onChange={(e) => setSenderName(e.target.value)}
                  className="pl-10"
                  disabled={sending}
                />
              </div>
            </div>

            {/* Preview card */}
            <div className="glass rounded-lg p-4 space-y-2">
              <p className="text-xs text-muted-foreground">Report preview:</p>
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium truncate max-w-[200px]">{fileName}</span>
                <span className={`font-semibold ${
                  result.status === "safe" ? "text-success" :
                  result.status === "warning" ? "text-warning" : "text-destructive"
                }`}>
                  {result.confidence}% confidence
                </span>
              </div>
            </div>

            <Button
              onClick={handleSend}
              disabled={!recipientEmail || sending}
              className="w-full"
            >
              {sending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Send Report
                </>
              )}
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default EmailShareDialog;
