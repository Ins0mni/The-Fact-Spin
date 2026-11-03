import React, { useState } from 'react';
import { BoothStats, HighScoreEntry } from '../types';
import { Users, RotateCcw, X, Play, Clock, Trash2, BookOpen } from 'lucide-react';

interface BoothModeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartNewSession: () => void;
  onResetScoreAndRounds: () => void;
  onReturnToMainMenu: () => void;
  boothStats: BoothStats;
  highScores: HighScoreEntry[];
  onClearLeaderboard: () => void;
  timerDuration: number;
  onUpdateTimerDuration: (seconds: number) => void;
  timerEnabled: boolean;
  onToggleTimer: (enabled: boolean) => void;
  ttsEnabled?: boolean;
  onToggleTTS?: (enabled: boolean) => void;
  firebaseConnected?: boolean;
}

export const BoothModeModal: React.FC<BoothModeModalProps> = ({
  isOpen,
  onClose,
  onStartNewSession,
  onResetScoreAndRounds,
  onReturnToMainMenu,
  boothStats,
  highScores,
  onClearLeaderboard,
  timerDuration,
  onUpdateTimerDuration,
  timerEnabled,
  onToggleTimer,
  ttsEnabled = true,
  onToggleTTS,
  firebaseConnected = true
}) => {
  const [activeTab, setActiveTab] = useState<'controls' | 'leaderboard' | 'guide'>('controls');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-2xl max-h-[90vh] flex flex-col bg-[#25262B] border border-[#32353D] rounded-xl shadow-2xl text-white overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-[#32353D] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#2463F5]/20 text-[#60A5FA] flex items-center justify-center font-bold">
              <Users className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-[#60A5FA] font-semibold uppercase tracking-wider">
                  EVENT AMBASSADOR CONSOLE
                </span>
                {firebaseConnected && (
                  <span className="inline-flex items-center gap-1 text-[9px] font-mono-code text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-1.5 py-0.2 rounded">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    FIRESTORE LIVE
                  </span>
                )}
              </div>
              <h3 className="font-heading font-bold text-xl uppercase tracking-tight text-white leading-none mt-0.5">
                BOOTH CONSOLE
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-[#1C1D21] transition-colors cursor-pointer"
            aria-label="Close Booth Mode"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Buttons */}
        <div className="px-5 pt-3 border-b border-[#32353D] bg-[#1E2025] flex gap-2">
          <button
            onClick={() => setActiveTab('controls')}
            className={`py-2 px-3 text-xs font-semibold rounded-t-lg transition-colors cursor-pointer border-b-2 ${
              activeTab === 'controls' 
                ? 'border-[#2463F5] text-white bg-[#25262B]' 
                : 'border-transparent text-[#A1A1AA] hover:text-white'
            }`}
          >
            Quick Actions
          </button>
          <button
            onClick={() => setActiveTab('leaderboard')}
            className={`py-2 px-3 text-xs font-semibold rounded-t-lg transition-colors cursor-pointer border-b-2 ${
              activeTab === 'leaderboard' 
                ? 'border-[#2463F5] text-white bg-[#25262B]' 
                : 'border-transparent text-[#A1A1AA] hover:text-white'
            }`}
          >
            Today's Scores ({highScores.length})
          </button>
          <button
            onClick={() => setActiveTab('guide')}
            className={`py-2 px-3 text-xs font-semibold rounded-t-lg transition-colors cursor-pointer border-b-2 ${
              activeTab === 'guide' 
                ? 'border-[#2463F5] text-white bg-[#25262B]' 
                : 'border-transparent text-[#A1A1AA] hover:text-white'
            }`}
          >
            Ambassador Talking Points
          </button>
        </div>

        {/* Tab Body */}
        <div className="p-5 overflow-y-auto space-y-5 flex-1 text-sm">
          {activeTab === 'controls' && (
            <>
              {/* Event Statistics Matrix */}
              <div className="grid grid-cols-3 gap-3">
                <div className="p-3 bg-[#1C1D21] border border-[#32353D] rounded-lg text-center">
                  <div className="text-[10px] font-medium uppercase text-[#A1A1AA]">
                    SESSIONS TODAY
                  </div>
                  <div className="font-heading font-bold text-2xl text-[#60A5FA]">
                    {boothStats.sessionsToday}
                  </div>
                </div>
                <div className="p-3 bg-[#1C1D21] border border-[#32353D] rounded-lg text-center">
                  <div className="text-[10px] font-medium uppercase text-[#A1A1AA]">
                    QUESTIONS SOLVED
                  </div>
                  <div className="font-heading font-bold text-2xl text-white">
                    {boothStats.totalQuestionsAnswered}
                  </div>
                </div>
                <div className="p-3 bg-[#1C1D21] border border-[#32353D] rounded-lg text-center">
                  <div className="text-[10px] font-medium uppercase text-[#A1A1AA]">
                    OVERALL ACCURACY
                  </div>
                  <div className="font-heading font-bold text-2xl text-emerald-400">
                    {boothStats.totalQuestionsAnswered > 0
                      ? `${Math.round((boothStats.totalCorrect / boothStats.totalQuestionsAnswered) * 100)}%`
                      : '0%'}
                  </div>
                </div>
              </div>

              {/* 1-Click Facilitator Actions */}
              <div className="space-y-2.5">
                <div className="text-xs font-medium uppercase tracking-wider text-[#A1A1AA]">
                  SESSION MANAGEMENT
                </div>

                {/* Start Fresh Participant Session */}
                <button
                  onClick={() => {
                    onStartNewSession();
                    onClose();
                  }}
                  className="w-full p-3.5 bg-[#2463F5] hover:bg-[#1D52D4] text-white font-semibold text-sm rounded-lg flex items-center justify-between cursor-pointer transition-colors shadow-sm"
                >
                  <div className="flex items-center gap-2.5">
                    <Play className="w-4 h-4" />
                    <span>START FRESH PARTICIPANT SESSION</span>
                  </div>
                  <span className="text-[11px] font-mono-code bg-black/30 px-2 py-0.5 rounded">
                    1-CLICK RESET
                  </span>
                </button>

                {/* Reset Score & Round Counter */}
                <button
                  onClick={onResetScoreAndRounds}
                  className="w-full p-3 bg-[#1C1D21] hover:bg-[#202227] text-zinc-200 border border-[#32353D] font-medium text-sm rounded-lg flex items-center justify-between cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <RotateCcw className="w-4 h-4 text-[#60A5FA]" />
                    <span>RESET CURRENT SCORE & ROUNDS</span>
                  </div>
                  <span className="text-xs text-[#A1A1AA]">ZERO SCORE</span>
                </button>

                {/* Return to Main Menu */}
                <button
                  onClick={() => {
                    onReturnToMainMenu();
                    onClose();
                  }}
                  className="w-full p-3 bg-[#1C1D21] hover:bg-[#202227] text-zinc-200 border border-[#32353D] font-medium text-sm rounded-lg flex items-center justify-between cursor-pointer transition-colors"
                >
                  <span>RETURN TO TITLE SCREEN</span>
                  <span className="text-xs text-[#A1A1AA]">MAIN MENU</span>
                </button>
              </div>

              {/* Booth Timer Tuning */}
              <div className="p-4 bg-[#1C1D21] border border-[#32353D] rounded-lg space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-[#60A5FA]" />
                    <span className="font-semibold text-sm">
                      QUESTION COUNTDOWN DURATION
                    </span>
                  </div>
                  <button
                    onClick={() => onToggleTimer(!timerEnabled)}
                    className={`text-xs px-2.5 py-1 font-semibold rounded cursor-pointer transition-colors ${
                      timerEnabled ? 'bg-[#2463F5] text-white' : 'bg-[#25262B] text-zinc-400 border border-[#32353D]'
                    }`}
                  >
                    {timerEnabled ? 'ACTIVE' : 'UNLIMITED'}
                  </button>
                </div>

                {timerEnabled && (
                  <div className="flex items-center gap-2 pt-1 text-xs">
                    <span className="text-[#A1A1AA]">Pace:</span>
                    {[15, 20, 30].map(sec => (
                      <button
                        key={sec}
                        onClick={() => onUpdateTimerDuration(sec)}
                        className={`px-2.5 py-1 rounded font-medium cursor-pointer transition-colors ${
                          timerDuration === sec
                            ? 'bg-[#2463F5] text-white'
                            : 'bg-[#25262B] text-zinc-400 hover:text-white border border-[#32353D]'
                        }`}
                      >
                        {sec}s
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* TTS Voice Narration Quick Switch */}
              {onToggleTTS && (
                <div className="p-4 bg-[#1C1D21] border border-[#32353D] rounded-lg flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-sm">
                      VOICE NARRATION (FEMALE TTS)
                    </div>
                    <div className="text-xs text-[#A1A1AA]">
                      Read questions aloud automatically
                    </div>
                  </div>
                  <button
                    onClick={() => onToggleTTS(!ttsEnabled)}
                    className={`text-xs px-2.5 py-1 font-semibold rounded cursor-pointer transition-colors ${
                      ttsEnabled ? 'bg-[#2463F5] text-white' : 'bg-[#25262B] text-zinc-400 border border-[#32353D]'
                    }`}
                  >
                    {ttsEnabled ? 'ENABLED' : 'MUTED'}
                  </button>
                </div>
              )}
            </>
          )}

          {activeTab === 'leaderboard' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-[#A1A1AA]">
                  TODAY'S EVENT LEADERBOARD
                </span>
                {highScores.length > 0 && (
                  <button
                    onClick={onClearLeaderboard}
                    className="text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Reset List
                  </button>
                )}
              </div>

              {highScores.length === 0 ? (
                <div className="p-6 text-center bg-[#1C1D21] border border-dashed border-[#32353D] rounded-lg text-xs text-[#A1A1AA]">
                  No participant entries recorded yet today. Completed 5-round runs can be logged here!
                </div>
              ) : (
                <div className="space-y-2">
                  {highScores.slice(0, 10).map((entry, idx) => (
                    <div
                      key={entry.id || idx}
                      className="p-3 bg-[#1C1D21] border border-[#32353D] rounded-lg flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center gap-3">
                        <span className={`w-5 h-5 rounded font-mono-code font-bold text-xs flex items-center justify-center ${
                          idx === 0 ? 'bg-amber-500 text-black' : idx === 1 ? 'bg-zinc-300 text-black' : idx === 2 ? 'bg-amber-700 text-white' : 'bg-[#25262B] text-zinc-400'
                        }`}>
                          {idx + 1}
                        </span>
                        <span className="font-semibold text-white">
                          {entry.participantName}
                        </span>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-[#A1A1AA]">
                          {entry.correctCount}/5 correct
                        </span>
                        <span className="font-bold text-[#60A5FA]">
                          {entry.score} pts
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'guide' && (
            <div className="space-y-3 text-xs leading-relaxed text-[#A1A1AA]">
              <div className="p-3 bg-[#1C1D21] border border-[#32353D] rounded-lg">
                <div className="font-semibold text-white mb-1">
                  1. Lateral Reading over Close Reading
                </div>
                Don't judge a website by how clean or official it looks. Open a new tab and search what other neutral outlets say about that author, domain, or claim.
              </div>
              <div className="p-3 bg-[#1C1D21] border border-[#32353D] rounded-lg">
                <div className="font-semibold text-white mb-1">
                  2. Breaking the Forwarding Chain
                </div>
                Emphasize to students: if a WhatsApp or Telegram message has a "Forwarded many times" tag and asks you to pass it along immediately, pause and verify first.
              </div>
              <div className="p-3 bg-[#1C1D21] border border-[#32353D] rounded-lg">
                <div className="font-semibold text-white mb-1">
                  3. Outrage as a Currency (Ragebait)
                </div>
                Creators earn advertising revenue and algorithmic reach when users argue in comments. Before replying in anger, ask: was this crafted just to trigger my emotion?
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#32353D] flex justify-end bg-[#1E2025]">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-[#25262B] hover:bg-[#2C2E35] text-zinc-300 hover:text-white text-xs font-semibold rounded-lg border border-[#32353D] transition-colors cursor-pointer"
          >
            CLOSE CONSOLE
          </button>
        </div>
      </div>
    </div>
  );
};
