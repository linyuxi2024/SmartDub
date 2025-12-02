import React, { useState } from 'react';
import { DurationAnalysis } from '../types';
import { optimizeScript } from '../services/gemini';
import { formatTime } from '../utils';

interface Props {
  analysis: DurationAnalysis;
  scriptText: string;
  setScriptText: (s: string) => void;
  onConfirm: () => void;
  onBack: () => void;
}

export const StepOptimize: React.FC<Props> = ({
  analysis,
  scriptText,
  setScriptText,
  onConfirm,
  onBack
}) => {
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [optimizedText, setOptimizedText] = useState<string | null>(null);

  const handleOptimization = async () => {
    setIsOptimizing(true);
    try {
      const mode = analysis.status === 'too_long' ? 'shorten' : 'extend';
      const result = await optimizeScript(scriptText, analysis.videoDuration, analysis.audioDuration, mode);
      setOptimizedText(result);
    } catch (err) {
      alert("AI 优化失败，请检查网络或稍后重试。");
    } finally {
      setIsOptimizing(false);
    }
  };

  const applyOptimization = () => {
    if (optimizedText) {
      setScriptText(optimizedText);
      // In a real app we might re-check duration here, but for now assume AI did well and proceed
      onConfirm(); 
    }
  };

  // If status is OK, we shouldn't really be here, but just in case
  if (analysis.status === 'ok') {
    return (
      <div className="text-center py-12">
        <h3 className="text-xl font-semibold text-green-600 mb-4">时长完美匹配！</h3>
        <p className="text-slate-600 mb-8">文案长度与视频时长完美契合。</p>
        <button onClick={onConfirm} className="px-6 py-2 bg-blue-600 text-white rounded-lg">开始生成</button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-fade-in">
      <div className={`p-6 rounded-xl border-l-4 ${analysis.status === 'too_long' ? 'bg-orange-50 border-orange-500' : 'bg-blue-50 border-blue-500'}`}>
        <div className="flex items-start">
          <div className="flex-shrink-0 mt-1">
            {analysis.status === 'too_long' ? (
              <svg className="w-6 h-6 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            ) : (
              <svg className="w-6 h-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            )}
          </div>
          <div className="ml-4">
            <h3 className={`text-lg font-medium ${analysis.status === 'too_long' ? 'text-orange-800' : 'text-blue-800'}`}>
              检测到时长不匹配
            </h3>
            <p className="mt-2 text-slate-700">
              {analysis.status === 'too_long' 
                ? `文案对于视频来说过长（视频：${formatTime(analysis.videoDuration)}，音频：${formatTime(analysis.audioDuration)}）。音频可能会被截断。`
                : `文案对于视频来说过短（视频：${formatTime(analysis.videoDuration)}，音频：${formatTime(analysis.audioDuration)}）。将会有约 ${Math.round(analysis.diff)} 秒的静音。`
              }
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Manual Edit Option */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col">
          <h4 className="font-semibold text-slate-800 mb-4 flex items-center">
            <span className="w-6 h-6 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center text-xs mr-2">1</span>
            手动调整
          </h4>
          <p className="text-sm text-slate-500 mb-4 flex-1">
            自行修改文案以修复时长问题。
          </p>
          <button 
            onClick={onBack}
            className="w-full py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 font-medium"
          >
            返回修改
          </button>
        </div>

        {/* AI Optimize Option */}
        <div className="bg-white p-6 rounded-xl border border-blue-200 shadow-sm flex flex-col relative overflow-hidden">
          <div className="absolute top-0 right-0 p-2 opacity-10">
            <svg className="w-24 h-24" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 18a8 8 0 1 1 8-8 8 8 0 0 1-8 8z"/><path d="M12 6a1 1 0 0 0-1 1v4H7a1 1 0 0 0 0 2h4v4a1 1 0 0 0 2 0v-4h4a1 1 0 0 0 0-2h-4V7a1 1 0 0 0-1-1z"/></svg>
          </div>
          <h4 className="font-semibold text-blue-900 mb-4 flex items-center z-10">
            <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs mr-2">2</span>
            AI 智能优化
          </h4>
          <p className="text-sm text-slate-500 mb-4 flex-1 z-10">
             让 Gemini 重写文案以完美适配 {formatTime(analysis.videoDuration)} 的视频时长。
          </p>
          
          {!optimizedText ? (
            <button 
              onClick={handleOptimization}
              disabled={isOptimizing}
              className="w-full py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:shadow-lg transition-all z-10 flex justify-center items-center"
            >
              {isOptimizing ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  优化中...
                </>
              ) : (
                'AI 自动优化'
              )}
            </button>
          ) : (
            <div className="space-y-3 z-10">
              <div className="p-3 bg-blue-50 rounded border border-blue-100 text-sm text-slate-700 max-h-32 overflow-y-auto">
                {optimizedText}
              </div>
              <div className="flex space-x-2">
                <button 
                  onClick={() => setOptimizedText(null)}
                  className="flex-1 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded"
                >
                  放弃
                </button>
                <button 
                  onClick={applyOptimization}
                  className="flex-1 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  使用此文案
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      
       {/* Ignore Option */}
       <div className="text-center pt-4">
          <button 
            onClick={onConfirm}
            className="text-sm text-slate-400 hover:text-slate-600 underline"
          >
            忽略警告并继续
          </button>
       </div>
    </div>
  );
};