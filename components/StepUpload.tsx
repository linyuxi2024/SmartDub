import React, { useRef } from 'react';
import { getFileDuration } from '../utils';

interface Props {
  videoFile: File | null;
  setVideoFile: (f: File) => void;
  scriptText: string;
  setScriptText: (s: string) => void;
  setVideoDuration: (d: number) => void;
  onNext: () => void;
}

export const StepUpload: React.FC<Props> = ({
  videoFile,
  setVideoFile,
  scriptText,
  setScriptText,
  setVideoDuration,
  onNext
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setVideoFile(file);
      try {
        const duration = await getFileDuration(file);
        setVideoDuration(duration);
      } catch (err) {
        alert("无法加载视频元数据。");
      }
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith('video/')) {
        setVideoFile(file);
        try {
          const duration = await getFileDuration(file);
          setVideoDuration(duration);
        } catch (err) {
          alert("无法加载视频元数据。");
        }
      }
    }
  };

  const canProceed = videoFile && scriptText.length > 5;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Video Upload Area */}
        <div 
          className="border-2 border-dashed border-slate-300 rounded-xl p-8 flex flex-col items-center justify-center bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer min-h-[300px]"
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <input 
            type="file" 
            ref={fileInputRef} 
            className="hidden" 
            accept="video/*" 
            onChange={handleFileChange} 
          />
          
          {videoFile ? (
            <div className="text-center space-y-3">
              <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.746 3.746 0 0 1 3.296-1.043A3.746 3.746 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.746 3.746 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z" />
                </svg>
              </div>
              <div>
                <p className="font-semibold text-slate-800 text-lg truncate max-w-[200px]">{videoFile.name}</p>
                <p className="text-sm text-slate-500">{(videoFile.size / (1024 * 1024)).toFixed(2)} MB</p>
              </div>
              <button 
                onClick={(e) => { e.stopPropagation(); setVideoFile(null as any); }}
                className="text-xs text-red-500 hover:text-red-700 underline"
              >
                移除
              </button>
            </div>
          ) : (
            <div className="text-center space-y-3 pointer-events-none">
              <div className="w-16 h-16 bg-slate-200 text-slate-400 rounded-full flex items-center justify-center mx-auto">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
                </svg>
              </div>
              <p className="font-medium text-slate-700">点击上传视频</p>
              <p className="text-sm text-slate-400">或将 MP4 文件拖放到此处</p>
            </div>
          )}
        </div>

        {/* Script Input Area */}
        <div className="flex flex-col">
          <label className="block text-sm font-medium text-slate-700 mb-2">
            配音文案
          </label>
          <textarea
            className="flex-1 w-full p-4 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none bg-slate-800 text-blue-50 placeholder-slate-400 leading-relaxed shadow-sm"
            placeholder="请输入您希望在视频中朗读的文字..."
            value={scriptText}
            onChange={(e) => setScriptText(e.target.value)}
          />
          <div className="text-right mt-2 text-xs text-slate-400">
            {scriptText.length} 个字符
          </div>
        </div>
      </div>

      <div className="flex justify-end pt-4">
        <button
          onClick={onNext}
          disabled={!canProceed}
          className={`px-8 py-3 rounded-lg font-medium transition-all transform active:scale-95 ${
            canProceed 
              ? 'bg-blue-600 text-white shadow-lg hover:bg-blue-700 hover:shadow-xl' 
              : 'bg-slate-200 text-slate-400 cursor-not-allowed'
          }`}
        >
          下一步：配置参数
        </button>
      </div>
    </div>
  );
};