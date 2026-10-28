import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import confetti from 'canvas-confetti';
import {
  UserProgressState,
  GameStats,
  SavedPrediction,
  INITIAL_USER_STATE,
  loadUserState,
  saveUserState,
  clearUserState,
  exportStateAsJSON,
  importStateFromJSON
} from '../services/storage';

export interface ProgressNotification {
  id: string;
  message: string;
  type: 'xp' | 'badge' | 'module' | 'game' | 'info';
  amount?: number;
}

interface ProgressContextType {
  // State
  state: UserProgressState;
  isLoaded: boolean;
  storageEngine: string;

  // Curriculum Helpers
  completedModules: number[];
  isModuleCompleted: (moduleId: number) => boolean;
  markModuleComplete: (moduleId: number, quizOptionIndex?: number) => void;
  quizAnswers: Record<number, number>;

  // Game Helpers
  gameStats: GameStats;
  isGameCompleted: (gameKey: keyof GameStats) => boolean;
  recordGameResult: (
    gameKey: keyof GameStats,
    score: number,
    options?: {
      xpAward?: number;
      badgeId?: string;
      additionalData?: any;
    }
  ) => void;

  // Gamification & Badges
  xp: number;
  level: number;
  rank: string;
  streakDays: number;
  dailyXp: number;
  awardXP: (amount: number, badgeIdToUnlock?: string) => void;
  unlockedBadgeIds: string[];
  isBadgeUnlocked: (badgeId: string) => boolean;
  unlockBadge: (badgeId: string) => void;

  // Predictions
  predictions: SavedPrediction[];
  savePredictionRecord: (record: Omit<SavedPrediction, 'id' | 'timestamp'>) => void;

  // Data Portability & Backup
  resetProgress: () => Promise<void>;
  exportDataJSON: () => string;
  importDataJSON: (jsonStr: string) => Promise<boolean>;

  // Notification Toast
  activeNotification: ProgressNotification | null;
  dismissNotification: () => void;
}

const ProgressContext = createContext<ProgressContextType | undefined>(undefined);

const RANKS = [
  'Medical Student Intern',
  'Junior Resident Physician',
  'Hepatology Clinical Registrar',
  'Medical Data Fellow',
  'Chief Medical AI Specialist'
];

export const ProgressProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, setState] = useState<UserProgressState>(INITIAL_USER_STATE);
  const [isLoaded, setIsLoaded] = useState(false);
  const [storageEngine, setStorageEngine] = useState('IndexedDB + LocalStorage');
  const [activeNotification, setActiveNotification] = useState<ProgressNotification | null>(null);

  // Initialize and load saved state on mount
  useEffect(() => {
    async function init() {
      try {
        const loaded = await loadUserState();
        setState(loaded);
        if (typeof window !== 'undefined' && !window.indexedDB) {
          setStorageEngine('LocalStorage (Fallback)');
        }
      } catch (err) {
        console.warn('Could not load persistent state, using initial:', err);
      } finally {
        setIsLoaded(true);
      }
    }
    init();
  }, []);

  // Save changes to storage
  const commitState = useCallback(async (updater: (prev: UserProgressState) => UserProgressState) => {
    setState((prevState) => {
      const nextState = updater(prevState);
      saveUserState(nextState);
      return nextState;
    });
  }, []);

  // Trigger brief in-app toast notification
  const triggerNotification = useCallback((message: string, type: ProgressNotification['type'], amount?: number) => {
    setActiveNotification({
      id: `toast-${Date.now()}`,
      message,
      type,
      amount
    });
    setTimeout(() => {
      setActiveNotification(null);
    }, 4500);
  }, []);

  const dismissNotification = useCallback(() => {
    setActiveNotification(null);
  }, []);

  // Calculate Level & Rank
  const playerLevel = Math.floor(state.xp / 200) + 1;
  const currentRank = RANKS[Math.min(RANKS.length - 1, Math.floor(playerLevel / 2))];

  // Curriculum Progress Methods
  const isModuleCompleted = useCallback(
    (moduleId: number) => state.completedModules.includes(moduleId),
    [state.completedModules]
  );

  const markModuleComplete = useCallback(
    (moduleId: number, quizOptionIndex?: number) => {
      commitState((prev) => {
        const alreadyDone = prev.completedModules.includes(moduleId);
        const updatedCompleted = alreadyDone ? prev.completedModules : [...prev.completedModules, moduleId];
        const updatedAnswers = { ...prev.quizAnswers };
        const updatedDates = { ...prev.moduleCompletionDates };

        if (quizOptionIndex !== undefined) {
          updatedAnswers[moduleId] = quizOptionIndex;
        }
        if (!alreadyDone) {
          updatedDates[moduleId] = new Date().toISOString();
        }

        // Award +100 XP for completing a module
        const xpBonus = alreadyDone ? 0 : 100;
        const newDailyXp = Math.min(1000, prev.dailyXp + xpBonus);

        return {
          ...prev,
          completedModules: updatedCompleted,
          quizAnswers: updatedAnswers,
          moduleCompletionDates: updatedDates,
          xp: prev.xp + xpBonus,
          dailyXp: newDailyXp
        };
      });

      confetti({ particleCount: 65, spread: 60, origin: { y: 0.65 } });
      triggerNotification(`Module ${moduleId} Completed! +100 XP awarded.`, 'module', 100);
    },
    [commitState, triggerNotification]
  );

  // Gamification Methods
  const awardXP = useCallback(
    (amount: number, badgeIdToUnlock?: string) => {
      commitState((prev) => {
        const dailyCap = 1000;
        const availableDaily = Math.max(0, dailyCap - prev.dailyXp);
        const actualXP = Math.min(amount, availableDaily);

        let updatedBadges = [...prev.unlockedBadgeIds];
        if (badgeIdToUnlock && !updatedBadges.includes(badgeIdToUnlock)) {
          updatedBadges.push(badgeIdToUnlock);
          triggerNotification(`Achievement Unlocked!`, 'badge');
        }

        return {
          ...prev,
          xp: prev.xp + actualXP,
          dailyXp: prev.dailyXp + actualXP,
          unlockedBadgeIds: updatedBadges
        };
      });

      if (amount > 0) {
        triggerNotification(`+${amount} XP Earned!`, 'xp', amount);
      }
    },
    [commitState, triggerNotification]
  );

  const isBadgeUnlocked = useCallback(
    (badgeId: string) => state.unlockedBadgeIds.includes(badgeId),
    [state.unlockedBadgeIds]
  );

  const unlockBadge = useCallback(
    (badgeId: string) => {
      commitState((prev) => {
        if (prev.unlockedBadgeIds.includes(badgeId)) return prev;
        return {
          ...prev,
          unlockedBadgeIds: [...prev.unlockedBadgeIds, badgeId]
        };
      });
      triggerNotification(`New Badge Unlocked!`, 'badge');
    },
    [commitState, triggerNotification]
  );

  // Clinical Games Progress Methods
  const isGameCompleted = useCallback(
    (gameKey: keyof GameStats) => state.gameStats[gameKey]?.completed || false,
    [state.gameStats]
  );

  const recordGameResult = useCallback(
    (
      gameKey: keyof GameStats,
      score: number,
      options?: {
        xpAward?: number;
        badgeId?: string;
        additionalData?: any;
      }
    ) => {
      commitState((prev) => {
        const existing = prev.gameStats[gameKey] || {
          bestScore: 0,
          gamesPlayed: 0,
          lastPlayed: '',
          completed: false
        };

        const newBestScore = Math.max(existing.bestScore || 0, score);
        const newGamesPlayed = (existing.gamesPlayed || 0) + 1;
        const now = new Date().toISOString();

        const updatedGameStat = {
          ...existing,
          bestScore: newBestScore,
          gamesPlayed: newGamesPlayed,
          lastPlayed: now,
          completed: true,
          ...(options?.additionalData || {})
        };

        const historyEntry = {
          id: `hist-${Date.now()}`,
          gameId: String(gameKey),
          gameName: String(gameKey),
          score,
          xpAwarded: options?.xpAward || 0,
          timestamp: new Date().toLocaleTimeString()
        };

        let updatedBadges = [...prev.unlockedBadgeIds];
        if (options?.badgeId && !updatedBadges.includes(options.badgeId)) {
          updatedBadges.push(options.badgeId);
        }

        const xpToAdd = options?.xpAward || 0;
        const newDailyXp = Math.min(1000, prev.dailyXp + xpToAdd);

        return {
          ...prev,
          gameStats: {
            ...prev.gameStats,
            [gameKey]: updatedGameStat
          },
          gameHistory: [historyEntry, ...prev.gameHistory.slice(0, 19)],
          xp: prev.xp + xpToAdd,
          dailyXp: newDailyXp,
          unlockedBadgeIds: updatedBadges
        };
      });

      triggerNotification(`Game Completed & Saved! (+${options?.xpAward || 0} XP)`, 'game');
    },
    [commitState, triggerNotification]
  );

  // Clinical Risk Prediction History
  const savePredictionRecord = useCallback(
    (record: Omit<SavedPrediction, 'id' | 'timestamp'>) => {
      commitState((prev) => {
        const newPred: SavedPrediction = {
          id: `pred-${Date.now()}`,
          timestamp: new Date().toLocaleTimeString(),
          ...record
        };
        return {
          ...prev,
          predictions: [newPred, ...prev.predictions.slice(0, 14)]
        };
      });
    },
    [commitState]
  );

  // Portfolio Management
  const resetProgress = useCallback(async () => {
    await clearUserState();
    const fresh = { ...INITIAL_USER_STATE, completedModules: [], xp: 0, streakDays: 1, dailyXp: 0, unlockedBadgeIds: [] };
    setState(fresh);
    saveUserState(fresh);
    triggerNotification('All local progress reset to defaults.', 'info');
  }, [triggerNotification]);

  const exportDataJSON = useCallback(() => {
    return exportStateAsJSON(state);
  }, [state]);

  const importDataJSON = useCallback(async (jsonStr: string) => {
    try {
      const imported = importStateFromJSON(jsonStr);
      setState(imported);
      await saveUserState(imported);
      triggerNotification('Progress portfolio successfully restored!', 'info');
      return true;
    } catch (e: any) {
      triggerNotification(`Import failed: ${e.message}`, 'info');
      return false;
    }
  }, [triggerNotification]);

  const value: ProgressContextType = {
    state,
    isLoaded,
    storageEngine,
    completedModules: state.completedModules,
    isModuleCompleted,
    markModuleComplete,
    quizAnswers: state.quizAnswers,
    gameStats: state.gameStats,
    isGameCompleted,
    recordGameResult,
    xp: state.xp,
    level: playerLevel,
    rank: currentRank,
    streakDays: state.streakDays,
    dailyXp: state.dailyXp,
    awardXP,
    unlockedBadgeIds: state.unlockedBadgeIds,
    isBadgeUnlocked,
    unlockBadge,
    predictions: state.predictions,
    savePredictionRecord,
    resetProgress,
    exportDataJSON,
    importDataJSON,
    activeNotification,
    dismissNotification
  };

  return <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>;
};

export function useProgress(): ProgressContextType {
  const context = useContext(ProgressContext);
  if (!context) {
    throw new Error('useProgress must be used within a ProgressProvider');
  }
  return context;
}
