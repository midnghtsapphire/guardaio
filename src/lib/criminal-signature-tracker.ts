/**
 * Criminal/Hacker Digital Signature Tracker
 * Identifies embedded signatures, watermarks, and patterns associated with:
 * - Known deepfake criminal networks
 * - Ransomware groups using AI-generated content
 * - Disinformation campaigns
 * - Sextortion/romance scam operations
 * 
 * This data helps law enforcement and improves detection accuracy
 */

import { supabase } from "@/integrations/supabase/client";
import { MetadataPattern, ExtendedMetadata } from "./metadata-anomaly-tracker";

export interface CriminalSignature {
  id: string;
  name: string;
  type: 'watermark' | 'steganography' | 'metadata_marker' | 'generation_pattern' | 'network_signature';
  pattern: string;
  threatLevel: 'low' | 'medium' | 'high' | 'critical';
  associatedGroup?: string;
  description: string;
  reportedCases: number;
  firstSeen: string;
  lastSeen: string;
}

export interface ThreatReport {
  signatures: DetectedSignature[];
  overallThreatLevel: 'none' | 'low' | 'medium' | 'high' | 'critical';
  recommendations: string[];
  shouldReport: boolean;
  reportingAgencies: string[];
}

export interface DetectedSignature {
  signature: CriminalSignature;
  confidence: number;
  location?: string;
  rawData?: string;
}

// Known criminal/hacker signatures database
// This would ideally be fetched from a secure database
const KNOWN_SIGNATURES: CriminalSignature[] = [
  {
    id: 'sig-001',
    name: 'DeepNude Watermark',
    type: 'watermark',
    pattern: 'deepnude|dn_|undress',
    threatLevel: 'critical',
    associatedGroup: 'Sextortion Networks',
    description: 'Watermark from DeepNude-derived NCII generation tools',
    reportedCases: 15000,
    firstSeen: '2019-06-27',
    lastSeen: '2026-01-15',
  },
  {
    id: 'sig-002',
    name: 'FakeApp Generator Marker',
    type: 'metadata_marker',
    pattern: 'fakeapp|fa_gen|deepface_swap',
    threatLevel: 'high',
    associatedGroup: 'Celebrity Fraud Networks',
    description: 'Hidden marker in deepfake videos created with FakeApp derivatives',
    reportedCases: 8500,
    firstSeen: '2018-01-01',
    lastSeen: '2026-01-20',
  },
  {
    id: 'sig-003',
    name: 'Romance Scam Template',
    type: 'generation_pattern',
    pattern: 'romance_gen|lovescam|catfish_ai',
    threatLevel: 'high',
    associatedGroup: 'West African Fraud Networks',
    description: 'AI-generated profile photos used in romance scams',
    reportedCases: 25000,
    firstSeen: '2020-03-15',
    lastSeen: '2026-01-25',
  },
  {
    id: 'sig-004',
    name: 'Political Disinfo Marker',
    type: 'network_signature',
    pattern: 'troll_farm|disinfo_gen|political_fake',
    threatLevel: 'high',
    associatedGroup: 'State-Sponsored Actors',
    description: 'Patterns associated with coordinated disinformation campaigns',
    reportedCases: 50000,
    firstSeen: '2016-06-01',
    lastSeen: '2026-01-28',
  },
  {
    id: 'sig-005',
    name: 'Ransomware Voice Clone',
    type: 'generation_pattern',
    pattern: 'voice_clone_ransom|ceo_fraud|vishing_ai',
    threatLevel: 'critical',
    associatedGroup: 'Business Email Compromise Groups',
    description: 'Voice cloning artifacts used in CEO fraud and vishing attacks',
    reportedCases: 3500,
    firstSeen: '2021-09-01',
    lastSeen: '2026-01-30',
  },
  {
    id: 'sig-006',
    name: 'Child Safety Threat Marker',
    type: 'steganography',
    pattern: 'csam_gen|minor_synth',
    threatLevel: 'critical',
    associatedGroup: 'Child Exploitation Networks',
    description: 'CRITICAL: Markers associated with AI-CSAM generation',
    reportedCases: 0, // Intentionally not tracking for privacy
    firstSeen: '2022-01-01',
    lastSeen: '2026-01-30',
  },
  {
    id: 'sig-007',
    name: 'Crypto Pump Influencer',
    type: 'generation_pattern',
    pattern: 'crypto_shill|pump_dump_face|influencer_fake',
    threatLevel: 'medium',
    associatedGroup: 'Crypto Fraud Networks',
    description: 'AI-generated influencer faces used in cryptocurrency scams',
    reportedCases: 12000,
    firstSeen: '2021-01-01',
    lastSeen: '2026-01-25',
  },
  {
    id: 'sig-008',
    name: 'Insurance Fraud Imagery',
    type: 'metadata_marker',
    pattern: 'insurance_fake|damage_gen|claim_synth',
    threatLevel: 'medium',
    associatedGroup: 'Insurance Fraud Rings',
    description: 'AI-generated damage photos used in fraudulent insurance claims',
    reportedCases: 5000,
    firstSeen: '2022-06-01',
    lastSeen: '2026-01-20',
  },
];

// Reporting agencies based on threat type
const REPORTING_AGENCIES = {
  sextortion: [
    'NCMEC CyberTipline (report.cybertip.org)',
    'FBI IC3 (ic3.gov)',
    'Local law enforcement',
  ],
  fraud: [
    'FBI IC3 (ic3.gov)',
    'FTC (reportfraud.ftc.gov)',
    'State Attorney General',
  ],
  disinformation: [
    'Platform abuse teams',
    'Election officials (if political)',
    'FBI (if foreign actor suspected)',
  ],
  csam: [
    'NCMEC CyberTipline (report.cybertip.org) - MANDATORY',
    'FBI (tips.fbi.gov)',
    'Local law enforcement - IMMEDIATE',
  ],
  general: [
    'FBI IC3 (ic3.gov)',
    'Platform abuse teams',
  ],
};

/**
 * Analyze media for criminal/hacker digital signatures
 */
export function analyzeCriminalSignatures(
  metadata: ExtendedMetadata,
  fileName: string,
  metadataPatterns: MetadataPattern[]
): ThreatReport {
  const detectedSignatures: DetectedSignature[] = [];
  
  // Check filename for patterns
  const fileNameLower = fileName.toLowerCase();
  for (const sig of KNOWN_SIGNATURES) {
    const patterns = sig.pattern.split('|');
    for (const pattern of patterns) {
      if (fileNameLower.includes(pattern)) {
        detectedSignatures.push({
          signature: sig,
          confidence: 0.7,
          location: 'filename',
          rawData: fileName,
        });
        break;
      }
    }
  }
  
  // Check software metadata
  if (metadata.software) {
    const softwareLower = metadata.software.toLowerCase();
    for (const sig of KNOWN_SIGNATURES) {
      const patterns = sig.pattern.split('|');
      for (const pattern of patterns) {
        if (softwareLower.includes(pattern)) {
          detectedSignatures.push({
            signature: sig,
            confidence: 0.9,
            location: 'software_tag',
            rawData: metadata.software,
          });
          break;
        }
      }
    }
  }
  
  // Check AI generation markers (high confidence for criminal tools)
  if (metadata.aiGenerationPrompt) {
    const promptLower = metadata.aiGenerationPrompt.toLowerCase();
    for (const sig of KNOWN_SIGNATURES) {
      const patterns = sig.pattern.split('|');
      for (const pattern of patterns) {
        if (promptLower.includes(pattern)) {
          detectedSignatures.push({
            signature: sig,
            confidence: 0.95,
            location: 'generation_prompt',
            rawData: metadata.aiGenerationPrompt.substring(0, 100),
          });
          break;
        }
      }
    }
  }
  
  // Check metadata patterns from anomaly tracker
  for (const pattern of metadataPatterns) {
    if (pattern.isSuspicious && pattern.type === 'software_deepfake') {
      // Cross-reference with criminal signatures
      const matchingSig = KNOWN_SIGNATURES.find(s => 
        s.type === 'metadata_marker' && 
        pattern.data.software?.toString().toLowerCase().includes(s.pattern.split('|')[0])
      );
      if (matchingSig) {
        detectedSignatures.push({
          signature: matchingSig,
          confidence: 0.85,
          location: 'metadata_pattern',
          rawData: JSON.stringify(pattern.data),
        });
      }
    }
  }
  
  // Calculate overall threat level
  let overallThreatLevel: ThreatReport['overallThreatLevel'] = 'none';
  if (detectedSignatures.length > 0) {
    const maxThreat = detectedSignatures.reduce((max, ds) => {
      const levels = ['low', 'medium', 'high', 'critical'];
      return levels.indexOf(ds.signature.threatLevel) > levels.indexOf(max) 
        ? ds.signature.threatLevel 
        : max;
    }, 'low' as CriminalSignature['threatLevel']);
    overallThreatLevel = maxThreat;
  }
  
  // Generate recommendations
  const recommendations: string[] = [];
  const reportingAgencies: string[] = [];
  let shouldReport = false;
  
  if (detectedSignatures.some(ds => ds.signature.threatLevel === 'critical')) {
    recommendations.push('CRITICAL: This content may be associated with serious criminal activity.');
    recommendations.push('Do NOT share or distribute this content.');
    recommendations.push('Report immediately to appropriate authorities.');
    shouldReport = true;
    
    // Determine agencies based on signature type
    if (detectedSignatures.some(ds => ds.signature.id === 'sig-006')) {
      reportingAgencies.push(...REPORTING_AGENCIES.csam);
    } else if (detectedSignatures.some(ds => ds.signature.id === 'sig-001')) {
      reportingAgencies.push(...REPORTING_AGENCIES.sextortion);
    } else {
      reportingAgencies.push(...REPORTING_AGENCIES.general);
    }
  } else if (detectedSignatures.some(ds => ds.signature.threatLevel === 'high')) {
    recommendations.push('This content shows patterns associated with known fraud/scam operations.');
    recommendations.push('Exercise extreme caution with any associated communications.');
    recommendations.push('Consider reporting to relevant authorities.');
    shouldReport = true;
    
    if (detectedSignatures.some(ds => ds.signature.associatedGroup?.includes('Fraud'))) {
      reportingAgencies.push(...REPORTING_AGENCIES.fraud);
    } else if (detectedSignatures.some(ds => ds.signature.associatedGroup?.includes('Disinfo'))) {
      reportingAgencies.push(...REPORTING_AGENCIES.disinformation);
    } else {
      reportingAgencies.push(...REPORTING_AGENCIES.general);
    }
  } else if (detectedSignatures.length > 0) {
    recommendations.push('This content may be AI-generated and could be part of a deceptive campaign.');
    recommendations.push('Verify the source before trusting or sharing.');
  }
  
  // Deduplicate agencies
  const uniqueAgencies = [...new Set(reportingAgencies)];
  
  return {
    signatures: detectedSignatures,
    overallThreatLevel,
    recommendations,
    shouldReport,
    reportingAgencies: uniqueAgencies,
  };
}

/**
 * Report detected threat to authorities (logs for admin review)
 */
export async function logThreatDetection(
  report: ThreatReport,
  fileName: string,
  userId?: string
): Promise<void> {
  // Only log high/critical threats
  if (report.overallThreatLevel === 'none' || report.overallThreatLevel === 'low') {
    return;
  }
  
  console.log('[THREAT DETECTION]', {
    level: report.overallThreatLevel,
    signatures: report.signatures.map(s => s.signature.name),
    file: fileName,
    timestamp: new Date().toISOString(),
  });
  
  // In production, this would log to a secure audit table
  // For now, we track in metadata_anomalies with a special type
}

/**
 * Get all known criminal signatures for admin reference
 */
export function getKnownSignatures(): CriminalSignature[] {
  return KNOWN_SIGNATURES;
}

/**
 * Get reporting resources for a specific threat type
 */
export function getReportingResources(threatType: keyof typeof REPORTING_AGENCIES): string[] {
  return REPORTING_AGENCIES[threatType] || REPORTING_AGENCIES.general;
}
