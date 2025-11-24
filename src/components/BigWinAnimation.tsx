import { motion, AnimatePresence } from 'framer-motion';
import { diceTheme } from '@/themes/dice';

interface BigWinAnimationProps {
  show: boolean;
}

export function BigWinAnimation({ show }: BigWinAnimationProps) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="absolute inset-0 flex items-center justify-center -z-10"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1.2 }}
          exit={{ opacity: 0, scale: 0.5 }}
          transition={{ duration: 0.5, type: 'spring' }}
        >
          <div className="text-center">
            <motion.h1
              className="text-6xl font-bold"
              style={{
                color: diceTheme.colors.secondary,
                textShadow: `0 0 20px ${diceTheme.colors.secondary}, 0 0 40px ${diceTheme.colors.primary}`,
              }}
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              BIG WIN
            </motion.h1>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
