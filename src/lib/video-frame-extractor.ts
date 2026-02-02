/**
 * Extracts key frames from a video file for analysis
 */

export interface ExtractedFrame {
  timestamp: number;
  dataUrl: string; // data:image/jpeg;base64,...
  base64: string;  // just the base64 part
}

/**
 * Extract frames from a video file at specified intervals
 * @param file - The video file
 * @param frameCount - Number of frames to extract (default 5)
 * @returns Array of extracted frames with timestamps
 */
export async function extractVideoFrames(
  file: File,
  frameCount: number = 5
): Promise<ExtractedFrame[]> {
  return new Promise((resolve, reject) => {
    const video = document.createElement("video");
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    if (!ctx) {
      reject(new Error("Could not get canvas context"));
      return;
    }

    video.preload = "metadata";
    video.muted = true;
    video.playsInline = true;

    const frames: ExtractedFrame[] = [];
    let blobUrl: string | null = null;

    const cleanup = () => {
      if (blobUrl) {
        URL.revokeObjectURL(blobUrl);
      }
      video.src = "";
      video.load();
    };

    video.onerror = () => {
      cleanup();
      reject(new Error("Failed to load video for frame extraction"));
    };

    video.onloadedmetadata = async () => {
      const duration = video.duration;

      if (!duration || duration === Infinity || isNaN(duration)) {
        cleanup();
        reject(new Error("Could not determine video duration"));
        return;
      }

      // Set canvas to video dimensions (capped for performance)
      const maxDimension = 1024;
      const scale = Math.min(1, maxDimension / Math.max(video.videoWidth, video.videoHeight));
      canvas.width = Math.floor(video.videoWidth * scale);
      canvas.height = Math.floor(video.videoHeight * scale);

      // Calculate timestamps to extract frames from
      // Skip first and last 5% to avoid black frames
      const startTime = duration * 0.05;
      const endTime = duration * 0.95;
      const effectiveDuration = endTime - startTime;
      const interval = effectiveDuration / (frameCount - 1);

      const timestamps: number[] = [];
      for (let i = 0; i < frameCount; i++) {
        timestamps.push(startTime + interval * i);
      }

      // Extract each frame
      for (const timestamp of timestamps) {
        try {
          const frame = await extractFrameAtTime(video, canvas, ctx, timestamp);
          frames.push(frame);
        } catch (err) {
          console.warn(`Failed to extract frame at ${timestamp}s:`, err);
        }
      }

      cleanup();

      if (frames.length === 0) {
        reject(new Error("Could not extract any frames from video"));
      } else {
        resolve(frames);
      }
    };

    // Create blob URL and load video
    try {
      blobUrl = URL.createObjectURL(file);
      video.src = blobUrl;
    } catch (err) {
      reject(new Error("Failed to create video URL"));
    }
  });
}

/**
 * Extract a single frame at a specific timestamp
 */
function extractFrameAtTime(
  video: HTMLVideoElement,
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D,
  timestamp: number
): Promise<ExtractedFrame> {
  return new Promise((resolve, reject) => {
    const timeoutId = setTimeout(() => {
      reject(new Error(`Timeout seeking to ${timestamp}s`));
    }, 10000);

    const handleSeeked = () => {
      clearTimeout(timeoutId);
      video.removeEventListener("seeked", handleSeeked);

      try {
        // Draw video frame to canvas
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        // Extract as JPEG for smaller size
        const dataUrl = canvas.toDataURL("image/jpeg", 0.85);
        const base64 = dataUrl.split(",")[1];

        resolve({
          timestamp,
          dataUrl,
          base64,
        });
      } catch (err) {
        reject(err);
      }
    };

    video.addEventListener("seeked", handleSeeked);
    video.currentTime = timestamp;
  });
}

/**
 * Get a thumbnail from the video for preview
 */
export async function getVideoThumbnail(file: File): Promise<string | null> {
  try {
    const frames = await extractVideoFrames(file, 1);
    return frames[0]?.dataUrl ?? null;
  } catch {
    return null;
  }
}
