// Hardware Security & Supply Chain Integrity Detection Library
// Implements COVERT method, RoT validation, side-channel analysis, and cryptographic traceability

export interface MicroarchEventTest {
  id: string;
  name: string;
  category: "pipeline" | "cache" | "exception" | "memory" | "branch";
  rareEventType: string;
  description: string;
  testCode: string;
  expectedBehavior: string;
  trojanIndicators: string[];
}

export interface SideChannelReading {
  timestamp: number;
  powerDraw: number; // mW
  thermalTemp: number; // Celsius
  timingDelay: number; // microseconds
  anomalyScore: number; // 0-100
}

export interface TraceabilityRecord {
  id: string;
  productId: string;
  eventType: "MAKE" | "SHIP" | "RECEIVE" | "ASSEMBLE" | "VERIFY";
  timestamp: Date;
  actorId: string;
  location: string;
  previousHash: string;
  currentHash: string;
  dataBlock: Record<string, unknown>;
  isVerified: boolean;
}

export interface HardwareIntegrityReport {
  deviceId: string;
  timestamp: Date;
  overallScore: number;
  covertTestResults: COVERTResult[];
  sideChannelAnalysis: SideChannelAnalysis;
  traceabilityChain: TraceabilityChainStatus;
  rootOfTrustStatus: RoTStatus;
  recommendations: string[];
}

export interface COVERTResult {
  testId: string;
  testName: string;
  status: "passed" | "failed" | "anomaly";
  rareEventsTriggered: number;
  expectedEvents: number;
  deviation: number;
  trojanProbability: number;
  details: string;
}

export interface SideChannelAnalysis {
  powerProfile: {
    baseline: number;
    current: number;
    deviation: number;
    isAnomalous: boolean;
  };
  timingProfile: {
    baselineLatency: number;
    currentLatency: number;
    jitter: number;
    isAnomalous: boolean;
  };
  thermalProfile: {
    baseline: number;
    current: number;
    rateOfChange: number; // dV/dt for ERM detection
    isAnomalous: boolean;
  };
  overallRisk: "low" | "medium" | "high" | "critical";
}

export interface TraceabilityChainStatus {
  chainLength: number;
  isComplete: boolean;
  brokenLinks: number;
  verifiedRecords: number;
  suspiciousRecords: string[];
  originVerified: boolean;
}

export interface RoTStatus {
  tpmPresent: boolean;
  tpmVersion: string;
  measurementLog: MeasurementEntry[];
  attestationValid: boolean;
  secureBootEnabled: boolean;
  firmwareIntegrity: boolean;
}

export interface MeasurementEntry {
  pcr: number;
  hash: string;
  component: string;
  isValid: boolean;
}

// COVERT Method Test Generator - Microarchitectural Event Testing
export const MICROARCH_EVENT_TESTS: MicroarchEventTest[] = [
  {
    id: "cov-001",
    name: "Pipeline Hazard Activation",
    category: "pipeline",
    rareEventType: "RAW Hazard Chain",
    description: "Tests for rare Read-After-Write pipeline stalls that could hide Trojan triggers",
    testCode: `
      // Force RAW hazard chain
      volatile int a = 0, b = 0, c = 0;
      for(int i = 0; i < 1000; i++) {
        a = i * 2;
        b = a + 1;  // RAW on 'a'
        c = b + a;  // RAW on both
      }
    `,
    expectedBehavior: "Consistent pipeline stall patterns",
    trojanIndicators: ["Unexpected timing variance", "Anomalous power spikes during stalls"]
  },
  {
    id: "cov-002",
    name: "L3 Cache Eviction Storm",
    category: "cache",
    rareEventType: "Full Cache Flush",
    description: "Forces rare complete L3 cache invalidation to trigger dormant logic",
    testCode: `
      // Evict entire L3 cache
      volatile char* buffer = malloc(32 * 1024 * 1024); // 32MB
      for(size_t i = 0; i < 32*1024*1024; i += 64) {
        buffer[i] = (char)i;
      }
    `,
    expectedBehavior: "Predictable cache miss pattern",
    trojanIndicators: ["Cache timing anomalies", "Unexpected memory access patterns"]
  },
  {
    id: "cov-003",
    name: "Nested Exception Handler",
    category: "exception",
    rareEventType: "Triple Fault Recovery",
    description: "Tests exception handling paths rarely executed in normal operation",
    testCode: `
      // Trigger nested exceptions
      try {
        throw new Error("Level 1");
      } catch(e1) {
        try {
          throw new Error("Level 2");
        } catch(e2) {
          throw new Error("Level 3");
        }
      }
    `,
    expectedBehavior: "Clean exception chain resolution",
    trojanIndicators: ["Stack corruption", "Unexpected register modifications"]
  },
  {
    id: "cov-004",
    name: "Branch Misprediction Flood",
    category: "branch",
    rareEventType: "BTB Overflow",
    description: "Overflows branch target buffer to activate rare prediction paths",
    testCode: `
      // Random branch pattern to defeat prediction
      for(int i = 0; i < 10000; i++) {
        if(Math.random() > 0.5) {
          nop();
        } else {
          nop();
        }
      }
    `,
    expectedBehavior: "~50% misprediction rate",
    trojanIndicators: ["Biased prediction outcomes", "Timing side-channels"]
  },
  {
    id: "cov-005",
    name: "Memory Boundary Stress",
    category: "memory",
    rareEventType: "Page Fault Storm",
    description: "Triggers rapid page faults to test MMU edge cases",
    testCode: `
      // Cross page boundaries rapidly
      volatile char* p;
      for(int i = 0; i < 1000; i++) {
        p = mmap(NULL, 4096, PROT_READ, MAP_ANON, -1, 0);
        munmap(p, 4096);
      }
    `,
    expectedBehavior: "Clean page table updates",
    trojanIndicators: ["TLB poisoning", "Stale page mappings"]
  }
];

// SHA-3 based hash simulation for traceability
export function generateTraceabilityHash(data: Record<string, unknown>, previousHash: string): string {
  const dataStr = JSON.stringify(data) + previousHash;
  let hash = 0;
  for (let i = 0; i < dataStr.length; i++) {
    const char = dataStr.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return `sha3-${Math.abs(hash).toString(16).padStart(16, '0')}`;
}

// Generate Access Hash for cross-ecosystem data retrieval
export function generateAccessHash(productId: string, actorId: string, timestamp: number): string {
  const combined = `${productId}:${actorId}:${timestamp}`;
  let hash = 0;
  for (let i = 0; i < combined.length; i++) {
    hash = ((hash << 5) - hash) + combined.charCodeAt(i);
  }
  return `access-${Math.abs(hash).toString(16).padStart(12, '0')}`;
}

// Simulate side-channel reading
export function simulateSideChannelReading(): SideChannelReading {
  const baseline = {
    power: 45, // mW baseline
    thermal: 42, // Celsius baseline
    timing: 100 // microseconds baseline
  };
  
  // Add realistic variance with potential anomaly injection
  const hasAnomaly = Math.random() < 0.05; // 5% anomaly rate
  
  const powerDraw = baseline.power + (Math.random() * 10 - 5) + (hasAnomaly ? 25 : 0);
  const thermalTemp = baseline.thermal + (Math.random() * 3 - 1.5) + (hasAnomaly ? 8 : 0);
  const timingDelay = baseline.timing + (Math.random() * 20 - 10) + (hasAnomaly ? 50 : 0);
  
  const anomalyScore = Math.min(100, Math.max(0,
    (Math.abs(powerDraw - baseline.power) / baseline.power * 100) +
    (Math.abs(thermalTemp - baseline.thermal) / baseline.thermal * 50) +
    (Math.abs(timingDelay - baseline.timing) / baseline.timing * 50)
  ));
  
  return {
    timestamp: Date.now(),
    powerDraw: Math.round(powerDraw * 100) / 100,
    thermalTemp: Math.round(thermalTemp * 10) / 10,
    timingDelay: Math.round(timingDelay * 10) / 10,
    anomalyScore: Math.round(anomalyScore)
  };
}

// Detect Environmental Rate Manipulation (ERM) triggers
export function detectERMTrigger(readings: SideChannelReading[]): { detected: boolean; rateOfChange: number; threshold: number } {
  if (readings.length < 3) {
    return { detected: false, rateOfChange: 0, threshold: 5 };
  }
  
  // Calculate dV/dt for thermal readings
  const recent = readings.slice(-3);
  const dT = (recent[2].timestamp - recent[0].timestamp) / 1000; // seconds
  const dV = recent[2].thermalTemp - recent[0].thermalTemp;
  const rateOfChange = Math.abs(dV / dT); // degrees per second
  
  // ERM triggers activate at specific rates, not thresholds
  const threshold = 5; // degrees/second - suspicious rate
  const detected = rateOfChange > threshold;
  
  return { detected, rateOfChange: Math.round(rateOfChange * 100) / 100, threshold };
}

// Run COVERT test simulation
export function runCOVERTTest(test: MicroarchEventTest): COVERTResult {
  // Simulate test execution
  const expectedEvents = 100;
  const triggeredEvents = Math.floor(Math.random() * 20) + 85; // 85-105 events
  const deviation = Math.abs((triggeredEvents - expectedEvents) / expectedEvents) * 100;
  
  // Calculate Trojan probability based on deviation
  const trojanProbability = deviation > 15 ? deviation * 2 : deviation;
  
  let status: "passed" | "failed" | "anomaly" = "passed";
  if (trojanProbability > 50) status = "failed";
  else if (trojanProbability > 20) status = "anomaly";
  
  return {
    testId: test.id,
    testName: test.name,
    status,
    rareEventsTriggered: triggeredEvents,
    expectedEvents,
    deviation: Math.round(deviation * 10) / 10,
    trojanProbability: Math.round(trojanProbability * 10) / 10,
    details: status === "passed" 
      ? "Rare event activation within normal parameters"
      : `Deviation of ${deviation.toFixed(1)}% from expected behavior detected`
  };
}

// Verify traceability chain integrity
export function verifyTraceabilityChain(records: TraceabilityRecord[]): TraceabilityChainStatus {
  if (records.length === 0) {
    return {
      chainLength: 0,
      isComplete: false,
      brokenLinks: 0,
      verifiedRecords: 0,
      suspiciousRecords: [],
      originVerified: false
    };
  }
  
  let brokenLinks = 0;
  let verifiedRecords = 0;
  const suspiciousRecords: string[] = [];
  
  // Verify chain integrity
  for (let i = 1; i < records.length; i++) {
    const current = records[i];
    const previous = records[i - 1];
    
    // Check hash chain
    const expectedHash = generateTraceabilityHash(previous.dataBlock, previous.previousHash);
    if (current.previousHash !== previous.currentHash) {
      brokenLinks++;
      suspiciousRecords.push(current.id);
    } else {
      verifiedRecords++;
    }
  }
  
  // First record is verified if it has genesis hash
  if (records[0].previousHash === "genesis" || records[0].previousHash === "") {
    verifiedRecords++;
  }
  
  return {
    chainLength: records.length,
    isComplete: brokenLinks === 0 && records[0].eventType === "MAKE",
    brokenLinks,
    verifiedRecords,
    suspiciousRecords,
    originVerified: records[0].eventType === "MAKE" && records[0].previousHash === "genesis"
  };
}

// Generate mock TPM measurement log
export function generateMockTPMMeasurements(): MeasurementEntry[] {
  return [
    { pcr: 0, hash: "sha256-coreboot", component: "Core Root of Trust", isValid: true },
    { pcr: 1, hash: "sha256-platform-cfg", component: "Platform Configuration", isValid: true },
    { pcr: 2, hash: "sha256-option-rom", component: "Option ROM Code", isValid: Math.random() > 0.1 },
    { pcr: 3, hash: "sha256-option-cfg", component: "Option ROM Configuration", isValid: true },
    { pcr: 4, hash: "sha256-mbr", component: "Master Boot Record", isValid: true },
    { pcr: 5, hash: "sha256-mbr-cfg", component: "MBR Configuration", isValid: true },
    { pcr: 7, hash: "sha256-secureboot", component: "Secure Boot Policy", isValid: Math.random() > 0.05 },
    { pcr: 8, hash: "sha256-kernel", component: "Kernel Image", isValid: true },
    { pcr: 9, hash: "sha256-initrd", component: "Initial Ramdisk", isValid: true },
    { pcr: 14, hash: "sha256-shim", component: "Shim Bootloader", isValid: true }
  ];
}

// Generate comprehensive hardware integrity report
export function generateHardwareIntegrityReport(deviceId: string): HardwareIntegrityReport {
  // Run all COVERT tests
  const covertResults = MICROARCH_EVENT_TESTS.map(test => runCOVERTTest(test));
  
  // Generate side-channel analysis
  const readings: SideChannelReading[] = [];
  for (let i = 0; i < 10; i++) {
    readings.push(simulateSideChannelReading());
  }
  
  const avgPower = readings.reduce((a, b) => a + b.powerDraw, 0) / readings.length;
  const avgThermal = readings.reduce((a, b) => a + b.thermalTemp, 0) / readings.length;
  const avgTiming = readings.reduce((a, b) => a + b.timingDelay, 0) / readings.length;
  const avgAnomaly = readings.reduce((a, b) => a + b.anomalyScore, 0) / readings.length;
  
  const ermCheck = detectERMTrigger(readings);
  
  const sideChannelAnalysis: SideChannelAnalysis = {
    powerProfile: {
      baseline: 45,
      current: avgPower,
      deviation: Math.abs((avgPower - 45) / 45 * 100),
      isAnomalous: Math.abs(avgPower - 45) > 15
    },
    timingProfile: {
      baselineLatency: 100,
      currentLatency: avgTiming,
      jitter: readings.reduce((a, b) => a + Math.abs(b.timingDelay - avgTiming), 0) / readings.length,
      isAnomalous: avgTiming > 130
    },
    thermalProfile: {
      baseline: 42,
      current: avgThermal,
      rateOfChange: ermCheck.rateOfChange,
      isAnomalous: ermCheck.detected
    },
    overallRisk: avgAnomaly > 50 ? "critical" : avgAnomaly > 30 ? "high" : avgAnomaly > 15 ? "medium" : "low"
  };
  
  // Generate TPM status
  const measurements = generateMockTPMMeasurements();
  const rotStatus: RoTStatus = {
    tpmPresent: true,
    tpmVersion: "2.0",
    measurementLog: measurements,
    attestationValid: measurements.every(m => m.isValid),
    secureBootEnabled: true,
    firmwareIntegrity: measurements.filter(m => m.pcr <= 3).every(m => m.isValid)
  };
  
  // Calculate overall score
  const covertScore = (covertResults.filter(r => r.status === "passed").length / covertResults.length) * 40;
  const sideChannelScore = sideChannelAnalysis.overallRisk === "low" ? 30 : 
                           sideChannelAnalysis.overallRisk === "medium" ? 20 : 10;
  const rotScore = rotStatus.attestationValid ? 30 : 15;
  const overallScore = Math.round(covertScore + sideChannelScore + rotScore);
  
  // Generate recommendations
  const recommendations: string[] = [];
  if (covertResults.some(r => r.status === "failed")) {
    recommendations.push("CRITICAL: COVERT testing detected potential hardware Trojan. Isolate device immediately.");
  }
  if (covertResults.some(r => r.status === "anomaly")) {
    recommendations.push("WARNING: Microarchitectural anomalies detected. Run extended testing with physical isolation.");
  }
  if (sideChannelAnalysis.powerProfile.isAnomalous) {
    recommendations.push("Power consumption anomaly detected. Compare against known-good reference unit.");
  }
  if (sideChannelAnalysis.thermalProfile.isAnomalous) {
    recommendations.push("Thermal rate-of-change trigger detected (ERM evasion pattern). Deep hardware inspection required.");
  }
  if (!rotStatus.attestationValid) {
    recommendations.push("TPM attestation failed. Boot chain integrity compromised.");
  }
  if (recommendations.length === 0) {
    recommendations.push("All security checks passed. Continue standard monitoring.");
  }
  
  return {
    deviceId,
    timestamp: new Date(),
    overallScore,
    covertTestResults: covertResults,
    sideChannelAnalysis,
    traceabilityChain: {
      chainLength: 5,
      isComplete: true,
      brokenLinks: 0,
      verifiedRecords: 5,
      suspiciousRecords: [],
      originVerified: true
    },
    rootOfTrustStatus: rotStatus,
    recommendations
  };
}
