/**
 * Web Audio API synthesizer for THE FACT SPIN
 * 100% offline, zero external audio asset dependencies!
 */

class SoundEngine {
  private ctx: AudioContext | null = null;
  private musicInterval: number | null = null;
  private musicGainNode: GainNode | null = null;
  private isMusicPlaying: boolean = false;

  private initContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  /**
   * Mechanical ratchet / flapper tick sound when a segment passes under the pointer.
   * Pitch slightly modulated for realism.
   */
  public playWheelTick(soundEnabled: boolean = true) {
    if (!soundEnabled) return;
    const ctx = this.initContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      // Sharp click with short impulse
      osc.type = 'triangle';
      const baseFreq = 580 + (Math.random() * 80 - 40);
      osc.frequency.setValueAtTime(baseFreq, now);
      osc.frequency.exponentialRampToValueAtTime(140, now + 0.035);

      gain.gain.setValueAtTime(0.18, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.035);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.038);
    } catch {
      // Ignore audio context state issues
    }
  }

  /**
   * Celebratory success chime (C5 - E5 - G5 - C6 major arpeggio)
   */
  public playSuccess(soundEnabled: boolean = true) {
    if (!soundEnabled) return;
    const ctx = this.initContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
      
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const noteTime = now + idx * 0.08;

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, noteTime);

        gain.gain.setValueAtTime(0.2, noteTime);
        gain.gain.exponentialRampToValueAtTime(0.001, noteTime + 0.35);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(noteTime);
        osc.stop(noteTime + 0.36);
      });
    } catch {
      // Audio context error fallback
    }
  }

  /**
   * Gentle incorrect answer sound (low descending tone)
   */
  public playIncorrect(soundEnabled: boolean = true) {
    if (!soundEnabled) return;
    const ctx = this.initContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(220, now);
      osc.frequency.exponentialRampToValueAtTime(130, now + 0.28);

      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);

      // Lowpass filter to keep it soft, not harsh
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(450, now);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.3);
    } catch {
      // Audio fallback
    }
  }

  /**
   * UI tactile button click
   */
  public playButtonClick(soundEnabled: boolean = true) {
    if (!soundEnabled) return;
    const ctx = this.initContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(700, now);
      osc.frequency.exponentialRampToValueAtTime(350, now + 0.04);

      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.045);
    } catch {
      // Audio fallback
    }
  }

  /**
   * Timer warning blip when under 5 seconds
   */
  public playTimerWarning(soundEnabled: boolean = true) {
    if (!soundEnabled) return;
    const ctx = this.initContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, now); // A5

      gain.gain.setValueAtTime(0.1, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.09);
    } catch {
      // Audio fallback
    }
  }

  /**
   * Category reveal fanfare
   */
  public playCategoryReveal(soundEnabled: boolean = true) {
    if (!soundEnabled) return;
    const ctx = this.initContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const notes = [440, 554.37, 659.25, 880]; // A4, C#5, E5, A5
      notes.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const start = now + i * 0.07;
        
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, start);
        gain.gain.setValueAtTime(0.15, start);
        gain.gain.exponentialRampToValueAtTime(0.001, start + 0.4);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(start);
        osc.stop(start + 0.42);
      });
    } catch {
      // Audio fallback
    }
  }

  /**
   * Upbeat background arcade groove generated via Web Audio API.
   * Completely offline, pleasant, and non-distracting!
   */
  public startBackgroundMusic(musicEnabled: boolean) {
    if (!musicEnabled) {
      this.stopBackgroundMusic();
      return;
    }
    if (this.isMusicPlaying) return;

    const ctx = this.initContext();
    if (!ctx) return;

    this.isMusicPlaying = true;
    const tempo = 112; // BPM
    const stepDuration = 60 / tempo / 2; // Eighth note
    let step = 0;

    // Upbeat pentatonic groove progression in D Major / B Minor
    const bassline = [146.83, 0, 146.83, 164.81, 185.00, 0, 220.00, 196.00]; // D3, E3, F#3, A3, G3
    const leadNotes = [587.33, 659.25, 739.99, 880.00, 0, 739.99, 659.25, 587.33]; // D5, E5, F#5, A5

    this.musicInterval = window.setInterval(() => {
      if (!this.isMusicPlaying || !this.ctx) return;
      try {
        const now = this.ctx.currentTime;
        const currentStep = step % 8;

        // Bass synth
        const bassFreq = bassline[currentStep];
        if (bassFreq > 0) {
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          const filter = this.ctx.createBiquadFilter();

          osc.type = 'triangle';
          osc.frequency.setValueAtTime(bassFreq, now);

          filter.type = 'lowpass';
          filter.frequency.setValueAtTime(320, now);

          gain.gain.setValueAtTime(0.04, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + stepDuration * 0.9);

          osc.connect(filter);
          filter.connect(gain);
          gain.connect(this.ctx.destination);

          osc.start(now);
          osc.stop(now + stepDuration);
        }

        // Soft melodic blip every 2 steps
        if (currentStep % 2 === 0) {
          const leadFreq = leadNotes[currentStep];
          if (leadFreq > 0) {
            const leadOsc = this.ctx.createOscillator();
            const leadGain = this.ctx.createGain();
            leadOsc.type = 'sine';
            leadOsc.frequency.setValueAtTime(leadFreq, now);

            leadGain.gain.setValueAtTime(0.025, now);
            leadGain.gain.exponentialRampToValueAtTime(0.001, now + stepDuration * 1.5);

            leadOsc.connect(leadGain);
            leadGain.connect(this.ctx.destination);

            leadOsc.start(now);
            leadOsc.stop(now + stepDuration * 1.6);
          }
        }

        step++;
      } catch {
        // Continue loop gracefully
      }
    }, stepDuration * 1000);
  }

  public stopBackgroundMusic() {
    this.isMusicPlaying = false;
    if (this.musicInterval !== null) {
      clearInterval(this.musicInterval);
      this.musicInterval = null;
    }
  }

  public setMusicEnabled(enabled: boolean) {
    if (enabled) {
      this.startBackgroundMusic(true);
    } else {
      this.stopBackgroundMusic();
    }
  }
}

export const sound = new SoundEngine();
