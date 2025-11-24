import { AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

interface FormErrorProps {
  error?: string | null;
  className?: string;
  variant?: 'default' | 'inline' | 'tooltip';
}

export function FormError({
  error,
  className,
  variant = 'default',
}: FormErrorProps) {
  if (!error) return null;

  if (variant === 'tooltip') {
    return (
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          className="absolute z-10 bg-red-600 text-white px-3 py-2 rounded-md text-xs whitespace-nowrap shadow-lg"
        >
          <div className="flex items-center gap-2">
            <AlertCircle className="w-3 h-3" />
            {error}
          </div>
          <div className="absolute -bottom-1 left-3 w-2 h-2 bg-red-600 transform rotate-45" />
        </motion.div>
      </AnimatePresence>
    );
  }

  if (variant === 'inline') {
    return (
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className={cn(
            'flex items-start gap-2 mt-2 p-3 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-500/30 rounded-md',
            className
          )}
        >
          <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-700 dark:text-red-200">{error}</p>
        </motion.div>
      </AnimatePresence>
    );
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -4 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -4 }}
        className={cn(
          'flex items-center gap-2 mt-1 text-sm text-red-600 dark:text-red-400',
          className
        )}
      >
        <AlertCircle className="w-4 h-4" />
        {error}
      </motion.div>
    </AnimatePresence>
  );
}
