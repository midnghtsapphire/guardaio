/**
 * Guardaio Bot Protection & Security Library
 * 
 * Implements comprehensive bot swarm defense using XP/Lean/RUP methodology:
 * - CrowdSec Collaborative IP Blocking
 * - BunkerWeb WAF Integration
 * - ALTCHA Proof-of-Work Challenges
 * - BotD Client-Side Detection
 * - Rate Limiting & Tarpitting
 * - Honeypot Traps
 * 
 * @version 1.0.0
 * @methodology XP (Extreme Programming) + Lean + RUP
 */

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export interface BotDetectionResult {
  isBot: boolean;
  confidence: number;
  signals: BotSignal[];
  recommendation: 'allow' | 'challenge' | 'block';
  fingerprint?: string;
}

export interface BotSignal {
  name: string;
  detected: boolean;
  weight: number;
  description: string;
}

export interface RateLimitConfig {
  maxRequests: number;
  windowMs: number;
  burstLimit: number;
  penaltyMs: number;
}

export interface CrowdSecAlert {
  ip: string;
  reason: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  timestamp: Date;
  source: string;
}

export interface WAFRule {
  id: string;
  name: string;
  pattern: RegExp | string;
  action: 'block' | 'challenge' | 'log';
  category: 'xss' | 'sqli' | 'lfi' | 'rce' | 'bot' | 'scanner';
}

export interface ProofOfWorkChallenge {
  difficulty: number;
  salt: string;
  algorithm: 'sha256' | 'sha384' | 'sha512';
  expires: number;
  nonce?: number;
}

export interface HoneypotConfig {
  enabled: boolean;
  endpoints: string[];
  hiddenFields: string[];
  trapDelay: number;
}

// ============================================================================
// CROWDSEC COLLABORATIVE IP BLOCKING
// ============================================================================

/**
 * CrowdSec Integration
 * Leverages community threat intelligence for proactive blocking
 */
export class CrowdSecClient {
  private blocklist: Set<string> = new Set();
  private alerts: CrowdSecAlert[] = [];
  private lastSync: Date | null = null;

  constructor(private apiKey?: string) {}

  /**
   * Sync blocklist from CrowdSec community
   * Uses herd immunity approach - IPs that attacked others are preemptively blocked
   */
  async syncBlocklist(): Promise<void> {
    // In production, this would call CrowdSec LAPI
    // For demo, simulate community blocklist
    const communityThreats = [
      '192.168.1.100', // Simulated threat IPs
      '10.0.0.50',
      '172.16.0.25',
    ];
    
    communityThreats.forEach(ip => this.blocklist.add(ip));
    this.lastSync = new Date();
    console.log(`[CrowdSec] Synced ${communityThreats.length} IPs from community blocklist`);
  }

  /**
   * Check if IP is in community blocklist
   */
  isBlocked(ip: string): boolean {
    return this.blocklist.has(ip);
  }

  /**
   * Report malicious IP to community
   */
  async reportIP(ip: string, reason: string, severity: CrowdSecAlert['severity']): Promise<void> {
    const alert: CrowdSecAlert = {
      ip,
      reason,
      severity,
      timestamp: new Date(),
      source: 'guardaio-waf'
    };
    
    this.alerts.push(alert);
    this.blocklist.add(ip);
    
    console.log(`[CrowdSec] Reported IP ${ip}: ${reason} (${severity})`);
  }

  /**
   * Get recent alerts
   */
  getAlerts(limit = 100): CrowdSecAlert[] {
    return this.alerts.slice(-limit);
  }

  /**
   * Get blocklist size
   */
  getBlocklistSize(): number {
    return this.blocklist.size;
  }
}

// ============================================================================
// BUNKERWEB WAF RULES ENGINE
// ============================================================================

/**
 * BunkerWeb-style WAF Rules Engine
 * Pre-configured with antibot features and bad behavior detection
 */
export class WAFEngine {
  private rules: WAFRule[] = [];
  private errorCounts: Map<string, number> = new Map();
  private bannedIPs: Set<string> = new Set();
  
  // Bad behavior thresholds
  private readonly MAX_ERRORS = 10;
  private readonly BAN_DURATION_MS = 3600000; // 1 hour

  constructor() {
    this.initializeRules();
  }

  private initializeRules(): void {
    this.rules = [
      // XSS Prevention
      {
        id: 'xss-001',
        name: 'XSS Script Injection',
        pattern: /<script[\s\S]*?>[\s\S]*?<\/script>/gi,
        action: 'block',
        category: 'xss'
      },
      {
        id: 'xss-002',
        name: 'XSS Event Handler',
        pattern: /on\w+\s*=\s*["'][^"']*["']/gi,
        action: 'block',
        category: 'xss'
      },
      // SQL Injection
      {
        id: 'sqli-001',
        name: 'SQL Union Injection',
        pattern: /union\s+(all\s+)?select/gi,
        action: 'block',
        category: 'sqli'
      },
      {
        id: 'sqli-002',
        name: 'SQL Comment Injection',
        pattern: /(--|#|\/\*)/g,
        action: 'log',
        category: 'sqli'
      },
      // Bot Detection
      {
        id: 'bot-001',
        name: 'Known Bot User Agent',
        pattern: /(curl|wget|python-requests|scrapy|phantomjs|headless)/gi,
        action: 'challenge',
        category: 'bot'
      },
      {
        id: 'bot-002',
        name: 'AI Scraper Bot',
        pattern: /(GPTBot|CCBot|ClaudeBot|anthropic|openai)/gi,
        action: 'block',
        category: 'bot'
      },
      // Scanner Detection
      {
        id: 'scan-001',
        name: 'Path Traversal',
        pattern: /\.\.\//g,
        action: 'block',
        category: 'lfi'
      },
      {
        id: 'scan-002',
        name: 'Admin Path Probe',
        pattern: /\/(wp-admin|phpmyadmin|admin\.php|config\.php)/gi,
        action: 'block',
        category: 'scanner'
      },
    ];
  }

  /**
   * Analyze request against WAF rules
   */
  analyzeRequest(
    input: string,
    ip: string,
    userAgent: string
  ): { allowed: boolean; matchedRules: WAFRule[]; action: 'allow' | 'challenge' | 'block' } {
    if (this.bannedIPs.has(ip)) {
      return { allowed: false, matchedRules: [], action: 'block' };
    }

    const matchedRules: WAFRule[] = [];
    let finalAction: 'allow' | 'challenge' | 'block' = 'allow';

    // Check all inputs
    const checkTargets = [input, userAgent];
    
    for (const target of checkTargets) {
      for (const rule of this.rules) {
        const pattern = typeof rule.pattern === 'string' 
          ? new RegExp(rule.pattern, 'gi') 
          : rule.pattern;
        
        if (pattern.test(target)) {
          matchedRules.push(rule);
          
          if (rule.action === 'block') {
            finalAction = 'block';
          } else if (rule.action === 'challenge' && finalAction !== 'block') {
            finalAction = 'challenge';
          }
        }
      }
    }

    return {
      allowed: finalAction === 'allow',
      matchedRules,
      action: finalAction
    };
  }

  /**
   * Track error codes for bad behavior detection
   * Bans IPs that generate too many 403/404 errors
   */
  trackError(ip: string, statusCode: number): void {
    if (statusCode === 403 || statusCode === 404 || statusCode === 429) {
      const count = (this.errorCounts.get(ip) || 0) + 1;
      this.errorCounts.set(ip, count);

      if (count >= this.MAX_ERRORS) {
        this.bannedIPs.add(ip);
        console.log(`[WAF] Auto-banned IP ${ip} for excessive errors (${count})`);
        
        // Auto-unban after duration
        setTimeout(() => {
          this.bannedIPs.delete(ip);
          this.errorCounts.delete(ip);
        }, this.BAN_DURATION_MS);
      }
    }
  }

  /**
   * Get all active rules
   */
  getRules(): WAFRule[] {
    return [...this.rules];
  }

  /**
   * Add custom rule
   */
  addRule(rule: WAFRule): void {
    this.rules.push(rule);
  }
}

// ============================================================================
// ALTCHA PROOF-OF-WORK CHALLENGES
// ============================================================================

/**
 * ALTCHA-style Proof-of-Work Challenge System
 * Forces bots to expend computational resources before accessing analysis
 */
export class ProofOfWorkManager {
  private readonly DEFAULT_DIFFICULTY = 20; // Number of leading zeros in hash
  private activeChallenges: Map<string, ProofOfWorkChallenge> = new Map();

  /**
   * Generate a new PoW challenge
   */
  generateChallenge(sessionId: string, difficulty?: number): ProofOfWorkChallenge {
    const challenge: ProofOfWorkChallenge = {
      difficulty: difficulty || this.DEFAULT_DIFFICULTY,
      salt: this.generateSalt(),
      algorithm: 'sha256',
      expires: Date.now() + 300000, // 5 minutes
    };

    this.activeChallenges.set(sessionId, challenge);
    return challenge;
  }

  /**
   * Verify a PoW solution
   */
  async verifyChallenge(sessionId: string, nonce: number): Promise<boolean> {
    const challenge = this.activeChallenges.get(sessionId);
    
    if (!challenge) {
      console.log('[PoW] Challenge not found');
      return false;
    }

    if (Date.now() > challenge.expires) {
      this.activeChallenges.delete(sessionId);
      console.log('[PoW] Challenge expired');
      return false;
    }

    // Verify the hash meets difficulty requirement
    const data = `${challenge.salt}:${nonce}`;
    const hash = await this.computeHash(data, challenge.algorithm);
    const leadingZeros = this.countLeadingZeros(hash);

    if (leadingZeros >= challenge.difficulty) {
      this.activeChallenges.delete(sessionId);
      console.log(`[PoW] Challenge solved! Nonce: ${nonce}, Zeros: ${leadingZeros}`);
      return true;
    }

    return false;
  }

  /**
   * Client-side solver (runs in browser)
   */
  async solveChallenge(challenge: ProofOfWorkChallenge): Promise<number> {
    let nonce = 0;
    const startTime = Date.now();

    while (true) {
      const data = `${challenge.salt}:${nonce}`;
      const hash = await this.computeHash(data, challenge.algorithm);
      const leadingZeros = this.countLeadingZeros(hash);

      if (leadingZeros >= challenge.difficulty) {
        const elapsed = Date.now() - startTime;
        console.log(`[PoW] Solved in ${elapsed}ms with nonce ${nonce}`);
        return nonce;
      }

      nonce++;
      
      // Yield to event loop every 1000 iterations
      if (nonce % 1000 === 0) {
        await new Promise(resolve => setTimeout(resolve, 0));
      }
    }
  }

  private generateSalt(): string {
    const array = new Uint8Array(16);
    crypto.getRandomValues(array);
    return Array.from(array, b => b.toString(16).padStart(2, '0')).join('');
  }

  private async computeHash(data: string, algorithm: string): Promise<string> {
    const encoder = new TextEncoder();
    const dataBuffer = encoder.encode(data);
    const hashBuffer = await crypto.subtle.digest(algorithm.toUpperCase().replace('SHA', 'SHA-'), dataBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }

  private countLeadingZeros(hash: string): number {
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
    return zeros;
  }
}

// ============================================================================
// BOTD CLIENT-SIDE DETECTION
// ============================================================================

/**
 * BotD-style Client-Side Bot Detection
 * Detects automation tools like Selenium, Puppeteer, Playwright
 */
export class BotDetector {
  private signals: BotSignal[] = [];

  /**
   * Run all detection checks
   */
  async detect(): Promise<BotDetectionResult> {
    this.signals = [];

    // Run all detection methods
    this.checkWebDriver();
    this.checkHeadless();
    this.checkAutomation();
    this.checkPlugins();
    this.checkLanguages();
    this.checkScreenResolution();
    this.checkWebGL();
    this.checkCanvas();
    this.checkAudioContext();
    this.checkTimingAnomaly();

    // Calculate overall score
    const totalWeight = this.signals.reduce((sum, s) => sum + s.weight, 0);
    const botWeight = this.signals
      .filter(s => s.detected)
      .reduce((sum, s) => sum + s.weight, 0);

    const confidence = (botWeight / totalWeight) * 100;
    const isBot = confidence > 50;

    let recommendation: BotDetectionResult['recommendation'];
    if (confidence > 75) {
      recommendation = 'block';
    } else if (confidence > 30) {
      recommendation = 'challenge';
    } else {
      recommendation = 'allow';
    }

    return {
      isBot,
      confidence,
      signals: this.signals,
      recommendation,
      fingerprint: await this.generateFingerprint()
    };
  }

  private checkWebDriver(): void {
    const detected = !!(
      (navigator as any).webdriver ||
      (window as any).callPhantom ||
      (window as any)._phantom ||
      (window as any).__nightmare ||
      (document as any).__webdriver_evaluate ||
      (document as any).__selenium_evaluate ||
      (document as any).__webdriver_script_function
    );

    this.signals.push({
      name: 'WebDriver Detection',
      detected,
      weight: 30,
      description: 'Checks for WebDriver/Selenium automation markers'
    });
  }

  private checkHeadless(): void {
    const detected = !!(
      (navigator as any).webdriver ||
      /HeadlessChrome/.test(navigator.userAgent) ||
      !navigator.plugins.length ||
      !navigator.languages.length
    );

    this.signals.push({
      name: 'Headless Browser',
      detected,
      weight: 25,
      description: 'Detects headless browser characteristics'
    });
  }

  private checkAutomation(): void {
    const detected = !!(
      (window as any).domAutomation ||
      (window as any).domAutomationController ||
      (navigator as any).permissions === undefined
    );

    this.signals.push({
      name: 'Automation Framework',
      detected,
      weight: 20,
      description: 'Checks for automation framework presence'
    });
  }

  private checkPlugins(): void {
    const detected = navigator.plugins.length === 0;

    this.signals.push({
      name: 'Browser Plugins',
      detected,
      weight: 10,
      description: 'Real browsers typically have plugins installed'
    });
  }

  private checkLanguages(): void {
    const detected = !navigator.languages || navigator.languages.length === 0;

    this.signals.push({
      name: 'Language Settings',
      detected,
      weight: 10,
      description: 'Real browsers have language preferences'
    });
  }

  private checkScreenResolution(): void {
    const detected = screen.width === 0 || screen.height === 0;

    this.signals.push({
      name: 'Screen Resolution',
      detected,
      weight: 5,
      description: 'Checks for valid screen dimensions'
    });
  }

  private checkWebGL(): void {
    let detected = false;
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      detected = !gl;
    } catch {
      detected = true;
    }

    this.signals.push({
      name: 'WebGL Support',
      detected,
      weight: 10,
      description: 'Real browsers support WebGL rendering'
    });
  }

  private checkCanvas(): void {
    let detected = false;
    try {
      const canvas = document.createElement('canvas');
      canvas.width = 200;
      canvas.height = 50;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.textBaseline = 'top';
        ctx.font = '14px Arial';
        ctx.fillText('BotCheck', 2, 2);
        detected = canvas.toDataURL().length < 100;
      }
    } catch {
      detected = true;
    }

    this.signals.push({
      name: 'Canvas Fingerprint',
      detected,
      weight: 15,
      description: 'Canvas rendering reveals browser authenticity'
    });
  }

  private checkAudioContext(): void {
    let detected = false;
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      detected = audioContext.state === 'suspended' && audioContext.sampleRate === 0;
    } catch {
      detected = true;
    }

    this.signals.push({
      name: 'Audio Context',
      detected,
      weight: 10,
      description: 'Web Audio API fingerprinting'
    });
  }

  private checkTimingAnomaly(): void {
    const start = performance.now();
    // Simple computation
    let x = 0;
    for (let i = 0; i < 100000; i++) {
      x += Math.random();
    }
    const elapsed = performance.now() - start;
    
    // Bots often have abnormally fast or slow timing
    const detected = elapsed < 1 || elapsed > 1000;

    this.signals.push({
      name: 'Timing Anomaly',
      detected,
      weight: 5,
      description: 'Checks for abnormal execution timing'
    });
  }

  private async generateFingerprint(): Promise<string> {
    const components = [
      navigator.userAgent,
      navigator.language,
      screen.width + 'x' + screen.height,
      new Date().getTimezoneOffset(),
      navigator.hardwareConcurrency || 0,
      (navigator as any).deviceMemory || 0,
    ];

    const data = components.join('|');
    const encoder = new TextEncoder();
    const hashBuffer = await crypto.subtle.digest('SHA-256', encoder.encode(data));
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('').substring(0, 32);
  }
}

// ============================================================================
// RATE LIMITING
// ============================================================================

/**
 * Rate Limiter with Leaky Bucket Algorithm
 */
export class RateLimiter {
  private requests: Map<string, number[]> = new Map();
  private banned: Map<string, number> = new Map();

  constructor(private config: RateLimitConfig) {}

  /**
   * Check if request is allowed
   */
  isAllowed(identifier: string): { allowed: boolean; remaining: number; resetIn: number } {
    const now = Date.now();
    
    // Check if banned
    const banExpiry = this.banned.get(identifier);
    if (banExpiry && now < banExpiry) {
      return { allowed: false, remaining: 0, resetIn: banExpiry - now };
    }

    // Get request history
    let history = this.requests.get(identifier) || [];
    
    // Remove expired entries
    history = history.filter(t => now - t < this.config.windowMs);
    
    // Check burst limit
    const recentRequests = history.filter(t => now - t < 1000);
    if (recentRequests.length >= this.config.burstLimit) {
      return { allowed: false, remaining: 0, resetIn: 1000 };
    }

    // Check window limit
    if (history.length >= this.config.maxRequests) {
      // Apply penalty
      this.banned.set(identifier, now + this.config.penaltyMs);
      return { allowed: false, remaining: 0, resetIn: this.config.penaltyMs };
    }

    // Record this request
    history.push(now);
    this.requests.set(identifier, history);

    const remaining = this.config.maxRequests - history.length;
    const oldestRequest = history[0] || now;
    const resetIn = this.config.windowMs - (now - oldestRequest);

    return { allowed: true, remaining, resetIn };
  }

  /**
   * Get current stats
   */
  getStats(): { activeClients: number; bannedClients: number } {
    return {
      activeClients: this.requests.size,
      bannedClients: this.banned.size
    };
  }
}

// ============================================================================
// HONEYPOT SYSTEM
// ============================================================================

/**
 * Honeypot Trap System
 * Invisible endpoints that trap bots scanning the site
 */
export class HoneypotSystem {
  private trappedIPs: Set<string> = new Set();
  private trapLogs: Array<{ ip: string; endpoint: string; timestamp: Date }> = [];

  constructor(private config: HoneypotConfig) {}

  /**
   * Check if this is a honeypot access
   */
  checkTrap(path: string, ip: string): boolean {
    if (!this.config.enabled) return false;

    const isHoneypot = this.config.endpoints.some(ep => path.includes(ep));
    
    if (isHoneypot) {
      this.trapIP(ip, path);
      return true;
    }

    return false;
  }

  /**
   * Check if form submission contains honeypot field data
   */
  checkHiddenFields(formData: Record<string, string>, ip: string): boolean {
    if (!this.config.enabled) return false;

    for (const field of this.config.hiddenFields) {
      if (formData[field] && formData[field].trim() !== '') {
        this.trapIP(ip, `hidden-field:${field}`);
        return true;
      }
    }

    return false;
  }

  /**
   * Record trapped IP
   */
  private trapIP(ip: string, endpoint: string): void {
    this.trappedIPs.add(ip);
    this.trapLogs.push({
      ip,
      endpoint,
      timestamp: new Date()
    });

    console.log(`[Honeypot] Trapped IP ${ip} at ${endpoint}`);
  }

  /**
   * Check if IP is trapped
   */
  isTrapped(ip: string): boolean {
    return this.trappedIPs.has(ip);
  }

  /**
   * Get trap logs
   */
  getLogs(limit = 100): Array<{ ip: string; endpoint: string; timestamp: Date }> {
    return this.trapLogs.slice(-limit);
  }

  /**
   * Get default honeypot config
   */
  static getDefaultConfig(): HoneypotConfig {
    return {
      enabled: true,
      endpoints: [
        '/api/v1/upload-fast',
        '/admin/debug',
        '/.env',
        '/wp-login.php',
        '/config.php',
        '/phpmyadmin',
        '/.git/config'
      ],
      hiddenFields: [
        'website_url',
        'fax_number',
        'company_address'
      ],
      trapDelay: 5000
    };
  }
}

// ============================================================================
// UNIFIED BOT PROTECTION MANAGER
// ============================================================================

/**
 * Unified Bot Protection Manager
 * Coordinates all defense layers following XP/Lean/RUP methodology
 */
export class BotProtectionManager {
  public crowdsec: CrowdSecClient;
  public waf: WAFEngine;
  public pow: ProofOfWorkManager;
  public botDetector: BotDetector;
  public rateLimiter: RateLimiter;
  public honeypot: HoneypotSystem;

  constructor() {
    this.crowdsec = new CrowdSecClient();
    this.waf = new WAFEngine();
    this.pow = new ProofOfWorkManager();
    this.botDetector = new BotDetector();
    this.rateLimiter = new RateLimiter({
      maxRequests: 60,      // 60 requests per window
      windowMs: 60000,      // 1 minute window
      burstLimit: 10,       // Max 10 per second
      penaltyMs: 300000     // 5 minute penalty
    });
    this.honeypot = new HoneypotSystem(HoneypotSystem.getDefaultConfig());
  }

  /**
   * Initialize all protection systems
   */
  async initialize(): Promise<void> {
    await this.crowdsec.syncBlocklist();
    console.log('[BotProtection] All systems initialized');
  }

  /**
   * Full request validation pipeline
   */
  async validateRequest(
    ip: string,
    path: string,
    userAgent: string,
    body?: string
  ): Promise<{
    allowed: boolean;
    reason: string;
    action: 'allow' | 'challenge' | 'block';
    challenge?: ProofOfWorkChallenge;
  }> {
    // Layer 1: Honeypot check
    if (this.honeypot.checkTrap(path, ip)) {
      return { allowed: false, reason: 'Honeypot triggered', action: 'block' };
    }

    // Layer 2: CrowdSec blocklist
    if (this.crowdsec.isBlocked(ip)) {
      return { allowed: false, reason: 'IP in community blocklist', action: 'block' };
    }

    // Layer 3: Honeypot trapped IPs
    if (this.honeypot.isTrapped(ip)) {
      return { allowed: false, reason: 'Previously trapped by honeypot', action: 'block' };
    }

    // Layer 4: Rate limiting
    const rateResult = this.rateLimiter.isAllowed(ip);
    if (!rateResult.allowed) {
      return { allowed: false, reason: 'Rate limit exceeded', action: 'block' };
    }

    // Layer 5: WAF analysis
    const wafResult = this.waf.analyzeRequest(body || '', ip, userAgent);
    if (wafResult.action === 'block') {
      await this.crowdsec.reportIP(ip, 'WAF rule triggered', 'medium');
      return { 
        allowed: false, 
        reason: `WAF blocked: ${wafResult.matchedRules.map(r => r.name).join(', ')}`, 
        action: 'block' 
      };
    }

    // Layer 6: Issue challenge if suspicious
    if (wafResult.action === 'challenge') {
      const challenge = this.pow.generateChallenge(ip);
      return { 
        allowed: false, 
        reason: 'Challenge required', 
        action: 'challenge',
        challenge 
      };
    }

    return { allowed: true, reason: 'All checks passed', action: 'allow' };
  }

  /**
   * Get protection stats
   */
  getStats(): {
    crowdsecBlocklist: number;
    wafRules: number;
    rateLimitStats: { activeClients: number; bannedClients: number };
    honeypotTraps: number;
  } {
    return {
      crowdsecBlocklist: this.crowdsec.getBlocklistSize(),
      wafRules: this.waf.getRules().length,
      rateLimitStats: this.rateLimiter.getStats(),
      honeypotTraps: this.honeypot.getLogs().length
    };
  }
}

// Export singleton instance
export const botProtection = new BotProtectionManager();
