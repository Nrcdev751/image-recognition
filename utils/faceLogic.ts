/**
 * Captures a frame from a video element and returns it as a base64 PNG.
 * It mirrors the image horizontally (standard selfie view).
 */
export const captureFrame = (video: HTMLVideoElement): string | null => {
  const canvas = document.createElement('canvas');
  canvas.width = 160; 
  canvas.height = 160;
  const ctx = canvas.getContext('2d');
  
  if (!ctx) return null;

  // Flip horizontally
  ctx.translate(canvas.width, 0);
  ctx.scale(-1, 1);
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
  
  return canvas.toDataURL('image/png');
};

/**
 * Compares two images using a simplified Mean Squared Error (MSE) algorithm
 * on a downscaled 24x24 grid to determine similarity.
 */
export const compareImages = async (img1Src: string, img2Src: string): Promise<number> => {
  return new Promise((resolve, reject) => {
    const img1 = new Image();
    const img2 = new Image();
    let loaded = 0;

    const onImageLoad = () => {
      loaded++;
      if (loaded === 2) {
        try {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          
          if (!ctx) {
            reject("Could not get canvas context");
            return;
          }

          const size = 24; // Downscale for fuzzy matching
          canvas.width = size;
          canvas.height = size;

          // Draw first image
          ctx.drawImage(img1, 0, 0, size, size);
          const data1 = ctx.getImageData(0, 0, size, size).data;

          // Clear and draw second image
          ctx.clearRect(0, 0, size, size);
          ctx.drawImage(img2, 0, 0, size, size);
          const data2 = ctx.getImageData(0, 0, size, size).data;

          let totalDiff = 0;
          // Loop through pixels (R, G, B, A)
          for (let i = 0; i < data1.length; i += 4) {
            // Convert to grayscale brightness
            const b1 = (data1[i] + data1[i+1] + data1[i+2]) / 3;
            const b2 = (data2[i] + data2[i+1] + data2[i+2]) / 3;
            totalDiff += Math.abs(b1 - b2);
          }

          const avgDiff = totalDiff / (size * size);
          // Calculate score: 0 (diff) to 100 (match)
          // The 1.6 factor adjusts sensitivity
          const score = Math.max(0, 100 - (avgDiff * 1.6)); 
          resolve(score);
        } catch (e) {
          reject(e);
        }
      }
    };

    img1.onload = onImageLoad;
    img2.onload = onImageLoad;
    img1.onerror = () => reject("Failed to load image");
    img2.onerror = () => reject("Failed to load image");

    img1.src = img1Src;
    img2.src = img2Src;
  });
};