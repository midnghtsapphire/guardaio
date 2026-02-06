/**
 * Bot Protection Test Suite
 * Automated tests for WAF, rate limiting, honeypots, and PoW challenges
 */

import { describe, it, expect, beforeEach, vi } from "vitest";
import {
  RateLimiter,
  WAFEngine,
  HoneypotSystem,
  ProofOfWorkManager,
  BotProtectionManager,
} from "@/lib/bot-protection";

describe("RateLimiter", () => {
  let rateLimiter: RateLimiter;

  beforeEach(() => {
    rateLimiter = new RateLimiter({
      maxRequests: 5,
      windowMs: 1000,
      burstLimit: 2,
      penaltyMs: 5000,
    });
  });

  it("should allow requests within limit", () => {
    const result = rateLimiter.isAllowed("test-ip-1");
    expect(result.allowed).toBe(true);
    expect(result.remaining).toBe(4);
  });

  it("should track remaining requests decreasing", () => {
    const result1 = rateLimiter.isAllowed("test-ip-2");
    const result2 = rateLimiter.isAllowed("test-ip-2");
    // Remaining should decrease with each request
    expect(result2.remaining).toBeLessThanOrEqual(result1.remaining);
    expect(result1.allowed).toBe(true);
    expect(result2.allowed).toBe(true);
  });

  it("should block when limit exceeded", () => {
    for (let i = 0; i < 5; i++) {
      rateLimiter.isAllowed("test-ip-3");
    }
    const result = rateLimiter.isAllowed("test-ip-3");
    expect(result.allowed).toBe(false);
    expect(result.remaining).toBe(0);
  });

  it("should return stats", () => {
    rateLimiter.isAllowed("ip-a");
    rateLimiter.isAllowed("ip-b");
    const stats = rateLimiter.getStats();
    expect(stats.activeClients).toBeGreaterThanOrEqual(2);
  });
});

describe("WAFEngine", () => {
  let waf: WAFEngine;

  beforeEach(() => {
    waf = new WAFEngine();
  });

  it("should detect XSS attempts", () => {
    const result = waf.analyzeRequest(
      '<script>alert("xss")</script>',
      "test-ip",
      "Mozilla/5.0"
    );
    expect(result.action).toBe("block");
    expect(result.matchedRules.some(r => r.category === "xss")).toBe(true);
  });

  it("should detect SQL injection", () => {
    const result = waf.analyzeRequest(
      "SELECT * FROM users UNION SELECT password FROM admin",
      "test-ip",
      "Mozilla/5.0"
    );
    expect(result.action).toBe("block");
    expect(result.matchedRules.some(r => r.category === "sqli")).toBe(true);
  });

  it("should challenge known bot user agents", () => {
    const result = waf.analyzeRequest(
      "normal request",
      "test-ip",
      "python-requests/2.28.0"
    );
    expect(result.action).toBe("challenge");
  });

  it("should block AI scrapers", () => {
    const result = waf.analyzeRequest(
      "normal request",
      "test-ip",
      "GPTBot/1.0"
    );
    expect(result.action).toBe("block");
  });

  it("should allow legitimate requests", () => {
    const result = waf.analyzeRequest(
      "analyzing image for deepfake detection",
      "test-ip",
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0"
    );
    expect(result.action).toBe("allow");
  });

  it("should detect path traversal", () => {
    const result = waf.analyzeRequest(
      "../../etc/passwd",
      "test-ip",
      "Mozilla/5.0"
    );
    expect(result.action).toBe("block");
  });

  it("should return all active rules", () => {
    const rules = waf.getRules();
    expect(rules.length).toBeGreaterThan(0);
    expect(rules.some(r => r.category === "xss")).toBe(true);
    expect(rules.some(r => r.category === "bot")).toBe(true);
  });
});

describe("HoneypotSystem", () => {
  let honeypot: HoneypotSystem;

  beforeEach(() => {
    honeypot = new HoneypotSystem({
      enabled: true,
      endpoints: ["/.env", "/wp-login.php", "/admin/config"],
      hiddenFields: ["email_confirm", "website_url"],
      trapDelay: 0,
    });
  });

  it("should trap requests to honeypot endpoints", () => {
    const trapped = honeypot.checkTrap("/.env", "attacker-ip");
    expect(trapped).toBe(true);
  });

  it("should remember trapped IPs", () => {
    honeypot.checkTrap("/wp-login.php", "attacker-ip-2");
    expect(honeypot.isTrapped("attacker-ip-2")).toBe(true);
  });

  it("should not trap legitimate paths", () => {
    const trapped = honeypot.checkTrap("/analyze", "legit-ip");
    expect(trapped).toBe(false);
    expect(honeypot.isTrapped("legit-ip")).toBe(false);
  });

  it("should log trap events", () => {
    honeypot.checkTrap("/.env", "logged-ip");
    const logs = honeypot.getLogs();
    expect(logs.length).toBeGreaterThan(0);
    expect(logs[0].ip).toBe("logged-ip");
  });
});

describe("ProofOfWorkManager", () => {
  let pow: ProofOfWorkManager;

  beforeEach(() => {
    pow = new ProofOfWorkManager();
  });

  it("should generate challenges with correct structure", () => {
    const challenge = pow.generateChallenge("session-1", 10);
    expect(challenge.difficulty).toBe(10);
    expect(challenge.algorithm).toBe("sha256");
    expect(challenge.salt).toBeDefined();
    expect(challenge.expires).toBeGreaterThan(Date.now());
  });

  it("should generate unique salts", () => {
    const challenge1 = pow.generateChallenge("session-a");
    const challenge2 = pow.generateChallenge("session-b");
    expect(challenge1.salt).not.toBe(challenge2.salt);
  });

  it("should reject verification for unknown sessions", async () => {
    const result = await pow.verifyChallenge("unknown-session", 12345);
    expect(result).toBe(false);
  });
});

describe("BotProtectionManager", () => {
  let manager: BotProtectionManager;

  beforeEach(() => {
    manager = new BotProtectionManager();
  });

  it("should block honeypot paths", async () => {
    const result = await manager.validateRequest(
      "192.168.1.100",
      "/.env",
      "Mozilla/5.0"
    );
    expect(result.allowed).toBe(false);
    expect(result.action).toBe("block");
    expect(result.reason).toContain("Honeypot");
  });

  it("should allow legitimate requests", async () => {
    const result = await manager.validateRequest(
      "192.168.1.200",
      "/analyze",
      "Mozilla/5.0 Chrome/120.0.0.0"
    );
    expect(result.allowed).toBe(true);
    expect(result.action).toBe("allow");
  });

  it("should return protection stats", () => {
    const stats = manager.getStats();
    expect(stats.wafRules).toBeGreaterThan(0);
    expect(stats.honeypotTraps).toBeDefined();
    expect(stats.rateLimitStats).toBeDefined();
  });

  it("should issue challenge for suspicious user agents", async () => {
    const result = await manager.validateRequest(
      "192.168.1.201",
      "/analyze",
      "curl/7.68.0"
    );
    expect(result.action).toBe("challenge");
    expect(result.challenge).toBeDefined();
  });
});
