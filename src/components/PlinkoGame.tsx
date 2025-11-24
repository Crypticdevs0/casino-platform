import { useState, useEffect, useRef, useCallback, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { ThemeContext } from '@/contexts/ThemeContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Circle, TrendingUp, Target, Keyboard } from 'lucide-react';
import { ParticleExplosion } from '@/components/ParticleExplosion';
import { CountingNumber, PulseNumber } from '@/components/CountingNumber';
import { QuickBetControls } from '@/components/QuickBetControls';
import { useSound } from '@/hooks/useSound';
import { useHaptic } from '@/hooks/useHaptic';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { displayError } from '@/utils/errorHandler';

interface PlinkoGameProps {
  onPlaceBet: (betAmount: string, target: number) => void;
  isPlaying: boolean;
  currentBalance: number;
  lastOutcome?: number | null;
  lastWon?: boolean | null;
}

// Plinko multipliers for each bucket
const MULTIPLIERS = [16, 9, 2, 1.4, 1.1, 1, 0.5, 1, 1.1, 1.4, 2, 9, 16];

// Helper function to generate color shades
const generateBucketColors = (primaryColor: string) => {
  const colors = [];
  for (const multiplier of MULTIPLIERS) {
    const shade = Math.max(0, Math.log2(multiplier) * 20);
    colors.push(`hsl(from ${primaryColor} h s ${shade}%)`);
  }
  return colors;
};

function PlinkoBoard({
  isDropping,
  bucketIndex,
}: {
  isDropping: boolean;
  bucketIndex: number | null;
}) {
  const rows = 12;
  const [ballPath, setBallPath] = useState<Array<{ x: number; y: number }>>([]);
  const [bucketColors, setBucketColors] = useState<string[]>([]);
  const themeContext = useContext(ThemeContext);

  useEffect(() => {
    const primaryColor = getComputedStyle(document.documentElement).getPropertyValue('--primary').trim();
    if (primaryColor) {
      setBucketColors(generateBucketColors(primaryColor));
    }
  }, [themeContext]);

  useEffect(() => {
    if (isDropping && bucketIndex !== null) {
      // Generate ball path
      const path: Array<{ x: number; y: number }> = [];
      let position = 6; // Start at center (0-indexed)

      path.push({ x: position, y: 0 });

      for (let row = 1; row <= rows; row++) {
        // Determine direction based on final bucket position
        const targetOffset = bucketIndex - 6;
        const currentOffset = position - 6;
        const shouldGoRight = currentOffset < targetOffset;
        const shouldGoLeft = currentOffset > targetOffset;

        let direction = Math.random() < 0.5 ? -0.5 : 0.5;

        if (shouldGoRight && Math.random() < 0.7) direction = 0.5;
        if (shouldGoLeft && Math.random() < 0.7) direction = -0.5;

        position += direction;
        path.push({ x: position, y: row });
      }

      setBallPath(path);
    } else {
      setBallPath([]);
    }
  }, [isDropping, bucketIndex]);

  return (
    <div className="relative w-full max-w-2xl mx-auto py-8">
      {/* Pegs */}
      <div className="relative" style={{ height: '400px' }}>
        {Array.from({ length: rows }).map((_, rowIndex) => {
          const pegsInRow = rowIndex + 3;
          return (
            <div
              key={rowIndex}
              className="absolute w-full flex justify-center gap-8"
              style={{ top: `${(rowIndex / rows) * 100}%` }}
            >
              {Array.from({ length: pegsInRow }).map((_, pegIndex) => (
                <motion.div
                  key={pegIndex}
                  className="w-3 h-3 bg-blue-400 rounded-full shadow-lg"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: rowIndex * 0.05 + pegIndex * 0.02 }}
                  style={{
                    boxShadow: '0 0 10px var(--primary)',
                    backgroundColor: 'var(--primary)',
                  }}
                />
              ))}
            </div>
          );
        })}

        {/* Ball */}
        <AnimatePresence>
          {isDropping && ballPath.length > 0 && (
            <motion.div
              className="absolute w-4 h-4 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full shadow-xl z-10"
              initial={{
                x: `${(ballPath[0].x / 12) * 100}%`,
                y: '0%',
                scale: 0,
              }}
              animate={{
                x: ballPath.map((p) => `${(p.x / 12) * 100}%`),
                y: ballPath.map((p) => `${(p.y / rows) * 100}%`),
                scale: 1,
              }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{
                duration: 2,
                ease: 'easeInOut',
              }}
              style={{
                boxShadow: '0 0 20px var(--accent)',
                backgroundColor: 'var(--accent)',
              }}
            />
          )}
        </AnimatePresence>
      </div>

      {/* Buckets */}
      <div className="flex justify-center gap-1 mt-4">
        {MULTIPLIERS.map((multiplier, index) => (
          <motion.div
            key={index}
            className="flex flex-col items-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <motion.div
              className="w-12 h-16 rounded-b-lg border-2 border-t-0 flex items-end justify-center pb-1"
              style={{
                backgroundColor: `${bucketColors[index]}20`,
                borderColor: bucketColors[index],
              }}
              animate={
                bucketIndex === index && !isDropping
                  ? {
                      scale: [1, 1.1, 1],
                      boxShadow: [
                        `0 0 10px ${bucketColors[index]}80`,
                        `0 0 30px ${bucketColors[index]}`,
                        `0 0 10px ${bucketColors[index]}80`,
                      ],
                    }
                  : {}
              }
              transition={{ duration: 0.5, repeat: bucketIndex === index ? 3 : 0 }}
            >
              <span
                className="text-xs font-bold"
                style={{ color: bucketColors[index] }}
              >
                {multiplier}x
              </span>
            </motion.div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export function PlinkoGame({
  onPlaceBet,
  isPlaying,
  currentBalance,
  lastOutcome,
  lastWon,
}: PlinkoGameProps) {
  const [betAmount, setBetAmount] = useState('0.001');
  const [particleTrigger, setParticleTrigger] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [bucketIndex, setBucketIndex] = useState<number | null>(null);
  const [lastMultiplier, setLastMultiplier] = useState(0);
  const previousOutcome = useRef<number | null | undefined>(lastOutcome);

  const sound = useSound();
  const haptic = useHaptic();
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (lastOutcome !== null && lastOutcome !== undefined && lastOutcome !== previousOutcome.current) {
      if (lastWon) {
        sound.playWin();
        haptic.success();
      } else {
        sound.playLose();
        haptic.error();
      }

      // Map outcome to bucket index (0-12)
      const index = Math.floor((lastOutcome / 100) * MULTIPLIERS.length);
      const clampedIndex = Math.max(0, Math.min(MULTIPLIERS.length - 1, index));

      setBucketIndex(clampedIndex);
      setLastMultiplier(MULTIPLIERS[clampedIndex]);

      setTimeout(() => {
        setParticleTrigger((prev) => prev + 1);
        setShowResult(true);
        previousOutcome.current = lastOutcome;
      }, 2000);
    }
  }, [lastOutcome, lastWon, sound, haptic]);

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
    setBucketIndex(null);
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

  const maxMultiplier = Math.max(...MULTIPLIERS);
  const potentialWin = parseFloat(betAmount) * maxMultiplier;

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <div className="space-y-6">
        {/* Plinko Board */}
        <Card className="relative p-4 md:p-8 overflow-hidden backdrop-blur-sm bg-gradient-to-br from-indigo-900/20 to-purple-900/20 border-2">
          {/* Animated background */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-transparent to-purple-500/5 pointer-events-none">
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-500/10 to-transparent"
            animate={{ y: ['-100%', '200%'] }}
            transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY, ease: 'linear' }}
          />
        </div>

        {/* Particle Effect */}
        {lastWon !== null && lastWon !== undefined && (
          <ParticleExplosion isWin={lastWon} trigger={particleTrigger} />
        )}

        <div className="relative flex flex-col items-center justify-center space-y-6">
          {/* Title */}
          <motion.div
            className="flex items-center gap-3"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Circle className="w-8 h-8 text-blue-500" />
            <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
              PLINKO DROP
            </h2>
            <Circle className="w-8 h-8 text-purple-500" />
          </motion.div>

          {/* Plinko Board */}
          <PlinkoBoard isDropping={isPlaying} bucketIndex={bucketIndex} />

          {/* Result Display */}
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
                  className={`inline-flex items-center gap-2 px-6 py-3 rounded-full ${
                    lastMultiplier >= 1
                      ? 'bg-green-500/20 text-green-400 border-green-500'
                      : 'bg-red-500/20 text-red-400 border-red-500'
                  } border-2`}
                  animate={{
                    scale: [1, 1.05, 1],
                  }}
                  transition={{ duration: 0.5, repeat: 3 }}
                >
                  {lastMultiplier >= 1 ? (
                    <>
                      <Target className="w-6 h-6" />
                      <span className="text-2xl font-bold">
                        {lastMultiplier.toFixed(1)}x WIN!
                      </span>
                      <Target className="w-6 h-6" />
                    </>
                  ) : (
                    <span className="text-2xl font-bold">{lastMultiplier.toFixed(1)}x</span>
                  )}
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </Card>

      {/* Bet Controls */}
      <Card className="relative p-6 overflow-hidden backdrop-blur-sm bg-card/95 border-2">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-blue-500/5 pointer-events-none" />

        <motion.div
          className="space-y-6 relative"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          {/* Bet Amount */}
          <motion.div whileHover={{ scale: prefersReducedMotion ? 1 : 1.01 }} transition={{ type: 'spring', stiffness: 300, damping: 20 }}>
            <Label htmlFor="plinkoBetAmount">Bet Amount</Label>
            <Input
              id="plinkoBetAmount"
              type="number"
              step="0.001"
              min="0"
              value={betAmount}
              onChange={(e) => setBetAmount(e.target.value)}
              disabled={isPlaying}
              className="mt-1.5"
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
                >
                  Max
                </Button>
              </motion.div>
            </div>
          </motion.div>

          {/* Quick Bet Controls */}
          <QuickBetControls
            betAmount={betAmount}
            onSetBetAmount={(amount) => {
              sound.playClick();
              setBetAmount(amount);
            }}
            disabled={isPlaying}
            currentBalance={currentBalance}
          />

          {/* Stats */}
          <motion.div
            className="grid grid-cols-2 gap-4 p-4 bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-lg border border-purple-500/30"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div>
              <p className="text-xs text-muted-foreground">Max Multiplier</p>
              <p className="text-lg font-semibold flex items-center text-green-500">
                <TrendingUp className="w-4 h-4 mr-1" />
                <PulseNumber value={maxMultiplier} decimals={0} />×
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Max Win</p>
              <p className="text-lg font-semibold text-green-500">
                <CountingNumber value={potentialWin} decimals={8} />
              </p>
            </div>
          </motion.div>

          {/* Keyboard Shortcuts Hint */}
          <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
            <Keyboard className="w-3 h-3" />
            <span>Enter to drop</span>
          </div>

          {/* Drop Button */}
          <motion.div whileHover={{ scale: prefersReducedMotion ? 1 : 1.02 }} whileTap={{ scale: prefersReducedMotion ? 1 : 0.98 }}>
            <Button
              className="w-full relative overflow-hidden bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
              size="lg"
              onClick={handlePlaceBet}
              disabled={isPlaying}
            >
              {isPlaying && !prefersReducedMotion && (
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                  animate={{ x: ['-100%', '200%'] }}
                  transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: 'linear' }}
                />
              )}
              <span className="relative z-10 flex items-center justify-center gap-2">
                {isPlaying ? (
                  <>
                    <motion.div
                      animate={{ y: [0, 10, 0] }}
                      transition={{ duration: 0.6, repeat: Number.POSITIVE_INFINITY, ease: 'easeInOut' }}
                    >
                      <Circle className="w-5 h-5" />
                    </motion.div>
                    DROPPING...
                  </>
                ) : (
                  <>
                    <Circle className="w-5 h-5" />
                    DROP BALL (Enter)
                  </>
                )}
              </span>
            </Button>
          </motion.div>
        </motion.div>
      </Card>
    </div>
  </div>
  );
}
