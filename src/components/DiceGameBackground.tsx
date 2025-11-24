import { motion } from 'framer-motion';
import { diceTheme } from '@/themes/dice';

export function DiceGameBackground() {
  return (
    <div
      className="absolute inset-0 overflow-hidden -z-10"
      style={{ backgroundColor: diceTheme.colors.background }}
    >
      <motion.div
        className="absolute top-1/4 left-1/4 w-32 h-32 rounded-full"
        style={{ backgroundColor: diceTheme.colors.primary, opacity: 0.3 }}
        animate={{
          scale: [1, 1.2, 1],
          y: [0, -20, 0],
          x: [0, 20, 0],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          repeatType: 'reverse',
          ease: 'easeInOut',
        }}
      />
      <motion.div
        className="absolute bottom-1/4 right-1/4 w-24 h-24 rounded-md"
        style={{ backgroundColor: diceTheme.colors.secondary, opacity: 0.3 }}
        animate={{
          scale: [1, 1.1, 1],
          rotate: [0, 90, 0],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          repeatType: 'reverse',
          ease: 'easeInOut',
        }}
      />
       <motion.div
        className="absolute bottom-1/2 right-1/3 w-16 h-16 rounded-lg"
        style={{ backgroundColor: diceTheme.colors.accent, opacity: 0.2 }}
        animate={{
          y: [0, 50, 0],
          x: [0, -50, 0]
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          repeatType: 'reverse',
          ease: 'easeInOut',
        }}
      />
    </div>
  );
}
