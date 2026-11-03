/**
 * Natural AI Voice & Text-to-Speech Engine for THE FACT SPIN
 * Powered by Gemini 3.8 Flash Lite TTS ('Kore' / 'Aoede') with ultra-natural,
 * expressive young woman narration and seamless local browser fallback.
 */

class TTSEngine {
  private synth: SpeechSynthesis | null = null;
  private voices: SpeechSynthesisVoice[] = [];
  private selectedBrowserVoice: SpeechSynthesisVoice | null = null;
  private isSpeakingInternal: boolean = false;
  private listeners: Set<(speaking: boolean) => void> = new Set();
  
  // Audio playback & cache
  private currentAudio: HTMLAudioElement | null = null;
  private activeAbortController: AbortController | null = null;
  private audioBlobCache: Map<string, string> = new Map(); // key -> objectURL
  private prefetchPromises: Map<string, Promise<string | null>> = new Map();

  constructor() {
    if (typeof window !== 'undefined') {
      if ('speechSynthesis' in window) {
        this.synth = window.speechSynthesis;
        this.loadBrowserVoices();
        if (this.synth.onvoiceschanged !== undefined) {
          this.synth.onvoiceschanged = () => this.loadBrowserVoices();
        }
      }
    }
  }

  private loadBrowserVoices() {
    if (!this.synth) return;
    const available = this.synth.getVoices();
    if (available && available.length > 0) {
      this.voices = available;
      this.findBestBrowserFemaleVoice();
    }
  }

  public findBestBrowserFemaleVoice(preferredURI?: string): SpeechSynthesisVoice | null {
    if (!this.voices.length && this.synth) {
      this.voices = this.synth.getVoices();
    }
    if (!this.voices.length) return null;

    if (preferredURI) {
      const match = this.voices.find(v => v.voiceURI === preferredURI);
      if (match) {
        this.selectedBrowserVoice = match;
        return match;
      }
    }

    const preferredFemaleNames = [
      'Microsoft Jenny Online (Natural)',
      'Microsoft Jenny',
      'Microsoft Aria Online (Natural)',
      'Microsoft Aria',
      'Google US English',
      'Samantha',
      'Victoria',
      'Karen',
      'Tessa',
      'Veena',
      'Moira',
      'en-US-Standard-C',
      'en-US-Wavenet-C'
    ];

    for (const name of preferredFemaleNames) {
      const found = this.voices.find(
        v => v.name.toLowerCase().includes(name.toLowerCase()) && v.lang.startsWith('en')
      );
      if (found) {
        this.selectedBrowserVoice = found;
        return found;
      }
    }

    const explicitFemale = this.voices.find(
      v => /female|woman/i.test(v.name) && v.lang.startsWith('en')
    );
    if (explicitFemale) {
      this.selectedBrowserVoice = explicitFemale;
      return explicitFemale;
    }

    const englishDefault = this.voices.find(
      v => v.lang.startsWith('en-US') || v.lang.startsWith('en-GB') || v.lang.startsWith('en')
    );
    if (englishDefault) {
      this.selectedBrowserVoice = englishDefault;
      return englishDefault;
    }

    this.selectedBrowserVoice = this.voices[0] || null;
    return this.selectedBrowserVoice;
  }

  public getAvailableBrowserVoices(): SpeechSynthesisVoice[] {
    if (!this.voices.length && this.synth) {
      this.voices = this.synth.getVoices();
    }
    const english = this.voices.filter(v => v.lang.startsWith('en'));
    return english.length > 0 ? english : this.voices;
  }

  public getAvailableVoices(): SpeechSynthesisVoice[] {
    return this.getAvailableBrowserVoices();
  }

  public getSelectedVoice(): SpeechSynthesisVoice | null {
    if (!this.selectedBrowserVoice) {
      this.findBestBrowserFemaleVoice();
    }
    return this.selectedBrowserVoice;
  }

  public subscribe(callback: (speaking: boolean) => void): () => void {
    this.listeners.add(callback);
    callback(this.isSpeakingInternal);
    return () => this.listeners.delete(callback);
  }

  private setSpeaking(state: boolean) {
    this.isSpeakingInternal = state;
    this.listeners.forEach(cb => cb(state));
  }

  public isSpeaking(): boolean {
    return this.isSpeakingInternal;
  }

  public stop() {
    // Abort pending fetch
    if (this.activeAbortController) {
      this.activeAbortController.abort();
      this.activeAbortController = null;
    }

    // Stop HTML5 audio
    if (this.currentAudio) {
      this.currentAudio.pause();
      this.currentAudio.currentTime = 0;
      this.currentAudio = null;
    }

    // Stop browser speech synthesis
    if (this.synth) {
      this.synth.cancel();
    }

    this.setSpeaking(false);
  }

  /**
   * Cleans question text for smooth, natural human narration without robotic labels.
   */
  public prepareNarrationText(scenarioContent?: string, question?: string): string {
    let cleanScenario = scenarioContent ? scenarioContent.trim() : '';
    // Simplify complex web URLs, handles or hashtags into natural spoken words
    cleanScenario = cleanScenario.replace(/https?:\/\/[^\s]+/gi, 'a web link');
    cleanScenario = cleanScenario.replace(/@[a-zA-Z0-9_]+/g, (match) => match.replace('@', ''));
    cleanScenario = cleanScenario.replace(/#([a-zA-Z0-9_]+)/g, '$1');
    cleanScenario = cleanScenario.replace(/^["']|["']$/g, '');

    const cleanQuestion = question ? question.trim() : '';
    if (!cleanScenario) return cleanQuestion;

    // Remove trailing period/question from scenario before appending conversational transition
    const baseScenario = cleanScenario.replace(/[.?!]+$/, '');
    
    // Choose natural conversational connector
    let connector = 'So, ';
    if (/^(what|why|how|who|which|where)\b/i.test(cleanQuestion)) {
      connector = 'Now, ';
    }

    return `${baseScenario}. ${connector}${cleanQuestion}`;
  }

  /**
   * Pre-fetches the AI voice audio in the background so it plays with 0ms latency when displayed.
   */
  public async preloadQuestion(options: {
    scenarioContent?: string;
    question: string;
    aiVoice?: string;
  }): Promise<string | null> {
    const text = this.prepareNarrationText(options.scenarioContent, options.question);
    const voice = options.aiVoice || 'Kore';
    if (voice === 'device') return null;

    const cacheKey = `${voice}:${text}`;
    if (this.audioBlobCache.has(cacheKey)) {
      return this.audioBlobCache.get(cacheKey)!;
    }

    if (this.prefetchPromises.has(cacheKey)) {
      return this.prefetchPromises.get(cacheKey)!;
    }

    const fetchPromise = (async () => {
      try {
        const response = await fetch('/api/tts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            text,
            voice,
            style: 'A real, articulate young adult woman having a relaxed, normal conversation with another person. Casual, friendly, and confident tone. Smooth and natural delivery with realistic pacing, subtle pauses, and organic changes in intonation. Natural contractions, conversational phrasing, subtle emphasis on key words, and rising intonation on questions. Zero robotic or monotone delivery, no overly formal announcer tone, no exaggerated enthusiasm, and not reading from a script.'
          }),
        });

        if (!response.ok) return null;
        const data = await response.json();
        if (data.audio) {
          const blobUrl = this.base64ToBlobUrl(data.audio, data.mimeType || 'audio/wav');
          this.audioBlobCache.set(cacheKey, blobUrl);
          return blobUrl;
        }
        return null;
      } catch (err) {
        return null;
      } finally {
        this.prefetchPromises.delete(cacheKey);
      }
    })();

    this.prefetchPromises.set(cacheKey, fetchPromise);
    return fetchPromise;
  }

  private base64ToBlobUrl(base64: string, mimeType: string = 'audio/wav'): string {
    const byteCharacters = atob(base64);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: mimeType });
    return URL.createObjectURL(blob);
  }

  /**
   * Main speech function: Plays advanced natural AI audio, falling back to clean browser voice if offline.
   */
  public async speakQuestion(options: {
    scenarioContent?: string;
    question: string;
    aiVoice?: string;
    preferredVoiceURI?: string;
    onEnd?: () => void;
  }) {
    this.stop();

    const speechText = this.prepareNarrationText(options.scenarioContent, options.question);
    if (!speechText) return;

    const selectedVoice = options.aiVoice || 'Kore';

    // If user explicitly chose local device voice
    if (selectedVoice === 'device') {
      this.speakWithBrowserSynth(speechText, options.preferredVoiceURI, options.onEnd);
      return;
    }

    // Try AI voice via /api/tts
    const cacheKey = `${selectedVoice}:${speechText}`;
    let audioUrl: string | null = null;

    if (this.audioBlobCache.has(cacheKey)) {
      audioUrl = this.audioBlobCache.get(cacheKey)!;
    } else {
      this.setSpeaking(true);
      this.activeAbortController = new AbortController();

      try {
        const response = await fetch('/api/tts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            text: speechText,
            voice: selectedVoice,
            style: 'A real, articulate young adult woman having a relaxed, normal conversation with another person. Casual, friendly, and confident tone. Smooth and natural delivery with realistic pacing, subtle pauses, and organic changes in intonation. Natural contractions, conversational phrasing, subtle emphasis on key words, and rising intonation on questions. Zero robotic or monotone delivery, no overly formal announcer tone, no exaggerated enthusiasm, and not reading from a script.'
          }),
          signal: this.activeAbortController.signal,
        });

        if (response.ok) {
          const data = await response.json();
          if (data.audio) {
            audioUrl = this.base64ToBlobUrl(data.audio, data.mimeType || 'audio/wav');
            this.audioBlobCache.set(cacheKey, audioUrl);
          }
        }
      } catch (err: any) {
        if (err.name === 'AbortError') {
          return; // Intentionally stopped
        }
        console.warn('AI TTS server call failed, seamlessly falling back to browser synthesis:', err);
      }
    }

    if (audioUrl) {
      this.playAudioUrl(audioUrl, options.onEnd);
    } else {
      // Graceful fallback to browser speech synthesis
      this.speakWithBrowserSynth(speechText, options.preferredVoiceURI, options.onEnd);
    }
  }

  private playAudioUrl(url: string, onEnd?: () => void) {
    try {
      const audio = new Audio(url);
      this.currentAudio = audio;

      audio.onplay = () => {
        this.setSpeaking(true);
      };

      audio.onended = () => {
        this.setSpeaking(false);
        this.currentAudio = null;
        onEnd?.();
      };

      audio.onerror = () => {
        this.setSpeaking(false);
        this.currentAudio = null;
      };

      audio.play().catch(e => {
        console.warn('Audio play prevented or interrupted:', e);
        this.setSpeaking(false);
      });
    } catch (e) {
      this.setSpeaking(false);
    }
  }

  /**
   * Browser Speech Synthesis fallback
   */
  private speakWithBrowserSynth(text: string, preferredVoiceURI?: string, onEnd?: () => void) {
    if (!this.synth) {
      this.setSpeaking(false);
      return;
    }

    this.synth.cancel();
    const voice = this.findBestBrowserFemaleVoice(preferredVoiceURI);
    const utterance = new SpeechSynthesisUtterance(text);

    if (voice) {
      utterance.voice = voice;
    }
    utterance.lang = voice?.lang || 'en-US';
    utterance.rate = 0.98;
    utterance.pitch = 1.02;
    utterance.volume = 1.0;

    utterance.onstart = () => this.setSpeaking(true);
    utterance.onend = () => {
      this.setSpeaking(false);
      onEnd?.();
    };
    utterance.onerror = () => this.setSpeaking(false);

    this.synth.speak(utterance);
  }

  /**
   * Test Voice button action for Settings
   */
  public async testVoice(options: { aiVoice?: string; voiceURI?: string }) {
    const testPhrase = "Hey, glad you stopped by! We're gonna spin the wheel and check out some real headlines and posts to see if we can spot what's real and what's fake. Think you've got good instincts? Let's find out!";
    
    await this.speakQuestion({
      question: testPhrase,
      aiVoice: options.aiVoice,
      preferredVoiceURI: options.voiceURI
    });
  }
}

export const tts = new TTSEngine();
