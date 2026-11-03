import React, { useEffect } from 'react';
import { Question } from '../types';
import { CATEGORY_MAP } from '../data/categories';
import { sound } from '../utils/audio';
import { Check, X, ArrowRight, BookOpen } from 'lucide-react';

interface FeedbackCardProps {
  question: Question;
  selectedOptionIndex: number; // 0 for YES, 1 for NO, -1 for timeout
  isCorrect: boolean;
  pointsEarned: number;
  speedBonus: number;
  roundNumber: number;
  totalRounds: number;
  soundEnabled: boolean;
  onNext: () => void;
}

export const FeedbackCard: React.FC<FeedbackCardProps> = ({
  question,
  selectedOptionIndex,
  isCorrect,
  pointsEarned,
  speedBonus,
  roundNumber,
  totalRounds,
  soundEnabled,
  onNext
}) => {
  const cat = CATEGORY_MAP[question.category];

  useEffect(() => {
    if (isCorrect) {
      sound.playSuccess(soundEnabled);
    } else {
      sound.playIncorrect(soundEnabled);
    }
  }, [isCorrect, soundEnabled]);

  const correctChoiceLabel = question.correctIndex === 0 ? 'YES' : 'NO';
  const playerChoiceLabel = selectedOptionIndex === 0 ? 'YES' : selectedOptionIndex === 1 ? 'NO' : 'EXPIRED';
  const isFinalRound = roundNumber >= totalRounds;

  return (
    <div className="w-full max-w-3xl mx-auto p-5 sm:p-8 bg-[#25262B] border border-[#32353D] rounded-xl shadow-lg relative text-white animate-in fade-in duration-150">
      {/* Top Banner with exact text from creative brief */}
      <div className={`p-4 rounded-lg border flex items-center justify-between mb-5 ${
        isCorrect 
          ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400' 
          : 'bg-rose-500/15 border-rose-500/30 text-rose-400'
      }`}>
        <div className="flex items-center gap-3">
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold ${
            isCorrect ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
          }`}>
            {isCorrect ? (
              <Check className="w-5 h-5 stroke-[3]" />
            ) : (
              <X className="w-5 h-5 stroke-[3]" />
            )}
          </div>
          <div>
            <h2 className="font-heading font-bold text-xl sm:text-2xl leading-none">
              {isCorrect ? "THAT'S THE ONE." : "NOT QUITE. HERE'S WHY."}
            </h2>
            <p className="text-xs opacity-85 mt-1 font-medium">
              {isCorrect ? 'Accurate verification decision' : 'Deceptive trap identified'}
            </p>
          </div>
        </div>

        {/* Score pill */}
        <div className="bg-[#1C1D21] border border-[#32353D] px-3 py-1.5 rounded-lg text-right">
          <div className="text-[10px] text-[#A1A1AA] uppercase tracking-wider">
            POINTS
          </div>
          <div className="font-bold text-base text-white leading-none">
            +{pointsEarned} {speedBonus > 0 && <span className="text-xs text-[#60A5FA]">(+{speedBonus})</span>}
          </div>
        </div>
      </div>

      {/* Answer Verification Box */}
      <div className="space-y-2 mb-5">
        <div className="text-xs font-medium text-[#A1A1AA] uppercase tracking-wider">
          OFFICIAL VERIFICATION
        </div>

        <div className="p-3.5 bg-[#1C1D21] border border-[#32353D] rounded-lg flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className={`px-3 py-1 rounded font-heading font-bold text-sm ${
              correctChoiceLabel === 'YES' ? 'bg-[#10B981] text-white' : 'bg-[#EF4444] text-white'
            }`}>
              {correctChoiceLabel}
            </span>
            <div className="text-sm text-zinc-200 font-medium">
              The verified answer is <span className="text-white font-bold">{correctChoiceLabel}</span>
            </div>
          </div>

          {!isCorrect && (
            <div className="text-xs text-[#A1A1AA]">
              Your answer: <span className="text-rose-400 font-semibold">{playerChoiceLabel}</span>
            </div>
          )}
        </div>
      </div>

      {/* Educational Explanation Box */}
      <div className="p-4 bg-[#1C1D21] border border-[#32353D] rounded-lg mb-5">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-[#A1A1AA] mb-1.5 flex items-center gap-1.5">
          <BookOpen className="w-3.5 h-3.5 text-[#60A5FA]" />
          THE REASONING
        </h4>
        <p className="text-sm text-zinc-200 leading-relaxed font-normal">
          {question.explanation}
        </p>
      </div>

      {/* DYAP Campaign Takeaway */}
      <div className="p-4 bg-[#2463F5]/10 border border-[#2463F5]/30 rounded-lg mb-6">
        <span className="text-[11px] font-bold uppercase tracking-wider text-[#60A5FA] block mb-1">
          DYAP CAMPAIGN TAKEAWAY
        </span>
        <p className="text-sm font-medium text-white leading-snug">
          {question.mediaLiteracyTip}
        </p>
      </div>

      {/* Action Strip */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-3 border-t border-[#32353D]">
        <div className="text-xs text-[#A1A1AA]">
          Round {roundNumber} of {totalRounds} completed
        </div>

        <button
          onClick={onNext}
          className="w-full sm:w-auto px-6 py-3 bg-[#2463F5] hover:bg-[#1D52D4] text-white font-semibold text-sm rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm"
        >
          <span>{isFinalRound ? 'PROCEED TO RESULTS' : 'NEXT ROUND'}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
