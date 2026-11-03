import React from 'react';
import { X, ArrowRight } from 'lucide-react';
import { CATEGORIES } from '../data/categories';

interface HowToPlayModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HowToPlayModal: React.FC<HowToPlayModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-2xl max-h-[90vh] flex flex-col bg-[#25262B] border border-[#32353D] rounded-xl shadow-2xl text-white overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-[#32353D] flex items-center justify-between">
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-wider text-[#60A5FA]">
              DYAP FIELD MANUAL
            </div>
            <h3 className="font-heading font-bold text-2xl sm:text-3xl text-white tracking-tight leading-none mt-1">
              HOW TO PLAY
            </h3>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-[#1C1D21] transition-colors cursor-pointer"
            aria-label="Close Rules"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5 flex-1 text-sm">
          {/* Tagline */}
          <div className="p-3 bg-[#2463F5]/10 border border-[#2463F5]/30 text-[#60A5FA] font-medium text-sm tracking-wider uppercase text-center rounded-lg">
            SPIN IT. QUESTION IT. VERIFY IT.
          </div>

          {/* 4 Rules Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-4 bg-[#1C1D21] border border-[#32353D] rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <span className="font-mono-code font-bold text-xs bg-[#2463F5]/20 text-[#60A5FA] px-2 py-0.5 rounded">
                  01
                </span>
                <h4 className="font-heading font-bold text-base text-white">
                  SPIN THE WHEEL
                </h4>
              </div>
              <p className="text-xs text-[#A1A1AA] leading-relaxed">
                Click SPIN to rotate the 6-segment physical wheel. Whichever sector stops under the top indicator is your round category.
              </p>
            </div>

            <div className="p-4 bg-[#1C1D21] border border-[#32353D] rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <span className="font-mono-code font-bold text-xs bg-[#2463F5]/20 text-[#60A5FA] px-2 py-0.5 rounded">
                  02
                </span>
                <h4 className="font-heading font-bold text-base text-white">
                  DECIDE: YES OR NO
                </h4>
              </div>
              <p className="text-xs text-[#A1A1AA] leading-relaxed">
                Analyze the simulated post, headline, product listing, or chat leak. Make the call: tap YES or NO (or use hotkeys [Y] and [N]) before time expires!
              </p>
            </div>

            <div className="p-4 bg-[#1C1D21] border border-[#32353D] rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <span className="font-mono-code font-bold text-xs bg-[#2463F5]/20 text-[#60A5FA] px-2 py-0.5 rounded">
                  03
                </span>
                <h4 className="font-heading font-bold text-base text-white">
                  SCORE & SPEED BONUS
                </h4>
              </div>
              <p className="text-xs text-[#A1A1AA] leading-relaxed">
                Every verified answer awards 100 points, plus up to 50 speed bonus points for rapid critical evaluation before time runs out.
              </p>
            </div>

            <div className="p-4 bg-[#1C1D21] border border-[#32353D] rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <span className="font-mono-code font-bold text-xs bg-[#2463F5]/20 text-[#60A5FA] px-2 py-0.5 rounded">
                  04
                </span>
                <h4 className="font-heading font-bold text-base text-white">
                  EARN YOUR TITLE
                </h4>
              </div>
              <p className="text-xs text-[#A1A1AA] leading-relaxed">
                Complete 5 rounds to unlock your official rank: Fact Checker, Feed Detective, Rumour Buster, Digital Sleuth, or Misinformation Master.
              </p>
            </div>
          </div>

          {/* 6 Category Reference */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#A1A1AA] mb-3">
              THE 6 GAME CATEGORIES
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {CATEGORIES.map(cat => (
                <div key={cat.id} className="p-2.5 bg-[#1C1D21] border border-[#32353D] rounded-lg flex items-center gap-2.5">
                  <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: cat.color }} />
                  <div>
                    <div className="font-semibold text-xs text-white">
                      {cat.shortTitle}
                    </div>
                    <div className="text-[11px] text-[#A1A1AA] leading-tight">
                      {cat.tagline}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#32353D] flex justify-end bg-[#1E2025]">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-[#2463F5] hover:bg-[#1D52D4] text-white font-medium text-sm rounded-lg transition-colors cursor-pointer"
          >
            GOT IT
          </button>
        </div>
      </div>
    </div>
  );
};
