export const formatTime = (seconds: number): string => {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
};

// Estimate roughly 4 characters per second for mixed content (standard reading speed)
// Adjusted by speed multiplier.
const BASE_CHARS_PER_SECOND = 5; 

export const estimateAudioDuration = (text: string, speedMultiplier: number): number => {
  if (!text) return 0;
  // Simple heuristic: Remove whitespace for rough char count effectively spoken
  const cleanLength = text.replace(/\s/g, '').length;
  // Higher speed multiplier = Lower duration
  return cleanLength / (BASE_CHARS_PER_SECOND * speedMultiplier);
};

export const getFileDuration = (file: File): Promise<number> => {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video');
    video.preload = 'metadata';
    video.onloadedmetadata = () => {
      window.URL.revokeObjectURL(video.src);
      resolve(video.duration);
    };
    video.onerror = () => {
      reject("Invalid video file");
    };
    video.src = URL.createObjectURL(file);
  });
};
