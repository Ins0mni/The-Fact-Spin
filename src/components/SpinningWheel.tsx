import React, { useRef, useState, useEffect } from 'react';
import { CATEGORIES } from '../data/categories';
import { Category } from '../types';
import { sound } from '../utils/audio';
import { RotateCw, Sparkles } from 'lucide-react';

interface SpinningWheelProps {
  onSpinComplete: (selectedCategory: Category) => void;
  isSpinning: boolean;
  setIsSpinning: (spinning: boolean) => void;
  soundEnabled: boolean;
  reducedMotion: boolean;
}

export const SpinningWheel: React.FC<SpinningWheelProps> = ({
  onSpinComplete,
  isSpinning,
  setIsSpinning,
  soundEnabled,
  reducedMotion
}) => {
  const [rotation, setRotation] = useState<number>(0);
  const [flapperAngle, setFlapperAngle] = useState<number>(0);
  const animationFrameRef = useRef<number | null>(null);
  const currentRotationRef = useRef<number>(0);
  const lastTickPegRef = useRef<number>(-1);

  const spin = () => {
    if (isSpinning) return;

    sound.playButtonClick(soundEnabled);
    setIsSpinning(true);

    const targetIndex = Math.floor(Math.random() * CATEGORIES.length);
    const chosenCategory = CATEGORIES[targetIndex].id;

    // Segment K is centered at K * 60 degrees.
    // Pointer at 12 o'clock (0 deg) requires:
    // Wheel final angle modulo 360 = (360 - K * 60) % 360
    const jitter = (Math.random() - 0.5) * 18; // Subtle natural jitter within slice center
    const baseTargetDeg = ((360 - targetIndex * 60) % 360);

    const fullSpins = (reducedMotion ? 2 : 5 + Math.floor(Math.random() * 3)) * 360;

    const currentRot = currentRotationRef.current;
    const currentRemainder = currentRot % 360;
    let delta = (baseTargetDeg + jitter) - currentRemainder;
    if (delta < 0) {
      delta += 360;
    }
    const finalTarget = currentRot + fullSpins + delta;

    const startTime = performance.now();
    const duration = reducedMotion ? 1200 : 4200;

    const animate = (time: number) => {
      const elapsed = time - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Smooth custom ease-out for realistic wheel deceleration
      const easeOut = 1 - Math.pow(1 - progress, 4.2);
      const currentAngle = currentRot + (finalTarget - currentRot) * easeOut;

      currentRotationRef.current = currentAngle;
      setRotation(currentAngle);

      // Flapper deflection and tick sound on boundary pins (12 pins = every 30 degrees)
      const pegSpan = Math.floor((currentAngle + 15) / 30);
      if (pegSpan !== lastTickPegRef.current) {
        lastTickPegRef.current = pegSpan;
        sound.playWheelTick(soundEnabled);
        setFlapperAngle(22);
      } else {
        setFlapperAngle(prev => Math.max(0, prev * 0.84));
      }

      if (progress < 1) {
        animationFrameRef.current = requestAnimationFrame(animate);
      } else {
        setIsSpinning(false);
        setFlapperAngle(0);
        sound.playCategoryReveal(soundEnabled);

        setTimeout(() => {
          onSpinComplete(chosenCategory);
        }, 750);
      }
    };

    animationFrameRef.current = requestAnimationFrame(animate);
  };

  // Keyboard shortcut listener: Space or Enter to spin
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.code === 'Enter') {
        if (!isSpinning && document.activeElement?.tagName !== 'INPUT') {
          e.preventDefault();
          spin();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSpinning, soundEnabled, reducedMotion]);

  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  const size = 480;
  const center = size / 2;
  const outerRadius = 228;
  const segmentRadius = outerRadius - 16; // 212
  const hubRadius = 68;

  // Perimeter calibration ticks (72 micro-notches around outer rim)
  const calibrationTicks = Array.from({ length: 72 }).map((_, i) => {
    const angle = (i * 360) / 72;
    const rad = (angle * Math.PI) / 180;
    const isMajor = i % 12 === 0;
    const isMedium = i % 6 === 0;
    const tickLen = isMajor ? 10 : isMedium ? 6 : 3.5;
    const r1 = outerRadius - 2 - tickLen;
    const r2 = outerRadius - 2;
    return {
      x1: center + r1 * Math.sin(rad),
      y1: center - r1 * Math.cos(rad),
      x2: center + r2 * Math.sin(rad),
      y2: center - r2 * Math.cos(rad),
      isMajor,
      isMedium
    };
  });

  // Category Icon SVG paths
  const getIconPaths = (id: Category) => {
    switch (id) {
      case 'FAKE_NEWS':
        return (
          <>
            <path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2" />
            <path d="M18 14h-8" />
            <path d="M15 18h-5" />
            <path d="M10 6h8v4h-8V6Z" />
          </>
        );
      case 'FAKE_PRODUCTS':
        return (
          <>
            <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
            <path d="M3 6h18" />
            <path d="M16 10a4 4 0 0 1-8 0" />
          </>
        );
      case 'RUMOURS_GOSSIP':
        return (
          <>
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            <path d="M12 7v3" />
            <path d="M12 13h.01" />
          </>
        );
      case 'RAGEBAIT':
        return (
          <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
        );
      case 'FACT_CHECK':
        return (
          <>
            <path d="m8 11 2 2 4-4" />
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
          </>
        );
      case 'MYSTERY_ROUND':
        return (
          <>
            <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
            <path d="M5 3v4" />
            <path d="M19 17v4" />
          </>
        );
    }
  };

  // Category subtitles for sector display
  const getCategorySubtitle = (id: Category) => {
    switch (id) {
      case 'FAKE_NEWS': return 'HEADLINES';
      case 'FAKE_PRODUCTS': return 'STOREFRONTS';
      case 'RUMOURS_GOSSIP': return 'CHAT LEAKS';
      case 'RAGEBAIT': return 'OUTRAGE TRAPS';
      case 'FACT_CHECK': return 'VERIFY SOURCES';
      case 'MYSTERY_ROUND': return 'WILDCARD';
    }
  };

  return (
    <div className="flex flex-col items-center select-none w-full">
      {/* Wheel Stage Box */}
      <div className="relative flex items-center justify-center p-2 sm:p-4">
        {/* Top Precision Mechanical Indicator Pointer */}
        <div 
          className="absolute -top-4 z-30 flex flex-col items-center pointer-events-none drop-shadow-[0_8px_16px_rgba(0,0,0,0.6)]"
          style={{
            transform: `rotate(${flapperAngle}deg)`,
            transformOrigin: 'top center',
            transition: 'transform 0.04s ease-out'
          }}
        >
          {/* Mount plate */}
          <div className="w-10 h-4 bg-[#25262B] border-2 border-[#3E424D] rounded-t-md flex items-center justify-center shadow-md">
            <div className="w-2.5 h-2.5 rounded-full bg-[#2463F5] shadow-[0_0_8px_#2463F5]" />
          </div>
          {/* Pointer Chevron Blade */}
          <svg width="34" height="42" viewBox="0 0 34 42" fill="none">
            <path
              d="M17 42L2 8C0.8 5.6 2.5 3 5.2 3H28.8C31.5 3 33.2 5.6 32 8L17 42Z"
              fill="#2463F5"
              stroke="#60A5FA"
              strokeWidth="2"
            />
            {/* High-contrast interior metallic spine */}
            <path
              d="M17 6V33"
              stroke="#FFFFFF"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            <circle cx="17" cy="8" r="2.5" fill="#FFFFFF" />
          </svg>
        </div>

        {/* The Rotating Wheel SVG Container */}
        <div className="relative w-[340px] h-[340px] sm:w-[420px] sm:h-[420px] md:w-[460px] md:h-[460px]">
          <svg
            viewBox={`0 0 ${size} ${size}`}
            className="w-full h-full drop-shadow-[0_20px_35px_rgba(0,0,0,0.7)]"
            style={{
              transform: `rotate(${rotation}deg)`,
              transformOrigin: 'center center'
            }}
          >
            <defs>
              {/* Outer dark chassis gradient */}
              <radialGradient id="chassisGrad" cx="50%" cy="50%" r="50%">
                <stop offset="78%" stopColor="#1E2025" />
                <stop offset="92%" stopColor="#141518" />
                <stop offset="98%" stopColor="#2E3036" />
                <stop offset="100%" stopColor="#0B0C0E" />
              </radialGradient>
              
              {/* Center Hub metallic gradient */}
              <radialGradient id="hubMetallic" cx="40%" cy="40%" r="60%">
                <stop offset="0%" stopColor="#32353E" />
                <stop offset="50%" stopColor="#25262B" />
                <stop offset="100%" stopColor="#17181B" />
              </radialGradient>

              {/* Wedge Gradient Filters for rich tactile depth */}
              {CATEGORIES.map((cat) => (
                <radialGradient
                  key={`grad-${cat.id}`}
                  id={`wedge-${cat.id}`}
                  cx="50%"
                  cy="20%"
                  r="80%"
                >
                  <stop offset="0%" stopColor={cat.color} stopOpacity="1" />
                  <stop offset="70%" stopColor={cat.color} stopOpacity="0.9" />
                  <stop offset="100%" stopColor="#121316" stopOpacity="0.85" />
                </radialGradient>
              ))}

              {/* Pin specular shine */}
              <radialGradient id="chromePin" cx="35%" cy="35%" r="65%">
                <stop offset="0%" stopColor="#FFFFFF" />
                <stop offset="45%" stopColor="#E4E4E7" />
                <stop offset="85%" stopColor="#71717A" />
                <stop offset="100%" stopColor="#27272A" />
              </radialGradient>

              {/* Soft Drop Shadow for text */}
              <filter id="textGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="1.5" stdDeviation="1.5" floodColor="#000000" floodOpacity="0.95" />
              </filter>
            </defs>

            {/* 1. Heavy Outer Chassis Rim */}
            <circle
              cx={center}
              cy={center}
              r={outerRadius}
              fill="url(#chassisGrad)"
              stroke="#32353D"
              strokeWidth="4"
            />

            {/* 2. Outer Bezel Inner Ring */}
            <circle
              cx={center}
              cy={center}
              r={outerRadius - 6}
              fill="none"
              stroke="#2463F5"
              strokeWidth="1.5"
              strokeOpacity="0.4"
            />

            {/* 3. Perimeter Mechanical Calibration Ticks */}
            {calibrationTicks.map((tick, idx) => (
              <line
                key={`tick-${idx}`}
                x1={tick.x1}
                y1={tick.y1}
                x2={tick.x2}
                y2={tick.y2}
                stroke={tick.isMajor ? '#60A5FA' : tick.isMedium ? '#71717A' : '#3F3F46'}
                strokeWidth={tick.isMajor ? 2.2 : tick.isMedium ? 1.4 : 0.9}
              />
            ))}

            {/* 4. Outer Segment Track Separator */}
            <circle
              cx={center}
              cy={center}
              r={segmentRadius}
              fill="#17181B"
              stroke="#2E3036"
              strokeWidth="3"
            />

            {/* 5. The 6 Category Segments (Radially Aligned) */}
            {CATEGORIES.map((cat, idx) => {
              const startAngle = idx * 60 - 30;
              const endAngle = idx * 60 + 30;
              const startRad = (startAngle * Math.PI) / 180;
              const endRad = (endAngle * Math.PI) / 180;

              const x1 = center + segmentRadius * Math.sin(startRad);
              const y1 = center - segmentRadius * Math.cos(startRad);
              const x2 = center + segmentRadius * Math.sin(endRad);
              const y2 = center - segmentRadius * Math.cos(endRad);

              const pathData = [
                `M ${center} ${center}`,
                `L ${x1} ${y1}`,
                `A ${segmentRadius} ${segmentRadius} 0 0 1 ${x2} ${y2}`,
                'Z'
              ].join(' ');

              const isRumours = cat.id === 'RUMOURS_GOSSIP';

              return (
                <g key={cat.id}>
                  {/* Segment Colored Surface */}
                  <path
                    d={pathData}
                    fill={`url(#wedge-${cat.id})`}
                    stroke="#17181B"
                    strokeWidth="3.5"
                  />

                  {/* Inner subtle arc accent line */}
                  <path
                    d={[
                      `M ${center + (segmentRadius - 26) * Math.sin(startRad)} ${center - (segmentRadius - 26) * Math.cos(startRad)}`,
                      `A ${segmentRadius - 26} ${segmentRadius - 26} 0 0 1 ${center + (segmentRadius - 26) * Math.sin(endRad)} ${center - (segmentRadius - 26) * Math.cos(endRad)}`
                    ].join(' ')}
                    fill="none"
                    stroke="rgba(255, 255, 255, 0.22)"
                    strokeWidth="1.5"
                    strokeDasharray="4 3"
                  />

                  {/* RADIAL CONTENT GROUP: Rotated perfectly around center */}
                  <g transform={`rotate(${idx * 60} ${center} ${center})`}>
                    {/* Sector Index Pill Badge */}
                    <g transform={`translate(${center}, 48)`}>
                      <rect
                        x="-17"
                        y="-8.5"
                        width="34"
                        height="17"
                        rx="8.5"
                        fill="rgba(0, 0, 0, 0.55)"
                        stroke="rgba(255, 255, 255, 0.35)"
                        strokeWidth="1.2"
                      />
                      <text
                        x="0"
                        y="3.5"
                        textAnchor="middle"
                        fill="#FFFFFF"
                        fontSize="9.5"
                        fontWeight="700"
                        className="font-mono-code"
                        letterSpacing="0.05em"
                      >
                        {cat.number}
                      </text>
                    </g>

                    {/* Category Icon Emblem */}
                    <g transform={`translate(${center}, 84)`}>
                      <circle
                        cx="0"
                        cy="0"
                        r="18"
                        fill="rgba(0, 0, 0, 0.45)"
                        stroke="rgba(255, 255, 255, 0.35)"
                        strokeWidth="1.5"
                      />
                      <g 
                        transform="translate(-10, -10)" 
                        stroke="#FFFFFF" 
                        strokeWidth="2.2" 
                        fill="none" 
                        strokeLinecap="round" 
                        strokeLinejoin="round"
                        className="w-5 h-5"
                      >
                        {getIconPaths(cat.id)}
                      </g>
                    </g>

                    {/* Category Title Typography */}
                    {isRumours ? (
                      <g filter="url(#textGlow)">
                        <text
                          x={center}
                          y="118"
                          textAnchor="middle"
                          fill="#FFFFFF"
                          fontSize="13"
                          fontWeight="800"
                          className="font-heading"
                          letterSpacing="0.03em"
                        >
                          RUMOURS
                        </text>
                        <text
                          x={center}
                          y="132"
                          textAnchor="middle"
                          fill="#FFFFFF"
                          fontSize="12"
                          fontWeight="800"
                          className="font-heading"
                          letterSpacing="0.03em"
                        >
                          & GOSSIP
                        </text>
                      </g>
                    ) : (
                      <g filter="url(#textGlow)">
                        <text
                          x={center}
                          y="126"
                          textAnchor="middle"
                          fill="#FFFFFF"
                          fontSize="13.5"
                          fontWeight="800"
                          className="font-heading uppercase"
                          letterSpacing="0.04em"
                        >
                          {cat.shortTitle}
                        </text>
                      </g>
                    )}

                    {/* Secondary Field Subtitle */}
                    <text
                      x={center}
                      y="146"
                      textAnchor="middle"
                      fill="rgba(255, 255, 255, 0.85)"
                      fontSize="8"
                      fontWeight="600"
                      className="font-mono-code"
                      letterSpacing="0.1em"
                    >
                      {getCategorySubtitle(cat.id)}
                    </text>
                  </g>
                </g>
              );
            })}

            {/* 6. Chrome Boundary Pegs (12 pins: seams & midpoints) */}
            {Array.from({ length: 12 }).map((_, idx) => {
              const pinAngle = idx * 30 + 15;
              const pinRad = (pinAngle * Math.PI) / 180;
              const pinDist = segmentRadius - 6;
              const px = center + pinDist * Math.sin(pinRad);
              const py = center - pinDist * Math.cos(pinRad);
              const isSeam = idx % 2 === 0;

              return (
                <g key={`pin-${idx}`}>
                  {/* Outer Socket */}
                  <circle 
                    cx={px} 
                    cy={py} 
                    r={isSeam ? 6 : 4.5} 
                    fill="#121316" 
                    stroke="#2E3036" 
                    strokeWidth="1.5" 
                  />
                  {/* Chrome Pin Head */}
                  <circle 
                    cx={px} 
                    cy={py} 
                    r={isSeam ? 4 : 3} 
                    fill="url(#chromePin)" 
                    stroke="#1E2025" 
                    strokeWidth="0.8" 
                  />
                </g>
              );
            })}

            {/* 7. Center Hub Base (Backing Disc) */}
            <circle
              cx={center}
              cy={center}
              r={hubRadius + 8}
              fill="#141518"
              stroke="#2E3036"
              strokeWidth="2"
            />
            {/* Center Hub Inner Metallic Bezel */}
            <circle
              cx={center}
              cy={center}
              r={hubRadius}
              fill="url(#hubMetallic)"
              stroke="#2463F5"
              strokeWidth="2.5"
            />
            {/* Illuminated Cobalt Indicator Ring */}
            <circle
              cx={center}
              cy={center}
              r={hubRadius - 4}
              fill="none"
              stroke="#60A5FA"
              strokeWidth="1"
              strokeDasharray="5 3"
              strokeOpacity="0.65"
            />
          </svg>

          {/* Central Tactile Spin Button (Overlaying Hub) */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-auto">
            <button
              onClick={spin}
              disabled={isSpinning}
              aria-label="Spin the wheel"
              className={`w-28 h-28 sm:w-32 sm:h-32 rounded-full flex flex-col items-center justify-center transition-all z-20 cursor-pointer border-2 shadow-[0_4px_20px_rgba(0,0,0,0.6)] ${
                isSpinning
                  ? 'bg-[#18191D] border-[#2E3036] text-zinc-500 cursor-not-allowed scale-95'
                  : 'bg-[#25262B] hover:bg-[#2C2E35] border-[#3E424D] hover:border-[#2463F5] text-white active:scale-95 shadow-[0_0_15px_rgba(36,99,245,0.25)]'
              }`}
            >
              {/* Glowing LED Status Dot */}
              <div className={`w-2 h-2 rounded-full mb-1 transition-all ${
                isSpinning 
                  ? 'bg-amber-400 animate-ping' 
                  : 'bg-[#2463F5] shadow-[0_0_8px_#2463F5]'
              }`} />
              
              <span className="font-heading text-xl sm:text-2xl font-bold tracking-tight uppercase leading-none">
                {isSpinning ? 'SPINNING' : 'SPIN'}
              </span>
              
              <span className="font-mono-code text-[9px] text-[#A1A1AA] uppercase mt-1 tracking-wider">
                {isSpinning ? 'STAND BY' : 'PRESS TO PLAY'}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Primary Action Button below wheel */}
      <div className="mt-3 flex flex-col items-center gap-2 w-full max-w-xs px-4">
        <button
          onClick={spin}
          disabled={isSpinning}
          className={`w-full py-3.5 px-6 rounded-lg font-semibold text-base transition-all duration-150 flex items-center justify-center gap-2.5 cursor-pointer shadow-md ${
            isSpinning
              ? 'bg-[#25262B] text-zinc-500 border border-[#32353D] cursor-not-allowed'
              : 'bg-[#2463F5] hover:bg-[#1D52D4] active:bg-[#1945B8] text-white'
          }`}
        >
          <RotateCw className={`w-4 h-4 ${isSpinning ? 'animate-spin' : ''}`} />
          <span>{isSpinning ? 'WHEEL ROTATING...' : 'SPIN THE WHEEL'}</span>
        </button>
        <div className="flex items-center gap-2 text-xs text-[#A1A1AA]">
          <span>Press [Space] or tap center to spin</span>
        </div>
      </div>
    </div>
  );
};
