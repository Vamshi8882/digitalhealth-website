/**
 * Digitalization in Healthcare - Persistent Storage Layer
 * IndexedDB wrapper with automatic localStorage fallback.
 * 
 * Manages:
 * - 10 Curriculum modules completion state, quiz answers, and timestamps
 * - 6 Clinical games completion state, high scores, and attempts history
 * - Student XP, levels, daily streaks, and 20+ milestone badges
 * - Lab prediction logs and user portfolio export/import
 */

export interface GameStatItem {
  completed: boolean;
  lastPlayed: string;
  bestScore?: number;
  gamesPlayed?: number;
  attempts?: number;
  casesSolved?: number;
  perfectRuns?: number;
  patientsSaved?: number;
  bestTimeSeconds?: number;
  [key: string]: any;
}

export interface GameStats {
  rapidFire: GameStatItem;
  diagnoseDash: GameStatItem;
  sqlSorter: GameStatItem;
  quizBlitz: GameStatItem;
  lifeSaverSim: GameStatItem;
  memoryMatch: GameStatItem;
  [key: string]: GameStatItem;
}

export interface GameHistoryEntry {
  id: string;
  gameId: string;
  gameName: string;
  score: number;
  xpAwarded: number;
  timestamp: string;
}

export interface SavedPrediction {
  id: string;
  timestamp: string;
  patientAge: number;
  gender: string;
  totalBilirubin: number;
  directBilirubin: number;
  deRitisRatio: number;
  bilirubinRatio?: number;
  riskPercent: number;
  likelihoodBand: string;
}

export interface UserProgressState {
  // Curriculum
  completedModules: number[];
  quizAnswers: Record<number, number>; // { [moduleId]: selectedOptionIndex }
  moduleCompletionDates: Record<number, string>; // { [moduleId]: ISO string }
  moduleNotes: Record<number, string>; // { [moduleId]: notes }

  // Clinical Games
  gameStats: GameStats;
  gameHistory: GameHistoryEntry[];

  // Gamification & Profile
  xp: number;
  streakDays: number;
  lastActiveDate: string; // YYYY-MM-DD
  dailyXp: number;
  dailyXpDate: string; // YYYY-MM-DD
  unlockedBadgeIds: string[];
  userProfile: {
    name: string;
    institution: string;
    role: string;
    avatarEmoji: string;
  };

  // Prediction History
  predictions: SavedPrediction[];

  lastSavedTimestamp: number;
}

const DB_NAME = 'DigitalHealthDB';
const DB_VERSION = 1;
const STORE_NAME = 'user_progress';
const KEY_NAME = 'current_user_state';
const LOCAL_STORAGE_KEY = 'digital_health_user_state_v1';

export const INITIAL_USER_STATE: UserProgressState = {
  completedModules: [1], // Module 1 completed by default as welcome
  quizAnswers: { 1: 1 },
  moduleCompletionDates: { 1: new Date().toISOString() },
  moduleNotes: {},

  gameStats: {
    rapidFire: { bestScore: 0, gamesPlayed: 0, lastPlayed: '', completed: false },
    diagnoseDash: { bestScore: 0, casesSolved: 0, lastPlayed: '', completed: false },
    sqlSorter: { completed: false, attempts: 0, lastPlayed: '' },
    quizBlitz: { bestScore: 0, gamesPlayed: 0, perfectRuns: 0, lastPlayed: '', completed: false },
    lifeSaverSim: { completed: false, patientsSaved: 0, lastPlayed: '' },
    memoryMatch: { completed: false, gamesPlayed: 0, lastPlayed: '' }
  },
  gameHistory: [],

  xp: 480,
  streakDays: 4,
  lastActiveDate: new Date().toISOString().split('T')[0],
  dailyXp: 240,
  dailyXpDate: new Date().toISOString().split('T')[0],
  unlockedBadgeIds: ['b1', 'b2', 'b3', 'b4', 'b7', 'b8', 'b11', 'b13', 'b14', 'b16', 'b17', 'b19'],

  userProfile: {
    name: 'Medical Student Intern',
    institution: 'Department of Medical Informatics & Hepatology',
    role: 'MBBS Candidate / Clinical AI Resident',
    avatarEmoji: '🩺'
  },

  predictions: [
    {
      id: 'pred-init-1',
      timestamp: new Date().toLocaleTimeString(),
      patientAge: 45,
      gender: 'Male',
      totalBilirubin: 4.8,
      directBilirubin: 2.5,
      deRitisRatio: 2.42,
      riskPercent: 88,
      likelihoodBand: 'Higher Likelihood'
    }
  ],

  lastSavedTimestamp: Date.now()
};

/**
 * Open IndexedDB database with schema initialization
 */
function openIndexedDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      reject(new Error('IndexedDB not supported in this environment'));
      return;
    }

    try {
      const request = window.indexedDB.open(DB_NAME, DB_VERSION);

      request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME);
        }
      };

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
      request.onblocked = () => reject(new Error('IndexedDB blocked'));
    } catch (err) {
      reject(err);
    }
  });
}

/**
 * Save user progress state to IndexedDB with localStorage fallback
 */
export async function saveUserState(state: UserProgressState): Promise<boolean> {
  const stateToSave: UserProgressState = {
    ...state,
    lastSavedTimestamp: Date.now()
  };

  // Always mirror to localStorage as synchronous backup
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(stateToSave));
    }
  } catch (err) {
    console.warn('LocalStorage save failed:', err);
  }

  // Attempt primary IndexedDB persistence
  try {
    const db = await openIndexedDB();
    return new Promise((resolve) => {
      const transaction = db.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const req = store.put(stateToSave, KEY_NAME);

      req.onsuccess = () => resolve(true);
      req.onerror = () => {
        console.warn('IndexedDB put error:', req.error);
        resolve(false);
      };
      transaction.oncomplete = () => db.close();
    });
  } catch (err) {
    console.warn('IndexedDB unavailable, relied on localStorage backup:', err);
    return true; // LocalStorage succeeded
  }
}

/**
 * Load user progress state from IndexedDB or localStorage
 */
export async function loadUserState(): Promise<UserProgressState> {
  let loadedState: UserProgressState | null = null;

  // 1. Try IndexedDB
  try {
    const db = await openIndexedDB();
    loadedState = await new Promise<UserProgressState | null>((resolve) => {
      const transaction = db.transaction([STORE_NAME], 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const req = store.get(KEY_NAME);

      req.onsuccess = () => resolve(req.result || null);
      req.onerror = () => resolve(null);
      transaction.oncomplete = () => db.close();
    });
  } catch (err) {
    console.warn('IndexedDB read error, falling back to localStorage:', err);
  }

  // 2. Fall back to localStorage if IndexedDB had no record
  if (!loadedState) {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const raw = window.localStorage.getItem(LOCAL_STORAGE_KEY);
        if (raw) {
          loadedState = JSON.parse(raw);
        }
      }
    } catch (err) {
      console.warn('LocalStorage read error:', err);
    }
  }

  // 3. Fall back to initial template if brand new session
  if (!loadedState) {
    loadedState = { ...INITIAL_USER_STATE };
    saveUserState(loadedState);
  } else {
    // Merge in case new fields were added to the schema
    loadedState = {
      ...INITIAL_USER_STATE,
      ...loadedState,
      gameStats: {
        ...INITIAL_USER_STATE.gameStats,
        ...(loadedState.gameStats || {})
      },
      userProfile: {
        ...INITIAL_USER_STATE.userProfile,
        ...(loadedState.userProfile || {})
      }
    };
  }

  // Check and update continuous daily streak
  const today = new Date().toISOString().split('T')[0];
  if (loadedState.lastActiveDate !== today) {
    const lastDate = new Date(loadedState.lastActiveDate);
    const currentDate = new Date(today);
    const diffDays = Math.round((currentDate.getTime() - lastDate.getTime()) / (1000 * 3600 * 24));

    if (diffDays === 1) {
      // Consecutive day login: advance streak!
      loadedState.streakDays += 1;
    } else if (diffDays > 1) {
      // Streak broken: reset to 1
      loadedState.streakDays = 1;
    }

    // Reset daily XP allocation for the new calendar date
    loadedState.dailyXp = 0;
    loadedState.dailyXpDate = today;
    loadedState.lastActiveDate = today;
    saveUserState(loadedState);
  }

  return loadedState;
}

/**
 * Clear all stored user progress (Factory Reset)
 */
export async function clearUserState(): Promise<void> {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.removeItem(LOCAL_STORAGE_KEY);
    }
  } catch (e) {
    console.warn('LocalStorage clear error:', e);
  }

  try {
    const db = await openIndexedDB();
    const transaction = db.transaction([STORE_NAME], 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    store.clear();
    transaction.oncomplete = () => db.close();
  } catch (e) {
    console.warn('IndexedDB clear error:', e);
  }
}

/**
 * Export complete progress portfolio as formatted JSON string
 */
export function exportStateAsJSON(state: UserProgressState): string {
  return JSON.stringify(state, null, 2);
}

/**
 * Import progress portfolio from JSON string with validation
 */
export function importStateFromJSON(jsonString: string): UserProgressState {
  const parsed = JSON.parse(jsonString);
  if (!Array.isArray(parsed.completedModules) || typeof parsed.xp !== 'number') {
    throw new Error('Invalid format: missing required progress fields');
  }
  return {
    ...INITIAL_USER_STATE,
    ...parsed,
    lastSavedTimestamp: Date.now()
  };
}
