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
  const [previewRatio, setPreviewRatio] = useState<'9:16' | '3:4' | '1:1' | '4:3'>('9:16');

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

  const applySubtitlePreset = (preset: SubtitleSettings['preset']) => {
    const common = {
      fontFamily: 'Noto Sans SC',
      fontSize: 10,
      positionBottom: 5,
      lineSpacing: 0,
      letterSpacing: 0,
      alignment: 'center' as const,
      isBold: false,
      isItalic: false,
      isUnderline: false,
    };

    switch(preset) {
      case 'classic':
        setSubtitleSettings(prev => ({
          ...prev,
          ...common,
          preset: 'classic',
          textColor: '#ffffff',
          backgroundColor: '#000000',
          backgroundOpacity: 80,
          strokeWidth: 0,
        }));
        break;
      case 'modern':
        setSubtitleSettings(prev => ({
          ...prev,
          ...common,
          preset: 'modern',
          textColor: '#ffffff',
          backgroundColor: '#000000',
          backgroundOpacity: 0,
          strokeWidth: 0,
          isBold: true,
        }));
        break;
      case 'outline':
        setSubtitleSettings(prev => ({
          ...prev,
          ...common,
          preset: 'outline',
          textColor: '#ffffff',
          backgroundColor: '#000000',
          backgroundOpacity: 0,
          strokeColor: '#000000',
          strokeWidth: 3,
        }));
        break;
      default:
        break;
    }
  };

  // Helper to calculate style for preview subtitle text
  const getSubtitleTextStyle = (): React.CSSProperties => {
    const s = subtitleSettings;
    const rgbaBg = `rgba(${parseInt(s.backgroundColor.slice(1,3),16)}, ${parseInt(s.backgroundColor.slice(3,5),16)}, ${parseInt(s.backgroundColor.slice(5,7),16)}, ${s.backgroundOpacity/100})`;
    
    return {
      fontFamily: s.fontFamily,
      fontSize: `${s.fontSize}px`,
      color: s.textColor,
      backgroundColor: rgbaBg,
      fontWeight: s.isBold ? 'bold' : 'normal',
      fontStyle: s.isItalic ? 'italic' : 'normal',
      textDecoration: s.isUnderline ? 'underline' : 'none',
      WebkitTextStroke: s.strokeWidth > 0 ? `${s.strokeWidth}px ${s.strokeColor}` : '0',
      textAlign: s.alignment,
      lineHeight: `${1.5 + s.lineSpacing}em`,
      letterSpacing: `${s.letterSpacing}px`,
      position: 'absolute',
      bottom: `${s.positionBottom}%`,
      left: '5%',
      right: '5%',
      margin: '0 auto',
      width: '90%',
      // Handling text shadow as poor man's stroke if webkit-stroke is not enough or for extra contrast
      textShadow: s.strokeWidth === 0 && s.backgroundOpacity === 0 && s.textColor === '#ffffff' ? '0 1px 2px rgba(0,0,0,0.6)' : 'none'
    };
  };

  const getPreviewContainerStyle = (): React.CSSProperties => {
    const ratioMap = {
      '9:16': '9/16',
      '3:4': '3/4',
      '1:1': '1/1',
      '4:3': '4/3',
    };
    
    return {
      width: '100%',
      maxWidth: '240px',
      aspectRatio: ratioMap[previewRatio],
      backgroundImage: 'url(https://picsum.photos/600/800)',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    };
  };

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Voice Settings Card */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
        <div className="flex justify-between items-center border-b pb-4 mb-6">
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
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
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
                    <div className="relative pt-6">
                      <input 
                        type="range" 
                        min="0.5" 
                        max="2.0" 
                        step="0.1"
                        value={voiceSettings.speed}
                        onChange={(e) => setVoiceSettings(prev => ({ ...prev, speed: parseFloat(e.target.value) }))}
                        className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600 absolute top-0"
                      />
                      <div className="relative w-full h-6">
                        <span className="absolute left-0 text-xs text-slate-400 -top-2" style={{ left: '0%' }}>0.5x</span>
                        {/* 1.0 is at (1.0-0.5)/(2.0-0.5) = 0.5/1.5 = 33.33% */}
                        <span className="absolute text-xs text-slate-400 -top-2 -translate-x-1/2" style={{ left: '33.33%' }}>1.0x</span>
                        <span className="absolute right-0 text-xs text-slate-400 -top-2" style={{ left: '100%', transform: 'translateX(-100%)' }}>2.0x</span>
                      </div>
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
                  {/* Voice Selection */}
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
                    {/* Speed */}
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

                    {/* Volume */}
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
                     {/* Pitch */}
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
                    
                    {/* Emotion */}
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
           
           <div className="flex flex-col justify-center">
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
             </div>
           </div>
        </div>
      </div>

      {/* Subtitle Settings Card */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
        <div className="border-b pb-4 mb-6">
           <h3 className="text-lg font-semibold text-slate-800">字幕样式</h3>
           <div className="mt-2 flex items-center space-x-3">
              <input 
                type="checkbox"
                id="showSubtitles"
                checked={subtitleSettings.show}
                onChange={(e) => setSubtitleSettings(prev => ({ ...prev, show: e.target.checked }))}
                className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500 border-gray-300"
              />
              <label htmlFor="showSubtitles" className="text-sm font-medium text-slate-700">生成字幕</label>
           </div>
        </div>

        <div className={`grid grid-cols-1 lg:grid-cols-3 gap-8 transition-opacity ${subtitleSettings.show ? 'opacity-100' : 'opacity-50 pointer-events-none'}`}>
           
           {/* LEFT COLUMN: Controls */}
           <div className="lg:col-span-2 space-y-6">
              {/* 1. Presets */}
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">预设样式</label>
                <div className="grid grid-cols-3 gap-3">
                  {['classic', 'modern', 'outline'].map((style) => (
                    <button
                      key={style}
                      onClick={() => applySubtitlePreset(style as any)}
                      className={`p-3 text-sm font-medium rounded-lg border transition-all ${
                        subtitleSettings.preset === style 
                          ? 'bg-blue-600 text-white border-blue-600 shadow-md transform scale-105' 
                          : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      {style === 'classic' ? '经典 (黑底)' : style === 'modern' ? '现代 (无底)' : '描边 (Outline)'}
                    </button>
                  ))}
                </div>
              </div>

              {/* 2. Custom Parameters */}
              <div className="space-y-4 bg-slate-50 rounded-lg p-5 border border-slate-100">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">自定义参数</label>
                
                {/* Font & Size */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-slate-500 mb-1">字体</label>
                    <select 
                      value={subtitleSettings.fontFamily}
                      onChange={(e) => {
                        setSubtitleSettings(prev => ({ ...prev, fontFamily: e.target.value, preset: 'custom' }));
                      }}
                      className="w-full p-2 text-sm border rounded bg-white text-slate-900"
                    >
                        <option value="Noto Sans SC">思源黑体 (Noto Sans)</option>
                        <option value="Microsoft YaHei">微软雅黑</option>
                        <option value="SimSun">宋体</option>
                        <option value="Arial">Arial</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-slate-500 mb-1">字号 (px)</label>
                    <input 
                      type="number" 
                      value={subtitleSettings.fontSize}
                      onChange={(e) => setSubtitleSettings(prev => ({ ...prev, fontSize: parseInt(e.target.value) || 24, preset: 'custom' }))}
                      className="w-full p-2 text-sm border rounded bg-white text-slate-900"
                    />
                  </div>
                </div>

                {/* Colors */}
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs text-slate-500 mb-1">文字颜色</label>
                    <div className="flex items-center space-x-2">
                      <input 
                        type="color" 
                        value={subtitleSettings.textColor}
                        onChange={(e) => setSubtitleSettings(prev => ({ ...prev, textColor: e.target.value, preset: 'custom' }))}
                        className="h-8 w-8 rounded cursor-pointer border-0"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs text-slate-500 mb-1">背景颜色</label>
                    <div className="flex items-center space-x-2">
                        <input 
                        type="color" 
                        value={subtitleSettings.backgroundColor}
                        onChange={(e) => setSubtitleSettings(prev => ({ ...prev, backgroundColor: e.target.value, preset: 'custom' }))}
                        className="h-8 w-8 rounded cursor-pointer border-0"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs text-slate-500 mb-1">描边颜色</label>
                    <div className="flex items-center space-x-2">
                        <input 
                        type="color" 
                        value={subtitleSettings.strokeColor}
                        onChange={(e) => setSubtitleSettings(prev => ({ ...prev, strokeColor: e.target.value, preset: 'custom' }))}
                        className="h-8 w-8 rounded cursor-pointer border-0"
                      />
                    </div>
                  </div>
                </div>

                {/* Sliders: Opacity, Stroke */}
                <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-slate-500 mb-1">背景透明度 ({subtitleSettings.backgroundOpacity}%)</label>
                      <input 
                        type="range" min="0" max="100"
                        value={subtitleSettings.backgroundOpacity}
                        onChange={(e) => setSubtitleSettings(prev => ({ ...prev, backgroundOpacity: parseInt(e.target.value), preset: 'custom' }))}
                        className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-slate-500 mb-1">描边宽度 ({subtitleSettings.strokeWidth}px)</label>
                      <input 
                        type="range" min="0" max="10"
                        value={subtitleSettings.strokeWidth}
                        onChange={(e) => setSubtitleSettings(prev => ({ ...prev, strokeWidth: parseInt(e.target.value), preset: 'custom' }))}
                        className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                      />
                    </div>
                </div>

                {/* Style and Alignment Grouped with Labels */}
                <div className="grid grid-cols-2 gap-6 border-t border-b border-slate-200 py-4">
                  <div>
                     <label className="block text-xs text-slate-500 mb-2 font-medium">样式</label>
                     <div className="flex space-x-2">
                      {[
                        { key: 'isBold', label: 'B', title: '加粗' }, 
                        { key: 'isItalic', label: 'I', title: '斜体' }, 
                        { key: 'isUnderline', label: 'U', title: '下划线' }
                      ].map((btn) => (
                        <button
                          key={btn.key}
                          onClick={() => setSubtitleSettings(prev => ({ ...prev, [btn.key]: !prev[btn.key as keyof SubtitleSettings], preset: 'custom' }))}
                          className={`w-10 h-10 rounded font-serif text-lg font-bold border transition-colors ${
                            subtitleSettings[btn.key as keyof SubtitleSettings] 
                              ? 'bg-blue-100 border-blue-400 text-blue-800' 
                              : 'bg-white border-slate-200 text-slate-600'
                          }`}
                          title={btn.title}
                        >
                          {btn.label}
                        </button>
                      ))}
                     </div>
                  </div>

                  <div>
                     <label className="block text-xs text-slate-500 mb-2 font-medium">对齐方式</label>
                     <div className="flex space-x-2">
                       {['left', 'center', 'right'].map((align) => (
                         <button
                           key={align}
                           onClick={() => setSubtitleSettings(prev => ({ ...prev, alignment: align as any, preset: 'custom' }))}
                           className={`w-10 h-10 rounded border flex items-center justify-center transition-colors ${
                             subtitleSettings.alignment === align 
                               ? 'bg-blue-100 border-blue-400 text-blue-800' 
                               : 'bg-white border-slate-200 text-slate-600'
                           }`}
                         >
                           {align === 'left' && <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h10M4 18h7" /></svg>}
                           {align === 'center' && <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M7 12h10M9 18h6" /></svg>}
                           {align === 'right' && <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M10 12h10M13 18h7" /></svg>}
                         </button>
                       ))}
                     </div>
                  </div>
                </div>

                {/* Layout */}
                <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-slate-500 mb-1">位置 (距底部 {subtitleSettings.positionBottom}%)</label>
                      <input 
                        type="range" min="0" max="50"
                        value={subtitleSettings.positionBottom}
                        onChange={(e) => setSubtitleSettings(prev => ({ ...prev, positionBottom: parseInt(e.target.value), preset: 'custom' }))}
                        className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-slate-500 mb-1">字间距 ({subtitleSettings.letterSpacing}px)</label>
                      <input 
                        type="number"
                        value={subtitleSettings.letterSpacing}
                        onChange={(e) => setSubtitleSettings(prev => ({ ...prev, letterSpacing: parseInt(e.target.value) || 0, preset: 'custom' }))}
                        className="w-full p-2 text-sm border rounded bg-white text-slate-900"
                      />
                    </div>
                </div>
              </div>
           </div>

           {/* RIGHT COLUMN: Preview (Sticky) */}
           <div className="lg:col-span-1">
              <div className="lg:sticky lg:top-6 bg-slate-100 rounded-xl p-4 border border-slate-200">
                <div className="flex justify-between items-center mb-4">
                  <label className="text-sm font-bold text-slate-700">实时效果预览</label>
                </div>
                
                {/* Ratio Selectors */}
                <div className="flex flex-wrap gap-2 mb-4">
                     {['9:16', '3:4', '1:1', '4:3'].map(ratio => (
                       <button
                         key={ratio}
                         onClick={() => setPreviewRatio(ratio as any)}
                         className={`text-xs px-2 py-1 rounded border ${
                           previewRatio === ratio 
                             ? 'bg-white border-blue-400 text-blue-700 shadow-sm' 
                             : 'bg-transparent border-transparent text-slate-500 hover:bg-slate-200'
                         }`}
                       >
                         {ratio}
                       </button>
                     ))}
                </div>

                {/* Preview Container */}
                <div className="w-full flex justify-center items-center bg-slate-800 rounded-lg py-8 overflow-hidden min-h-[300px]">
                  <div 
                    className="relative shadow-2xl transition-all duration-300 flex-shrink-0"
                    style={getPreviewContainerStyle()}
                  >
                    {/* Subtitle Overlay */}
                    <div style={getSubtitleTextStyle()}>
                      这里是预览字幕效果
                      <br/>
                      支持多行文本显示
                    </div>
                  </div>
                </div>
                <p className="text-center text-xs text-slate-400 mt-3">
                    * 仅供参考，实际合成效果可能因视频分辨率略有差异
                </p>
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
