import React from 'react';
import { ArrowLeft, Shield, Terminal, Award } from 'lucide-react';

interface CreditsScreenProps {
  onBackToMenu: () => void;
}

export const CreditsScreen: React.FC<CreditsScreenProps> = ({ onBackToMenu }) => {
  return (
    <div className="w-full max-w-3xl mx-auto my-auto p-5 sm:p-8 bg-[#25262B] border border-[#32353D] rounded-xl shadow-xl text-white relative animate-in fade-in duration-200">
      {/* Top Header */}
      <div className="flex items-center justify-between border-b border-[#32353D] pb-3 mb-6">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#2463F5]" />
          <span className="text-xs font-semibold uppercase tracking-wider text-[#60A5FA]">
            DYAP / PRODUCTION ATTRIBUTION
          </span>
        </div>
        <span className="text-[11px] px-2 py-0.5 rounded bg-[#1C1D21] text-[#A1A1AA] border border-[#32353D] font-mono-code">
          DOC_REF #2026-CRD
        </span>
      </div>

      {/* Main Credits Header */}
      <div className="text-center mb-8">
        <div className="inline-block px-3 py-1 rounded bg-[#2463F5]/10 border border-[#2463F5]/30 text-[#60A5FA] text-xs font-semibold tracking-wider uppercase mb-3">
          A DYAP PROJECT
        </div>

        <h1 className="font-heading font-bold text-4xl sm:text-5xl text-white tracking-tight leading-none mb-2">
          THE FACT SPIN
        </h1>
        <div className="text-xs font-medium uppercase tracking-widest text-[#A1A1AA]">
          SPIN IT. QUESTION IT. VERIFY IT.
        </div>
      </div>

      {/* Structured Credits Matrix */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {/* Creation Card */}
        <div className="p-5 bg-[#1C1D21] border border-[#32353D] rounded-xl flex flex-col justify-between">
          <div>
            <div className="text-[11px] uppercase font-medium text-[#A1A1AA] tracking-wider mb-1 flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-[#60A5FA]" />
              CREATED BY
            </div>
            <div className="font-heading font-bold text-2xl text-white tracking-tight uppercase">
              THE DYAP TEAM
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-[#2E3036] text-xs text-[#A1A1AA]">
            Digital Youth Ambassador Programme initiatives & youth advocacy
          </div>
        </div>

        {/* Development Card */}
        <div className="p-5 bg-[#1C1D21] border border-[#32353D] rounded-xl flex flex-col justify-between">
          <div>
            <div className="text-[11px] uppercase font-medium text-[#A1A1AA] tracking-wider mb-1 flex items-center gap-1.5">
              <Terminal className="w-3.5 h-3.5 text-[#60A5FA]" />
              GAME CONCEPT & DEVELOPMENT
            </div>
            <div className="font-heading font-bold text-2xl text-[#60A5FA] tracking-tight uppercase">
              SHENRAA
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-[#2E3036] text-xs text-[#A1A1AA]">
            Interactive mechanics, wheel physics & digital experience design
          </div>
        </div>

        {/* Programme Card (Full Width) */}
        <div className="md:col-span-2 p-5 bg-[#1C1D21] border border-[#32353D] rounded-xl">
          <div className="text-[11px] uppercase font-medium text-[#A1A1AA] tracking-wider mb-1 flex items-center gap-1.5">
            <Award className="w-3.5 h-3.5 text-[#60A5FA]" />
            PROGRAMME
          </div>
          <div className="font-heading font-bold text-xl sm:text-2xl text-white tracking-tight uppercase">
            DIGITAL YOUTH AMBASSADOR PROGRAMME
          </div>
          <p className="mt-2 text-xs sm:text-sm text-[#A1A1AA] leading-relaxed font-normal">
            An educational initiative empowering young people and students to navigate online media, deconstruct viral misinformation, identify deceptive marketing, and practice evidence-based lateral verification.
          </p>
        </div>
      </div>

      {/* Footer Navigation Strip */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-[#32353D]">
        <div className="text-xs text-[#A1A1AA] text-center sm:text-left">
          Official attribution for booth and classroom exhibition
        </div>

        <button
          onClick={onBackToMenu}
          className="w-full sm:w-auto px-5 py-2.5 bg-[#2463F5] hover:bg-[#1D52D4] text-white font-medium text-sm rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>BACK TO MAIN MENU</span>
        </button>
      </div>
    </div>
  );
};
