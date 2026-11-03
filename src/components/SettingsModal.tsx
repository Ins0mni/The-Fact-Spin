import React, { useState, useEffect } from 'react';
import { GameSettings } from '../types';
import { tts } from '../utils/tts';
import { X, Volume2, VolumeX, Music, Clock, Maximize2, Minimize2, Eye, Mic, Radio, Play } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: GameSettings;
  onUpdateSettings: (newSettings: Partial<GameSettings>) => void;
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
  isFullscreen,
  onToggleFullscreen
}) => {
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [isSpeakingTest, setIsSpeakingTest] = useState<boolean>(false);

  useEffect(() => {
    if (isOpen) {
      const v = tts.getAvailableVoices();
      setVoices(v);
    }
  }, [isOpen]);

  useEffect(() => {
    const unsub = tts.subscribe(setIsSpeakingTest);
    return () => unsub();
  }, []);

  if (!isOpen) return null;

  const currentVoice = tts.getSelectedVoice();

  const handleTestVoice = () => {
    tts.testVoice({
      aiVoice: settings.aiVoice || 'Kore',
      voiceURI: settings.ttsVoiceURI
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-md bg-[#25262B] border border-[#32353D] rounded-xl shadow-2xl text-white overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-[#32353D] flex items-center justify-between shrink-0">
          <div>
            <div className="text-[10px] text-[#60A5FA] font-semibold uppercase tracking-wider">
              SYSTEM CONFIGURATION
            </div>
            <h3 className="font-heading font-bold text-xl uppercase tracking-tight leading-none text-white mt-0.5">
              SETTINGS
            </h3>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-[#1C1D21] transition-colors cursor-pointer"
            aria-label="Close Settings"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Settings Body */}
        <div className="p-5 space-y-3 overflow-y-auto flex-1">
          {/* TTS Voice Narration Toggle */}
          <div className="p-3 bg-[#1C1D21] border border-[#32353D] rounded-lg space-y-2.5">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-semibold text-sm text-white flex items-center gap-1.5">
                  <Mic className="w-3.5 h-3.5 text-[#60A5FA]" />
                  <span>Question Voice Narration</span>
                </div>
                <div className="text-xs text-[#A1A1AA]">
                  Ultra-natural female AI host narration
                </div>
              </div>
              <button
                onClick={() => onUpdateSettings({ ttsEnabled: !settings.ttsEnabled })}
                className={`px-3 py-1 rounded text-xs font-semibold cursor-pointer transition-colors ${
                  settings.ttsEnabled ? 'bg-[#2463F5] text-white' : 'bg-[#25262B] text-zinc-400 border border-[#32353D]'
                }`}
              >
                {settings.ttsEnabled ? 'ON' : 'OFF'}
              </button>
            </div>

            {settings.ttsEnabled && (
              <div className="space-y-3 pt-2.5 border-t border-[#2E3036] text-xs">
                {/* Voice Model Selection */}
                <div>
                  <div className="text-[11px] font-medium text-zinc-300 mb-1.5">Voice Model & Tone:</div>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => onUpdateSettings({ aiVoice: 'Kore' })}
                      className={`p-2 rounded-lg text-left transition-colors border cursor-pointer ${
                        (settings.aiVoice || 'Kore') === 'Kore'
                          ? 'bg-[#2463F5]/20 border-[#2463F5] text-white'
                          : 'bg-[#25262B] border-[#32353D] text-zinc-400 hover:text-white'
                      }`}
                    >
                      <div className="font-semibold text-[11px] flex items-center justify-between">
                        <span>Kore</span>
                        <span className="text-[9px] px-1 py-0.2 rounded bg-[#2463F5] text-white">PRO</span>
                      </div>
                      <div className="text-[10px] text-zinc-400 mt-0.5">Natural young female presenter</div>
                    </button>

                    <button
                      type="button"
                      onClick={() => onUpdateSettings({ aiVoice: 'Aoede' })}
                      className={`p-2 rounded-lg text-left transition-colors border cursor-pointer ${
                        settings.aiVoice === 'Aoede'
                          ? 'bg-[#2463F5]/20 border-[#2463F5] text-white'
                          : 'bg-[#25262B] border-[#32353D] text-zinc-400 hover:text-white'
                      }`}
                    >
                      <div className="font-semibold text-[11px] flex items-center justify-between">
                        <span>Aoede</span>
                        <span className="text-[9px] px-1 py-0.2 rounded bg-[#2463F5] text-white">AI</span>
                      </div>
                      <div className="text-[10px] text-zinc-400 mt-0.5">Articulate, bright & clear</div>
                    </button>
                  </div>
                </div>

                {/* Auto-play toggle */}
                <div className="flex items-center justify-between bg-[#25262B] p-2 rounded border border-[#32353D]">
                  <span className="text-zinc-300">Auto-read questions:</span>
                  <button
                    onClick={() => onUpdateSettings({ ttsAutoPlay: !settings.ttsAutoPlay })}
                    className={`px-2 py-0.5 rounded text-[11px] font-medium cursor-pointer transition-colors ${
                      settings.ttsAutoPlay ? 'bg-[#2463F5] text-white' : 'bg-[#1C1D21] text-zinc-400 border border-[#32353D]'
                    }`}
                  >
                    {settings.ttsAutoPlay ? 'AUTOMATIC' : 'ON DEMAND'}
                  </button>
                </div>

                {/* Voice info & Test button */}
                <div className="flex items-center justify-between bg-[#25262B] p-2.5 rounded border border-[#32353D]">
                  <div className="truncate max-w-[210px]">
                    <div className="text-[10px] text-[#60A5FA] uppercase font-semibold">Active AI Narrator</div>
                    <div className="font-medium text-white truncate text-[11px]">
                      {settings.aiVoice === 'Aoede' ? 'Aoede (Gemini 3.8 Natural AI)' : 'Kore (Gemini 3.8 Natural AI)'}
                    </div>
                  </div>
                  <button
                    onClick={handleTestVoice}
                    className={`px-3 py-1.5 text-xs rounded-md font-medium flex items-center gap-1.5 transition-colors cursor-pointer ${
                      isSpeakingTest 
                        ? 'bg-[#2463F5] text-white animate-pulse' 
                        : 'bg-[#1C1D21] hover:bg-[#2C2E35] text-[#60A5FA] border border-[#32353D]'
                    }`}
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>{isSpeakingTest ? 'Playing...' : 'Test Voice'}</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Sound FX Toggle */}
          <div className="p-3 bg-[#1C1D21] border border-[#32353D] rounded-lg flex items-center justify-between">
            <div>
              <div className="font-semibold text-sm text-white">
                Sound Effects
              </div>
              <div className="text-xs text-[#A1A1AA]">
                Wheel ratchet ticks, clicks, chimes
              </div>
            </div>
            <button
              onClick={() => onUpdateSettings({ soundEnabled: !settings.soundEnabled })}
              className={`px-3 py-1 rounded text-xs font-semibold cursor-pointer transition-colors ${
                settings.soundEnabled ? 'bg-[#2463F5] text-white' : 'bg-[#25262B] text-zinc-400 border border-[#32353D]'
              }`}
            >
              {settings.soundEnabled ? 'ON' : 'OFF'}
            </button>
          </div>

          {/* Background Music Toggle */}
          <div className="p-3 bg-[#1C1D21] border border-[#32353D] rounded-lg flex items-center justify-between">
            <div>
              <div className="font-semibold text-sm text-white">
                Arcade Music Groove
              </div>
              <div className="text-xs text-[#A1A1AA]">
                Synthesized offline ambient beat
              </div>
            </div>
            <button
              onClick={() => onUpdateSettings({ musicEnabled: !settings.musicEnabled })}
              className={`px-3 py-1 rounded text-xs font-semibold cursor-pointer transition-colors ${
                settings.musicEnabled ? 'bg-[#2463F5] text-white' : 'bg-[#25262B] text-zinc-400 border border-[#32353D]'
              }`}
            >
              {settings.musicEnabled ? 'ON' : 'OFF'}
            </button>
          </div>

          {/* Countdown Timer Toggle & Duration */}
          <div className="p-3 bg-[#1C1D21] border border-[#32353D] rounded-lg space-y-2.5">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-semibold text-sm text-white">
                  Question Timer
                </div>
                <div className="text-xs text-[#A1A1AA]">
                  {settings.timerEnabled ? `Active: ${settings.timerDuration}s per question` : 'Disabled (Unlimited)'}
                </div>
              </div>
              <button
                onClick={() => onUpdateSettings({ timerEnabled: !settings.timerEnabled })}
                className={`px-3 py-1 rounded text-xs font-semibold cursor-pointer transition-colors ${
                  settings.timerEnabled ? 'bg-[#2463F5] text-white' : 'bg-[#25262B] text-zinc-400 border border-[#32353D]'
                }`}
              >
                {settings.timerEnabled ? 'ON' : 'OFF'}
              </button>
            </div>

            {settings.timerEnabled && (
              <div className="flex items-center gap-2 pt-1 border-t border-[#2E3036]">
                <span className="text-xs text-[#A1A1AA]">Duration:</span>
                {[15, 20, 30].map((dur) => (
                  <button
                    key={dur}
                    onClick={() => onUpdateSettings({ timerDuration: dur })}
                    className={`px-2.5 py-1 text-xs font-medium rounded cursor-pointer transition-colors ${
                      settings.timerDuration === dur
                        ? 'bg-[#2463F5] text-white'
                        : 'bg-[#25262B] text-zinc-400 hover:text-white border border-[#32353D]'
                    }`}
                  >
                    {dur}s
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Fullscreen Option */}
          <div className="p-3 bg-[#1C1D21] border border-[#32353D] rounded-lg flex items-center justify-between">
            <div>
              <div className="font-semibold text-sm text-white">
                Fullscreen Mode
              </div>
              <div className="text-xs text-[#A1A1AA]">
                Optimal display for school booth setups
              </div>
            </div>
            <button
              onClick={onToggleFullscreen}
              className="p-1.5 rounded bg-[#25262B] border border-[#32353D] text-zinc-300 hover:text-white cursor-pointer"
              title="Toggle Fullscreen"
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
          </div>

          {/* Reduced Motion Toggle */}
          <div className="p-3 bg-[#1C1D21] border border-[#32353D] rounded-lg flex items-center justify-between">
            <div>
              <div className="font-semibold text-sm text-white">
                Reduced Motion
              </div>
              <div className="text-xs text-[#A1A1AA]">
                Faster spins & subtle transitions
              </div>
            </div>
            <button
              onClick={() => onUpdateSettings({ reducedMotion: !settings.reducedMotion })}
              className={`px-3 py-1 rounded text-xs font-semibold cursor-pointer transition-colors ${
                settings.reducedMotion ? 'bg-[#2463F5] text-white' : 'bg-[#25262B] text-zinc-400 border border-[#32353D]'
              }`}
            >
              {settings.reducedMotion ? 'ON' : 'OFF'}
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#32353D] flex items-center justify-between bg-[#1E2025] shrink-0">
          <button
            onClick={() => onUpdateSettings({
              soundEnabled: true,
              musicEnabled: false,
              timerEnabled: true,
              timerDuration: 20,
              reducedMotion: false,
              ttsEnabled: true,
              ttsAutoPlay: true
            })}
            className="text-xs text-[#A1A1AA] hover:text-white underline cursor-pointer"
          >
            Reset to Defaults
          </button>

          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-[#2463F5] hover:bg-[#1D52D4] text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer"
          >
            DONE
          </button>
        </div>
      </div>
    </div>
  );
};
