import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Cherry, Sparkles, Coins, Flame, Keyboard } from 'lucide-react';
import { ParticleExplosion } from '@/components/ParticleExplosion';
import { CountingNumber, PulseNumber } from '@/components/CountingNumber';
import { QuickBetControls } from '@/components/QuickBetControls';
import { useSound } from '@/hooks/useSound';
import { useHaptic } from '@/hooks/useHaptic';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { displayError } from '@/utils/errorHandler';
import { SlotsGameBackground } from './SlotsGameBackground';

interface SlotsGameProps {
  onPlaceBet: (betAmount: string, target: number) => void;
  isPlaying: boolean;
  currentBalance: number;
  lastOutcome?: number | null;
  lastWon?: boolean | null;
}

// Slot symbols with their multipliers
const SYMBOLS = [
  { icon: '🍒', name: 'cherry', multiplier: 2, color: '#ef4444' },
  { icon: '🍋', name: 'lemon', multiplier: 3, color: '#eab308' },
  { icon: '🍊', name: 'orange', multiplier: 4, color: '#f97316' },
  { icon: '🍇', name: 'grape', multiplier: 5, color: '#a855f7' },
  { icon: '💎', name: 'diamond', multiplier: 8, color: '#06b6d4' },
  { icon: '⭐', name: 'star', multiplier: 10, color: '#fbbf24' },
  { icon: '7️⃣', name: 'seven', multiplier: 20, color: '#22c55e' },
];

function getSymbolFromOutcome(outcome: number, reelIndex: number): typeof SYMBOLS[number] {
  // Use outcome and reel index to deterministically select a symbol
  const hash = (outcome * (reelIndex + 1) * 13) % 100;

  // Weighted distribution (higher multipliers are rarer)
  if (hash < 25) return SYMBOLS[0]; // Cherry - 25%
  if (hash < 45) return SYMBOLS[1]; // Lemon - 20%
  if (hash < 63) return SYMBOLS[2]; // Orange - 18%
  if (hash < 78) return SYMBOLS[3]; // Grape - 15%
  if (hash < 88) return SYMBOLS[4]; // Diamond - 10%
  if (hash < 95) return SYMBOLS[5]; // Star - 7%
  return SYMBOLS[6]; // Seven - 5%
}

function calculateSlotsWin(symbols: typeof SYMBOLS[number][]): { won: boolean; multiplier: number } {
  // Check for three of a kind
  if (symbols[0].name === symbols[1].name && symbols[1].name === symbols[2].name) {
    return { won: true, multiplier: symbols[0].multiplier };
  }

  // Check for two of a kind (partial win)
  if (symbols[0].name === symbols[1].name || symbols[1].name === symbols[2].name) {
    const symbol = symbols[0].name === symbols[1].name ? symbols[0] : symbols[1];
    return { won: true, multiplier: symbol.multiplier * 0.5 };
  }

  return { won: false, multiplier: 0 };
}

function SlotReel({
  symbol,
  isSpinning,
  delay,
  lastWon,
}: {
  symbol: typeof SYMBOLS[number];
  isSpinning: boolean;
  delay: number;
  lastWon: boolean | null | undefined;
}) {
  const [displaySymbol, setDisplaySymbol] = useState(symbol);

  useEffect(() => {
    if (isSpinning) {
      const interval = setInterval(() => {
        setDisplaySymbol(SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)]);
      }, 100);
      return () => clearInterval(interval);
    } else {
      setDisplaySymbol(symbol);
    }
  }, [isSpinning, symbol]);

  return (
    <motion.div
      className="relative w-24 h-32 rounded-lg border-4 overflow-hidden"
      animate={{
        scale: !isSpinning && lastWon ? [1, 1.1, 1] : 1,
      }}
      transition={{
        duration: 0.5,
        delay: delay + 0.2,
      }}
      style={{
        backgroundColor: 'var(--card)',
        borderColor: 'var(--primary)',
        boxShadow: 'var(--style-boxShadow)',
      }}
    >
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(to top, var(--primary) -100%, transparent 30%)`,
          opacity: 0.2,
        }}
      />
      <motion.div
        className="absolute inset-0 flex items-center justify-center"
        animate={{
          y: isSpinning ? [0, -20, 0] : 0,
        }}
        transition={{
          duration: 0.1,
          repeat: isSpinning ? Number.POSITIVE_INFINITY : 0,
          delay: delay,
        }}
      >
        <motion.div
          className="text-6xl filter drop-shadow-lg"
          animate={{
            scale: isSpinning ? [1, 0.9, 1] : 1,
            filter: isSpinning ? ['blur(0px)', 'blur(4px)', 'blur(0px)'] : 'blur(0px)',
          }}
          transition={{
            duration: 0.2,
            repeat: isSpinning ? Number.POSITIVE_INFINITY : 0,
          }}
        >
          {displaySymbol.icon}
        </motion.div>
      </motion.div>

      {/* Shine effect */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
        animate={{
          x: isSpinning ? ['-100%', '200%'] : '-100%',
        }}
        transition={{
          duration: 1,
          repeat: isSpinning ? Number.POSITIVE_INFINITY : 0,
          ease: 'linear',
        }}
      />
    </motion.div>
  );
}

export function SlotsGame({
  onPlaceBet,
  isPlaying,
  currentBalance,
  lastOutcome,
  lastWon,
}: SlotsGameProps) {
  const [betAmount, setBetAmount] = useState('0.001');
  const [particleTrigger, setParticleTrigger] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [reelSymbols, setReelSymbols] = useState<typeof SYMBOLS[number][]>([
    SYMBOLS[0],
    SYMBOLS[0],
    SYMBOLS[0],
  ]);
  const [winMultiplier, setWinMultiplier] = useState(0);
  const previousOutcome = useRef<number | null | undefined>(lastOutcome);

  const sound = useSound();
  const haptic = useHaptic();
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (lastOutcome !== null && lastOutcome !== undefined && lastOutcome !== previousOutcome.current) {
      // Play sounds and haptic feedback
      if (lastWon) {
        sound.playWin();
        haptic.success();
      } else {
        sound.playLose();
        haptic.error();
      }

      // Calculate reel symbols from outcome
      const symbols = [
        getSymbolFromOutcome(lastOutcome, 0),
        getSymbolFromOutcome(lastOutcome, 1),
        getSymbolFromOutcome(lastOutcome, 2),
      ];

      setReelSymbols(symbols);

      const result = calculateSlotsWin(symbols);
      setWinMultiplier(result.multiplier);

      setParticleTrigger((prev) => prev + 1);
      setShowResult(true);
      previousOutcome.current = lastOutcome;
    }
  }, [lastOutcome]);

  const handlePlaceBet = useCallback(() => {
    if (parseFloat(betAmount) <= 0) {
      displayError(new Error('Please enter a valid bet amount'), { type: 'validation' });
      return;
    }

    if (parseFloat(betAmount) > currentBalance) {
      displayError(new Error('Insufficient balance'), { type: 'payment' });
      return;
    }

    sound.playSpin();
    haptic.light();
    setShowResult(false);
    // Use 50 as default target for slots (50% base win chance)
    onPlaceBet(betAmount, 50);
  }, [betAmount, currentBalance, sound, haptic, onPlaceBet]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (isPlaying) return;

      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handlePlaceBet();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isPlaying, betAmount, handlePlaceBet]);

  const potentialWin = parseFloat(betAmount) * 10; // Max multiplier for 777

  return (
    <div className="space-y-6 relative" style={{ color: 'var(--foreground)' }}>
      <SlotsGameBackground />
      {/* Slots Machine */}
      <Card
        className="relative p-8 overflow-hidden border-2"
        style={{
          backgroundColor: 'transparent',
          borderColor: 'var(--border)',
        }}
      >
        <ParticleExplosion isWin={!!lastWon} trigger={particleTrigger} />

        <div className="relative flex flex-col items-center justify-center space-y-6">
          <motion.div
            className="flex items-center gap-3"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Cherry className="w-8 h-8" style={{ color: 'var(--primary)' }} />
            <h2
              className="text-3xl font-bold"
              style={{
                background: 'var(--style-buttonGradient)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              CLASSIC VEGAS
            </h2>
            <Cherry className="w-8 h-8" style={{ color: 'var(--primary)' }} />
          </motion.div>

          <div
            className="relative p-6 rounded-2xl border-4"
            style={{
              backgroundColor: 'var(--card)',
              borderColor: 'var(--primary)',
              boxShadow: 'var(--style-boxShadow)',
            }}
          >
            <motion.div
              className="flex gap-4 relative z-10"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 200, damping: 20 }}
            >
              <SlotReel symbol={reelSymbols[0]} isSpinning={isPlaying} delay={0} lastWon={lastWon} />
              <SlotReel symbol={reelSymbols[1]} isSpinning={isPlaying} delay={0.1} lastWon={lastWon} />
              <SlotReel symbol={reelSymbols[2]} isSpinning={isPlaying} delay={0.2} lastWon={lastWon} />
            </motion.div>
          </div>

          <AnimatePresence mode="wait">
            {lastOutcome !== null && lastOutcome !== undefined && !isPlaying && showResult && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.4, type: 'spring', stiffness: 200, damping: 20 }}
                className="text-center"
              >
                <motion.div
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full border-2"
                  style={{
                    backgroundColor: lastWon ? 'rgba(212, 175, 55, 0.1)' : 'rgba(200, 29, 37, 0.1)',
                    borderColor: lastWon ? 'var(--primary)' : 'var(--secondary)',
                    color: lastWon ? 'var(--primary)' : 'var(--secondary)',
                  }}
                  animate={{
                    boxShadow: lastWon ? 'var(--style-boxShadow)' : 'none',
                  }}
                  transition={{ duration: 1, repeat: lastWon ? Infinity : 0 }}
                >
                  {lastWon && <Sparkles className="w-6 h-6" />}
                  <span className="text-2xl font-bold">
                    {lastWon ? `${winMultiplier.toFixed(2)}x WIN!` : 'TRY AGAIN'}
                  </span>
                  {lastWon && <Sparkles className="w-6 h-6" />}
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          <motion.div
            className="grid grid-cols-4 gap-2 p-4 rounded-lg border"
            style={{
              backgroundColor: 'var(--card)',
              borderColor: 'var(--border)',
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            {SYMBOLS.slice(0, 4).map((symbol, i) => (
              <div key={i} className="flex flex-col items-center gap-1">
                <span className="text-2xl">{symbol.icon}</span>
                <span className="text-xs font-bold" style={{ color: 'var(--primary)' }}>
                  {symbol.multiplier}x
                </span>
              </div>
            ))}
          </motion.div>
        </div>
      </Card>

      <Card
        className="relative p-6 border-2"
        style={{
          backgroundColor: 'transparent',
          borderColor: 'var(--border)',
        }}
      >
        <motion.div
          className="space-y-6 relative"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <motion.div whileHover={{ scale: prefersReducedMotion ? 1 : 1.01 }} transition={{ type: 'spring', stiffness: 300, damping: 20 }}>
            <Label htmlFor="slotsBetAmount" style={{ color: 'var(--primary)' }}>Bet Amount</Label>
            <Input
              id="slotsBetAmount"
              type="number"
              step="0.001"
              min="0"
              value={betAmount}
              onChange={(e) => setBetAmount(e.target.value)}
              disabled={isPlaying}
              className="mt-1.5 bg-transparent"
              style={{ borderColor: 'var(--border)', color: 'var(--foreground)' }}
            />
            <div className="flex gap-2 mt-2">
              <motion.div whileHover={{ scale: prefersReducedMotion ? 1 : 1.05 }} whileTap={{ scale: prefersReducedMotion ? 1 : 0.95 }}>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    sound.playClick();
                    setBetAmount((parseFloat(betAmount) / 2).toFixed(8));
                  }}
                  disabled={isPlaying}
                  style={{
                    backgroundColor: 'var(--card)',
                    borderColor: 'var(--border)',
                    color: 'var(--foreground)',
                  }}
                >
                  ½
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: prefersReducedMotion ? 1 : 1.05 }} whileTap={{ scale: prefersReducedMotion ? 1 : 0.95 }}>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    sound.playClick();
                    setBetAmount((parseFloat(betAmount) * 2).toFixed(8));
                  }}
                  disabled={isPlaying}
                  style={{
                    backgroundColor: 'var(--card)',
                    borderColor: 'var(--border)',
                    color: 'var(--foreground)',
                  }}
                >
                  2×
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: prefersReducedMotion ? 1 : 1.05 }} whileTap={{ scale: prefersReducedMotion ? 1 : 0.95 }}>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    sound.playClick();
                    setBetAmount(currentBalance.toFixed(8));
                  }}
                  disabled={isPlaying}
                  style={{
                    backgroundColor: 'var(--card)',
                    borderColor: 'var(--border)',
                    color: 'var(--foreground)',
                  }}
                >
                  Max
                </Button>
              </motion.div>
            </div>
          </motion.div>

          <QuickBetControls
            betAmount={betAmount}
            onSetBetAmount={(amount) => {
              sound.playClick();
              setBetAmount(amount);
            }}
            disabled={isPlaying}
            currentBalance={currentBalance}
          />

          <motion.div
            className="grid grid-cols-2 gap-4 p-4 rounded-lg border"
            style={{
              backgroundColor: 'var(--card)',
              borderColor: 'var(--border)',
            }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div>
              <p className="text-xs text-muted-foreground">Max Win (777)</p>
              <p className="text-lg font-semibold flex items-center" style={{ color: 'var(--primary)' }}>
                <Coins className="w-4 h-4 mr-1" />
                <CountingNumber value={potentialWin} decimals={8} />
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Last Multiplier</p>
              <p className="text-lg font-semibold flex items-center" style={{ color: 'var(--success)' }}>
                <Flame className="w-4 h-4 mr-1" />
                {lastWon && winMultiplier > 0 ? (
                  <PulseNumber value={winMultiplier} decimals={2} />
                ) : (
                  '0.00'
                )}x
              </p>
            </div>
          </motion.div>

          <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
            <Keyboard className="w-3 h-3" />
            <span>Enter to spin</span>
          </div>

          <motion.div whileHover={{ scale: prefersReducedMotion ? 1 : 1.02 }} whileTap={{ scale: prefersReducedMotion ? 1 : 0.98 }}>
            <Button
              className="w-full relative overflow-hidden text-black font-bold text-lg"
              size="lg"
              onClick={handlePlaceBet}
              disabled={isPlaying}
              style={{
                background: 'var(--style-buttonGradient)',
                boxShadow: 'var(--style-boxShadow)',
                color: 'var(--foreground)',
              }}
            >
              {isPlaying && !prefersReducedMotion && (
                <motion.div
                  className="absolute inset-0"
                  style={{
                    background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent)',
                  }}
                  animate={{ x: ['-100%', '200%'] }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                />
              )}
              <span className="relative z-10 flex items-center justify-center gap-2">
                {isPlaying ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    >
                      <Cherry className="w-5 h-5" />
                    </motion.div>
                    SPINNING...
                  </>
                ) : (
                  <>
                    <Cherry className="w-5 h-5" />
                    SPIN TO WIN (Enter)
                  </>
                )}
              </span>
            </Button>
          </motion.div>
        </motion.div>
      </Card>
    </div>
  );
}
