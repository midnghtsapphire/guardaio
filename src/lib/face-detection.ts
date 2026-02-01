/**
 * Face Detection and Analysis Library
 * Uses @vladmandic/face-api for face detection, landmarks, and expressions
 * Provides deepfake-specific analysis features
 */

import * as faceapi from '@vladmandic/face-api';

export interface FaceDetectionResult {
  facesDetected: number;
  faces: FaceAnalysis[];
  symmetryScore: number;
  overallScore: number;
  anomalies: string[];
  landmarkOverlayUrl: string | null;
}

export interface FaceAnalysis {
  id: number;
  box: { x: number; y: number; width: number; height: number };
  landmarks: { points: number; quality: 'good' | 'poor' | 'suspicious' };
  expressions: Record<string, number>;
  symmetry: number;
  blurScore: number;
  anomalies: string[];
}

let modelsLoaded = false;
let loadingPromise: Promise<void> | null = null;

const MODEL_URL = 'https://cdn.jsdelivr.net/npm/@vladmandic/face-api@1.7.13/model';

/**
 * Load face-api.js models (only once)
 */
export async function loadFaceApiModels(): Promise<void> {
  if (modelsLoaded) return;
  
  if (loadingPromise) {
    await loadingPromise;
    return;
  }
  
  loadingPromise = (async () => {
    try {
      await Promise.all([
        faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL),
        faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
        faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL),
        faceapi.nets.ageGenderNet.loadFromUri(MODEL_URL),
      ]);
      modelsLoaded = true;
      console.log('Face-API models loaded successfully');
    } catch (error) {
      console.error('Failed to load face-api models:', error);
      loadingPromise = null;
      throw error;
    }
  })();
  
  await loadingPromise;
}

/**
 * Calculate facial symmetry score
 * Deepfakes often have subtle asymmetries
 */
function calculateSymmetry(landmarks: faceapi.FaceLandmarks68): number {
  const points = landmarks.positions;
  
  if (points.length < 68) return 0.5;
  
  // Get nose tip as center reference
  const noseTip = points[30];
  
  // Compare symmetric point pairs
  const symmetryPairs = [
    [0, 16],   // Jaw outline
    [1, 15],
    [2, 14],
    [3, 13],
    [4, 12],
    [5, 11],
    [6, 10],
    [7, 9],
    [17, 26],  // Eyebrows
    [18, 25],
    [19, 24],
    [20, 23],
    [21, 22],
    [36, 45],  // Eyes
    [37, 44],
    [38, 43],
    [39, 42],
    [40, 47],
    [41, 46],
    [31, 35],  // Nose
    [32, 34],
    [48, 54],  // Mouth
    [49, 53],
    [50, 52],
    [59, 55],
    [58, 56],
  ];
  
  let totalDiff = 0;
  let validPairs = 0;
  
  for (const [leftIdx, rightIdx] of symmetryPairs) {
    const left = points[leftIdx];
    const right = points[rightIdx];
    
    // Calculate distance from center line
    const leftDist = Math.abs(left.x - noseTip.x);
    const rightDist = Math.abs(right.x - noseTip.x);
    
    // Compare y positions
    const yDiff = Math.abs(left.y - right.y);
    
    // Compare distances from center
    const xDiff = Math.abs(leftDist - rightDist);
    
    totalDiff += xDiff + yDiff;
    validPairs++;
  }
  
  // Normalize to 0-1 score (1 = perfect symmetry)
  const avgDiff = totalDiff / validPairs;
  const normalizedScore = 1 - Math.min(1, avgDiff / 20);
  
  return normalizedScore;
}

/**
 * Analyze facial landmark quality
 */
function analyzeLandmarkQuality(
  landmarks: faceapi.FaceLandmarks68,
  faceBox: faceapi.Box
): { points: number; quality: 'good' | 'poor' | 'suspicious' } {
  const points = landmarks.positions;
  
  // Check if landmarks are within expected ranges
  let outOfBounds = 0;
  
  for (const point of points) {
    if (
      point.x < faceBox.x - faceBox.width * 0.2 ||
      point.x > faceBox.x + faceBox.width * 1.2 ||
      point.y < faceBox.y - faceBox.height * 0.2 ||
      point.y > faceBox.y + faceBox.height * 1.2
    ) {
      outOfBounds++;
    }
  }
  
  const quality = outOfBounds > 5 
    ? 'suspicious' 
    : outOfBounds > 2 
      ? 'poor' 
      : 'good';
  
  return { points: points.length, quality };
}

/**
 * Calculate blur score for face region
 */
function calculateBlurScore(
  imageElement: HTMLImageElement,
  box: faceapi.Box
): number {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d')!;
  
  // Extract face region
  const padding = 10;
  const x = Math.max(0, box.x - padding);
  const y = Math.max(0, box.y - padding);
  const w = Math.min(imageElement.naturalWidth - x, box.width + padding * 2);
  const h = Math.min(imageElement.naturalHeight - y, box.height + padding * 2);
  
  canvas.width = w;
  canvas.height = h;
  
  ctx.drawImage(imageElement, x, y, w, h, 0, 0, w, h);
  
  const imageData = ctx.getImageData(0, 0, w, h);
  const data = imageData.data;
  
  // Calculate Laplacian variance (blur metric)
  let variance = 0;
  let count = 0;
  
  for (let py = 1; py < h - 1; py++) {
    for (let px = 1; px < w - 1; px++) {
      const idx = (py * w + px) * 4;
      
      const center = (data[idx] + data[idx + 1] + data[idx + 2]) / 3;
      const top = (data[idx - w * 4] + data[idx - w * 4 + 1] + data[idx - w * 4 + 2]) / 3;
      const bottom = (data[idx + w * 4] + data[idx + w * 4 + 1] + data[idx + w * 4 + 2]) / 3;
      const left = (data[idx - 4] + data[idx - 3] + data[idx - 2]) / 3;
      const right = (data[idx + 4] + data[idx + 5] + data[idx + 6]) / 3;
      
      const laplacian = Math.abs(4 * center - top - bottom - left - right);
      variance += laplacian * laplacian;
      count++;
    }
  }
  
  // Higher variance = sharper image
  const avgVariance = variance / count;
  
  // Normalize to 0-100 (100 = very sharp, 0 = very blurry)
  return Math.min(100, avgVariance / 10);
}

/**
 * Draw face landmarks overlay on image
 */
async function drawLandmarksOverlay(
  imageElement: HTMLImageElement,
  detections: faceapi.WithFaceLandmarks<{ detection: faceapi.FaceDetection }, faceapi.FaceLandmarks68>[]
): Promise<string | null> {
  if (detections.length === 0) return null;
  
  const canvas = document.createElement('canvas');
  canvas.width = imageElement.naturalWidth;
  canvas.height = imageElement.naturalHeight;
  const ctx = canvas.getContext('2d')!;
  
  // Draw original image
  ctx.drawImage(imageElement, 0, 0);
  
  // Draw landmarks and boxes
  for (const detection of detections) {
    const box = detection.detection.box;
    const landmarks = detection.landmarks;
    
    // Draw face box
    ctx.strokeStyle = '#00ff00';
    ctx.lineWidth = 2;
    ctx.strokeRect(box.x, box.y, box.width, box.height);
    
    // Draw landmark points
    ctx.fillStyle = '#ff0000';
    for (const point of landmarks.positions) {
      ctx.beginPath();
      ctx.arc(point.x, point.y, 2, 0, 2 * Math.PI);
      ctx.fill();
    }
    
    // Draw landmark connections
    ctx.strokeStyle = 'rgba(0, 255, 255, 0.5)';
    ctx.lineWidth = 1;
    
    // Jaw line
    const jawPoints = landmarks.getJawOutline();
    ctx.beginPath();
    ctx.moveTo(jawPoints[0].x, jawPoints[0].y);
    for (let i = 1; i < jawPoints.length; i++) {
      ctx.lineTo(jawPoints[i].x, jawPoints[i].y);
    }
    ctx.stroke();
    
    // Left eye
    const leftEye = landmarks.getLeftEye();
    ctx.beginPath();
    ctx.moveTo(leftEye[0].x, leftEye[0].y);
    for (let i = 1; i < leftEye.length; i++) {
      ctx.lineTo(leftEye[i].x, leftEye[i].y);
    }
    ctx.closePath();
    ctx.stroke();
    
    // Right eye
    const rightEye = landmarks.getRightEye();
    ctx.beginPath();
    ctx.moveTo(rightEye[0].x, rightEye[0].y);
    for (let i = 1; i < rightEye.length; i++) {
      ctx.lineTo(rightEye[i].x, rightEye[i].y);
    }
    ctx.closePath();
    ctx.stroke();
    
    // Nose
    const nose = landmarks.getNose();
    ctx.beginPath();
    ctx.moveTo(nose[0].x, nose[0].y);
    for (let i = 1; i < nose.length; i++) {
      ctx.lineTo(nose[i].x, nose[i].y);
    }
    ctx.stroke();
    
    // Mouth
    const mouth = landmarks.getMouth();
    ctx.beginPath();
    ctx.moveTo(mouth[0].x, mouth[0].y);
    for (let i = 1; i < mouth.length; i++) {
      ctx.lineTo(mouth[i].x, mouth[i].y);
    }
    ctx.closePath();
    ctx.stroke();
  }
  
  return canvas.toDataURL('image/png');
}

/**
 * Detect and analyze faces in an image
 */
export async function detectFaces(imageElement: HTMLImageElement): Promise<FaceDetectionResult> {
  await loadFaceApiModels();
  
  // Detect faces with landmarks and expressions
  const detections = await faceapi
    .detectAllFaces(imageElement, new faceapi.SsdMobilenetv1Options({ minConfidence: 0.5 }))
    .withFaceLandmarks()
    .withFaceExpressions();
  
  const anomalies: string[] = [];
  const faces: FaceAnalysis[] = [];
  let totalSymmetry = 0;
  
  for (let i = 0; i < detections.length; i++) {
    const detection = detections[i];
    const box = detection.detection.box;
    const landmarks = detection.landmarks;
    const expressions = detection.expressions;
    
    const symmetry = calculateSymmetry(landmarks);
    const landmarkQuality = analyzeLandmarkQuality(landmarks, box);
    const blurScore = calculateBlurScore(imageElement, box);
    
    const faceAnomalies: string[] = [];
    
    // Check for suspicious patterns
    if (symmetry < 0.7) {
      faceAnomalies.push('Unusual facial asymmetry');
    }
    if (landmarkQuality.quality === 'suspicious') {
      faceAnomalies.push('Landmark positioning anomalies');
    }
    if (blurScore < 20) {
      faceAnomalies.push('Face region appears blurred');
    }
    if (blurScore > 90 && symmetry > 0.95) {
      faceAnomalies.push('Unnaturally sharp and symmetric (possible AI generation)');
    }
    
    // Expression analysis - convert to plain object for iteration
    const expressionObj: Record<string, number> = {};
    for (const [key, value] of Object.entries(expressions)) {
      expressionObj[key] = value as number;
    }
    const expressionEntries = Object.entries(expressionObj);
    const dominantExpression = expressionEntries.reduce((a, b) => a[1] > b[1] ? a : b);
    
    // Neutral expression with very high confidence can indicate AI generation
    if (dominantExpression[0] === 'neutral' && dominantExpression[1] > 0.95) {
      faceAnomalies.push('Unnaturally neutral expression');
    }

    faces.push({
      id: i + 1,
      box: {
        x: (box.x / imageElement.naturalWidth) * 100,
        y: (box.y / imageElement.naturalHeight) * 100,
        width: (box.width / imageElement.naturalWidth) * 100,
        height: (box.height / imageElement.naturalHeight) * 100,
      },
      landmarks: landmarkQuality,
      expressions: expressionObj,
      symmetry,
      blurScore,
      anomalies: faceAnomalies,
    });
    
    totalSymmetry += symmetry;
    anomalies.push(...faceAnomalies);
  }
  
  // Generate landmark overlay
  const landmarkOverlayUrl = await drawLandmarksOverlay(imageElement, detections);
  
  // Overall analysis
  if (detections.length === 0) {
    anomalies.push('No faces detected');
  }
  
  const avgSymmetry = detections.length > 0 ? totalSymmetry / detections.length : 0;
  
  // Calculate overall score (0-100, higher = more suspicious)
  let overallScore = 0;
  
  if (detections.length === 0) {
    overallScore = 0; // No faces to analyze
  } else {
    const symmetryPenalty = (1 - avgSymmetry) * 30;
    const anomalyPenalty = Math.min(40, anomalies.length * 10);
    overallScore = Math.min(100, symmetryPenalty + anomalyPenalty);
  }
  
  return {
    facesDetected: detections.length,
    faces,
    symmetryScore: avgSymmetry,
    overallScore: Math.round(overallScore),
    anomalies: [...new Set(anomalies)], // Remove duplicates
    landmarkOverlayUrl,
  };
}

/**
 * Quick check if models are loaded
 */
export function areModelsLoaded(): boolean {
  return modelsLoaded;
}
