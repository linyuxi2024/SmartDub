export interface VoiceSettings {
  speed: number; // 0.5 to 2.0
  volume: number; // 0 to 100 or 1.0 depending on usage
  pitch: number; // -10 to 10
  voiceId: string;
  emotion?: string;
}

export interface SubtitleSettings {
  show: boolean;
  fontSize: number;
  color: string;
  style: 'classic' | 'modern' | 'outline';
}

export type ProcessingStatus = 
  | 'idle' 
  | 'uploading'
  | 'analyzing' 
  | 'optimizing' 
  | 'generating_audio' 
  | 'merging' 
  | 'done';

export interface DurationAnalysis {
  videoDuration: number;
  audioDuration: number; // Estimated
  diff: number; // video - audio
  status: 'ok' | 'too_long' | 'too_short';
}