import React from 'react';
import { SubtitleSettings } from '../types';

interface Props {
  videoFile: File | null;
  subtitleSettings: SubtitleSettings;
  scriptText: string; // To show fake subtitles
  onReset: () => void;
}

export const StepResult: React.FC<Props> = ({
  videoFile,
  subtitleSettings,
  scriptText,
  onReset
}) => {
  const videoUrl = videoFile ? URL.createObjectURL(videoFile) : '';

  // Mock subtitle extraction (take first sentence)
  const previewSubtitle = scriptText.split(/[.!?。！？]/)[0] + '...';

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center text-green-800 mb-6">
        <svg className="w-6 h-6 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <div>
          <h4 className="font-semibold">成功！</h4>
          <p className="text-sm">您的视频已成功配音并生成字幕。</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
           {/* Video Player Container */}
           <div className="relative aspect-video bg-black rounded-lg overflow-hidden shadow-2xl group">
             {videoUrl && (
               <video 
                  src={videoUrl} 
                  controls 
                  className="w-full h-full object-contain"
                  autoPlay
                  loop
                  muted // Muted because we didn't actually generate audio in the browser
               />
             )}
             
             {/* Fake Audio Status Overlay (since we can't play generated audio) */}
             <div className="absolute top-4 right-4 bg-black/70 text-white text-xs px-2 py-1 rounded backdrop-blur-sm">
                音频播放中 (模拟)
             </div>

             {/* Subtitle Overlay - Simulating burned-in subs */}
             {subtitleSettings.show && (
                <div className="absolute bottom-12 left-0 right-0 text-center px-8 pointer-events-none">
                  <span
                    style={{
                        color: subtitleSettings.color,
                        fontSize: `${subtitleSettings.fontSize}px`,
                        textShadow: subtitleSettings.style === 'outline' ? '2px 2px 0 #000' : '0 2px 4px rgba(0,0,0,0.8)',
                        fontFamily: subtitleSettings.style === 'modern' ? 'sans-serif' : 'serif',
                        fontWeight: subtitleSettings.style === 'modern' ? 'bold' : 'normal',
                        backgroundColor: subtitleSettings.style === 'classic' ? 'rgba(0,0,0,0.6)' : 'transparent',
                        padding: '4px 8px',
                        borderRadius: '4px'
                    }}
                  >
                    {previewSubtitle}
                  </span>
                </div>
             )}
           </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
             <h3 className="font-semibold text-slate-800 mb-4">导出选项</h3>
             
             <button className="w-full flex items-center justify-center space-x-2 bg-slate-900 text-white py-3 rounded-lg hover:bg-slate-800 transition-colors mb-3">
               <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
               </svg>
               <span>下载视频 (MP4)</span>
             </button>
             
             <button className="w-full flex items-center justify-center space-x-2 bg-white border border-slate-300 text-slate-700 py-3 rounded-lg hover:bg-slate-50 transition-colors">
               <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
               </svg>
               <span>下载字幕 (.srt)</span>
             </button>
          </div>

          <button 
            onClick={onReset}
            className="text-sm text-slate-500 hover:text-slate-700 underline w-full text-center"
          >
            创建新项目
          </button>
        </div>
      </div>
    </div>
  );
};