export type Category = 
  | 'FAKE_NEWS' 
  | 'FAKE_PRODUCTS' 
  | 'RUMOURS_GOSSIP' 
  | 'RAGEBAIT' 
  | 'FACT_CHECK' 
  | 'MYSTERY_ROUND';

export interface CategoryInfo {
  id: Category;
  name: string;
  shortTitle: string;
  tagline: string;
  color: string; // Tailwind color or hex
  accentColor: string;
  bgColor: string;
  textColor: string;
  borderColor: string;
  iconName: string;
  description: string;
}

export type ScenarioType = 'headline' | 'product' | 'chat' | 'social_post' | 'search';

export interface Question {
  id: string;
  category: Category;
  scenarioType?: ScenarioType;
  scenarioSource?: string;
  scenarioContent?: string;
  scenarioImageHint?: string;
  question: string;
  options: string[];
  correctIndex: number;
  clue?: string;
  explanation: string;
  mediaLiteracyTip: string;
  difficulty?: 'normal' | 'challenge';
}

export type GamePhase = 
  | 'MENU' 
  | 'SPINNING' 
  | 'CATEGORY_REVEAL' 
  | 'QUESTION' 
  | 'FEEDBACK' 
  | 'RESULTS'
  | 'CREDITS';

export interface GameSettings {
  soundEnabled: boolean;
  musicEnabled: boolean;
  timerEnabled: boolean;
  timerDuration: number; // in seconds (e.g. 15 or 20)
  reducedMotion: boolean;
  ttsEnabled: boolean;
  ttsAutoPlay: boolean;
  ttsVoiceURI?: string;
  aiVoice?: 'Kore' | 'Aoede' | 'device';
}

export interface RoundResult {
  roundNumber: number;
  category: Category;
  question: Question;
  selectedOptionIndex: number;
  isCorrect: boolean;
  pointsEarned: number;
  speedBonus: number;
  timeRemaining: number;
}

export interface HighScoreEntry {
  id: string;
  participantName: string;
  score: number;
  correctCount: number;
  totalRounds: number;
  date: string;
  userId?: string;
  userEmail?: string;
}

export interface BoothStats {
  sessionsToday: number;
  totalQuestionsAnswered: number;
  totalCorrect: number;
}
