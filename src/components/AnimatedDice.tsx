import { motion } from 'framer-motion';
import { diceTheme } from '@/themes/dice';

interface AnimatedDiceProps {
  isRolling: boolean;
  outcome: number | null | undefined;
}

const diceFaces: Record<number, number[][]> = {
  1: [[5, 5]],
  2: [[2, 2], [8, 8]],
  3: [[2, 2], [5, 5], [8, 8]],
  4: [[2, 2], [2, 8], [8, 2], [8, 8]],
  5: [[2, 2], [2, 8], [5, 5], [8, 2], [8, 8]],
  6: [[2, 2], [2, 5], [2, 8], [8, 2], [8, 5], [8, 8]],
};

function getFaceFromOutcome(outcome: number | null | undefined): number {
  if (outcome === null || outcome === undefined) return 1;
  const value = Math.floor((outcome / 100) * 6) + 1;
  return Math.max(1, Math.min(6, value));
}

export function AnimatedDice({ isRolling, outcome }: AnimatedDiceProps) {
  const face = getFaceFromOutcome(outcome);

  return (
    <motion.div
      className="w-24 h-24 rounded-lg flex items-center justify-center"
      style={{
        backgroundColor: diceTheme.colors.card,
        boxShadow: diceTheme.styles.boxShadow,
        border: `2px solid ${diceTheme.colors.primary}`,
      }}
      animate={{
        rotate: isRolling ? 360 : 0,
        scale: isRolling ? [1, 1.2, 1] : 1,
      }}
      transition={{
        rotate: { duration: 0.5, repeat: isRolling ? Number.POSITIVE_INFINITY : 0, ease: 'linear' },
        scale: { duration: 0.5, repeat: isRolling ? Number.POSITIVE_INFINITY : 0, ease: 'easeInOut' },
      }}
    >
      <div className="grid grid-cols-10 grid-rows-10 w-full h-full p-2">
        {diceFaces[face].map(([x, y], i) => (
          <motion.div
            key={i}
            className="w-3 h-3 rounded-full"
            style={{
              gridColumn: x,
              gridRow: y,
              backgroundColor: diceTheme.colors.secondary,
              boxShadow: `0 0 10px ${diceTheme.colors.secondary}`,
            }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1 * i, type: 'spring' }}
          />
        ))}
      </div>
    </motion.div>
  );
}
