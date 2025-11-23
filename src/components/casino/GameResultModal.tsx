import { motion, AnimatePresence } from 'framer-motion';
import { X, AlertCircle, Trophy, Zap, Gift } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useGameStore } from '@/stores/useGameStore';
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';

interface WinEffectProps {
  isVisible: boolean;
  winAmount: number;
}

const WinEffect = ({ isVisible, winAmount }: WinEffectProps) => {
  if (!isVisible) return null;
  
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="absolute inset-0 bg-gradient-to-b from-yellow-400/20 to-transparent opacity-0 animate-pulse" />
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute text-yellow-400 text-2xl"
          initial={{
            opacity: 0,
            x: Math.random() * 100 - 50,
            y: Math.random() * 100 - 50,
            scale: 0.5,
          }}
          animate={{
            opacity: [0, 1, 0],
            y: [0, -100],
            x: [0, (Math.random() - 0.5) * 100],
            scale: [0.5, 1.5],
          }}
          transition={{
            duration: 1.5,
            delay: Math.random() * 0.5,
            repeat: Infinity,
            repeatType: 'loop',
          }}
        >
          {winAmount >= 1000 ? '🎯' : '✨'}
        </motion.div>
      ))}
    </div>
  );
};

export function GameResultModal() {
  const { currentGameResult, clearCurrentResult, isProcessingResult } = useGameStore();
  const [showWinEffect, setShowWinEffect] = useState(false);
  
  const isWin = currentGameResult?.winAmount ? currentGameResult.winAmount > 0 : false;
  const isJackpot = currentGameResult?.isJackpot;
  const hasFreeSpins = (currentGameResult?.freeSpins ?? 0) > 0;
  const hasBonusRounds = (currentGameResult?.bonusRounds ?? 0) > 0;

  useEffect(() => {
    if (isWin && currentGameResult) {
      setShowWinEffect(true);
      const timer = setTimeout(() => setShowWinEffect(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [isWin, currentGameResult?.id]);

  if (!currentGameResult) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={clearCurrentResult}
      >
        <WinEffect isVisible={showWinEffect} winAmount={currentGameResult.winAmount} />
        
        <motion.div
          initial={{ scale: 0.9, y: 20, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          exit={{ scale: 0.9, y: 20, opacity: 0 }}
          className={cn(
            "bg-gradient-to-br from-card to-card/90 rounded-2xl p-6 max-w-md w-full relative overflow-hidden shadow-2xl border",
            isWin ? "border-yellow-400/30" : "border-border"
          )}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Decorative elements */}
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-yellow-400/10 rounded-full blur-3xl" />
          
          <button
            onClick={clearCurrentResult}
            className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
            disabled={isProcessingResult}
          >
            <X className="h-5 w-5" />
          </button>

          <div className="text-center space-y-4 relative z-10">
            {/* Result Header */}
            <div className="space-y-2">
              <div className={cn(
                "text-4xl font-bold mb-2 flex items-center justify-center gap-2",
                isWin ? "text-yellow-400" : "text-foreground"
              )}>
                {isWin ? (
                  <>
                    {isJackpot ? '🏆 JACKPOT!' : '🎉 You Won!'}
                  </>
                ) : (
                  'Better Luck Next Time!'
                )}
              </div>
              
              {isWin && (
                <div className="text-5xl font-bold text-yellow-400 animate-bounce">
                  ${currentGameResult.winAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
              )}

              {currentGameResult.multiplier && (
                <div className="text-lg text-muted-foreground">
                  Multiplier: <span className="font-semibold text-foreground">x{currentGameResult.multiplier.toFixed(2)}</span>
                </div>
              )}
            </div>

            {/* Special Features */}
            <div className="space-y-3 pt-2">
              {isJackpot && (
                <div className="bg-yellow-500/10 text-yellow-400 p-3 rounded-lg flex items-center gap-2">
                  <Trophy className="h-5 w-5" />
                  <span className="font-medium">JACKPOT WIN!</span>
                </div>
              )}
              
              {hasFreeSpins && (
                <div className="bg-blue-500/10 text-blue-400 p-3 rounded-lg flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  <span className="font-medium">{currentGameResult.freeSpins} Free Spins Awarded!</span>
                </div>
              )}
              
              {hasBonusRounds && (
                <div className="bg-purple-500/10 text-purple-400 p-3 rounded-lg flex items-center gap-2">
                  <Gift className="h-5 w-5" />
                  <span className="font-medium">Bonus Round Unlocked!</span>
                </div>
              )}
              
              {!isWin && !isJackpot && !hasFreeSpins && !hasBonusRounds && (
                <div className="bg-muted p-3 rounded-lg flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-muted-foreground" />
                  <span className="text-muted-foreground">Try again for a chance to win!</span>
                </div>
              )}
            </div>

            {/* Winning Lines (if any) */}
            {currentGameResult.winningLines?.length ? (
              <div className="pt-2">
                <div className="text-sm text-muted-foreground">
                  Winning Lines: <span className="font-medium text-foreground">{currentGameResult.winningLines.join(', ')}</span>
                </div>
              </div>
            ) : null}

            {/* Action Buttons */}
            <div className="pt-4 flex gap-3 justify-center">
              <Button 
                onClick={clearCurrentResult} 
                size="lg"
                className={cn(
                  "min-w-[120px]",
                  isWin 
                    ? "bg-yellow-500 hover:bg-yellow-600 text-yellow-900" 
                    : "bg-primary hover:bg-primary/90"
                )}
                disabled={isProcessingResult}
              >
                {isWin ? 'Collect' : 'Continue'}
              </Button>
              
              {isWin && (
                <Button 
                  variant="outline" 
                  size="lg"
                  onClick={clearCurrentResult}
                  disabled={isProcessingResult}
                >
                  Play Again
                </Button>
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
