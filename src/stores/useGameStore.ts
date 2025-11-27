import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import type { StateStorage } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

// Stubs for missing packages
let createSelectorHooks: any;
let uuidv4: any;

try {
  ({ createSelectorHooks } = require('zustand-selector-hooks'));
} catch (e) {
  createSelectorHooks = null;
}

try {
  ({ v4: uuidv4 } = require('uuid'));
} catch (e) {
  uuidv4 = () => Math.random().toString(36).substring(2, 11);
}

// Types
export type GameType = 'slot' | 'blackjack' | 'roulette' | 'poker' | 'baccarat';

type GameResult = {
  id: string;
  winAmount: number;
  multiplier?: number;
  winningLines?: number[];
  symbols?: string[];
  bonusRounds?: number;
  freeSpins?: number;
  timestamp: number;
  gameState?: Record<string, unknown>;
  isJackpot?: boolean;
};

type GameHistoryItem = {
  id: string;
  game: GameType;
  timestamp: number;
  bet: number;
  win: number;
  result: Omit<GameResult, 'timestamp' | 'id'>;
};

type GameStatistics = {
  totalWins: number;
  totalSpins: number;
  winRate: number;
  biggestWin: number;
  totalWagered: number;
  favoriteGame: { game: GameType; count: number } | null;
  recentWins: Array<{ amount: number; timestamp: number }>;
};

// Constants
const GAME_CONFIG = {
  DEFAULT_BALANCE: 1000,
  DEFAULT_BET: 10,
  MAX_HISTORY: 100,
  MIN_BET: 1,
  MAX_BET: 1000,
  STORAGE_VERSION: '1.1', // Bumped version for new schema
  STORAGE_KEY: 'casino_game_state',
  JACKPOT_THRESHOLD: 1000,
  BONUS_FACTOR: 1.5,
  MAX_FREE_SPINS: 20,
  SESSION_TIMEOUT: 30 * 60 * 1000, // 30 minutes
} as const;

// Custom storage with error handling
const createCustomStorage = (): StateStorage => {
  return {
    getItem: (name: string) => {
      try {
        return localStorage.getItem(name);
      } catch (error) {
        console.error('Failed to load from localStorage:', error);
        return null;
      }
    },
    setItem: (name: string, value: string) => {
      try {
        localStorage.setItem(name, value);
      } catch (error) {
        console.error('Failed to save to localStorage:', error);
      }
    },
    removeItem: (name: string) => {
      try {
        localStorage.removeItem(name);
      } catch (error) {
        console.error('Failed to remove from localStorage:', error);
      }
    },
  };
};

export interface GameState {
  // Core game state
  isPlaying: boolean;
  currentGame: GameType | null;
  balance: number;
  betAmount: number;
  lastWin: number;
  gameHistory: GameHistoryItem[];
  lastResults: GameResult[];
  currentGameResult: GameResult | null;
  isProcessingResult: boolean;

  // Settings
  autoPlay: boolean;
  soundEnabled: boolean;
  quickSpin: boolean;
  lastPlayed: number | null;
  sessionStart: number | null;

  // Actions
  startGame: (game: GameType) => void;
  endGame: (result: Omit<GameResult, 'timestamp' | 'id'>) => void;
  placeBet: (amount: number) => void;
  cashOut: () => void;
  updateBalance: (amount: number, reason?: string) => void;
  toggleAutoPlay: () => void;
  toggleSound: () => void;
  toggleQuickSpin: () => void;
  resetGame: () => void;
  processGameResult: (result: Omit<GameResult, 'timestamp' | 'id'>) => Promise<void>;
  clearCurrentResult: () => void;

  // Selectors
  getLastGameResult: () => GameHistoryItem | null;
  getTotalWins: () => number;
  getGamesPlayed: (gameType?: GameType) => number;
  canPlaceBet: (amount?: number) => boolean;
  getGameStatistics: () => GameStatistics;
  isSessionActive: () => boolean;
  getCurrentStreak: () => number;
}

const initialState = {
  isPlaying: false,
  currentGame: null,
  balance: GAME_CONFIG.DEFAULT_BALANCE,
  betAmount: GAME_CONFIG.DEFAULT_BET,
  lastWin: 0,
  gameHistory: [],
  lastResults: [],
  currentGameResult: null,
  isProcessingResult: false,
  autoPlay: false,
  soundEnabled: true,
  quickSpin: false,
  lastPlayed: null,
  sessionStart: null,
};

// Create the store with middleware
export const useGameStore = (create as any)<GameState>()(
  devtools(
    persist(
      immer((set, get) => ({
        ...initialState,

        startGame: (game) => {
          const { balance, betAmount, isSessionActive } = get();
          if (balance < betAmount) {
            throw new Error('Insufficient balance');
          }

          // Reset session if inactive
          const sessionActive = isSessionActive();
          if (!sessionActive) {
            set({ sessionStart: Date.now() });
          }

          set((state) => {
            state.isPlaying = true;
            state.currentGame = game;
            state.balance -= betAmount;
            state.lastPlayed = Date.now();
            trackEvent('game_started', {
              game,
              bet: betAmount,
              balance: state.balance,
              sessionActive,
            });
          });
        },

        endGame: (result) => {
          const { currentGame, betAmount, processGameResult } = get();
          if (!currentGame) return;

          // Process the game result with enhanced handling
          processGameResult(result as any);
        },

        processGameResult: async (result: Omit<GameResult, 'timestamp' | 'id'>) => {
          const { currentGame, betAmount } = get();
          if (!currentGame) return;

          const timestamp = Date.now();
          const gameResult: GameResult = {
            ...result,
            id: uuidv4(),
            timestamp,
          };

          // Apply bonus for consecutive wins
          const lastResult = get().lastResults[0];
          const consecutiveWins = lastResult?.winAmount > 0
            ? (get().lastResults.filter((r) => r.winAmount > 0).length + 1)
            : 1;

          const bonusMultiplier = consecutiveWins > 1
            ? Math.min(1 + (consecutiveWins * 0.1), 2)
            : 1; // Up to 2x bonus

          const finalWinAmount = gameResult.winAmount * bonusMultiplier;

          set((state) => {
            state.isProcessingResult = true;
            state.lastWin = finalWinAmount;
            state.balance += finalWinAmount;
            state.currentGameResult = { ...gameResult, winAmount: finalWinAmount };

            // Add to last results
            state.lastResults.unshift({
              ...gameResult,
              winAmount: finalWinAmount,
              multiplier: gameResult.multiplier
                ? gameResult.multiplier * bonusMultiplier
                : bonusMultiplier > 1
                ? bonusMultiplier
                : undefined,
            });

            // Trim results
            if (state.lastResults.length > GAME_CONFIG.MAX_HISTORY) {
              state.lastResults.pop();
            }

            // Add to game history
            const historyItem: GameHistoryItem = {
              id: uuidv4(),
              game: currentGame,
              timestamp,
              bet: betAmount,
              win: finalWinAmount,
              result: {
                winAmount: finalWinAmount,
                multiplier: gameResult.multiplier
                  ? gameResult.multiplier * bonusMultiplier
                  : bonusMultiplier > 1
                  ? bonusMultiplier
                  : undefined,
                winningLines: gameResult.winningLines,
                symbols: gameResult.symbols,
                bonusRounds: gameResult.bonusRounds,
                freeSpins: gameResult.freeSpins,
                isJackpot: gameResult.isJackpot,
                gameState: gameResult.gameState,
              },
            };

            state.gameHistory.unshift(historyItem);
            if (state.gameHistory.length > GAME_CONFIG.MAX_HISTORY) {
              state.gameHistory.pop();
            }

            // Track analytics
            trackEvent('game_completed', {
              game: currentGame,
              bet: betAmount,
              win: finalWinAmount,
              isWin: finalWinAmount > 0,
              multiplier: gameResult.multiplier,
              bonusMultiplier: bonusMultiplier > 1 ? bonusMultiplier : undefined,
              timestamp,
            });

            // Handle jackpot
            if (finalWinAmount >= GAME_CONFIG.JACKPOT_THRESHOLD) {
              trackEvent('jackpot_won', {
                amount: finalWinAmount,
                game: currentGame,
                timestamp,
              });
            }
          });

          // Simulate processing delay
          await new Promise((resolve) => setTimeout(resolve, 1000));

          set({ isProcessingResult: false });
        },

        clearCurrentResult: () => {
          set({ currentGameResult: null });
        },

        isSessionActive: () => {
          const { sessionStart } = get();
          if (!sessionStart) return false;
          return (Date.now() - sessionStart) < GAME_CONFIG.SESSION_TIMEOUT;
        },

        getCurrentStreak: () => {
          const { lastResults } = get();
          let streak = 0;
          for (const result of lastResults) {
            if (result.winAmount > 0) {
              streak++;
            } else {
              break;
            }
          }
          return streak;
        },

        // ... other actions and selectors ...
      })),
      {
        name: GAME_CONFIG.STORAGE_KEY,
        version: 1, // Increment this when making breaking changes
        storage: createCustomStorage() as any,
        partialize: (state: GameState) => ({
          balance: state.balance,
          betAmount: state.betAmount,
          gameHistory: state.gameHistory,
          lastResults: state.lastResults,
          soundEnabled: state.soundEnabled,
          quickSpin: state.quickSpin,
          autoPlay: state.autoPlay,
          lastPlayed: state.lastPlayed,
          sessionStart: state.sessionStart,
        } as any),
        migrate: (persistedState: any, version) => {
          console.log('Migrating from version', version);

          // Migration from version 0 to 1 (initial version)
          if (version === 0) {
            // Add any migration logic here
            return {
              ...persistedState,
              lastResults: [],
              currentGameResult: null,
              isProcessingResult: false,
              sessionStart: null,
            };
          }

          return persistedState;
        },
      }
    ),
    {
      name: 'GameStore',
      enabled: process.env.NODE_ENV === 'development',
      anonymousActionType: 'GameStoreAction',
    }
  )
);

// Create typed hooks for better TypeScript support
export const useGameStoreSelectors = createSelectorHooks ? createSelectorHooks(useGameStore) : ({} as any);

// Export selectors with memoization
export const selectors = {
  balance: (state: GameState) => state.balance,
  betAmount: (state: GameState) => state.betAmount,
  isPlaying: (state: GameState) => state.isPlaying,
  currentGame: (state: GameState) => state.currentGame,
  lastWin: (state: GameState) => state.lastWin,
  gameHistory: (state: GameState) => state.gameHistory,
  autoPlay: (state: GameState) => state.autoPlay,
  soundEnabled: (state: GameState) => state.soundEnabled,
  quickSpin: (state: GameState) => state.quickSpin,
  lastPlayed: (state: GameState) => state.lastPlayed,

  // Derived selectors
  totalWagered: (state: GameState) =>
    state.gameHistory.reduce((total, game) => total + game.bet, 0),

  totalWins: (state: GameState) =>
    state.gameHistory.reduce((total, game) => total + game.win, 0),

  winRate: (state: GameState) => {
    const wins = state.gameHistory.filter((g) => g.win > 0).length;
    return state.gameHistory.length > 0
      ? (wins / state.gameHistory.length) * 100
      : 0;
  },

  canAffordBet: (amount: number) => (state: GameState) =>
    state.balance >= amount && amount >= GAME_CONFIG.MIN_BET,
};

// Analytics helper function
function trackEvent(eventName: string, properties: Record<string, unknown> = {}) {
  if (typeof window === 'undefined') return;

  try {
    const eventData = {
      event: eventName,
      timestamp: Date.now(),
      ...properties,
    };

    // In production, you would send this to your analytics service
    if (process.env.NODE_ENV === 'development') {
      console.log(`[Analytics] ${eventName}`, eventData);
    }

    // Example: Send to analytics service
    // analytics.track(eventName, eventData);

    // Optionally store events in localStorage for debugging
    try {
      const events = JSON.parse(localStorage.getItem('analytics_events') || '[]');
      events.push(eventData);
      // Keep only the last 100 events
      localStorage.setItem('analytics_events', JSON.stringify(events.slice(-100)));
    } catch (e) {
      console.error('Failed to store analytics event:', e);
    }
  } catch (error) {
    console.error('Failed to track event:', error);
  }
}

// Initialize analytics
if (typeof window !== 'undefined') {
  // Track session start
  trackEvent('session_start', {
    referrer: document.referrer,
    userAgent: navigator.userAgent,
    screen: {
      width: window.screen.width,
      height: window.screen.height,
      colorDepth: window.screen.colorDepth,
    },
    language: navigator.language,
  });

  // Track page views
  trackEvent('page_view', {
    url: window.location.href,
    path: window.location.pathname,
    search: window.location.search,
  });

  // Track page visibility changes
  document.addEventListener('visibilitychange', () => {
    trackEvent('visibility_change', {
      isVisible: !document.hidden,
      timestamp: Date.now(),
    });
  });

  // Track before unload
  window.addEventListener('beforeunload', () => {
    trackEvent('session_end', {
      duration: Date.now() - performance.timeOrigin,
      timestamp: Date.now(),
    });
  });
}

// Utility function to format currency
// export const formatCurrency = (amount: number): string => {
//   return new Intl.NumberFormat('en-US', {
//     style: 'currency',
//     currency: 'USD',
//   }).format(amount);
// };

// Export store instance for direct access if needed (use sparingly)
export const gameStore = useGameStore;
