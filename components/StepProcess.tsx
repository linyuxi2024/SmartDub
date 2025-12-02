import React, { useEffect, useState } from 'react';
import { ProcessingStatus } from '../types';

interface Props {
  onComplete: () => void;
}

export const StepProcess: React.FC<Props> = ({ onComplete }) => {
  const [status, setStatus] = useState<ProcessingStatus>('generating_audio');
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Simulation of the backend pipeline
    const pipeline = async () => {
      // 1. Generate Audio
      setStatus('generating_audio');
      for(let i=0; i<=30; i++) {
        setProgress(i);
        await new Promise(r => setTimeout(r, 50));
      }

      // 2. Merge Video
      setStatus('merging');
      for(let i=30; i<=70; i++) {
        setProgress(i);
        await new Promise(r => setTimeout(r, 60));
      }

      // 3. Generate Subtitles
      // (Wait a bit longer as if calling an API)
      for(let i=70; i<=100; i++) {
        setProgress(i);
        await new Promise(r => setTimeout(r, 30));
      }
      
      setStatus('done');
      await new Promise(r => setTimeout(r, 500));
      onComplete();
    };

    pipeline();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getStatusText = (s: ProcessingStatus) => {
    switch(s) {
      case 'generating_audio': return '正在合成 AI 配音...';
      case 'merging': return '正在合并音视频...';
      case 'done': return '正在完成...';
      default: return '处理中...';
    }
  };

  return (
    <div className="flex flex-col items-center justify-center py-20 animate-fade-in">
      <div className="w-full max-w-md space-y-6">
        <div className="relative pt-1">
          <div className="flex mb-2 items-center justify-between">
            <div>
              <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-blue-600 bg-blue-200">
                {status === 'done' ? '完成' : '处理中'}
              </span>
            </div>
            <div className="text-right">
              <span className="text-xs font-semibold inline-block text-blue-600">
                {progress}%
              </span>
            </div>
          </div>
          <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-blue-200">
            <div style={{ width: `${progress}%` }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500 transition-all duration-300"></div>
          </div>
        </div>
        
        <div className="text-center space-y-2">
            <h3 className="text-xl font-medium text-slate-800 animate-pulse">
                {getStatusText(status)}
            </h3>
            <p className="text-slate-500 text-sm">
                该过程通常需要 10-20 秒。
            </p>
        </div>

        {/* Visual Mock of "Processing Steps" */}
        <div className="flex justify-center space-x-2 mt-8">
            <div className={`w-3 h-3 rounded-full ${progress > 10 ? 'bg-green-500' : 'bg-slate-300'}`}></div>
            <div className={`w-3 h-3 rounded-full ${progress > 40 ? 'bg-green-500' : 'bg-slate-300'}`}></div>
            <div className={`w-3 h-3 rounded-full ${progress > 80 ? 'bg-green-500' : 'bg-slate-300'}`}></div>
        </div>
      </div>
    </div>
  );
};