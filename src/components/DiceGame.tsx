import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { TrendingUp, Sparkles, Keyboard } from 'lucide-react';
import { calculateMultiplier } from '@/lib/provably-fair';
import { AnimatedDice } from '@/components/AnimatedDice';
import { ParticleExplosion } from '@/components/ParticleExplosion';
import { CountingNumber, PulseNumber } from '@/components/CountingNumber';
import { QuickBetControls } from '@/components/QuickBetControls';
import { useSound } from '@/hooks/useSound';
import { useHaptic } from '@/hooks/useHaptic';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { CelebrationAnimation } from './CelebrationAnimation';
import { DiceGameBackground } from './DiceGameBackground';
import { BigWinAnimation } from './BigWinAnimation';

interface DiceGameProps {
  onPlaceBet: (betAmount: string, target: number) => void;
  isPlaying: boolean;
  currentBalance: number;
  lastOutcome?: number | null;
  lastWon?: boolean | null;
  winAmount?: number;
}

export function DiceGame({
  onPlaceBet,
  isPlaying,
  currentBalance,
  lastOutcome,
  lastWon,
  winAmount,
}: DiceGameProps) {
  const [betAmount, setBetAmount] = useState('0.001');
  const [target, setTarget] = useState(50);
  const [particleTrigger, setParticleTrigger] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const previousOutcome = useRef<number | null | undefined>(lastOutcome);

  const sound = useSound();
  const haptic = useHaptic();
  const prefersReducedMotion = useReducedMotion();

  const multiplier = calculateMultiplier(target);
  const winChance = target;
  const potentialWin = parseFloat(betAmount) * multiplier;

  useEffect(() => {
    if (lastOutcome !== null && lastOutcome !== undefined && lastOutcome !== previousOutcome.current) {
      setParticleTrigger((prev) => prev + 1);
      setShowResult(true);
      previousOutcome.current = lastOutcome;

      if (lastWon) {
        sound.playWin();
        haptic.success();
      } else {
        sound.playLose();
        haptic.error();
      }
    }
  }, [lastOutcome, lastWon, sound, haptic]);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (isPlaying) return;
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handlePlaceBet();
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setTarget(prev => Math.min(99, prev + 1));
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setTarget(prev => Math.max(1, prev - 1));
      }
    };
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isPlaying, betAmount, target]);

  const handlePlaceBet = () => {
    onPlaceBet(betAmount, target);
    sound.playSpin();
    haptic.light();
  };


  return (
    <div className="space-y-6 relative rounded-lg" style={{ color: 'var(--foreground)' }}>
      <DiceGameBackground />
      {/* Game Visualization */}
      <Card className="relative p-8 overflow-hidden border-2" style={{ backgroundColor: 'transparent', borderColor: 'var(--border)' }}>
        <CelebrationAnimation trigger={particleTrigger} winAmount={winAmount} />
        <BigWinAnimation show={!!(lastWon && multiplier > 10)} />
        {lastWon !== null && lastWon !== undefined && (
          <ParticleExplosion isWin={lastWon} trigger={particleTrigger} />
        )}
        <div className="relative flex flex-col items-center justify-center space-y-6">
          <motion.div
            className="py-8"
            animate={{ scale: isPlaying && !prefersReducedMotion ? [1, 1.05, 1] : 1 }}
            transition={{ repeat: isPlaying && !prefersReducedMotion ? Infinity : 0, duration: 0.5 }}
          >
            <AnimatedDice isRolling={isPlaying} outcome={lastOutcome} />
          </motion.div>
          <AnimatePresence mode="wait">
            {lastOutcome !== null && lastOutcome !== undefined && !isPlaying && showResult && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.4, type: 'spring', stiffness: 200, damping: 20 }}
                className="text-center"
              >
                <p className="text-sm mb-1 font-mono" style={{ color: 'var(--secondary)' }}>Roll Result</p>
                <motion.p className="text-5xl font-bold mb-2" style={{ color: 'var(--foreground)', textShadow: 'var(--style-textShadow)' }}>
                  <PulseNumber value={lastOutcome} decimals={2} />
                </motion.p>
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${
                    lastWon ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                  }`}
                >
                  {lastWon && <Sparkles className="w-4 h-4" />}
                  <span className={`text-lg font-semibold`}>
                    {lastWon ? 'WIN' : 'LOSS'}
                  </span>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <motion.div className="mt-6 relative" animate={{ opacity: 1, y: 0 }} initial={{ opacity: 0, y: 10 }}>
          <div className="h-4 rounded-full relative shadow-lg" style={{ background: `linear-gradient(to right, var(--primary), var(--secondary))`}}>
            <motion.div className="absolute top-1/2 -translate-y-1/2 w-1 h-6 bg-white rounded-full" style={{ left: `${target}%` }}
              animate={{ boxShadow: ['0 0 10px #fff', '0 0 20px #fff', '0 0 10px #fff'] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
          </div>
        </motion.div>
      </Card>

      {/* Bet Controls */}
      <Card className="relative p-6 border-2" style={{ backgroundColor: 'transparent', borderColor: 'var(--border)' }}>
        <motion.div className="space-y-6" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div>
            <Label htmlFor="betAmount" style={{ color: 'var(--primary)' }}>Bet Amount</Label>
            <Input id="betAmount" type="number" value={betAmount} onChange={e => setBetAmount(e.target.value)} disabled={isPlaying} className="mt-1.5 bg-transparent" style={{ borderColor: 'var(--border)', color: 'var(--foreground)' }} />
          </div>
          <QuickBetControls betAmount={betAmount} onSetBetAmount={amount => { setBetAmount(amount); sound.playClick(); }} disabled={isPlaying} currentBalance={currentBalance} />
          <div>
            <Label style={{ color: 'var(--secondary)' }}>Roll Under {target.toFixed(2)}</Label>
            <Slider value={[target]} onValueChange={values => setTarget(values[0])} min={1} max={99} step={0.01} disabled={isPlaying} />
          </div>
          <motion.div className="grid grid-cols-3 gap-4 p-4 rounded-lg border" style={{ backgroundColor: 'rgba(0,0,0,0.2)', borderColor: 'var(--border)' }} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="text-center">
              <p className="text-xs text-muted-foreground">Win Chance</p>
              <p className="text-lg font-semibold"><PulseNumber value={winChance} decimals={2} />%</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-muted-foreground">Multiplier</p>
              <p className="text-lg font-semibold"><TrendingUp className="inline w-4 h-4 mr-1" /><PulseNumber value={multiplier} decimals={4} />×</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-muted-foreground">Potential Win</p>
              <p className="text-lg font-semibold" style={{ color: 'var(--success)' }}><CountingNumber value={potentialWin} decimals={8} /></p>
            </div>
          </motion.div>
          <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground"><Keyboard className="w-3 h-3" /><span>Enter to bet • ↑↓ to adjust</span></div>
          <motion.div whileHover={{ scale: prefersReducedMotion ? 1 : 1.02 }} whileTap={{ scale: prefersReducedMotion ? 1 : 0.98 }}>
            <Button className="w-full" size="lg" onClick={handlePlaceBet} disabled={isPlaying} style={{ backgroundColor: 'var(--primary)', boxShadow: 'var(--style-boxShadow)' }}>
              <span className="relative z-10">{isPlaying ? 'ROLLING...' : 'PLACE BET'}</span>
            </Button>
          </motion.div>
        </motion.div>
      </Card>
    </div>
  );
}
