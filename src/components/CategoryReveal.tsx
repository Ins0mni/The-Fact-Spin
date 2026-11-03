import React, { useEffect, useState } from 'react';
import { Category } from '../types';
import { CATEGORY_MAP } from '../data/categories';
import { ArrowRight } from 'lucide-react';

interface CategoryRevealProps {
  category: Category;
  roundNumber: number;
  totalRounds: number;
  onContinue: () => void;
  reducedMotion: boolean;
}

export const CategoryReveal: React.FC<CategoryRevealProps> = ({
  category,
  roundNumber,
  totalRounds,
  onContinue,
  reducedMotion
}) => {
  const cat = CATEGORY_MAP[category];
  const [countdown, setCountdown] = useState<number>(3);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          onContinue();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [onContinue]);

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-lg p-6 sm:p-8 bg-[#25262B] border border-[#32353D] rounded-xl shadow-2xl text-white relative">
        {/* Top Tagline */}
        <div className="flex items-center justify-between border-b border-[#32353D] pb-3 mb-5">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#60A5FA]">
            ROUND {roundNumber} OF {totalRounds}
          </span>
          <span className="text-[11px] px-2 py-0.5 rounded bg-[#1C1D21] text-[#A1A1AA] border border-[#32353D] font-mono-code">
            {cat.editorialAnnotation}
          </span>
        </div>

        {/* Reveal Header */}
        <div className="text-left mb-4">
          <div className="text-xs font-medium tracking-wider uppercase text-[#A1A1AA] mb-1">
            SELECTED CATEGORY
          </div>
          <div className="flex items-center gap-2.5">
            <span className="w-3 h-3 rounded-full" style={{ backgroundColor: cat.color }} />
            <h2 className="font-heading font-bold text-3xl sm:text-4xl text-white tracking-tight">
              {cat.shortTitle}
            </h2>
          </div>
        </div>

        {/* Tagline Card with category accent background */}
        <div 
          className="p-3.5 mb-4 rounded-lg font-medium text-sm sm:text-base border"
          style={{ 
            backgroundColor: `${cat.color}20`, 
            borderColor: `${cat.color}50`,
            color: '#FFFFFF' 
          }}
        >
          {cat.tagline}
        </div>

        {/* Short Category Description */}
        <p className="text-sm text-[#A1A1AA] leading-relaxed mb-6 font-normal">
          {cat.description}
        </p>

        {/* Action Button */}
        <button
          onClick={onContinue}
          className="w-full py-3.5 px-5 bg-[#2463F5] hover:bg-[#1D52D4] text-white font-semibold text-sm rounded-lg transition-colors flex items-center justify-between cursor-pointer shadow-sm"
        >
          <span>PROCEED TO QUESTION</span>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono-code bg-black/30 text-white/90 px-2 py-0.5 rounded">
              AUTO {countdown}S
            </span>
            <ArrowRight className="w-4 h-4" />
          </div>
        </button>
      </div>
    </div>
  );
};
