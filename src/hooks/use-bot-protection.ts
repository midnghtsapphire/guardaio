/**
 * useBotProtection Hook
 * 
 * Provides client-side bot protection integration for components.
 * Runs BotD detection and coordinates with rate limiting.
 */

import { useState, useEffect, useCallback, useRef } from "react";
import {
  botProtection,
  BotDetector,
  type BotDetectionResult,
} from "@/lib/bot-protection";

interface UseBotProtectionOptions {
  enabled?: boolean;
  autoDetect?: boolean;
  sessionKey?: string;
}

interface BotProtectionState {
  isInitialized: boolean;
  isDetecting: boolean;
  detectionResult: BotDetectionResult | null;
  isBlocked: boolean;
  requiresChallenge: boolean;
  remainingRequests: number;
  error: string | null;
}

export function useBotProtection(options: UseBotProtectionOptions = {}) {
  const { enabled = true, autoDetect = true, sessionKey = "default" } = options;

  const [state, setState] = useState<BotProtectionState>({
    isInitialized: false,
    isDetecting: false,
    detectionResult: null,
    isBlocked: false,
    requiresChallenge: false,
    remainingRequests: 60,
    error: null,
  });

  const initRef = useRef(false);

  // Initialize protection systems
  useEffect(() => {
    if (!enabled || initRef.current) return;
    initRef.current = true;

    const init = async () => {
      try {
        await botProtection.initialize();
        setState(prev => ({ ...prev, isInitialized: true }));
      } catch (error) {
        console.error("[BotProtection] Init error:", error);
        setState(prev => ({
          ...prev,
          error: "Failed to initialize bot protection",
        }));
      }
    };

    init();
  }, [enabled]);

  // Auto-detect bots on mount
  useEffect(() => {
    if (!enabled || !autoDetect || !state.isInitialized) return;

    // Check session storage for cached result
    const cached = sessionStorage.getItem(`bot_detection_${sessionKey}`);
    if (cached) {
      try {
        const result = JSON.parse(cached) as BotDetectionResult;
        setState(prev => ({
          ...prev,
          detectionResult: result,
          requiresChallenge: result.recommendation === "challenge",
          isBlocked: result.recommendation === "block",
        }));
        return;
      } catch {
        // Invalid cache, run detection
      }
    }

    runDetection();
  }, [enabled, autoDetect, state.isInitialized, sessionKey]);

  // Run bot detection
  const runDetection = useCallback(async (): Promise<BotDetectionResult | null> => {
    if (!enabled) return null;

    setState(prev => ({ ...prev, isDetecting: true, error: null }));

    try {
      const detector = new BotDetector();
      const result = await detector.detect();

      // Cache result for session
      sessionStorage.setItem(
        `bot_detection_${sessionKey}`,
        JSON.stringify(result)
      );

      setState(prev => ({
        ...prev,
        isDetecting: false,
        detectionResult: result,
        requiresChallenge: result.recommendation === "challenge",
        isBlocked: result.recommendation === "block",
      }));

      return result;
    } catch (error) {
      console.error("[BotProtection] Detection error:", error);
      setState(prev => ({
        ...prev,
        isDetecting: false,
        error: "Bot detection failed",
      }));
      return null;
    }
  }, [enabled, sessionKey]);

  // Check rate limit before action
  const checkRateLimit = useCallback(
    (identifier?: string): { allowed: boolean; remaining: number } => {
      if (!enabled) return { allowed: true, remaining: 60 };

      const id = identifier || sessionKey;
      const result = botProtection.rateLimiter.isAllowed(id);

      setState(prev => ({
        ...prev,
        remainingRequests: result.remaining,
        isBlocked: !result.allowed,
      }));

      return { allowed: result.allowed, remaining: result.remaining };
    },
    [enabled, sessionKey]
  );

  // Full validation pipeline
  const validateRequest = useCallback(
    async (
      path: string,
      body?: string
    ): Promise<{ allowed: boolean; reason: string }> => {
      if (!enabled) return { allowed: true, reason: "Protection disabled" };

      const userAgent = navigator.userAgent;
      // Use fingerprint as IP proxy (we don't have real IP client-side)
      const identifier =
        state.detectionResult?.fingerprint || sessionKey;

      const result = await botProtection.validateRequest(
        identifier,
        path,
        userAgent,
        body
      );

      setState(prev => ({
        ...prev,
        isBlocked: !result.allowed,
        requiresChallenge: result.action === "challenge",
      }));

      return { allowed: result.allowed, reason: result.reason };
    },
    [enabled, sessionKey, state.detectionResult?.fingerprint]
  );

  // Mark challenge as completed
  const completeChallenge = useCallback(() => {
    setState(prev => ({ ...prev, requiresChallenge: false }));
  }, []);

  // Get current stats
  const getStats = useCallback(() => {
    return botProtection.getStats();
  }, []);

  return {
    ...state,
    runDetection,
    checkRateLimit,
    validateRequest,
    completeChallenge,
    getStats,
  };
}
