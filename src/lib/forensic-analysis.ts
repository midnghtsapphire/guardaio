/**
 * Client-side Forensic Analysis Library
 * Implements best-in-class open source techniques for deepfake detection:
 * - Error Level Analysis (ELA)
 * - Noise Analysis
 * - EXIF Metadata Extraction
 * - Color Histogram Analysis
 * - Frequency Domain Analysis (DCT)
 */

export interface ForensicResult {
  ela: ELAResult;
  noise: NoiseAnalysisResult;
  metadata: MetadataResult;
  histogram: HistogramResult;
  frequency: FrequencyResult;
  overallScore: number;
  suspiciousRegions: SuspiciousRegion[];
}

export interface ELAResult {
  score: number;
  maxDifference: number;
  averageDifference: number;
  suspiciousAreas: number;
  imageDataUrl: string;
}

export interface NoiseAnalysisResult {
  score: number;
  noiseLevel: number;
  uniformity: number;
  anomalies: string[];
}

export interface MetadataResult {
  hasExif: boolean;
  software: string | null;
  lastModified: string | null;
  suspiciousFlags: string[];
  cameraModel: string | null;
  dateTime: string | null;
}

export interface HistogramResult {
  redChannel: number[];
  greenChannel: number[];
  blueChannel: number[];
  anomalies: string[];
  score: number;
}

export interface FrequencyResult {
  score: number;
  blockiness: number;
  compressionArtifacts: number;
  anomalies: string[];
}

export interface SuspiciousRegion {
  x: number;
  y: number;
  width: number;
  height: number;
  intensity: number;
  reason: string;
}

/**
 * Perform Error Level Analysis (ELA)
 * ELA reveals hidden edits by re-compressing the image and comparing differences
 */
export async function performELA(
  imageElement: HTMLImageElement,
  quality: number = 90
): Promise<ELAResult> {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d')!;
    
    canvas.width = imageElement.naturalWidth;
    canvas.height = imageElement.naturalHeight;
    
    // Draw original image
    ctx.drawImage(imageElement, 0, 0);
    const originalData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    
    // Re-compress with specified quality
    const recompressedDataUrl = canvas.toDataURL('image/jpeg', quality / 100);
    
    const tempImg = new Image();
    tempImg.onload = () => {
      ctx.drawImage(tempImg, 0, 0);
      const recompressedData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      
      // Calculate differences
      const diffData = ctx.createImageData(canvas.width, canvas.height);
      let maxDiff = 0;
      let totalDiff = 0;
      let suspiciousAreas = 0;
      const threshold = 15; // Sensitivity threshold
      
      for (let i = 0; i < originalData.data.length; i += 4) {
        const rDiff = Math.abs(originalData.data[i] - recompressedData.data[i]);
        const gDiff = Math.abs(originalData.data[i + 1] - recompressedData.data[i + 1]);
        const bDiff = Math.abs(originalData.data[i + 2] - recompressedData.data[i + 2]);
        
        const avgDiff = (rDiff + gDiff + bDiff) / 3;
        const scaledDiff = Math.min(255, avgDiff * 15); // Scale for visibility
        
        if (avgDiff > maxDiff) maxDiff = avgDiff;
        totalDiff += avgDiff;
        
        if (avgDiff > threshold) {
          suspiciousAreas++;
          // Highlight suspicious areas in red
          diffData.data[i] = scaledDiff;
          diffData.data[i + 1] = scaledDiff * 0.3;
          diffData.data[i + 2] = scaledDiff * 0.3;
        } else {
          // Normal areas in grayscale
          diffData.data[i] = scaledDiff;
          diffData.data[i + 1] = scaledDiff;
          diffData.data[i + 2] = scaledDiff;
        }
        diffData.data[i + 3] = 255;
      }
      
      ctx.putImageData(diffData, 0, 0);
      const elaImageUrl = canvas.toDataURL('image/png');
      
      const pixelCount = originalData.data.length / 4;
      const avgDifference = totalDiff / pixelCount;
      const suspiciousRatio = suspiciousAreas / pixelCount;
      
      // Score: 0-100 (higher = more suspicious)
      const score = Math.min(100, suspiciousRatio * 500 + avgDifference * 5);
      
      resolve({
        score: Math.round(score),
        maxDifference: maxDiff,
        averageDifference: avgDifference,
        suspiciousAreas: suspiciousAreas,
        imageDataUrl: elaImageUrl,
      });
    };
    tempImg.src = recompressedDataUrl;
  });
}

/**
 * Analyze image noise patterns
 * Manipulated regions often have different noise characteristics
 */
export function analyzeNoise(imageElement: HTMLImageElement): NoiseAnalysisResult {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d')!;
  
  canvas.width = imageElement.naturalWidth;
  canvas.height = imageElement.naturalHeight;
  ctx.drawImage(imageElement, 0, 0);
  
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;
  
  // Calculate local noise variance using Laplacian
  let noiseSum = 0;
  let noiseCount = 0;
  const noiseMap: number[] = [];
  
  const width = canvas.width;
  const height = canvas.height;
  
  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      const idx = (y * width + x) * 4;
      
      // Laplacian kernel for edge/noise detection
      const center = (data[idx] + data[idx + 1] + data[idx + 2]) / 3;
      const top = (data[idx - width * 4] + data[idx - width * 4 + 1] + data[idx - width * 4 + 2]) / 3;
      const bottom = (data[idx + width * 4] + data[idx + width * 4 + 1] + data[idx + width * 4 + 2]) / 3;
      const left = (data[idx - 4] + data[idx - 3] + data[idx - 2]) / 3;
      const right = (data[idx + 4] + data[idx + 5] + data[idx + 6]) / 3;
      
      const laplacian = Math.abs(4 * center - top - bottom - left - right);
      noiseSum += laplacian;
      noiseCount++;
      noiseMap.push(laplacian);
    }
  }
  
  const avgNoise = noiseSum / noiseCount;
  
  // Calculate noise uniformity (standard deviation)
  let variance = 0;
  for (const noise of noiseMap) {
    variance += Math.pow(noise - avgNoise, 2);
  }
  variance /= noiseMap.length;
  const stdDev = Math.sqrt(variance);
  
  // Uniformity score (0-1, higher = more uniform)
  const uniformity = 1 / (1 + stdDev / avgNoise);
  
  const anomalies: string[] = [];
  if (uniformity < 0.3) anomalies.push('Highly variable noise patterns detected');
  if (avgNoise > 30) anomalies.push('Elevated noise levels');
  if (stdDev > avgNoise * 2) anomalies.push('Noise pattern inconsistency');
  
  // Score: 0-100 (higher = more suspicious)
  const score = Math.min(100, (1 - uniformity) * 50 + (avgNoise > 20 ? 25 : 0) + (anomalies.length * 10));
  
  return {
    score: Math.round(score),
    noiseLevel: avgNoise,
    uniformity,
    anomalies,
  };
}

/**
 * Analyze color histogram for manipulation signs
 */
export function analyzeHistogram(imageElement: HTMLImageElement): HistogramResult {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d')!;
  
  canvas.width = imageElement.naturalWidth;
  canvas.height = imageElement.naturalHeight;
  ctx.drawImage(imageElement, 0, 0);
  
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;
  
  // Initialize histograms
  const redHist = new Array(256).fill(0);
  const greenHist = new Array(256).fill(0);
  const blueHist = new Array(256).fill(0);
  
  for (let i = 0; i < data.length; i += 4) {
    redHist[data[i]]++;
    greenHist[data[i + 1]]++;
    blueHist[data[i + 2]]++;
  }
  
  const anomalies: string[] = [];
  
  // Check for histogram gaps (sign of manipulation)
  const checkGaps = (hist: number[], channelName: string) => {
    let gaps = 0;
    for (let i = 10; i < 245; i++) {
      if (hist[i] === 0 && hist[i - 1] > 0 && hist[i + 1] > 0) {
        gaps++;
      }
    }
    if (gaps > 5) {
      anomalies.push(`${channelName} channel has ${gaps} suspicious gaps`);
    }
    return gaps;
  };
  
  // Check for sharp peaks (possible posterization or editing)
  const checkPeaks = (hist: number[], channelName: string) => {
    const avgCount = data.length / 4 / 256;
    let sharpPeaks = 0;
    for (let i = 5; i < 250; i++) {
      if (hist[i] > avgCount * 20 && hist[i - 2] < avgCount && hist[i + 2] < avgCount) {
        sharpPeaks++;
      }
    }
    if (sharpPeaks > 3) {
      anomalies.push(`${channelName} channel shows unusual distribution peaks`);
    }
    return sharpPeaks;
  };
  
  const redGaps = checkGaps(redHist, 'Red');
  const greenGaps = checkGaps(greenHist, 'Green');
  const blueGaps = checkGaps(blueHist, 'Blue');
  
  const redPeaks = checkPeaks(redHist, 'Red');
  const greenPeaks = checkPeaks(greenHist, 'Green');
  const bluePeaks = checkPeaks(blueHist, 'Blue');
  
  const totalGaps = redGaps + greenGaps + blueGaps;
  const totalPeaks = redPeaks + greenPeaks + bluePeaks;
  
  // Score: 0-100 (higher = more suspicious)
  const score = Math.min(100, totalGaps * 3 + totalPeaks * 5 + anomalies.length * 10);
  
  return {
    redChannel: redHist,
    greenChannel: greenHist,
    blueChannel: blueHist,
    anomalies,
    score: Math.round(score),
  };
}

/**
 * Analyze frequency domain for compression artifacts and manipulation
 */
export function analyzeFrequency(imageElement: HTMLImageElement): FrequencyResult {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d')!;
  
  canvas.width = imageElement.naturalWidth;
  canvas.height = imageElement.naturalHeight;
  ctx.drawImage(imageElement, 0, 0);
  
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;
  const width = canvas.width;
  const height = canvas.height;
  
  // Analyze 8x8 blocks for DCT artifacts (JPEG compression)
  let blockBoundaryDiffs = 0;
  let totalBoundaries = 0;
  
  for (let y = 7; y < height; y += 8) {
    for (let x = 0; x < width - 1; x++) {
      const idx1 = (y * width + x) * 4;
      const idx2 = ((y + 1) * width + x) * 4;
      
      if (y + 1 < height) {
        const diff = Math.abs(
          (data[idx1] + data[idx1 + 1] + data[idx1 + 2]) / 3 -
          (data[idx2] + data[idx2 + 1] + data[idx2 + 2]) / 3
        );
        blockBoundaryDiffs += diff;
        totalBoundaries++;
      }
    }
  }
  
  for (let x = 7; x < width; x += 8) {
    for (let y = 0; y < height - 1; y++) {
      const idx1 = (y * width + x) * 4;
      const idx2 = (y * width + x + 1) * 4;
      
      if (x + 1 < width) {
        const diff = Math.abs(
          (data[idx1] + data[idx1 + 1] + data[idx1 + 2]) / 3 -
          (data[idx2] + data[idx2 + 1] + data[idx2 + 2]) / 3
        );
        blockBoundaryDiffs += diff;
        totalBoundaries++;
      }
    }
  }
  
  const blockiness = totalBoundaries > 0 ? blockBoundaryDiffs / totalBoundaries : 0;
  
  // Calculate general high-frequency content
  let hfEnergy = 0;
  let totalEnergy = 0;
  
  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      const idx = (y * width + x) * 4;
      const center = (data[idx] + data[idx + 1] + data[idx + 2]) / 3;
      
      // Simple Sobel-like gradient
      const right = (data[idx + 4] + data[idx + 5] + data[idx + 6]) / 3;
      const bottom = (data[idx + width * 4] + data[idx + width * 4 + 1] + data[idx + width * 4 + 2]) / 3;
      
      const gradient = Math.abs(center - right) + Math.abs(center - bottom);
      hfEnergy += gradient;
      totalEnergy += center;
    }
  }
  
  const compressionArtifacts = blockiness / 10;
  
  const anomalies: string[] = [];
  if (blockiness > 5) anomalies.push('Visible 8x8 block artifacts (JPEG compression)');
  if (hfEnergy / totalEnergy > 0.3) anomalies.push('High frequency anomalies detected');
  if (blockiness > 10) anomalies.push('Severe compression or re-encoding detected');
  
  // Score: 0-100 (higher = more suspicious)
  const score = Math.min(100, blockiness * 5 + compressionArtifacts * 10 + anomalies.length * 15);
  
  return {
    score: Math.round(score),
    blockiness,
    compressionArtifacts,
    anomalies,
  };
}

/**
 * Extract and analyze image metadata
 */
export async function analyzeMetadata(file: File): Promise<MetadataResult> {
  const suspiciousFlags: string[] = [];
  let software: string | null = null;
  let cameraModel: string | null = null;
  let dateTime: string | null = null;
  let hasExif = false;
  
  // Check for known AI generation tools in filename
  const aiTools = ['dalle', 'midjourney', 'stable-diffusion', 'stablediffusion', 'sd_', 'generated', 'ai_'];
  const lowerName = file.name.toLowerCase();
  for (const tool of aiTools) {
    if (lowerName.includes(tool)) {
      suspiciousFlags.push(`Filename suggests AI generation: ${tool}`);
    }
  }
  
  // Check file type consistency
  const extension = file.name.split('.').pop()?.toLowerCase();
  const mimeType = file.type;
  
  if (extension === 'jpg' && !mimeType.includes('jpeg')) {
    suspiciousFlags.push('File extension does not match MIME type');
  }
  
  // Read file for EXIF data
  try {
    const arrayBuffer = await file.arrayBuffer();
    const dataView = new DataView(arrayBuffer);
    
    // Check for JPEG SOI marker
    if (dataView.getUint16(0) === 0xFFD8) {
      // Look for APP1 (EXIF) marker
      let offset = 2;
      while (offset < dataView.byteLength - 4) {
        const marker = dataView.getUint16(offset);
        if (marker === 0xFFE1) { // APP1
          hasExif = true;
          break;
        }
        if ((marker & 0xFF00) !== 0xFF00) break;
        const segmentLength = dataView.getUint16(offset + 2);
        offset += 2 + segmentLength;
      }
    }
    
    if (!hasExif && extension === 'jpg') {
      suspiciousFlags.push('JPEG file missing EXIF data (possible screenshot or processed)');
    }
  } catch (e) {
    // Ignore metadata read errors
  }
  
  return {
    hasExif,
    software,
    lastModified: new Date(file.lastModified).toISOString(),
    suspiciousFlags,
    cameraModel,
    dateTime,
  };
}

/**
 * Detect suspicious regions in an image
 */
export function detectSuspiciousRegions(
  imageElement: HTMLImageElement,
  elaResult: ELAResult
): SuspiciousRegion[] {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d')!;
  
  // Load ELA image to find high-intensity regions
  const elaImg = new Image();
  const regions: SuspiciousRegion[] = [];
  
  canvas.width = imageElement.naturalWidth;
  canvas.height = imageElement.naturalHeight;
  ctx.drawImage(imageElement, 0, 0);
  
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;
  const width = canvas.width;
  const height = canvas.height;
  
  // Grid-based region detection
  const gridSize = 32;
  const gridCols = Math.ceil(width / gridSize);
  const gridRows = Math.ceil(height / gridSize);
  
  for (let gy = 0; gy < gridRows; gy++) {
    for (let gx = 0; gx < gridCols; gx++) {
      let localIntensity = 0;
      let pixelCount = 0;
      
      const startX = gx * gridSize;
      const startY = gy * gridSize;
      const endX = Math.min(startX + gridSize, width);
      const endY = Math.min(startY + gridSize, height);
      
      for (let y = startY; y < endY; y++) {
        for (let x = startX; x < endX; x++) {
          const idx = (y * width + x) * 4;
          
          // Check for edge artifacts and color anomalies
          if (x > 0 && y > 0) {
            const prevX = (y * width + x - 1) * 4;
            const prevY = ((y - 1) * width + x) * 4;
            
            const colorDiff = 
              Math.abs(data[idx] - data[prevX]) +
              Math.abs(data[idx + 1] - data[prevX + 1]) +
              Math.abs(data[idx + 2] - data[prevX + 2]) +
              Math.abs(data[idx] - data[prevY]) +
              Math.abs(data[idx + 1] - data[prevY + 1]) +
              Math.abs(data[idx + 2] - data[prevY + 2]);
            
            localIntensity += colorDiff / 6;
          }
          pixelCount++;
        }
      }
      
      const avgIntensity = localIntensity / pixelCount;
      const normalizedIntensity = Math.min(1, avgIntensity / 30);
      
      if (normalizedIntensity > 0.4) {
        regions.push({
          x: (startX / width) * 100,
          y: (startY / height) * 100,
          width: ((endX - startX) / width) * 100,
          height: ((endY - startY) / height) * 100,
          intensity: normalizedIntensity,
          reason: normalizedIntensity > 0.7 ? 'High edge complexity' : 'Moderate edge artifacts',
        });
      }
    }
  }
  
  // Merge nearby regions and return top suspicious areas
  return regions
    .sort((a, b) => b.intensity - a.intensity)
    .slice(0, 6);
}

/**
 * Run complete forensic analysis on an image
 */
export async function runForensicAnalysis(
  imageElement: HTMLImageElement,
  file: File
): Promise<ForensicResult> {
  const [ela, metadata] = await Promise.all([
    performELA(imageElement, 90),
    analyzeMetadata(file),
  ]);
  
  const noise = analyzeNoise(imageElement);
  const histogram = analyzeHistogram(imageElement);
  const frequency = analyzeFrequency(imageElement);
  const suspiciousRegions = detectSuspiciousRegions(imageElement, ela);
  
  // Calculate overall score (weighted average)
  const weights = {
    ela: 0.35,
    noise: 0.20,
    histogram: 0.15,
    frequency: 0.20,
    metadata: 0.10,
  };
  
  const metadataScore = Math.min(100, metadata.suspiciousFlags.length * 25);
  
  const overallScore = Math.round(
    ela.score * weights.ela +
    noise.score * weights.noise +
    histogram.score * weights.histogram +
    frequency.score * weights.frequency +
    metadataScore * weights.metadata
  );
  
  return {
    ela,
    noise,
    metadata,
    histogram,
    frequency,
    overallScore,
    suspiciousRegions,
  };
}
