import * as faceapi from 'face-api.js';

// We'll use a public CDN for models to avoid large file commitments
// Ideally, these should be hosted locally in /public/models
const MODEL_URL = 'https://justadudewhohacks.github.io/face-api.js/models';

/**
 * Loads the necessary face-api.js models.
 * This should be called once when the app starts.
 */
export const loadModels = async () => {
  try {
    console.log("Loading face-api models...");
    await Promise.all([
      faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL),
      faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
      faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL)
    ]);
    console.log("Face-api models loaded successfully");
  } catch (error) {
    console.error("Failed to load face-api models:", error);
    throw error;
  }
};

/**
 * Captures a frame from a video element and returns it as a base64 PNG.
 * It mirrors the image horizontally (standard selfie view).
 */
export const captureFrame = (video: HTMLVideoElement): string | null => {
  const canvas = document.createElement('canvas');
  // Use a reasonable size for face-api (not too small like before)
  canvas.width = 640; 
  canvas.height = 480;
  const ctx = canvas.getContext('2d');
  
  if (!ctx) return null;

  // Flip horizontally
  ctx.translate(canvas.width, 0);
  ctx.scale(-1, 1);
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
  
  return canvas.toDataURL('image/png');
};

/**
 * Extracts a face descriptor (128-float vector) from an image source.
 * Returns null if no face is detected.
 */
const extractDescriptor = async (imageSrc: string): Promise<Float32Array | null> => {
  const img = await faceapi.fetchImage(imageSrc);
  const detection = await faceapi.detectSingleFace(img).withFaceLandmarks().withFaceDescriptor();
  
  if (!detection) {
    return null;
  }
  return detection.descriptor;
};

/**
 * Compares two images using face-api.js descriptors.
 * Returns a score from 0 to 100.
 */
export const compareImages = async (img1Src: string, img2Src: string): Promise<number> => {
  try {
    const desc1 = await extractDescriptor(img1Src);
    if (!desc1) return 0; // No face in first image

    const desc2 = await extractDescriptor(img2Src);
    if (!desc2) return 0; // No face in second image

    const distance = faceapi.euclideanDistance(desc1, desc2);
    
    // Distance usually ranges from 0 (match) to 1+ (diff).
    // Threshold is typically 0.6.
    // We map 0 -> 100% and 0.6 -> ~50-60%
    
    // Custom scoring logic:
    // If distance is 0, score is 100.
    // If distance is 0.6, score should be around 50 (borderline).
    // If distance is > 0.8, score usually drops to 0.
    
    // Formula: Score = 100 * (1 - distance / 0.8)
    let score = (1.0 - (distance / 0.8)) * 100;
    
    // Clamp between 0 and 100
    score = Math.max(0, Math.min(100, score));
    
    return score;
  } catch (error) {
    console.error("Comparison error:", error);
    return 0;
  }
};