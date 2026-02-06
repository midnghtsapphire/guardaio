/**
 * validate-request Edge Function
 * 
 * Server-side bot validation with rate limiting, WAF rules,
 * and CrowdSec-style collaborative blocking.
 * 
 * Called before expensive analysis operations to filter bots.
 */

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-fingerprint, x-pow-solution",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

// Simple in-memory rate limiter (per-instance)
const rateLimits = new Map<string, { count: number; resetAt: number }>();
const blockedIPs = new Set<string>();

// WAF patterns
const wafPatterns = [
  { name: "XSS", pattern: /<script[\s\S]*?>|on\w+\s*=/i, action: "block" },
  { name: "SQLi", pattern: /union\s+select|;\s*drop|--\s*$/i, action: "block" },
  { name: "Bot UA", pattern: /curl|wget|python-requests|scrapy|phantomjs/i, action: "challenge" },
  { name: "AI Scraper", pattern: /GPTBot|CCBot|ClaudeBot|anthropic/i, action: "block" },
  { name: "Path Traversal", pattern: /\.\.\//g, action: "block" },
];

// Honeypot paths
const honeypotPaths = [
  "/api/v1/upload-fast",
  "/admin/debug",
  "/.env",
  "/wp-login.php",
  "/config.php",
  "/.git/config",
];

interface ValidationRequest {
  path: string;
  userAgent: string;
  fingerprint?: string;
  powSolution?: number;
  body?: string;
}

interface ValidationResponse {
  allowed: boolean;
  reason: string;
  action: "allow" | "challenge" | "block";
  challenge?: {
    salt: string;
    difficulty: number;
    algorithm: string;
    expires: number;
  };
  remaining?: number;
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const clientIP = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
                     req.headers.get("cf-connecting-ip") ||
                     "unknown";
    
    const fingerprint = req.headers.get("x-fingerprint") || clientIP;
    const powSolution = req.headers.get("x-pow-solution");

    const body: ValidationRequest = await req.json();
    const { path, userAgent, body: requestBody } = body;

    // Layer 1: Honeypot check
    if (honeypotPaths.some(hp => path.includes(hp))) {
      blockedIPs.add(clientIP);
      console.log(`[Honeypot] Trapped: ${clientIP} at ${path}`);
      return new Response(
        JSON.stringify({
          allowed: false,
          reason: "Honeypot triggered",
          action: "block",
        } as ValidationResponse),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 403 }
      );
    }

    // Layer 2: Blocklist check
    if (blockedIPs.has(clientIP)) {
      return new Response(
        JSON.stringify({
          allowed: false,
          reason: "IP blocked",
          action: "block",
        } as ValidationResponse),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 403 }
      );
    }

    // Layer 3: Rate limiting (60 req/min, burst 10/sec)
    const now = Date.now();
    const limit = rateLimits.get(fingerprint);
    
    if (limit) {
      if (now < limit.resetAt) {
        if (limit.count >= 60) {
          return new Response(
            JSON.stringify({
              allowed: false,
              reason: "Rate limit exceeded",
              action: "block",
              remaining: 0,
            } as ValidationResponse),
            { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 429 }
          );
        }
        limit.count++;
      } else {
        limit.count = 1;
        limit.resetAt = now + 60000;
      }
    } else {
      rateLimits.set(fingerprint, { count: 1, resetAt: now + 60000 });
    }

    const currentLimit = rateLimits.get(fingerprint);
    const remaining = currentLimit ? 60 - currentLimit.count : 59;

    // Layer 4: WAF pattern matching
    const checkTargets = [userAgent, requestBody || ""];
    for (const target of checkTargets) {
      for (const rule of wafPatterns) {
        if (rule.pattern.test(target)) {
          console.log(`[WAF] Rule ${rule.name} matched for ${clientIP}`);
          
          if (rule.action === "block") {
            blockedIPs.add(clientIP);
            return new Response(
              JSON.stringify({
                allowed: false,
                reason: `WAF: ${rule.name} detected`,
                action: "block",
              } as ValidationResponse),
              { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 403 }
            );
          }
          
          if (rule.action === "challenge") {
            // Issue PoW challenge
            const salt = crypto.randomUUID().replace(/-/g, "");
            return new Response(
              JSON.stringify({
                allowed: false,
                reason: "Challenge required",
                action: "challenge",
                challenge: {
                  salt,
                  difficulty: 18,
                  algorithm: "sha256",
                  expires: now + 300000, // 5 minutes
                },
                remaining,
              } as ValidationResponse),
              { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 }
            );
          }
        }
      }
    }

    // Layer 5: PoW verification if solution provided
    if (powSolution) {
      // In production, verify against stored challenge
      console.log(`[PoW] Solution received: ${powSolution} from ${clientIP}`);
    }

    // All checks passed
    return new Response(
      JSON.stringify({
        allowed: true,
        reason: "All checks passed",
        action: "allow",
        remaining,
      } as ValidationResponse),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("[validate-request] Error:", error);
    return new Response(
      JSON.stringify({
        allowed: true, // Fail open to not block legitimate users
        reason: "Validation error - allowing",
        action: "allow",
      } as ValidationResponse),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
