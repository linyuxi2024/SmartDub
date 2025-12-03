export interface VoiceSettings {
  speed: number; // 0.5 to 2.0
  volume: number; // 0 to 100 or 1.0 depending on usage
  pitch: number; // -10 to 10
  voiceId: string;
  emotion?: string;
}

export interface SubtitleSettings {
  show: boolean;
  preset: 'classic' | 'modern' | 'outline' | 'custom';
  
  // Font
  fontFamily: string;
  fontSize: number;
  textColor: string;
  
  // Background
  backgroundColor: string;
  backgroundOpacity: number; // 0-100
  
  // Effects
  strokeColor: string;
  strokeWidth: number;
  
  // Style
  isBold: boolean;
  isItalic: boolean;
  isUnderline: boolean;
  
  // Layout
  positionBottom: number; // %
  lineSpacing: number; // em/px
  letterSpacing: number; // px
  alignment: 'left' | 'center' | 'right';
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