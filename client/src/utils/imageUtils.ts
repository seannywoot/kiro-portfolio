/**
 * Utility functions for image handling and analysis
 */

export interface ImageDimensions {
  width: number;
  height: number;
  aspectRatio: number;
}

/**
 * Load an image and get its natural dimensions
 */
export const getImageDimensions = (src: string): Promise<ImageDimensions> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      resolve({
        width: img.naturalWidth,
        height: img.naturalHeight,
        aspectRatio: img.naturalWidth / img.naturalHeight,
      });
    };
    img.onerror = reject;
    img.src = src;
  });
};

/**
 * Determine if an image will be cropped when displayed in a container
 */
export const willImageBeCropped = (
  imageAspectRatio: number,
  containerWidth: number,
  containerHeight: number,
  threshold: number = 0.1
): boolean => {
  const containerAspectRatio = containerWidth / containerHeight;
  const aspectRatioDifference = Math.abs(imageAspectRatio - containerAspectRatio);
  
  // If the aspect ratios differ significantly, the image will be cropped
  return aspectRatioDifference > threshold;
};

/**
 * Calculate the best fit dimensions for an image in a container
 */
export const calculateBestFit = (
  imageWidth: number,
  imageHeight: number,
  containerWidth: number,
  containerHeight: number,
  mode: 'cover' | 'contain' = 'cover'
): { width: number; height: number; scale: number } => {
  const imageAspectRatio = imageWidth / imageHeight;
  const containerAspectRatio = containerWidth / containerHeight;

  let scale: number;
  
  if (mode === 'cover') {
    // Scale to cover the entire container (may crop)
    scale = imageAspectRatio > containerAspectRatio
      ? containerHeight / imageHeight
      : containerWidth / imageWidth;
  } else {
    // Scale to fit entirely within container (may letterbox)
    scale = imageAspectRatio > containerAspectRatio
      ? containerWidth / imageWidth
      : containerHeight / imageHeight;
  }

  return {
    width: imageWidth * scale,
    height: imageHeight * scale,
    scale,
  };
};

/**
 * Preload multiple images and return their dimensions
 */
export const preloadImagesWithDimensions = async (
  urls: string[]
): Promise<Map<string, ImageDimensions>> => {
  const dimensionsMap = new Map<string, ImageDimensions>();
  
  await Promise.allSettled(
    urls.map(async (url) => {
      try {
        const dimensions = await getImageDimensions(url);
        dimensionsMap.set(url, dimensions);
      } catch (error) {
        console.warn(`Failed to load image dimensions for ${url}:`, error);
      }
    })
  );

  return dimensionsMap;
};