import React, { useState } from 'react';
import { VoiceSettings, SubtitleSettings, DurationAnalysis } from './types';
import { StepUpload } from './components/StepUpload';
import { StepConfig } from './components/StepConfig';
import { StepOptimize } from './components/StepOptimize';
import { StepProcess } from './components/StepProcess';
import { StepResult } from './components/StepResult';

// Stepper Components
const Stepper = ({ currentStep }: { currentStep: number }) => {
  const steps = ['内容', '设置', '优化', '完成'];
  return (
    <div className="flex items-center justify-between mb-10 relative">
      <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-full h-1 bg-slate-200 -z-10"></div>
      <div className="absolute left-0 top-1/2 transform -translate-y-1/2 h-1 bg-blue-500 -z-10 transition-all duration-500" style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}></div>
      
      {steps.map((label, index) => {
        const stepNum = index + 1;
        const isActive = currentStep >= stepNum;
        const isCurrent = currentStep === stepNum;
        
        return (
          <div key={label} className="flex flex-col items-center bg-transparent">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-colors duration-300 ${
              isActive ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-500'
            } ${isCurrent ? 'ring-4 ring-blue-100' : ''}`}>
              {isActive ? (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              ) : stepNum}
            </div>
            <span className={`mt-2 text-xs font-medium ${isCurrent ? 'text-blue-600' : 'text-slate-400'}`}>
              {label}
            </span>
          </div>
        );
      })}
    </div>
  );
};

const App: React.FC = () => {
  // State
  const [step, setStep] = useState<number>(1);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoDuration, setVideoDuration] = useState<number>(0);
  const [scriptText, setScriptText] = useState<string>('');
  
  const [voiceSettings, setVoiceSettings] = useState<VoiceSettings>({
    speed: 1.0,
    volume: 1.0, 
    pitch: 0,
    voiceId: 'female_warm',
    emotion: 'calm'
  });
  
  const [subtitleSettings, setSubtitleSettings] = useState<SubtitleSettings>({
    show: true,
    preset: 'classic',
    fontFamily: 'Noto Sans SC',
    fontSize: 10, // Default changed to 10
    textColor: '#ffffff',
    backgroundColor: '#000000',
    backgroundOpacity: 60,
    strokeColor: '#000000',
    strokeWidth: 0,
    isBold: false,
    isItalic: false,
    isUnderline: false,
    positionBottom: 5,
    lineSpacing: 0,
    letterSpacing: 0,
    alignment: 'center'
  });

  const [durationAnalysis, setDurationAnalysis] = useState<DurationAnalysis>({
    videoDuration: 0,
    audioDuration: 0,
    diff: 0,
    status: 'ok'
  });

  // Handlers
  const handleReset = () => {
    setStep(1);
    setVideoFile(null);
    setScriptText('');
    setDurationAnalysis({ videoDuration: 0, audioDuration: 0, diff: 0, status: 'ok' });
  };

  const handleConfigNext = () => {
    if (durationAnalysis.status === 'ok') {
      setStep(4); // Skip Optimize step
    } else {
      setStep(3); // Go to Optimize Step
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      <nav className="bg-white border-b border-slate-200 px-6 py-4 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">SD</div>
            <span className="font-bold text-xl tracking-tight text-slate-800">SmartDub</span>
          </div>
          <div className="text-sm text-slate-500">智能视频配音工具</div>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-6 py-10">
        
        {step < 5 && <Stepper currentStep={step > 3 ? 3 : step} />}

        <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-8 min-h-[500px]">
          {step === 1 && (
            <StepUpload
              videoFile={videoFile}
              setVideoFile={setVideoFile}
              scriptText={scriptText}
              setScriptText={setScriptText}
              setVideoDuration={setVideoDuration}
              onNext={() => setStep(2)}
            />
          )}

          {step === 2 && (
            <StepConfig
              voiceSettings={voiceSettings}
              setVoiceSettings={setVoiceSettings}
              subtitleSettings={subtitleSettings}
              setSubtitleSettings={setSubtitleSettings}
              scriptText={scriptText}
              videoDuration={videoDuration}
              setDurationAnalysis={setDurationAnalysis}
              onNext={handleConfigNext}
              onBack={() => setStep(1)}
            />
          )}

          {step === 3 && (
            <StepOptimize
              analysis={durationAnalysis}
              scriptText={scriptText}
              setScriptText={setScriptText}
              onConfirm={() => setStep(4)}
              onBack={() => setStep(2)}
            />
          )}

          {step === 4 && (
            <StepProcess
              onComplete={() => setStep(5)}
            />
          )}

          {step === 5 && (
            <StepResult 
              videoFile={videoFile}
              subtitleSettings={subtitleSettings}
              scriptText={scriptText}
              onReset={handleReset}
            />
          )}
        </div>
      </main>

      <footer className="text-center py-6 text-slate-400 text-sm">
        &copy; {new Date().getFullYear()} SmartDub Technologies. 由 Gemini 提供支持。
      </footer>
    </div>
  );
};

export default App;