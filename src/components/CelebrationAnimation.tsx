import { AnimatePresence, motion } from 'framer-motion';
import './CelebrationAnimation.css';

interface CelebrationAnimationProps {
  trigger: any; // Trigger animation on change
  winAmount?: number;
}

type Tier = 'minor' | 'major' | 'jackpot' | null;

const getTier = (winAmount?: number): Tier => {
  if (!winAmount || winAmount <= 0) return null;
  if (winAmount > 1) return 'jackpot';
  if (winAmount > 0.1) return 'major';
  return 'minor';
};

const particles = {
    minor: ['✨', '🌟'],
    major: ['💰', '💎'],
    jackpot: ['🚀', '🎉', '🎊'],
}

export function CelebrationAnimation({ trigger, winAmount }: CelebrationAnimationProps) {
  const tier = getTier(winAmount);
  if (!tier) return null;

  return (
    <AnimatePresence>
      {trigger && (
        <div className="celebration-overlay">
          {Array.from({ length: 30 }).map((_, i) => (
            <motion.div
              key={i}
              className="particle"
              initial={{ y: '100vh', x: `${Math.random() * 100}vw`, opacity: 1 }}
              animate={{ y: '-20vh' }}
              exit={{ opacity: 0 }}
              transition={{
                  duration: Math.random() * 2 + 1,
                  delay: Math.random() * 0.5,
                  ease: 'easeOut'
              }}
            >
              {particles[tier][i % particles[tier].length]}
            </motion.div>
          ))}
        </div>
      )}
    </AnimatePresence>
  );
}
