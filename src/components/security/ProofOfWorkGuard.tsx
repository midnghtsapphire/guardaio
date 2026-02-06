/**
 * ProofOfWorkGuard - ALTCHA-style PoW Challenge Component
 * 
 * Forces users to solve a computational challenge before accessing
 * resource-intensive analysis endpoints. This makes bot attacks
 * economically expensive while being invisible to real users.
 */

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, Cpu, CheckCircle, Loader2, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
import { ProofOfWorkManager, type ProofOfWorkChallenge } from "@/lib/bot-protection";

interface ProofOfWorkGuardProps {
  children: React.ReactNode;
  enabled?: boolean;
  difficulty?: number;
  onVerified?: () => void;
  sessionKey?: string;
}

const ProofOfWorkGuard = ({
  children,
  enabled = true,
  difficulty = 18,
  onVerified,
  sessionKey = "default",
}: ProofOfWorkGuardProps) => {
  const [isVerified, setIsVerified] = useState(false);
  const [isSolving, setIsSolving] = useState(false);
  const [progress, setProgress] = useState(0);
  const [challenge, setChallenge] = useState<ProofOfWorkChallenge | null>(null);
  const [solveTime, setSolveTime] = useState<number | null>(null);

  // Check if already verified this session
  useEffect(() => {
    const storedVerification = sessionStorage.getItem(`pow_verified_${sessionKey}`);
    if (storedVerification) {
      const expiry = parseInt(storedVerification, 10);
      if (Date.now() < expiry) {
        setIsVerified(true);
      }
    }
  }, [sessionKey]);

  const generateChallenge = useCallback(() => {
    const pow = new ProofOfWorkManager();
    const newChallenge = pow.generateChallenge(sessionKey, difficulty);
    setChallenge(newChallenge);
  }, [sessionKey, difficulty]);

  const solveChallenge = useCallback(async () => {
    if (!challenge) return;

    setIsSolving(true);
    setProgress(0);
    const startTime = Date.now();

    const pow = new ProofOfWorkManager();
    
    // Solve with progress updates
    let nonce = 0;
    const maxIterations = Math.pow(2, difficulty + 2);
    
    const solve = async (): Promise<number> => {
      const batchSize = 5000;
      
      while (nonce < maxIterations) {
        for (let i = 0; i < batchSize; i++) {
          const data = `${challenge.salt}:${nonce}`;
          const encoder = new TextEncoder();
          const hashBuffer = await crypto.subtle.digest('SHA-256', encoder.encode(data));
          const hashArray = Array.from(new Uint8Array(hashBuffer));
          const hash = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
          
          // Count leading zeros
          let zeros = 0;
          for (const char of hash) {
            if (char === '0') {
              zeros += 4;
            } else {
              const nibble = parseInt(char, 16);
              zeros += Math.clz32(nibble) - 28;
              break;
            }
          }
          
          if (zeros >= challenge.difficulty) {
            return nonce;
          }
          nonce++;
        }
        
        // Update progress
        const estimatedProgress = Math.min((nonce / maxIterations) * 100 * 4, 95);
        setProgress(estimatedProgress);
        
        // Yield to event loop
        await new Promise(resolve => setTimeout(resolve, 0));
      }
      
      throw new Error("Could not solve challenge");
    };

    try {
      await solve();
      const elapsed = Date.now() - startTime;
      setSolveTime(elapsed);
      setProgress(100);
      
      // Store verification for 30 minutes
      const expiry = Date.now() + 30 * 60 * 1000;
      sessionStorage.setItem(`pow_verified_${sessionKey}`, expiry.toString());
      
      setTimeout(() => {
        setIsVerified(true);
        onVerified?.();
      }, 500);
    } catch (error) {
      console.error("PoW solve error:", error);
      generateChallenge(); // Generate new challenge
    } finally {
      setIsSolving(false);
    }
  }, [challenge, difficulty, sessionKey, onVerified, generateChallenge]);

  // Auto-generate challenge when component mounts
  useEffect(() => {
    if (enabled && !isVerified && !challenge) {
      generateChallenge();
    }
  }, [enabled, isVerified, challenge, generateChallenge]);

  // If disabled or verified, render children directly
  if (!enabled || isVerified) {
    return <>{children}</>;
  }

  return (
    <div className="relative">
      {/* Blurred content behind */}
      <div className="filter blur-sm pointer-events-none select-none opacity-50">
        {children}
      </div>

      {/* PoW Challenge overlay */}
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm z-10"
        >
          <Card className="w-full max-w-md mx-4 glass border-border/50">
            <CardContent className="pt-6 space-y-6">
              <div className="text-center space-y-2">
                <div className="w-16 h-16 mx-auto rounded-full bg-primary/20 flex items-center justify-center">
                  {isSolving ? (
                    <Cpu className="w-8 h-8 text-primary animate-pulse" />
                  ) : solveTime ? (
                    <CheckCircle className="w-8 h-8 text-green-500" />
                  ) : (
                    <Shield className="w-8 h-8 text-primary" />
                  )}
                </div>
                
                <h3 className="text-xl font-semibold">
                  {solveTime ? "Verification Complete!" : "Security Verification"}
                </h3>
                
                <p className="text-sm text-muted-foreground">
                  {isSolving
                    ? "Solving cryptographic challenge..."
                    : solveTime
                    ? `Completed in ${(solveTime / 1000).toFixed(1)}s`
                    : "Quick verification to protect our analysis resources"}
                </p>
              </div>

              {isSolving && (
                <div className="space-y-2">
                  <Progress value={progress} className="h-2" />
                  <p className="text-xs text-center text-muted-foreground">
                    {progress.toFixed(0)}% complete
                  </p>
                </div>
              )}

              {!isSolving && !solveTime && challenge && (
                <div className="space-y-4">
                  <div className="p-3 rounded-lg bg-secondary/50 space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">Algorithm</span>
                      <span className="font-mono">SHA-256</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">Difficulty</span>
                      <span className="font-mono">{challenge.difficulty} bits</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">Privacy</span>
                      <span className="text-emerald-500 dark:text-emerald-400 flex items-center gap-1">
                        <Lock className="w-3 h-3" /> No tracking
                      </span>
                    </div>
                  </div>

                  <Button
                    onClick={solveChallenge}
                    className="w-full gap-2"
                    size="lg"
                  >
                    <Cpu className="w-4 h-4" />
                    Verify & Continue
                  </Button>

                  <p className="text-xs text-center text-muted-foreground">
                    This one-time check takes ~2-5 seconds and protects against bot abuse
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default ProofOfWorkGuard;
