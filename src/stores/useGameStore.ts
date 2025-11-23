import { create } from 'zustand';
import { devtools, persist, StateStorage } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import { createSelectorHooks } from 'zustand-selector-hooks';

// Types
export type GameType = 'slot' | 'blackjack' | 'roulette' | 'poker' | 'baccarat';

type GameResult = {
  winAmount: number;
  multiplier?: number;
  winningLines?: number[];
  timestamp: number;
  gameState?: Record<string, unknown>;
};

type GameHistoryItem = {
  game: GameType;
  timestamp: number;
  bet: number;
  win: number;
  result: Omit<GameResult, 'timestamp'>;
};

// Constants
const GAME_CONFIG = {
  DEFAULT_BALANCE: 1000,
  DEFAULT_BET: 10,
  MAX_HISTORY: 100,
  MIN_BET: 1,
  MAX_BET: 1000,
  STORAGE_VERSION: '1.0',
  STORAGE_KEY: 'casino_game_state',
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
  // Game session state
  isPlaying: boolean;
  currentGame: GameType | null;
  balance: number;
  betAmount: number;
  lastWin: number;
  gameHistory: GameHistoryItem[];
  
  // Game settings
  autoPlay: boolean;
  soundEnabled: boolean;
  quickSpin: boolean;
  lastPlayed: number | null;
  
  // Actions
  startGame: (game: GameType) => void;
  endGame: (result: Omit<GameResult, 'timestamp'>) => void;
  placeBet: (amount: number) => void;
  cashOut: () => void;
  updateBalance: (amount: number) => void;
  toggleAutoPlay: () => void;
  toggleSound: () => void;
  toggleQuickSpin: () => void;
  resetGame: () => void;
  getLastGameResult: () => GameHistoryItem | null;
  getTotalWins: () => number;
  getGamesPlayed: (gameType?: GameType) => number;
  canPlaceBet: (amount?: number) => boolean;
}

const initialState = {
  isPlaying: false,
  currentGame: null,
  balance: GAME_CONFIG.DEFAULT_BALANCE,
  betAmount: GAME_CONFIG.DEFAULT_BET,
  lastWin: 0,
  gameHistory: [],
  autoPlay: false,
  soundEnabled: true,
  quickSpin: false,
  lastPlayed: null,
};

// Create the store with middleware
export const useGameStore = create<GameState>()(
  devtools(
    persist(
      immer((set, get) => ({
        ...initialState,
        
        startGame: (game) => {
          const { balance, betAmount } = get();
          
          if (!game) {
            throw new Error('No game specified');
          }
          
          if (balance < betAmount) {
            throw new Error('Insufficient balance for this bet');
          }
          
          if (betAmount < GAME_CONFIG.MIN_BET || betAmount > GAME_CONFIG.MAX_BET) {
            throw new Error(`Bet amount must be between ${GAME_CONFIG.MIN_BET} and ${GAME_CONFIG.MAX_BET}`);
          }
          
          set((state) => {
            state.isPlaying = true;
            state.currentGame = game;
            state.balance -= betAmount;
            state.lastPlayed = Date.now();
            
            // Analytics event
            trackEvent('game_started', { game, betAmount });
          });
        },
        
        endGame: (result) => {
          const { currentGame, betAmount } = get();
          
          if (!currentGame) {
            console.warn('No active game to end');
            return;
          }
          
          const winAmount = result?.winAmount || 0;
          const gameResult: GameResult = {
            ...result,
            timestamp: Date.now(),
          };
          
          set((state) => {
            state.isPlaying = false;
            state.lastWin = winAmount;
            state.balance += winAmount;
            
            // Add to game history
            const historyItem: GameHistoryItem = {
              game: currentGame,
              timestamp: Date.now(),
              bet: betAmount,
              win: winAmount,
              result: {
                winAmount,
                multiplier: result?.multiplier,
                winningLines: result?.winningLines,
                gameState: result?.gameState,
              },
            };
            
            state.gameHistory.unshift(historyItem);
            
            // Keep history size in check
            if (state.gameHistory.length > GAME_CONFIG.MAX_HISTORY) {
              state.gameHistory.pop();
            }
            
            // Analytics event
            trackEvent('game_ended', {
              game: currentGame,
              bet: betAmount,
              win: winAmount,
              result: gameResult,
            });
          });
        },
        
        placeBet: (amount) => {
          if (typeof amount !== 'number' || isNaN(amount) || amount <= 0) {
            throw new Error('Invalid bet amount');
          }
          
          if (amount > get().balance) {
            throw new Error('Insufficient balance');
          }
          
          set((state) => {
            state.betAmount = Math.min(Math.max(amount, GAME_CONFIG.MIN_BET), GAME_CONFIG.MAX_BET);
          });
        },
        
        cashOut: () => {
          const { currentGame, betAmount } = get();
          
          set((state) => {
            state.isPlaying = false;
            
            if (currentGame) {
              // Return the bet amount if game was in progress
              state.balance += betAmount;
              
              // Analytics event
              trackEvent('game_cashed_out', { game: currentGame, bet: betAmount });
            }
            
            state.currentGame = null;
          });
        },
        
        updateBalance: (amount) => {
          if (typeof amount !== 'number' || isNaN(amount)) {
            throw new Error('Invalid amount');
          }
          
          set((state) => {
            state.balance = Math.max(0, state.balance + amount);
            
            // Analytics event for significant balance changes
            if (Math.abs(amount) >= 100) {
              trackEvent('balance_updated', { amount, newBalance: state.balance });
            }
          });
        },
        
        toggleAutoPlay: () => {
          set((state) => {
            state.autoPlay = !state.autoPlay;
            trackEvent('autoplay_toggled', { enabled: state.autoPlay });
          });
        },
        
        toggleSound: () => {
          set((state) => {
            state.soundEnabled = !state.soundEnabled;
            trackEvent('sound_toggled', { enabled: state.soundEnabled });
          });
        },
        
        toggleQuickSpin: () => {
          set((state) => {
            state.quickSpin = !state.quickSpin;
            trackEvent('quickspin_toggled', { enabled: state.quickSpin });
          });
        },
        
        resetGame: () => {
          if (window.confirm('Are you sure you want to reset your game? This will clear all progress.')) {
            trackEvent('game_reset');
            set(initialState);
          }
        },
        
        // Selectors
        getLastGameResult: () => {
          const { gameHistory } = get();
          return gameHistory.length > 0 ? gameHistory[0] : null;
        },
        
        getTotalWins: () => {
          return get().gameHistory.reduce((total, game) => total + game.win, 0);
        },
        
        getGamesPlayed: (gameType?: GameType) => {
          const { gameHistory } = get();
          return gameType 
            ? gameHistory.filter(game => game.game === gameType).length 
            : gameHistory.length;
        },
        
        canPlaceBet: (amount?: number) => {
          const { balance } = get();
          const betAmount = amount ?? get().betAmount;
          return balance >= betAmount && 
                 betAmount >= GAME_CONFIG.MIN_BET && 
                 betAmount <= GAME_CONFIG.MAX_BET;
        },
      })),
      {
        name: GAME_CONFIG.STORAGE_KEY,
        version: 1,
        storage: createCustomStorage(),
        partialize: (state) => ({
          balance: state.balance,
          betAmount: state.betAmount,
          gameHistory: state.gameHistory,
          autoPlay: state.autoPlay,
          soundEnabled: state.soundEnabled,
          quickSpin: state.quickSpin,
          lastPlayed: state.lastPlayed,
        }),
        migrate: (persistedState: any, version) => {
          // Handle migrations between versions if needed
          if (version === 0) {
            // Migrate from version 0 to 1
            return {
              ...persistedState,
              lastPlayed: null, // New field
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
export const useGameStoreSelectors = createSelectorHooks(useGameStore);

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
    const wins = state.gameHistory.filter(g => g.win > 0).length;
    return state.gameHistory.length > 0 
      ? (wins / state.gameHistory.length) * 100 
      : 0;
  },
  
  canAffordBet: (amount: number) => (state: GameState) => 
    state.balance >= amount && amount >= GAME_CONFIG.MIN_BET,
};

// Analytics helper function
function trackEvent(eventName: string, properties?: Record<string, unknown>) {
  if (typeof window === 'undefined') return;
  
  // Replace with your analytics implementation
  try {
    console.log(`[Analytics] ${eventName}`, properties);
    // Example: analytics.track(eventName, properties);
  } catch (error) {
    console.error('Analytics error:', error);
  }
}

// Utility function to format currency
// export const formatCurrency = (amount: number): string => {
//   return new Intl.NumberFormat('en-US', {
//     style: 'currency',
//     currency: 'USD',
//     minimumFractionDigits: 2,
//   }).format(amount);
// };

// Export store instance for direct access if needed (use sparingly)
export const gameStore = useGameStore;
