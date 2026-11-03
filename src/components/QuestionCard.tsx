import React, { useState, useEffect, useRef } from 'react';
import { Question } from '../types';
import { CATEGORY_MAP } from '../data/categories';
import { sound } from '../utils/audio';
import { tts } from '../utils/tts';
import { 
  Clock, 
  ExternalLink,
  MessageSquare,
  Tag,
  Search,
  Check,
  X,
  Volume2,
  VolumeX,
  Radio
} from 'lucide-react';

interface QuestionCardProps {
  question: Question;
  roundNumber: number;
  totalRounds: number;
  currentScore: number;
  timerEnabled: boolean;
  timerDuration: number;
  soundEnabled: boolean;
  ttsEnabled?: boolean;
  ttsAutoPlay?: boolean;
  ttsVoiceURI?: string;
  aiVoice?: 'Kore' | 'Aoede' | 'device';
  onAnswerSelected: (selectedIndex: number, timeRemaining: number) => void;
}

export const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  roundNumber,
  totalRounds,
  currentScore,
  timerEnabled,
  timerDuration,
  soundEnabled,
  ttsEnabled = true,
  ttsAutoPlay = true,
  ttsVoiceURI,
  aiVoice = 'Kore',
  onAnswerSelected
}) => {
  const [timeLeft, setTimeLeft] = useState<number>(timerDuration);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isLocked, setIsLocked] = useState<boolean>(false);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const timerRef = useRef<number | null>(null);
  const cat = CATEGORY_MAP[question.category];

  // Subscribe to TTS speaking events
  useEffect(() => {
    const unsubscribe = tts.subscribe((speaking) => {
      setIsSpeaking(speaking);
    });
    return () => {
      unsubscribe();
      tts.stop();
    };
  }, []);

  // Auto-play voice reading when question appears
  useEffect(() => {
    if (ttsEnabled && ttsAutoPlay && !isLocked) {
      // Small timeout to allow transition to render smoothly
      const t = setTimeout(() => {
        tts.speakQuestion({
          scenarioContent: question.scenarioContent,
          question: question.question,
          aiVoice,
          preferredVoiceURI: ttsVoiceURI
        });
      }, 350);

      return () => {
        clearTimeout(t);
        tts.stop();
      };
    }
  }, [question.id, ttsEnabled, ttsAutoPlay, ttsVoiceURI, aiVoice]);

  // Countdown timer
  useEffect(() => {
    if (!timerEnabled || isLocked) return;

    setTimeLeft(timerDuration);

    timerRef.current = window.setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          handleTimeOut();
          return 0;
        }

        if (prev <= 6) {
          sound.playTimerWarning(soundEnabled);
        }

        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [timerEnabled, timerDuration, isLocked, question.id]);

  const handleTimeOut = () => {
    if (isLocked) return;
    tts.stop();
    setIsLocked(true);
    setSelectedOption(-1);
    onAnswerSelected(-1, 0);
  };

  const handleSelectOption = (index: number) => {
    if (isLocked) return;

    tts.stop();
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    sound.playButtonClick(soundEnabled);
    setSelectedOption(index);
    setIsLocked(true);

    onAnswerSelected(index, timeLeft);
  };

  const toggleSpeech = () => {
    if (isSpeaking) {
      tts.stop();
    } else {
      tts.speakQuestion({
        scenarioContent: question.scenarioContent,
        question: question.question,
        aiVoice,
        preferredVoiceURI: ttsVoiceURI
      });
    }
  };

  // Keyboard shortcut listener: Y, N, 1, 2, ArrowLeft, ArrowRight
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isLocked) return;
      const key = e.key.toUpperCase();
      if (key === 'Y' || key === '1' || e.key === 'ArrowLeft') {
        handleSelectOption(0); // YES
      } else if (key === 'N' || key === '2' || e.key === 'ArrowRight') {
        handleSelectOption(1); // NO
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isLocked]);

  const renderScenarioVisual = () => {
    if (!question.scenarioContent) return null;

    switch (question.scenarioType) {
      case 'headline':
        return (
          <div className="p-4 sm:p-5 bg-[#1C1D21] border border-[#32353D] rounded-lg mb-5">
            <div className="flex items-center justify-between text-xs text-[#A1A1AA] pb-2 mb-2 border-b border-[#2E3036]">
              <span className="flex items-center gap-1.5 font-medium">
                <ExternalLink className="w-3.5 h-3.5 text-[#60A5FA]" />
                SOURCE: {question.scenarioSource || 'dailybuzzbreaking.co.uk.net'}
              </span>
              <span className="bg-[#2463F5]/20 text-[#60A5FA] px-2 py-0.5 rounded text-[11px] font-medium uppercase tracking-wider">
                HEADLINE
              </span>
            </div>
            <p className="font-heading font-bold text-xl sm:text-2xl text-white leading-tight">
              {question.scenarioContent}
            </p>
          </div>
        );

      case 'product':
        return (
          <div className="p-4 sm:p-5 bg-[#1C1D21] border border-[#32353D] rounded-lg mb-5">
            <div className="flex items-center justify-between text-xs text-[#A1A1AA] pb-2 mb-2 border-b border-[#2E3036]">
              <span className="flex items-center gap-1.5 font-medium">
                <Tag className="w-3.5 h-3.5 text-[#EC4899]" />
                STORE: {question.scenarioSource || 'HYPER-DEALS.SHOP'}
              </span>
              <span className="bg-[#EC4899]/20 text-[#F472B6] px-2 py-0.5 rounded text-[11px] font-medium uppercase tracking-wider">
                PRODUCT LISTING
              </span>
            </div>
            <p className="font-heading font-bold text-xl sm:text-2xl text-white leading-tight mb-1">
              {question.scenarioContent}
            </p>
          </div>
        );

      case 'chat':
        return (
          <div className="p-4 sm:p-5 bg-[#1C1D21] border border-[#32353D] rounded-lg mb-5">
            <div className="flex items-center gap-2 text-xs text-[#A1A1AA] pb-2 mb-2 border-b border-[#2E3036]">
              <MessageSquare className="w-3.5 h-3.5 text-[#8B5CF6]" />
              <span className="font-medium">CHAT LEAK: {question.scenarioSource || 'Forwarded WhatsApp Chat'}</span>
            </div>
            <div className="bg-[#25262B] p-3.5 rounded border border-[#32353D] text-sm sm:text-base text-zinc-200 italic font-medium">
              "{question.scenarioContent}"
            </div>
          </div>
        );

      case 'social_post':
        return (
          <div className="p-4 sm:p-5 bg-[#1C1D21] border border-[#32353D] rounded-lg mb-5">
            <div className="flex items-center justify-between text-xs text-[#A1A1AA] pb-2 mb-2 border-b border-[#2E3036]">
              <span className="text-[#60A5FA] font-medium flex items-center gap-1.5">
                FEED POST: {question.scenarioSource || '@ViralFeedAlerts'}
              </span>
              <span className="text-[11px] uppercase tracking-wider text-[#A1A1AA]">
                VIRAL SOCIAL FEED
              </span>
            </div>
            <p className="text-base sm:text-lg text-white font-medium leading-relaxed">
              {question.scenarioContent}
            </p>
          </div>
        );

      case 'search':
      default:
        return (
          <div className="p-4 sm:p-5 bg-[#1C1D21] border border-[#32353D] rounded-lg mb-5">
            <div className="flex items-center gap-2 text-xs text-[#A1A1AA] pb-2 mb-2 border-b border-[#2E3036]">
              <Search className="w-3.5 h-3.5 text-[#10B981]" />
              <span className="font-medium">CASE INVESTIGATION: {question.scenarioSource || 'Verification File'}</span>
            </div>
            <p className="text-base sm:text-lg text-white font-medium leading-relaxed">
              {question.scenarioContent}
            </p>
          </div>
        );
    }
  };

  const isTimeCritical = timerEnabled && timeLeft <= 5;

  return (
    <div className="w-full max-w-3xl mx-auto p-5 sm:p-8 bg-[#25262B] border border-[#32353D] rounded-xl shadow-lg relative text-white">
      {/* Top HUD Strip */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3.5 mb-5 border-b border-[#32353D]">
        {/* Left: Category Badge & Round */}
        <div className="flex items-center gap-2.5">
          <span 
            className="px-2.5 py-1 text-xs font-semibold uppercase tracking-wider rounded-md flex items-center gap-1.5"
            style={{ backgroundColor: `${cat.color}25`, color: cat.accentColor, border: `1px solid ${cat.color}50` }}
          >
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: cat.color }} />
            {cat.shortTitle}
          </span>
          <span className="text-xs font-medium text-[#A1A1AA]">
            Round {roundNumber} of {totalRounds}
          </span>
        </div>

        {/* Right: TTS Voice Reader, Score & Timer */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* TTS Interactive Voice Button */}
          {ttsEnabled && (
            <button
              onClick={toggleSpeech}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer border ${
                isSpeaking
                  ? 'bg-[#2463F5] text-white border-[#60A5FA] shadow-sm animate-pulse'
                  : 'bg-[#1C1D21] hover:bg-[#2C2E35] text-zinc-300 border-[#32353D]'
              }`}
              title={isSpeaking ? 'Pause voice narration' : 'Listen to question read aloud'}
            >
              {isSpeaking ? (
                <>
                  <Radio className="w-3.5 h-3.5 text-white animate-spin" />
                  <span>Reading...</span>
                </>
              ) : (
                <>
                  <Volume2 className="w-3.5 h-3.5 text-[#60A5FA]" />
                  <span>Read Aloud</span>
                </>
              )}
            </button>
          )}

          <div className="text-xs font-medium text-[#A1A1AA]">
            Score: <span className="text-white font-bold text-sm">{currentScore}</span>
          </div>

          {timerEnabled && (
            <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold font-mono-code transition-colors ${
              isTimeCritical 
                ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40 animate-pulse' 
                : 'bg-[#1C1D21] text-zinc-300 border border-[#32353D]'
            }`}>
              <Clock className="w-3.5 h-3.5" />
              <span>{timeLeft}s</span>
            </div>
          )}
        </div>
      </div>

      {/* Simulated Context Container */}
      {renderScenarioVisual()}

      {/* Clue Highlight Callout */}
      {question.clue && (
        <div className="mb-5 p-3 bg-[#2463F5]/10 border border-[#2463F5]/30 rounded-lg flex items-center gap-3 text-zinc-200">
          <span className="px-2 py-0.5 bg-[#2463F5] text-white text-[10px] font-bold uppercase tracking-wider rounded shrink-0">
            CLUE
          </span>
          <span className="text-xs sm:text-sm font-medium leading-snug">
            {question.clue}
          </span>
        </div>
      )}

      {/* The Punchy Question Prompt */}
      <div className="mb-6 flex items-start justify-between gap-3">
        <h3 className="font-heading font-bold text-2xl sm:text-3xl text-white leading-tight flex-1">
          {question.question}
        </h3>
        {ttsEnabled && (
          <button
            onClick={toggleSpeech}
            className={`p-2 rounded-lg border shrink-0 transition-colors cursor-pointer ${
              isSpeaking 
                ? 'bg-[#2463F5] text-white border-[#60A5FA]' 
                : 'bg-[#1C1D21] hover:bg-[#2C2E35] text-[#60A5FA] border-[#32353D]'
            }`}
            title="Read question prompt"
          >
            <Volume2 className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Tactile YES / NO Buttons */}
      <div className="grid grid-cols-2 gap-4 sm:gap-6 mb-3">
        {/* YES Button */}
        <button
          onClick={() => handleSelectOption(0)}
          disabled={isLocked}
          className={`py-6 sm:py-7 px-4 rounded-xl font-heading font-bold text-3xl sm:text-4xl transition-all duration-150 flex flex-col items-center justify-center gap-1.5 cursor-pointer border ${
            selectedOption === 0
              ? 'bg-[#10B981] text-white border-[#34D399] scale-98 shadow-md'
              : 'bg-[#10B981] hover:bg-[#059669] text-white border-transparent hover:shadow-lg active:scale-98'
          } ${isLocked ? 'cursor-default' : ''}`}
        >
          <div className="flex items-center gap-2">
            <Check className="w-8 h-8 sm:w-9 sm:h-9 stroke-[3]" />
            <span>YES</span>
          </div>
          <span className="text-[11px] font-mono-code font-normal bg-black/25 text-white/90 px-2 py-0.5 rounded tracking-wide">
            [Y] or [1] or [←]
          </span>
        </button>

        {/* NO Button */}
        <button
          onClick={() => handleSelectOption(1)}
          disabled={isLocked}
          className={`py-6 sm:py-7 px-4 rounded-xl font-heading font-bold text-3xl sm:text-4xl transition-all duration-150 flex flex-col items-center justify-center gap-1.5 cursor-pointer border ${
            selectedOption === 1
              ? 'bg-[#EF4444] text-white border-[#F87171] scale-98 shadow-md'
              : 'bg-[#EF4444] hover:bg-[#DC2626] text-white border-transparent hover:shadow-lg active:scale-98'
          } ${isLocked ? 'cursor-default' : ''}`}
        >
          <div className="flex items-center gap-2">
            <X className="w-8 h-8 sm:w-9 sm:h-9 stroke-[3]" />
            <span>NO</span>
          </div>
          <span className="text-[11px] font-mono-code font-normal bg-black/25 text-white/90 px-2 py-0.5 rounded tracking-wide">
            [N] or [2] or [→]
          </span>
        </button>
      </div>

      {/* Footer Helper Note */}
      <div className="mt-4 pt-3 border-t border-[#32353D] flex items-center justify-between text-xs text-[#A1A1AA]">
        <span>Tap [YES] or [NO] to lock in your answer</span>
        <span className="text-[#60A5FA] font-medium">+100 pts + speed bonus</span>
      </div>
    </div>
  );
};
