import React, { useEffect, useState } from 'react';
import { VoiceSettings, SubtitleSettings, DurationAnalysis } from '../types';
import { formatTime, estimateAudioDuration } from '../utils';

interface Props {
  voiceSettings: VoiceSettings;
  setVoiceSettings: React.Dispatch<React.SetStateAction<VoiceSettings>>;
  subtitleSettings: SubtitleSettings;
  setSubtitleSettings: React.Dispatch<React.SetStateAction<SubtitleSettings>>;
  scriptText: string;
  videoDuration: number;
  setDurationAnalysis: (a: DurationAnalysis) => void;
  onNext: () => void;
  onBack: () => void;
}

export const StepConfig: React.FC<Props> = ({
  voiceSettings,
  setVoiceSettings,
  subtitleSettings,
  setSubtitleSettings,
  scriptText,
  videoDuration,
  setDurationAnalysis,
  onNext,
  onBack
}) => {
  const [isCustomVoice, setIsCustomVoice] = useState(false);

  const estimatedAudio = estimateAudioDuration(scriptText, voiceSettings.speed);
  const diff = videoDuration - estimatedAudio;
  
  // Update analysis whenever settings change
  useEffect(() => {
    let status: DurationAnalysis['status'] = 'ok';
    if (diff < -2) status = 'too_long'; // Audio is longer than video by >2s
    else if (diff >= 5) status = 'too_short'; // Audio is shorter than video by >=5s

    setDurationAnalysis({
      videoDuration,
      audioDuration: estimatedAudio,
      diff,
      status
    });
  }, [voiceSettings.speed, scriptText, videoDuration, diff, estimatedAudio, setDurationAnalysis]);

  const emotionOptions = [
    { value: 'happy', label: 'Happy (开心)' },
    { value: 'sad', label: 'Sad (悲伤)' },
    { value: 'angry', label: 'Angry (愤怒)' },
    { value: 'fearful', label: 'Fearful (恐惧)' },
    { value: 'disgusted', label: 'Disgusted (厌恶)' },
    { value: 'surprised', label: 'Surprised (惊讶)' },
    { value: 'calm', label: 'Calm (平静)' },
    { value: 'fluent', label: 'Fluent (流畅)' },
  ];

  const miniMaxVoices = [
    { value: 'male-qn-qingse', label: '青涩男大学生 (male-qn-qingse)' },
    { value: 'male-qn-jingying', label: '精英男士 (male-qn-jingying)' },
    { value: 'female-shaonv', label: '活力少女 (female-shaonv)' },
    { value: 'female-yujie', label: '御姐音 (female-yujie)' },
    { value: 'presenter_male', label: '男主持人 (presenter_male)' },
    { value: 'presenter_female', label: '女主持人 (presenter_female)' },
    { value: 'audiobook_male_1', label: '有声书男 (audiobook_male_1)' },
    { value: 'audiobook_female_1', label: '有声书女 (audiobook_female_1)' },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        
        {/* Voice Settings */}
        <div className="space-y-6">
          <div className="flex justify-between items-center border-b pb-2">
            <h3 className="text-lg font-semibold text-slate-800">配音设置</h3>
            <button
              onClick={() => setIsCustomVoice(!isCustomVoice)}
              className="text-xs px-3 py-1 rounded-full border border-blue-200 text-blue-600 hover:bg-blue-50 transition-colors flex items-center gap-1"
            >
              {isCustomVoice ? (
                <>
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  返回简易模式
                </>
              ) : (
                <>
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                  </svg>
                  自定义参数
                </>
              )}
            </button>
          </div>
          
          <div className="space-y-5">
            {!isCustomVoice ? (
              // Standard Mode
              <>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">配音员</label>
                  <select 
                    value={voiceSettings.voiceId}
                    onChange={(e) => setVoiceSettings(prev => ({ ...prev, voiceId: e.target.value }))}
                    className="w-full p-2 border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                  >
                    <option value="female_warm">👩 温暖女声 (默认)</option>
                    <option value="male_deep">👨 深沉男声</option>
                    <option value="child_cheerful">👶 欢快童声</option>
                    <option value="robot_neutral">🤖 机械人声</option>
                  </select>
                </div>

                <div>
                  <div className="flex justify-between mb-1">
                    <label className="text-sm font-medium text-slate-700">语速</label>
                    <span className="text-sm text-slate-500">{voiceSettings.speed.toFixed(1)}x</span>
                  </div>
                  <input 
                    type="range" 
                    min="0.5" 
                    max="2.0" 
                    step="0.1"
                    value={voiceSettings.speed}
                    onChange={(e) => setVoiceSettings(prev => ({ ...prev, speed: parseFloat(e.target.value) }))}
                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  />
                  {/* Corrected Slider Labels Position */}
                  <div className="relative w-full h-4 mt-1">
                    <span className="absolute left-0 text-xs text-slate-400">0.5x</span>
                    <span className="absolute left-[33.33%] -translate-x-1/2 text-xs text-slate-400">1.0x</span>
                    <span className="absolute right-0 text-xs text-slate-400">2.0x</span>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-1">
                    <label className="text-sm font-medium text-slate-700">音量</label>
                    <span className="text-sm text-slate-500">{voiceSettings.volume}</span>
                  </div>
                  <input 
                    type="range" 
                    min="0" 
                    max="100" 
                    step="1"
                    value={voiceSettings.volume}
                    onChange={(e) => setVoiceSettings(prev => ({ ...prev, volume: parseInt(e.target.value) }))}
                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  />
                </div>
              </>
            ) : (
              // Custom Mode
              <div className="space-y-4 bg-slate-50 p-4 rounded-lg border border-slate-200">
                <div className="text-xs text-slate-500 mb-2 pb-2 border-b border-slate-200">
                  配置 MiniMax 语音接口参数 (voice_setting)
                </div>
                
                {/* Voice Selection - Dropdown */}
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">音色选择 (Voice ID)</label>
                  <select
                    value={voiceSettings.voiceId}
                    onChange={(e) => setVoiceSettings(prev => ({ ...prev, voiceId: e.target.value }))}
                    className="w-full p-2 text-sm border border-slate-300 rounded focus:ring-1 focus:ring-blue-500 outline-none bg-white text-slate-900"
                  >
                    {miniMaxVoices.map(voice => (
                      <option key={voice.value} value={voice.value}>
                        {voice.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                   {/* Speed - Input */}
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">语速 (Speed)</label>
                    <input 
                      type="number"
                      step="0.1"
                      value={voiceSettings.speed}
                      onChange={(e) => setVoiceSettings(prev => ({ ...prev, speed: parseFloat(e.target.value) }))}
                      placeholder="e.g. 1.0"
                      className="w-full p-2 text-sm border border-slate-300 rounded focus:ring-1 focus:ring-blue-500 outline-none bg-white text-slate-900"
                    />
                  </div>

                  {/* Volume - Input */}
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">音量 (Volume)</label>
                    <input 
                      type="number"
                      step="0.1"
                      value={voiceSettings.volume}
                      onChange={(e) => setVoiceSettings(prev => ({ ...prev, volume: parseFloat(e.target.value) }))}
                      placeholder="e.g. 1.0"
                      className="w-full p-2 text-sm border border-slate-300 rounded focus:ring-1 focus:ring-blue-500 outline-none bg-white text-slate-900"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                   {/* Pitch - Input */}
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">音调 (Pitch)</label>
                    <input 
                      type="number"
                      step="1"
                      value={voiceSettings.pitch}
                      onChange={(e) => setVoiceSettings(prev => ({ ...prev, pitch: parseFloat(e.target.value) }))}
                      placeholder="e.g. 0"
                      className="w-full p-2 text-sm border border-slate-300 rounded focus:ring-1 focus:ring-blue-500 outline-none bg-white text-slate-900"
                    />
                  </div>
                  
                  {/* Emotion - Dropdown */}
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">情绪 (Emotion)</label>
                    <select
                      value={voiceSettings.emotion || 'calm'}
                      onChange={(e) => setVoiceSettings(prev => ({ ...prev, emotion: e.target.value }))}
                      className="w-full p-2 text-sm border border-slate-300 rounded focus:ring-1 focus:ring-blue-500 outline-none bg-white text-slate-900"
                    >
                      {emotionOptions.map(opt => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
             <div className="flex justify-between items-center text-sm">
                <span className="text-slate-500">视频时长:</span>
                <span className="font-mono font-medium">{formatTime(videoDuration)}</span>
             </div>
             <div className="flex justify-between items-center text-sm mt-2">
                <span className="text-slate-500">预计音频时长:</span>
                <span className={`font-mono font-medium ${diff < 0 ? 'text-red-500' : 'text-green-600'}`}>
                  {formatTime(estimatedAudio)}
                </span>
             </div>
             <div className="mt-3 pt-3 border-t border-slate-200 text-xs text-slate-400">
               * 基于字符数和语速设置的估算值。
             </div>
          </div>
        </div>

        {/* Subtitle Settings */}
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-slate-800 border-b pb-2">字幕样式</h3>
          
          <div className="space-y-4">
             <div className="flex items-center space-x-3">
               <input 
                 type="checkbox"
                 id="showSubtitles"
                 checked={subtitleSettings.show}
                 onChange={(e) => setSubtitleSettings(prev => ({ ...prev, show: e.target.checked }))}
                 className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500 border-gray-300"
               />
               <label htmlFor="showSubtitles" className="text-sm font-medium text-slate-700">生成字幕</label>
             </div>

             <div className={`space-y-4 transition-opacity ${subtitleSettings.show ? 'opacity-100' : 'opacity-50 pointer-events-none'}`}>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">样式预设</label>
                  <div className="grid grid-cols-3 gap-3">
                    {['classic', 'modern', 'outline'].map((style) => (
                      <button
                        key={style}
                        onClick={() => setSubtitleSettings(prev => ({ ...prev, style: style as any }))}
                        className={`p-2 text-sm rounded border ${
                          subtitleSettings.style === style 
                            ? 'bg-blue-50 border-blue-500 text-blue-700 ring-1 ring-blue-500' 
                            : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        {style === 'classic' ? '经典' : style === 'modern' ? '现代' : '描边'}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Subtitle Preview */}
                <div className="mt-4">
                  <label className="block text-sm font-medium text-slate-700 mb-2">预览</label>
                  <div className="relative w-full h-32 bg-slate-800 rounded-lg overflow-hidden flex items-end justify-center pb-4">
                    <img src="https://picsum.photos/400/200?blur=2" alt="Preview bg" className="absolute inset-0 w-full h-full object-cover opacity-50" />
                    <p 
                      className="relative px-2 text-center"
                      style={{
                        color: subtitleSettings.color,
                        fontSize: `${subtitleSettings.fontSize}px`,
                        textShadow: subtitleSettings.style === 'outline' ? '2px 2px 0 #000, -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000' : '0 2px 4px rgba(0,0,0,0.5)',
                        fontFamily: subtitleSettings.style === 'modern' ? 'sans-serif' : 'serif',
                        fontWeight: subtitleSettings.style === 'modern' ? 'bold' : 'normal',
                        backgroundColor: subtitleSettings.style === 'classic' ? 'rgba(0,0,0,0.6)' : 'transparent',
                      }}
                    >
                      字幕效果预览
                    </p>
                  </div>
                </div>
             </div>
          </div>
        </div>
      </div>

      <div className="flex justify-between pt-4">
        <button
          onClick={onBack}
          className="px-6 py-2 rounded-lg font-medium text-slate-600 hover:bg-slate-100 transition-colors"
        >
          返回
        </button>
        <button
          onClick={onNext}
          className="px-8 py-3 rounded-lg font-medium bg-blue-600 text-white shadow-lg hover:bg-blue-700 hover:shadow-xl transition-all transform active:scale-95"
        >
          检查并生成
        </button>
      </div>
    </div>
  );
};