import React, { useEffect, useState } from 'react';
import { RoundResult } from '../types';
import { sound } from '../utils/audio';
import { RotateCcw, Home, Check, X, Award, Shield } from 'lucide-react';

interface ResultsScreenProps {
  roundResults: RoundResult[];
  totalScore: number;
  soundEnabled: boolean;
  onPlayAgain: () => void;
  onReturnToMenu: () => void;
  onSaveToLeaderboard?: (name: string, score: number, correctCount: number) => void;
  currentUser?: { displayName?: string | null; email?: string | null } | null;
  onGoogleSignIn?: () => void;
}

export const ResultsScreen: React.FC<ResultsScreenProps> = ({
  roundResults,
  totalScore,
  soundEnabled,
  onPlayAgain,
  onReturnToMenu,
  onSaveToLeaderboard,
  currentUser,
  onGoogleSignIn
}) => {
  const [participantName, setParticipantName] = useState<string>(() => {
    return currentUser?.displayName || '';
  });
  const [isSaved, setIsSaved] = useState<boolean>(false);

  const totalRounds = roundResults.length || 5;
  const correctCount = roundResults.filter(r => r.isCorrect).length;

  const getPerformanceDetails = () => {
    if (correctCount === 5) {
      return {
        title: 'MISINFORMATION MASTER',
        tagline: 'Highest clearance achieved. Outstanding critical verification.',
        badgeClass: 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40',
        commentary: 'You caught every subtle manipulation, out-of-context headline, and engagement trap.'
      };
    } else if (correctCount === 4) {
      return {
        title: 'FEED DETECTIVE',
        tagline: 'Sharp editorial instincts. You spot deception before it spreads.',
        badgeClass: 'bg-blue-500/20 text-blue-400 border border-blue-500/40',
        commentary: 'Strong digital literacy across both social platforms and online storefronts.'
      };
    } else if (correctCount === 3) {
      return {
        title: 'RUMOUR BUSTER',
        tagline: 'Solid foundation. Always remember to check primary sources.',
        badgeClass: 'bg-violet-500/20 text-violet-400 border border-violet-500/40',
        commentary: 'Good awareness of rumours and ragebait; continue practicing lateral reading.'
      };
    } else if (correctCount === 2) {
      return {
        title: 'DIGITAL SLEUTH',
        tagline: 'In training. Don\'t let sensational headlines rush your judgment.',
        badgeClass: 'bg-amber-500/20 text-amber-400 border border-amber-500/40',
        commentary: 'Pay close attention to weird web domains and anonymous quotes.'
      };
    } else {
      return {
        title: 'FACT CHECKER',
        tagline: 'The first step is questioning what you see in the feed.',
        badgeClass: 'bg-zinc-800 text-zinc-300 border border-zinc-700',
        commentary: 'Remember SIFT: Stop, Investigate source, Find better coverage, Trace claims.'
      };
    }
  };

  const performance = getPerformanceDetails();

  useEffect(() => {
    sound.playSuccess(soundEnabled);
  }, [soundEnabled]);

  const handleSaveScore = (e: React.FormEvent) => {
    e.preventDefault();
    if (!participantName.trim() || isSaved) return;

    if (onSaveToLeaderboard) {
      onSaveToLeaderboard(participantName.trim(), totalScore, correctCount);
      setIsSaved(true);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto p-5 sm:p-8 bg-[#25262B] border border-[#32353D] rounded-xl shadow-xl text-white relative animate-in fade-in duration-200">
      {/* Top Banner */}
      <div className="flex items-center justify-between border-b border-[#32353D] pb-3 mb-6">
        <div className="text-xs font-semibold uppercase tracking-wider text-[#60A5FA]">
          DYAP CAMPAIGN CERTIFICATION
        </div>
        <div className="text-xs px-2.5 py-0.5 rounded bg-[#1C1D21] text-[#A1A1AA] border border-[#32353D] font-mono-code">
          {totalRounds} OF {totalRounds} ROUNDS COMPLETE
        </div>
      </div>

      {/* Main Campaign Performance Block */}
      <div className="p-5 sm:p-6 bg-[#1C1D21] border border-[#32353D] rounded-xl mb-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-5 border-b border-[#2E3036]">
          <div>
            <span className="text-[11px] font-medium uppercase tracking-wider text-[#A1A1AA] block mb-1">
              OFFICIAL RANKING
            </span>
            <div className={`inline-block px-3 py-1 font-heading font-bold text-xl sm:text-2xl rounded-md ${performance.badgeClass}`}>
              {performance.title}
            </div>
            <p className="text-xs sm:text-sm text-[#A1A1AA] mt-2 font-normal max-w-md">
              {performance.tagline}
            </p>
          </div>

          {/* Scores Strip */}
          <div className="flex items-center gap-6 text-right w-full sm:w-auto justify-between sm:justify-end border-t sm:border-t-0 pt-3 sm:pt-0 border-[#2E3036]">
            <div>
              <div className="text-[10px] uppercase font-medium text-[#A1A1AA]">
                FINAL SCORE
              </div>
              <div className="font-heading font-bold text-3xl sm:text-4xl text-[#60A5FA]">
                {totalScore}
              </div>
            </div>
            <div className="w-px h-10 bg-[#32353D] hidden sm:block" />
            <div>
              <div className="text-[10px] uppercase font-medium text-[#A1A1AA]">
                ACCURACY
              </div>
              <div className="font-heading font-bold text-2xl sm:text-3xl text-white">
                {correctCount} / {totalRounds}
              </div>
            </div>
          </div>
        </div>

        {/* Round Matrix */}
        <div className="mt-5">
          <div className="text-xs font-medium uppercase tracking-wider text-[#A1A1AA] mb-3">
            ROUND BREAKDOWN
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-5 gap-2.5">
            {roundResults.map((r, i) => (
              <div
                key={i}
                className={`p-3 rounded-lg border flex flex-col justify-between ${
                  r.isCorrect 
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-white' 
                    : 'bg-rose-500/10 border-rose-500/30 text-white'
                }`}
              >
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-[#A1A1AA] font-mono-code font-bold">R{i + 1}</span>
                  {r.isCorrect ? (
                    <Check className="w-4 h-4 text-emerald-400 stroke-[3]" />
                  ) : (
                    <X className="w-4 h-4 text-rose-400 stroke-[3]" />
                  )}
                </div>
                <div className="font-semibold text-xs leading-tight truncate">
                  {r.category.replace('_', ' ')}
                </div>
                <div className="text-[11px] font-mono-code mt-1 text-[#A1A1AA]">
                  +{r.pointsEarned} pts
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Save Score to Booth Leaderboard */}
      {onSaveToLeaderboard && (
        <div className="p-4 bg-[#1C1D21] border border-[#32353D] rounded-xl mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-[#A1A1AA] font-medium">
              Record score on the booth leaderboard:
            </span>
            {currentUser ? (
              <span className="inline-flex items-center gap-1.5 text-[10px] text-emerald-400 font-mono-code bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                FIRESTORE SYNC ACTIVE
              </span>
            ) : onGoogleSignIn ? (
              <button
                type="button"
                onClick={onGoogleSignIn}
                className="text-[11px] text-[#60A5FA] hover:text-[#93C5FD] underline cursor-pointer"
              >
                Sign in with Google to sync online
              </button>
            ) : null}
          </div>
          <form onSubmit={handleSaveScore} className="flex flex-col sm:flex-row items-center gap-3">
            <div className="flex-1 w-full text-left">
              <input
                id="pname"
                type="text"
                placeholder={currentUser?.displayName ? `Nickname: ${currentUser.displayName}` : "Enter your nickname / school ID"}
                value={participantName}
                onChange={(e) => setParticipantName(e.target.value)}
                disabled={isSaved}
                className="w-full px-3.5 py-2 bg-[#25262B] border border-[#32353D] rounded-lg text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-[#2463F5]"
              />
            </div>
            <button
              type="submit"
              disabled={!participantName.trim() || isSaved}
              className={`w-full sm:w-auto px-5 py-2 mt-auto text-sm font-semibold rounded-lg transition-colors cursor-pointer ${
                isSaved 
                  ? 'bg-emerald-600 text-white cursor-default' 
                  : 'bg-[#2463F5] hover:bg-[#1D52D4] text-white disabled:opacity-50 disabled:cursor-not-allowed'
              }`}
            >
              {isSaved ? 'SAVED TO LEADERBOARD' : 'LOG SCORE'}
            </button>
          </form>
        </div>
      )}

      {/* Primary Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
        <button
          onClick={onPlayAgain}
          className="w-full sm:flex-1 py-3 px-5 bg-[#2463F5] hover:bg-[#1D52D4] text-white font-semibold text-sm rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm"
        >
          <RotateCcw className="w-4 h-4" />
          <span>PLAY AGAIN (NEW ROUNDS)</span>
        </button>

        <button
          onClick={onReturnToMenu}
          className="w-full sm:w-auto py-3 px-5 bg-[#25262B] hover:bg-[#2C2E35] text-zinc-200 border border-[#32353D] font-medium text-sm rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer"
        >
          <Home className="w-4 h-4" />
          <span>MAIN MENU</span>
        </button>
      </div>
    </div>
  );
};
