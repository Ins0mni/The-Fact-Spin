import React, { useState, useEffect } from 'react';
import { 
  GamePhase, 
  Category, 
  Question, 
  GameSettings, 
  RoundResult, 
  BoothStats, 
  HighScoreEntry 
} from './types';
import { CATEGORIES } from './data/categories';
import { getQuestionForCategory } from './data/questions';
import { sound } from './utils/audio';
import { tts } from './utils/tts';
import { 
  auth, 
  loginWithGoogle, 
  logoutUser, 
  saveHighScoreToFirestore, 
  recordGameSessionInFirestore, 
  subscribeToHighScores, 
  subscribeToBoothStats 
} from './firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import { SpinningWheel } from './components/SpinningWheel';
import { CategoryReveal } from './components/CategoryReveal';
import { QuestionCard } from './components/QuestionCard';
import { FeedbackCard } from './components/FeedbackCard';
import { ResultsScreen } from './components/ResultsScreen';
import { CreditsScreen } from './components/CreditsScreen';
import { BoothModeModal } from './components/BoothModeModal';
import { HowToPlayModal } from './components/HowToPlayModal';
import { SettingsModal } from './components/SettingsModal';
import { 
  Play, 
  HelpCircle, 
  Settings as SettingsIcon, 
  Users, 
  Volume2, 
  VolumeX, 
  Maximize2,
  Info
} from 'lucide-react';

const DEFAULT_SETTINGS: GameSettings = {
  soundEnabled: true,
  musicEnabled: false,
  timerEnabled: true,
  timerDuration: 20,
  reducedMotion: false,
  ttsEnabled: true,
  ttsAutoPlay: true,
  aiVoice: 'Kore'
};

const DEFAULT_STATS: BoothStats = {
  sessionsToday: 0,
  totalQuestionsAnswered: 0,
  totalCorrect: 0
};

export default function App() {
  const [phase, setPhase] = useState<GamePhase>('MENU');
  const [currentRound, setCurrentRound] = useState<number>(1);
  const totalRounds = 5;
  const [totalScore, setTotalScore] = useState<number>(0);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [roundResults, setRoundResults] = useState<RoundResult[]>([]);
  const [usedQuestionIds, setUsedQuestionIds] = useState<string[]>([]);
  const [isWheelSpinning, setIsWheelSpinning] = useState<boolean>(false);

  // Settings & Local Storage
  const [settings, setSettings] = useState<GameSettings>(() => {
    try {
      const saved = localStorage.getItem('factspin_settings');
      return saved ? { ...DEFAULT_SETTINGS, ...JSON.parse(saved) } : DEFAULT_SETTINGS;
    } catch {
      return DEFAULT_SETTINGS;
    }
  });

  const [boothStats, setBoothStats] = useState<BoothStats>(() => {
    try {
      const saved = localStorage.getItem('factspin_booth_stats');
      return saved ? { ...DEFAULT_STATS, ...JSON.parse(saved) } : DEFAULT_STATS;
    } catch {
      return DEFAULT_STATS;
    }
  });

  const [highScores, setHighScores] = useState<HighScoreEntry[]>(() => {
    try {
      const saved = localStorage.getItem('factspin_high_scores');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Modals
  const [isHowToPlayOpen, setIsHowToPlayOpen] = useState<boolean>(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [isBoothModeOpen, setIsBoothModeOpen] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  // Firebase Auth & Cloud Sync State
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState<boolean>(true);
  const [firebaseSyncActive, setFirebaseSyncActive] = useState<boolean>(false);

  // Listen to Firebase Auth & attach real-time Firestore listeners
  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setIsAuthLoading(false);
    });

    let unsubscribeScores: (() => void) | undefined;
    let unsubscribeStats: (() => void) | undefined;

    try {
      unsubscribeScores = subscribeToHighScores((remoteScores) => {
        if (remoteScores && remoteScores.length > 0) {
          setHighScores(remoteScores);
          setFirebaseSyncActive(true);
        }
      });

      unsubscribeStats = subscribeToBoothStats((remoteStats) => {
        if (remoteStats) {
          setBoothStats(prev => ({
            ...prev,
            ...remoteStats
          }));
          setFirebaseSyncActive(true);
        }
      });
    } catch (err) {
      console.warn('Real-time Firebase subscriptions active in fallback mode:', err);
    }

    return () => {
      unsubscribeAuth();
      if (unsubscribeScores) unsubscribeScores();
      if (unsubscribeStats) unsubscribeStats();
    };
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('factspin_settings', JSON.stringify(settings));
    } catch {
      // Ignore storage errors
    }
    sound.setMusicEnabled(settings.musicEnabled);
  }, [settings]);

  useEffect(() => {
    try {
      localStorage.setItem('factspin_booth_stats', JSON.stringify(boothStats));
    } catch {
      // Ignore storage errors
    }
  }, [boothStats]);

  useEffect(() => {
    try {
      localStorage.setItem('factspin_high_scores', JSON.stringify(highScores));
    } catch {
      // Ignore storage errors
    }
  }, [highScores]);

  // Handle Fullscreen
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }
      setIsFullscreen(false);
    }
  };

  // Start / Reset Session
  const handleStartGame = () => {
    sound.playButtonClick(settings.soundEnabled);
    setCurrentRound(1);
    setTotalScore(0);
    setRoundResults([]);
    setUsedQuestionIds([]);
    setSelectedCategory(null);
    setCurrentQuestion(null);
    setPhase('SPINNING');

    // Increment session count
    setBoothStats(prev => ({
      ...prev,
      sessionsToday: prev.sessionsToday + 1
    }));
  };

  const handleResetSession = () => {
    handleStartGame();
  };

  // Called when wheel finishes rotating
  const handleSpinComplete = (category: Category) => {
    setSelectedCategory(category);
    // Determine question early and preload natural AI audio in background
    const question = getQuestionForCategory(category, usedQuestionIds);
    setCurrentQuestion(question);
    if (settings.ttsEnabled) {
      tts.preloadQuestion({
        scenarioContent: question.scenarioContent,
        question: question.question,
        aiVoice: settings.aiVoice || 'Kore'
      });
    }
    setPhase('CATEGORY_REVEAL');
  };

  // Called when category reveal finishes or user clicks continue
  const handleCategoryRevealContinue = () => {
    if (!selectedCategory) return;
    sound.playButtonClick(settings.soundEnabled);

    if (currentQuestion) {
      setUsedQuestionIds(prev => [...prev, currentQuestion.id]);
    } else {
      const question = getQuestionForCategory(selectedCategory, usedQuestionIds);
      setCurrentQuestion(question);
      setUsedQuestionIds(prev => [...prev, question.id]);
    }
    setPhase('QUESTION');
  };

  // Called when user selects an answer on the QuestionCard
  const handleAnswerSelected = (selectedIndex: number, timeRemaining: number) => {
    if (!currentQuestion) return;

    const isCorrect = selectedIndex === currentQuestion.correctIndex;
    const basePoints = isCorrect ? 100 : 0;
    // Speed bonus: up to 50 points based on time remaining
    const speedBonus = isCorrect && settings.timerEnabled ? Math.round((timeRemaining / settings.timerDuration) * 50) : 0;
    const earned = basePoints + speedBonus;

    const result: RoundResult = {
      roundNumber: currentRound,
      category: currentQuestion.category,
      question: currentQuestion,
      selectedOptionIndex: selectedIndex,
      isCorrect,
      timeRemaining,
      pointsEarned: earned,
      speedBonus
    };

    setTotalScore(prev => prev + earned);
    setRoundResults(prev => [...prev, result]);

    // Update Booth Stats
    setBoothStats(prev => ({
      ...prev,
      totalQuestionsAnswered: prev.totalQuestionsAnswered + 1,
      totalCorrect: isCorrect ? prev.totalCorrect + 1 : prev.totalCorrect
    }));

    setPhase('FEEDBACK');
  };

  // Proceed from feedback to either next round or final results
  const handleNextFromFeedback = () => {
    sound.playButtonClick(settings.soundEnabled);
    if (currentRound >= totalRounds) {
      setPhase('RESULTS');
    } else {
      setCurrentRound(prev => prev + 1);
      setSelectedCategory(null);
      setCurrentQuestion(null);
      setPhase('SPINNING');
    }
  };

  const handleSaveToLeaderboard = async (name: string, score: number, correctCount: number) => {
    const cleanId = `${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const newEntry: HighScoreEntry = {
      id: cleanId,
      participantName: name,
      score,
      correctCount,
      totalRounds: 5,
      date: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      userId: currentUser?.uid,
      userEmail: currentUser?.email || undefined
    };

    // Optimistic local update
    setHighScores(prev => {
      const updated = [...prev, newEntry].sort((a, b) => b.score - a.score).slice(0, 50);
      return updated;
    });

    // Cloud Firestore Sync
    if (currentUser) {
      try {
        await saveHighScoreToFirestore({
          name,
          score,
          correctCount,
          totalRounds: 5
        });
        await recordGameSessionInFirestore({
          sessionId: `session_${cleanId}`,
          playerName: name,
          score,
          correctCount,
          totalRounds: 5
        });
        setFirebaseSyncActive(true);
      } catch (err) {
        console.error('Error saving score to Firebase Firestore:', err);
      }
    }
  };

  const handleClearLeaderboard = () => {
    setHighScores([]);
  };

  const handleUpdateSettings = (newSettings: Partial<GameSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  return (
    <div className="min-h-screen bg-[#17181B] text-white flex flex-col font-sans selection:bg-[#2463F5] selection:text-white antialiased">
      {/* Modern Compact Navigation Bar */}
      <header className="w-full bg-[#17181B]/95 backdrop-blur-sm border-b border-[#2E3036] px-4 sm:px-6 py-3 sticky top-0 z-30 flex items-center justify-between">
        {/* Wordmark */}
        <button
          onClick={() => {
            sound.playButtonClick(settings.soundEnabled);
            setPhase('MENU');
          }}
          className="flex items-center gap-2.5 text-left group cursor-pointer whitespace-nowrap shrink-0"
        >
          <div className="w-7 h-7 rounded-lg bg-[#2463F5] text-white flex items-center justify-center font-bold text-sm shadow-sm">
            !
          </div>
          <div className="flex items-center gap-2">
            <span className="font-heading font-bold text-lg tracking-tight text-white">
              THE FACT SPIN
            </span>
            <span className="hidden sm:inline-block text-[11px] font-semibold text-[#60A5FA] bg-[#2463F5]/10 border border-[#2463F5]/30 rounded px-1.5 py-0.5">
              DYAP
            </span>
          </div>
        </button>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-4 text-xs font-medium text-[#A1A1AA]">
          <button
            onClick={() => {
              sound.playButtonClick(settings.soundEnabled);
              setIsHowToPlayOpen(true);
            }}
            className="hover:text-white transition-colors cursor-pointer"
          >
            How to Play
          </button>
          <button
            onClick={() => {
              sound.playButtonClick(settings.soundEnabled);
              setPhase('CREDITS');
            }}
            className="hover:text-white transition-colors cursor-pointer"
          >
            Credits
          </button>
          <button
            onClick={() => {
              sound.playButtonClick(settings.soundEnabled);
              setIsSettingsOpen(true);
            }}
            className="hover:text-white transition-colors cursor-pointer"
          >
            Settings
          </button>
          <span className="text-zinc-600">·</span>
          <span className="text-zinc-300 font-medium">
            Misinformation Awareness Booth
          </span>
        </nav>

        {/* Top Right Controls */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Quick Sound Toggle */}
          <button
            onClick={() => handleUpdateSettings({ soundEnabled: !settings.soundEnabled })}
            className="p-2 rounded-lg bg-[#25262B] hover:bg-[#2C2E35] border border-[#32353D] text-zinc-300 hover:text-white transition-colors cursor-pointer"
            aria-label="Toggle Sound"
            title="Toggle Sound Effects"
          >
            {settings.soundEnabled ? <Volume2 className="w-4 h-4 text-white" /> : <VolumeX className="w-4 h-4 text-zinc-500" />}
          </button>

          {/* Fullscreen Toggle */}
          <button
            onClick={toggleFullscreen}
            className="p-2 rounded-lg bg-[#25262B] hover:bg-[#2C2E35] border border-[#32353D] text-zinc-300 hover:text-white transition-colors cursor-pointer hidden sm:flex"
            aria-label="Toggle Fullscreen"
            title="Toggle Fullscreen"
          >
            <Maximize2 className="w-4 h-4" />
          </button>

          {/* Booth Facilitator Console Button */}
          <button
            onClick={() => {
              sound.playButtonClick(settings.soundEnabled);
              setIsBoothModeOpen(true);
            }}
            className="px-3 py-1.5 rounded-lg bg-[#25262B] hover:bg-[#2C2E35] border border-[#32353D] text-zinc-200 text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-colors"
          >
            <Users className="w-3.5 h-3.5 text-[#60A5FA]" />
            <span className="hidden sm:inline">Booth Console</span>
            <span className="sm:hidden">Console</span>
          </button>

          {/* Firebase Google Auth Button / Profile Chip */}
          {currentUser ? (
            <div className="flex items-center gap-2 bg-[#25262B] border border-[#32353D] rounded-lg px-2.5 py-1 text-xs">
              {currentUser.photoURL ? (
                <img
                  src={currentUser.photoURL}
                  alt={currentUser.displayName || 'Player'}
                  className="w-5 h-5 rounded-full object-cover"
                />
              ) : (
                <div className="w-5 h-5 rounded-full bg-[#2463F5] text-white flex items-center justify-center text-[10px] font-bold">
                  {(currentUser.displayName || currentUser.email || 'P').charAt(0).toUpperCase()}
                </div>
              )}
              <span className="text-zinc-200 font-medium truncate max-w-[80px] sm:max-w-[120px]">
                {currentUser.displayName || currentUser.email?.split('@')[0]}
              </span>
              <button
                onClick={() => logoutUser()}
                className="text-zinc-400 hover:text-rose-400 text-[10px] uppercase font-mono-code transition-colors ml-0.5 cursor-pointer"
                title="Sign out of Firebase"
              >
                Exit
              </button>
            </div>
          ) : (
            <button
              onClick={() => loginWithGoogle()}
              disabled={isAuthLoading}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#25262B] hover:bg-[#2C2E35] border border-[#32353D] hover:border-[#2463F5]/60 text-zinc-200 text-xs font-medium cursor-pointer transition-colors"
              title="Sign in with Google to sync scores and booth stats"
            >
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
              </svg>
              <span className="hidden sm:inline">Sign In</span>
            </button>
          )}
        </div>
      </header>

      {/* Main Experience Arena */}
      <main className="flex-1 flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
        {/* ========================================================= */}
        {/* VIEW 1: CLEAN MODERN MAIN MENU                            */}
        {/* ========================================================= */}
        {phase === 'MENU' && (
          <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center my-auto animate-in fade-in duration-200">
            {/* Left Column: Hero Content */}
            <div className="lg:col-span-7 flex flex-col text-left space-y-4">
              {/* Campaign Label Badge */}
              <div className="inline-flex items-center gap-2 self-start px-3 py-1 rounded-full bg-[#2463F5]/10 border border-[#2463F5]/30">
                <span className="w-1.5 h-1.5 rounded-full bg-[#2463F5]" />
                <span className="text-[11px] font-semibold text-[#60A5FA] tracking-wider uppercase">
                  DIGITAL YOUTH AMBASSADOR PROGRAMME
                </span>
              </div>

              {/* Headline */}
              <div className="leading-tight">
                <h1 className="font-heading font-bold text-5xl sm:text-6xl lg:text-7xl text-white tracking-tight">
                  THE FACT <span className="text-[#2463F5]">SPIN.</span>
                </h1>
              </div>

              {/* Tagline Badge */}
              <div className="text-sm font-semibold tracking-wider text-[#60A5FA] uppercase">
                SPIN IT. QUESTION IT. VERIFY IT.
              </div>

              {/* Supporting Copy */}
              <p className="text-base sm:text-lg text-[#A1A1AA] leading-relaxed max-w-xl font-normal">
                Your feed is full of claims. How good are you at spotting the ones that don't add up? Spin the wheel to test your critical thinking across 6 rapid rounds.
              </p>

              {/* Quick Spec Strip */}
              <div className="p-3 bg-[#1C1D21] border border-[#32353D] rounded-lg text-xs font-medium text-zinc-300 max-w-lg flex items-center justify-between">
                <span>6 Categories · 5 Rounds · Fast-paced verification</span>
                <span className="text-[#60A5FA] font-mono-code font-bold">YES / NO</span>
              </div>

              {/* Primary Call to Action & Options */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
                <button
                  onClick={handleStartGame}
                  className="py-3.5 px-6 bg-[#2463F5] hover:bg-[#1D52D4] text-white rounded-lg font-semibold text-base transition-colors flex items-center justify-center gap-2.5 cursor-pointer shadow-sm"
                >
                  <Play className="w-4 h-4 fill-white" />
                  <span>START PLAYING</span>
                </button>

                <button
                  onClick={() => {
                    sound.playButtonClick(settings.soundEnabled);
                    setIsHowToPlayOpen(true);
                  }}
                  className="py-3.5 px-5 bg-[#25262B] hover:bg-[#2C2E35] text-zinc-200 border border-[#32353D] rounded-lg font-medium text-sm transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <HelpCircle className="w-4 h-4 text-[#60A5FA]" />
                  <span>HOW TO PLAY</span>
                </button>

                <button
                  onClick={() => {
                    sound.playButtonClick(settings.soundEnabled);
                    setPhase('CREDITS');
                  }}
                  className="py-3.5 px-5 bg-[#25262B] hover:bg-[#2C2E35] text-zinc-200 border border-[#32353D] rounded-lg font-medium text-sm transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Info className="w-4 h-4 text-[#60A5FA]" />
                  <span>CREDITS</span>
                </button>
              </div>

              {/* Exact Main Menu Attribution Line from Brief */}
              <div className="pt-3">
                <div className="text-xs text-[#A1A1AA] pt-3 border-t border-[#2E3036]">
                  Made by the DYAP Team · Game concept & development by Shenraa
                </div>
              </div>
            </div>

            {/* Right Column: Wheel Preview Card */}
            <div className="lg:col-span-5 flex flex-col items-center justify-center">
              <div className="p-5 bg-[#25262B] border border-[#32353D] rounded-xl shadow-xl w-full max-w-md flex flex-col items-center">
                <div className="w-full text-center mb-2">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-[#A1A1AA]">
                    6-SEGMENT PRIZE WHEEL
                  </span>
                </div>

                {/* Spinning Wheel mounted on preview */}
                <div className="scale-90 sm:scale-100 origin-center">
                  <SpinningWheel
                    onSpinComplete={handleSpinComplete}
                    isSpinning={isWheelSpinning}
                    setIsSpinning={setIsWheelSpinning}
                    soundEnabled={settings.soundEnabled}
                    reducedMotion={settings.reducedMotion}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* VIEW 2: SPINNING WHEEL ARENA (ACTIVE GAME)                */}
        {/* ========================================================= */}
        {phase === 'SPINNING' && (
          <div className="w-full flex flex-col items-center justify-center animate-in fade-in duration-150 my-auto">
            {/* Header info HUD */}
            <div className="flex items-center justify-between w-full max-w-md mb-4 px-1">
              <div className="text-xs font-semibold uppercase tracking-wider px-3 py-1 bg-[#25262B] border border-[#32353D] rounded-lg text-zinc-300">
                ROUND {currentRound} OF {totalRounds}
              </div>
              <div className="text-xs font-semibold uppercase tracking-wider px-3 py-1 bg-[#25262B] border border-[#32353D] rounded-lg text-zinc-300">
                SCORE: <span className="text-[#60A5FA] font-bold">{totalScore} PTS</span>
              </div>
            </div>

            <SpinningWheel
              onSpinComplete={handleSpinComplete}
              isSpinning={isWheelSpinning}
              setIsSpinning={setIsWheelSpinning}
              soundEnabled={settings.soundEnabled}
              reducedMotion={settings.reducedMotion}
            />
          </div>
        )}

        {/* ========================================================= */}
        {/* VIEW 3: CATEGORY REVEAL OVERLAY                           */}
        {/* ========================================================= */}
        {phase === 'CATEGORY_REVEAL' && selectedCategory && (
          <CategoryReveal
            category={selectedCategory}
            roundNumber={currentRound}
            totalRounds={totalRounds}
            onContinue={handleCategoryRevealContinue}
            reducedMotion={settings.reducedMotion}
          />
        )}

        {/* ========================================================= */}
        {/* VIEW 4: QUESTION CARD                                     */}
        {/* ========================================================= */}
        {phase === 'QUESTION' && currentQuestion && (
          <QuestionCard
            question={currentQuestion}
            roundNumber={currentRound}
            totalRounds={totalRounds}
            currentScore={totalScore}
            timerEnabled={settings.timerEnabled}
            timerDuration={settings.timerDuration}
            soundEnabled={settings.soundEnabled}
            ttsEnabled={settings.ttsEnabled}
            ttsAutoPlay={settings.ttsAutoPlay}
            ttsVoiceURI={settings.ttsVoiceURI}
            aiVoice={settings.aiVoice || 'Kore'}
            onAnswerSelected={handleAnswerSelected}
          />
        )}

        {/* ========================================================= */}
        {/* VIEW 5: ANSWER FEEDBACK CARD                              */}
        {/* ========================================================= */}
        {phase === 'FEEDBACK' && currentQuestion && roundResults.length > 0 && (
          <FeedbackCard
            question={currentQuestion}
            selectedOptionIndex={roundResults[roundResults.length - 1].selectedOptionIndex}
            isCorrect={roundResults[roundResults.length - 1].isCorrect}
            pointsEarned={roundResults[roundResults.length - 1].pointsEarned}
            speedBonus={roundResults[roundResults.length - 1].speedBonus}
            roundNumber={currentRound}
            totalRounds={totalRounds}
            soundEnabled={settings.soundEnabled}
            onNext={handleNextFromFeedback}
          />
        )}

        {/* ========================================================= */}
        {/* VIEW 6: RESULTS SCREEN                                    */}
        {/* ========================================================= */}
        {phase === 'RESULTS' && (
          <ResultsScreen
            roundResults={roundResults}
            totalScore={totalScore}
            soundEnabled={settings.soundEnabled}
            onPlayAgain={handleResetSession}
            onReturnToMenu={() => {
              sound.playButtonClick(settings.soundEnabled);
              setPhase('MENU');
            }}
            onSaveToLeaderboard={handleSaveToLeaderboard}
            currentUser={currentUser}
            onGoogleSignIn={() => loginWithGoogle()}
          />
        )}

        {/* ========================================================= */}
        {/* VIEW 7: DEDICATED OFFICIAL CREDITS SCREEN                 */}
        {/* ========================================================= */}
        {phase === 'CREDITS' && (
          <CreditsScreen
            onBackToMenu={() => {
              sound.playButtonClick(settings.soundEnabled);
              setPhase('MENU');
            }}
          />
        )}
      </main>

      {/* Dark Gaming Footer */}
      <footer className="px-4 py-3 border-t border-[#2E3036] bg-[#17181B] text-xs text-[#A1A1AA] flex flex-wrap items-center justify-between gap-3 max-w-7xl w-full mx-auto">
        <div className="flex items-center gap-2 font-medium text-zinc-300">
          <span className="w-2 h-2 rounded-full bg-emerald-500" />
          <span>OFFLINE READY · DYAP BOOTH EDITION</span>
        </div>
        <div className="flex items-center gap-3">
          <span>DIGITAL YOUTH AMBASSADOR PROGRAMME</span>
          <span className="text-zinc-600">—</span>
          <button
            onClick={() => {
              sound.playButtonClick(settings.soundEnabled);
              setPhase('CREDITS');
            }}
            className="text-[#60A5FA] hover:underline cursor-pointer font-medium"
          >
            Official Credits
          </button>
        </div>
      </footer>

      {/* Auxiliary Modals */}
      <HowToPlayModal
        isOpen={isHowToPlayOpen}
        onClose={() => setIsHowToPlayOpen(false)}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onUpdateSettings={handleUpdateSettings}
        isFullscreen={isFullscreen}
        onToggleFullscreen={toggleFullscreen}
      />

      <BoothModeModal
        isOpen={isBoothModeOpen}
        onClose={() => setIsBoothModeOpen(false)}
        onStartNewSession={handleResetSession}
        onResetScoreAndRounds={() => {
          setCurrentRound(1);
          setTotalScore(0);
          setRoundResults([]);
        }}
        onReturnToMainMenu={() => setPhase('MENU')}
        boothStats={boothStats}
        highScores={highScores}
        onClearLeaderboard={handleClearLeaderboard}
        timerDuration={settings.timerDuration}
        onUpdateTimerDuration={(sec) => handleUpdateSettings({ timerDuration: sec })}
        timerEnabled={settings.timerEnabled}
        onToggleTimer={(enabled) => handleUpdateSettings({ timerEnabled: enabled })}
        ttsEnabled={settings.ttsEnabled}
        onToggleTTS={(enabled) => handleUpdateSettings({ ttsEnabled: enabled })}
        firebaseConnected={firebaseSyncActive}
      />
    </div>
  );
}
