/**
 * Metadata Anomaly Tracking System
 * Catalogs unusual EXIF/metadata patterns to improve detection accuracy
 * Based on government research (DARPA MediFor, NIST standards)
 */

import { supabase } from "@/integrations/supabase/client";

export interface MetadataPattern {
  type: AnomalyType;
  signature: string;
  data: Record<string, unknown>;
  rarity: number;
  isSuspicious: boolean;
}

export type AnomalyType = 
  | 'exif_missing'
  | 'exif_stripped'
  | 'exif_inconsistent'
  | 'software_ai'
  | 'software_editor'
  | 'software_deepfake'
  | 'software_unknown'
  | 'timestamp_future'
  | 'timestamp_impossible'
  | 'gps_mismatch'
  | 'compression_unusual'
  | 'filename_ai'
  | 'dimension_unusual'
  | 'colorspace_unusual'
  | 'camera_fake'
  | 'metadata_conflict';

export interface ExtendedMetadata {
  // Basic EXIF
  make?: string;
  model?: string;
  software?: string;
  dateTime?: string;
  dateTimeOriginal?: string;
  dateTimeDigitized?: string;
  
  // Camera settings
  exposureTime?: string;
  fNumber?: string;
  iso?: number;
  focalLength?: string;
  flash?: string;
  
  // GPS
  gpsLatitude?: number;
  gpsLongitude?: number;
  gpsAltitude?: number;
  gpsTimestamp?: string;
  
  // Image properties
  width?: number;
  height?: number;
  colorSpace?: string;
  bitsPerSample?: number;
  compression?: string;
  
  // XMP/IPTC
  creator?: string;
  rights?: string;
  title?: string;
  description?: string;
  
  // AI/Generation markers
  aiGenerationModel?: string;
  aiGenerationSeed?: string;
  aiGenerationPrompt?: string;
  
  // Raw data
  rawExif?: Record<string, unknown>;
}

export interface AnomalyReport {
  patterns: MetadataPattern[];
  overallRiskScore: number;
  recommendations: string[];
  neverSeenBefore: MetadataPattern[];
  knownSuspicious: MetadataPattern[];
}

// Known AI generation software patterns
const AI_GENERATOR_PATTERNS = [
  /dall-?e/i, /midjourney/i, /stable.?diffusion/i, /sd[_-]?xl/i,
  /automatic1111/i, /comfyui/i, /invoke.?ai/i, /leonardo\.ai/i,
  /runway/i, /pika/i, /gen-?2/i, /sora/i, /firefly/i, /imagen/i,
  /bing.?image/i, /copilot/i, /gemini/i, /claude/i,
];

// Known deepfake tool patterns
const DEEPFAKE_TOOL_PATTERNS = [
  /faceswap/i, /deepfacelab/i, /dfl/i, /reface/i, /faceapp/i,
  /deepfake/i, /first.?order.?motion/i, /wav2lip/i, /syncnet/i,
];

// Known photo editors
const EDITOR_PATTERNS = [
  /photoshop/i, /lightroom/i, /gimp/i, /affinity/i, /capture.?one/i,
  /darktable/i, /rawtherapee/i, /pixelmator/i, /snapseed/i,
  /vsco/i, /canva/i, /figma/i, /sketch/i,
];

// Suspicious filename patterns
const SUSPICIOUS_FILENAME_PATTERNS = [
  /generated/i, /ai[_-]?gen/i, /_output/i, /fake/i, /synthetic/i,
  /\d{13,}/, // Long numeric IDs (common in AI outputs)
  /[a-f0-9]{32,}/i, // Hash-like strings
  /comfyui/i, /automatic1111/i, /a1111/i,
];

/**
 * Extract comprehensive metadata from an image file
 */
export async function extractExtendedMetadata(file: File): Promise<ExtendedMetadata> {
  const metadata: ExtendedMetadata = {
    width: 0,
    height: 0,
    rawExif: {},
  };

  try {
    const arrayBuffer = await file.arrayBuffer();
    const dataView = new DataView(arrayBuffer);
    
    // Check for JPEG
    if (dataView.getUint16(0) === 0xFFD8) {
      await parseJpegExif(dataView, metadata);
    }
    // Check for PNG
    else if (dataView.getUint32(0) === 0x89504E47) {
      await parsePngMetadata(dataView, metadata);
    }
    // Check for WebP
    else if (dataView.getUint32(0) === 0x52494646 && dataView.getUint32(8) === 0x57454250) {
      metadata.compression = 'WebP';
    }
    
  } catch (e) {
    console.warn('Metadata extraction error:', e);
  }

  return metadata;
}

/**
 * Parse JPEG EXIF data
 */
async function parseJpegExif(dataView: DataView, metadata: ExtendedMetadata): Promise<void> {
  let offset = 2;
  const markers: Record<string, number> = {};
  
  while (offset < dataView.byteLength - 4) {
    const marker = dataView.getUint16(offset);
    
    if (marker === 0xFFE1) { // APP1 (EXIF)
      const segmentLength = dataView.getUint16(offset + 2);
      markers['APP1_EXIF'] = offset;
      
      // Check for EXIF header
      if (offset + 10 < dataView.byteLength) {
        const exifHeader = String.fromCharCode(
          dataView.getUint8(offset + 4),
          dataView.getUint8(offset + 5),
          dataView.getUint8(offset + 6),
          dataView.getUint8(offset + 7)
        );
        
        if (exifHeader === 'Exif') {
          await parseExifIFD(dataView, offset + 10, metadata);
        }
      }
      
      offset += 2 + segmentLength;
    } else if (marker === 0xFFE0) { // APP0 (JFIF)
      markers['APP0_JFIF'] = offset;
      const segmentLength = dataView.getUint16(offset + 2);
      offset += 2 + segmentLength;
    } else if (marker === 0xFFC0 || marker === 0xFFC2) { // SOF0/SOF2
      metadata.height = dataView.getUint16(offset + 5);
      metadata.width = dataView.getUint16(offset + 7);
      metadata.bitsPerSample = dataView.getUint8(offset + 4);
      const segmentLength = dataView.getUint16(offset + 2);
      offset += 2 + segmentLength;
    } else if ((marker & 0xFF00) !== 0xFF00) {
      break;
    } else {
      const segmentLength = dataView.getUint16(offset + 2);
      offset += 2 + segmentLength;
    }
  }
  
  // Store marker presence for anomaly detection
  metadata.rawExif = { ...metadata.rawExif, markers };
}

/**
 * Parse EXIF IFD entries
 */
async function parseExifIFD(dataView: DataView, tiffStart: number, metadata: ExtendedMetadata): Promise<void> {
  try {
    // Determine byte order
    const byteOrder = dataView.getUint16(tiffStart);
    const littleEndian = byteOrder === 0x4949; // 'II'
    
    // Get IFD0 offset
    const ifd0Offset = dataView.getUint32(tiffStart + 4, littleEndian);
    const ifd0Start = tiffStart + ifd0Offset;
    
    if (ifd0Start >= dataView.byteLength) return;
    
    const entryCount = dataView.getUint16(ifd0Start, littleEndian);
    
    for (let i = 0; i < entryCount && ifd0Start + 2 + i * 12 + 12 <= dataView.byteLength; i++) {
      const entryOffset = ifd0Start + 2 + i * 12;
      const tag = dataView.getUint16(entryOffset, littleEndian);
      const type = dataView.getUint16(entryOffset + 2, littleEndian);
      const count = dataView.getUint32(entryOffset + 4, littleEndian);
      
      // Extract common tags
      switch (tag) {
        case 0x010F: // Make
          metadata.make = readExifString(dataView, entryOffset + 8, count, tiffStart, littleEndian);
          break;
        case 0x0110: // Model
          metadata.model = readExifString(dataView, entryOffset + 8, count, tiffStart, littleEndian);
          break;
        case 0x0131: // Software
          metadata.software = readExifString(dataView, entryOffset + 8, count, tiffStart, littleEndian);
          break;
        case 0x0132: // DateTime
          metadata.dateTime = readExifString(dataView, entryOffset + 8, count, tiffStart, littleEndian);
          break;
      }
    }
  } catch (e) {
    console.warn('EXIF IFD parsing error:', e);
  }
}

function readExifString(dataView: DataView, offset: number, count: number, tiffStart: number, littleEndian: boolean): string {
  let str = '';
  try {
    const actualOffset = count > 4 
      ? tiffStart + dataView.getUint32(offset, littleEndian)
      : offset;
    
    for (let i = 0; i < Math.min(count - 1, 100); i++) {
      if (actualOffset + i >= dataView.byteLength) break;
      const char = dataView.getUint8(actualOffset + i);
      if (char === 0) break;
      str += String.fromCharCode(char);
    }
  } catch (e) {
    // Ignore read errors
  }
  return str.trim();
}

/**
 * Parse PNG metadata chunks
 */
async function parsePngMetadata(dataView: DataView, metadata: ExtendedMetadata): Promise<void> {
  let offset = 8; // Skip PNG signature
  
  while (offset < dataView.byteLength - 12) {
    const chunkLength = dataView.getUint32(offset);
    const chunkType = String.fromCharCode(
      dataView.getUint8(offset + 4),
      dataView.getUint8(offset + 5),
      dataView.getUint8(offset + 6),
      dataView.getUint8(offset + 7)
    );
    
    if (chunkType === 'IHDR') {
      metadata.width = dataView.getUint32(offset + 8);
      metadata.height = dataView.getUint32(offset + 12);
      metadata.bitsPerSample = dataView.getUint8(offset + 16);
    } else if (chunkType === 'tEXt' || chunkType === 'iTXt') {
      // Text metadata - check for AI generation markers
      try {
        let text = '';
        for (let i = 0; i < chunkLength && offset + 8 + i < dataView.byteLength; i++) {
          text += String.fromCharCode(dataView.getUint8(offset + 8 + i));
        }
        
        if (text.toLowerCase().includes('parameters') || text.toLowerCase().includes('prompt')) {
          metadata.aiGenerationPrompt = text.substring(0, 500);
        }
        if (text.toLowerCase().includes('seed')) {
          const seedMatch = text.match(/seed[:\s]+(\d+)/i);
          if (seedMatch) metadata.aiGenerationSeed = seedMatch[1];
        }
      } catch (e) {
        // Ignore text parsing errors
      }
    } else if (chunkType === 'IEND') {
      break;
    }
    
    offset += 12 + chunkLength;
  }
  
  metadata.compression = 'PNG';
}

/**
 * Analyze metadata for anomalies
 */
export function analyzeMetadataAnomalies(
  metadata: ExtendedMetadata,
  fileName: string
): MetadataPattern[] {
  const patterns: MetadataPattern[] = [];
  
  // Check for missing EXIF (suspicious for camera photos)
  const isLikelyPhoto = /\.(jpg|jpeg|heic|raw|cr2|nef|arw)$/i.test(fileName);
  if (isLikelyPhoto && !metadata.make && !metadata.model && !metadata.dateTimeOriginal) {
    patterns.push({
      type: 'exif_missing',
      signature: hashPattern({ missing: true, extension: fileName.split('.').pop() }),
      data: { fileName, extension: fileName.split('.').pop() },
      rarity: 30,
      isSuspicious: true,
    });
  }
  
  // Check for AI generation software
  if (metadata.software) {
    for (const pattern of AI_GENERATOR_PATTERNS) {
      if (pattern.test(metadata.software)) {
        patterns.push({
          type: 'software_ai',
          signature: hashPattern({ software: metadata.software }),
          data: { software: metadata.software, matched: pattern.source },
          rarity: 5,
          isSuspicious: true,
        });
        break;
      }
    }
    
    // Check for deepfake tools
    for (const pattern of DEEPFAKE_TOOL_PATTERNS) {
      if (pattern.test(metadata.software)) {
        patterns.push({
          type: 'software_deepfake',
          signature: hashPattern({ software: metadata.software, type: 'deepfake' }),
          data: { software: metadata.software, matched: pattern.source },
          rarity: 2,
          isSuspicious: true,
        });
        break;
      }
    }
    
    // Check for unknown software (potentially novel AI tool)
    const isKnownEditor = EDITOR_PATTERNS.some(p => p.test(metadata.software!));
    const isKnownAI = AI_GENERATOR_PATTERNS.some(p => p.test(metadata.software!));
    const isKnownDeepfake = DEEPFAKE_TOOL_PATTERNS.some(p => p.test(metadata.software!));
    
    if (!isKnownEditor && !isKnownAI && !isKnownDeepfake && metadata.software.length > 3) {
      patterns.push({
        type: 'software_unknown',
        signature: hashPattern({ software: metadata.software }),
        data: { software: metadata.software },
        rarity: 80,
        isSuspicious: false, // Unknown isn't automatically suspicious
      });
    }
  }
  
  // Check for AI generation markers in PNG
  if (metadata.aiGenerationPrompt || metadata.aiGenerationSeed) {
    patterns.push({
      type: 'software_ai',
      signature: hashPattern({ prompt: !!metadata.aiGenerationPrompt, seed: metadata.aiGenerationSeed }),
      data: { 
        hasPrompt: !!metadata.aiGenerationPrompt, 
        seed: metadata.aiGenerationSeed,
        promptPreview: metadata.aiGenerationPrompt?.substring(0, 100),
      },
      rarity: 3,
      isSuspicious: true,
    });
  }
  
  // Check suspicious filename patterns
  for (const pattern of SUSPICIOUS_FILENAME_PATTERNS) {
    if (pattern.test(fileName)) {
      patterns.push({
        type: 'filename_ai',
        signature: hashPattern({ filename: fileName, pattern: pattern.source }),
        data: { fileName, matchedPattern: pattern.source },
        rarity: 15,
        isSuspicious: true,
      });
      break;
    }
  }
  
  // Check for timestamp anomalies
  if (metadata.dateTime) {
    const date = new Date(metadata.dateTime.replace(/:/g, '-').replace(' ', 'T'));
    const now = new Date();
    
    if (date > now) {
      patterns.push({
        type: 'timestamp_future',
        signature: hashPattern({ future: true, date: metadata.dateTime }),
        data: { dateTime: metadata.dateTime },
        rarity: 95,
        isSuspicious: true,
      });
    }
    
    // Impossibly old digital photo (before digital cameras existed)
    if (date.getFullYear() < 1990) {
      patterns.push({
        type: 'timestamp_impossible',
        signature: hashPattern({ impossible: true, year: date.getFullYear() }),
        data: { dateTime: metadata.dateTime, year: date.getFullYear() },
        rarity: 98,
        isSuspicious: true,
      });
    }
  }
  
  // Check for unusual dimensions (common in AI outputs)
  const aiDimensions = [
    [512, 512], [768, 768], [1024, 1024], [2048, 2048],
    [512, 768], [768, 512], [1024, 768], [768, 1024],
    [1920, 1080], [1080, 1920], [1920, 1920],
  ];
  
  if (metadata.width && metadata.height) {
    const isAIDimension = aiDimensions.some(
      ([w, h]) => metadata.width === w && metadata.height === h
    );
    
    if (isAIDimension) {
      patterns.push({
        type: 'dimension_unusual',
        signature: hashPattern({ width: metadata.width, height: metadata.height }),
        data: { width: metadata.width, height: metadata.height },
        rarity: 20,
        isSuspicious: false, // Common dimensions aren't conclusive
      });
    }
  }
  
  return patterns;
}

/**
 * Generate a simple hash for pattern deduplication
 */
function hashPattern(data: Record<string, unknown>): string {
  const str = JSON.stringify(data, Object.keys(data).sort());
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(36);
}

/**
 * Track anomaly in database for ML improvement
 */
export async function trackAnomaly(
  pattern: MetadataPattern,
  detectionContext: 'deepfake' | 'authentic' | 'unknown',
  fileName: string
): Promise<void> {
  try {
    // Check if pattern already exists
    const { data: existing } = await supabase
      .from('metadata_anomalies')
      .select('id, occurrence_count, example_file_names')
      .eq('pattern_signature', pattern.signature)
      .single();
    
    if (existing) {
      // Update occurrence count
      const fileNames = existing.example_file_names || [];
      if (!fileNames.includes(fileName) && fileNames.length < 10) {
        fileNames.push(fileName);
      }
      
      await supabase
        .from('metadata_anomalies')
        .update({
          occurrence_count: existing.occurrence_count + 1,
          last_seen: new Date().toISOString(),
          example_file_names: fileNames,
        })
        .eq('id', existing.id);
    } else {
      // Insert new pattern
      await supabase
        .from('metadata_anomalies')
        .insert([{
          anomaly_type: pattern.type,
          pattern_signature: pattern.signature,
          pattern_data: pattern.data as unknown as Record<string, never>,
          rarity_score: pattern.rarity,
          is_suspicious: pattern.isSuspicious,
          detection_context: detectionContext,
          example_file_names: [fileName],
        }]);
    }
  } catch (e) {
    console.warn('Failed to track anomaly:', e);
  }
}

/**
 * Get rare/never-seen-before patterns
 */
export async function getRarePatterns(limit = 20): Promise<MetadataPattern[]> {
  try {
    const { data } = await supabase
      .from('metadata_anomalies')
      .select('*')
      .order('rarity_score', { ascending: false })
      .limit(limit);
    
    return (data || []).map(row => ({
      type: row.anomaly_type as AnomalyType,
      signature: row.pattern_signature,
      data: row.pattern_data as Record<string, unknown>,
      rarity: row.rarity_score || 0,
      isSuspicious: row.is_suspicious || false,
    }));
  } catch (e) {
    console.warn('Failed to fetch rare patterns:', e);
    return [];
  }
}

/**
 * Generate full anomaly report
 */
export async function generateAnomalyReport(
  metadata: ExtendedMetadata,
  fileName: string,
  detectionContext: 'deepfake' | 'authentic' | 'unknown' = 'unknown'
): Promise<AnomalyReport> {
  const patterns = analyzeMetadataAnomalies(metadata, fileName);
  
  // Track all patterns for ML
  for (const pattern of patterns) {
    await trackAnomaly(pattern, detectionContext, fileName);
  }
  
  // Calculate overall risk score
  let riskScore = 0;
  const suspiciousPatterns = patterns.filter(p => p.isSuspicious);
  
  if (suspiciousPatterns.length > 0) {
    // Weight by rarity (rare suspicious patterns are more concerning)
    riskScore = Math.min(100, suspiciousPatterns.reduce((sum, p) => {
      return sum + (100 - p.rarity) / suspiciousPatterns.length;
    }, 0) + suspiciousPatterns.length * 10);
  }
  
  // Generate recommendations
  const recommendations: string[] = [];
  
  if (patterns.some(p => p.type === 'software_ai')) {
    recommendations.push('AI generation software detected - high likelihood of synthetic content');
  }
  if (patterns.some(p => p.type === 'software_deepfake')) {
    recommendations.push('Deepfake tool signature found - treat with extreme caution');
  }
  if (patterns.some(p => p.type === 'exif_missing')) {
    recommendations.push('Missing EXIF data suggests stripped metadata or screenshot');
  }
  if (patterns.some(p => p.type === 'filename_ai')) {
    recommendations.push('Filename patterns suggest AI-generated origin');
  }
  if (patterns.some(p => p.type.includes('timestamp'))) {
    recommendations.push('Timestamp anomalies indicate potential manipulation');
  }
  
  // Find never-seen-before patterns (rarity > 90)
  const neverSeenBefore = patterns.filter(p => p.rarity > 90);
  
  return {
    patterns,
    overallRiskScore: Math.round(riskScore),
    recommendations,
    neverSeenBefore,
    knownSuspicious: suspiciousPatterns,
  };
}

/**
 * Get known software signatures from database
 */
export async function getKnownSoftwareSignatures(): Promise<Array<{
  name: string;
  category: string;
  riskLevel: string;
}>> {
  try {
    const { data } = await supabase
      .from('known_software_signatures')
      .select('software_name, category, risk_level')
      .order('occurrence_count', { ascending: false });
    
    return (data || []).map(row => ({
      name: row.software_name,
      category: row.category,
      riskLevel: row.risk_level,
    }));
  } catch (e) {
    console.warn('Failed to fetch software signatures:', e);
    return [];
  }
}
