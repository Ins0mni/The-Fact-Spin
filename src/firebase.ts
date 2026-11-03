import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  signInWithPopup, 
  GoogleAuthProvider, 
  signOut, 
  onAuthStateChanged,
  User 
} from 'firebase/auth';
import { 
  getFirestore, 
  doc, 
  collection, 
  getDocFromServer, 
  onSnapshot, 
  setDoc, 
  query, 
  orderBy, 
  limit, 
  increment 
} from 'firebase/firestore';
import firebaseConfig from '../firebase-applet-config.json';
import { HighScoreEntry, BoothStats } from './types';

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null): never {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Connectivity test probe
export async function testFirestoreConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn('Firebase client is offline or awaiting connection.');
    }
  }
}
testFirestoreConnection();

// Auth Helpers
export async function loginWithGoogle(): Promise<User | null> {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error) {
    console.error('Failed to sign in with Google:', error);
    throw error;
  }
}

export async function logoutUser(): Promise<void> {
  try {
    await signOut(auth);
  } catch (error) {
    console.error('Failed to sign out:', error);
    throw error;
  }
}

// Leaderboard Sync
export async function saveHighScoreToFirestore(entry: {
  name: string;
  score: number;
  correctCount: number;
  totalRounds: number;
}): Promise<string | null> {
  if (!auth.currentUser) return null;
  
  const cleanId = `score_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
  const cleanName = (entry.name || 'DYAP Player').trim().slice(0, 30) || 'DYAP Player';
  const path = `highScores/${cleanId}`;

  const payload = {
    name: cleanName,
    score: Math.max(0, Math.min(100000, Math.round(entry.score))),
    correctCount: Math.max(0, Math.min(100, entry.correctCount)),
    totalRounds: Math.max(1, Math.min(100, entry.totalRounds)),
    userId: auth.currentUser.uid,
    userEmail: auth.currentUser.email ? auth.currentUser.email.slice(0, 100) : '',
    createdAt: new Date().toISOString()
  };

  try {
    await setDoc(doc(db, 'highScores', cleanId), payload);
    return cleanId;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
    return null;
  }
}

export function subscribeToHighScores(callback: (scores: HighScoreEntry[]) => void): () => void {
  const path = 'highScores';
  try {
    const q = query(collection(db, path), orderBy('score', 'desc'), limit(15));
    return onSnapshot(q, (snapshot) => {
      const items: HighScoreEntry[] = [];
      snapshot.forEach(docSnap => {
        const d = docSnap.data();
        items.push({
          id: docSnap.id,
          participantName: d.name || 'Anonymous Player',
          score: d.score || 0,
          correctCount: d.correctCount || 0,
          totalRounds: d.totalRounds || 5,
          date: d.createdAt ? new Date(d.createdAt).toLocaleDateString() : new Date().toLocaleDateString(),
          userId: d.userId,
          userEmail: d.userEmail
        });
      });
      callback(items);
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, path);
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, path);
  }
}

// Telemetry & Booth Stats Sync
export async function recordGameSessionInFirestore(session: {
  sessionId: string;
  playerName: string;
  score: number;
  correctCount: number;
  totalRounds: number;
}): Promise<void> {
  if (!auth.currentUser) return;

  const sessionPath = `gameSessions/${session.sessionId}`;
  const cleanName = (session.playerName || 'DYAP Player').trim().slice(0, 30) || 'DYAP Player';

  try {
    await setDoc(doc(db, 'gameSessions', session.sessionId), {
      sessionId: session.sessionId,
      userId: auth.currentUser.uid,
      playerName: cleanName,
      score: Math.max(0, Math.min(100000, Math.round(session.score))),
      correctCount: Math.max(0, Math.min(100, session.correctCount)),
      totalRounds: Math.max(1, Math.min(100, session.totalRounds)),
      createdAt: new Date().toISOString()
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, sessionPath);
  }

  // Atomically increment aggregate booth stats
  const statsPath = 'boothStats/aggregate';
  try {
    const statsDocRef = doc(db, 'boothStats', 'aggregate');
    await setDoc(statsDocRef, {
      sessionsToday: increment(1),
      totalQuestionsAnswered: increment(session.totalRounds),
      totalCorrect: increment(session.correctCount),
      updatedAt: new Date().toISOString()
    }, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, statsPath);
  }
}

export function subscribeToBoothStats(callback: (stats: BoothStats) => void): () => void {
  const path = 'boothStats/aggregate';
  try {
    const statsDocRef = doc(db, 'boothStats', 'aggregate');
    return onSnapshot(statsDocRef, (docSnap) => {
      if (docSnap.exists()) {
        const d = docSnap.data();
        callback({
          sessionsToday: d.sessionsToday ?? 0,
          totalQuestionsAnswered: d.totalQuestionsAnswered ?? 0,
          totalCorrect: d.totalCorrect ?? 0
        });
      }
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, path);
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, path);
  }
}
