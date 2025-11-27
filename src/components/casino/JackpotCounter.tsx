import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

interface JackpotCounterProps {
  value: number;
  prefix?: string;
  suffix?: string;
  className?: string;
  digitClassName?: string;
  duration?: number;
  delay?: number;
  ease?: string;
}

export function JackpotCounter({
  value,
  prefix = '$',
  suffix = '',
  className = '',
  digitClassName = '',
  duration = 1,
  delay = 0,
  ease = 'easeOut',
}: JackpotCounterProps) {
  const [currentValue, setCurrentValue] = useState(value);
  const [previousValue, setPreviousValue] = useState(value);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (value !== currentValue) {
      setPreviousValue(currentValue);
      setCurrentValue(value);
      setIsAnimating(true);
      
      const timer = setTimeout(() => {
        setIsAnimating(false);
      }, (duration + delay) * 1000);
      
      return () => clearTimeout(timer);
    }
  }, [value, currentValue, duration, delay]);

  // Format number with commas
  const formatNumber = (num: number) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  const currentStr = formatNumber(currentValue);
  const previousStr = formatNumber(previousValue);
  const maxLength = Math.max(currentStr.length, previousStr.length);
  
  // Pad strings with leading spaces to ensure same length
  const padStr = (str: string, length: number) => {
    return str.padStart(length, ' ');
  };

  const paddedCurrent = padStr(currentStr, maxLength);
  const paddedPrevious = padStr(previousStr, maxLength);

  return (
    <div className={cn("inline-flex items-center overflow-hidden", className)}>
      {prefix && <span className="mr-1">{prefix}</span>}
      
      <div className="relative inline-flex items-baseline">
        <AnimatePresence mode="wait">
          {isAnimating ? (
            <motion.div
              key="previous"
              initial={{ y: 0, opacity: 1 }}
              animate={{ y: -20, opacity: 0 }}
              exit={{ y: 20, opacity: 0 }}
              transition={{ duration, delay, ease: ease as any }}
              className="absolute flex"
            >
              {paddedPrevious.split('').map((char, index) => (
                <span 
                  key={`prev-${index}`} 
                  className={cn("inline-block w-4 text-center", digitClassName, {
                    'opacity-0': char === ' ',
                    'text-amber-400 font-bold text-2xl': !digitClassName
                  })}
                >
                  {char === ' ' ? '0' : char}
                </span>
              ))}
            </motion.div>
          ) : null}
          
          <motion.div
            key="current"
            initial={{ y: isAnimating ? 20 : 0, opacity: isAnimating ? 0 : 1 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration, delay, ease: ease as any }}
            className="flex"
          >
            {paddedCurrent.split('').map((char, index) => (
              <span 
                key={`curr-${index}`} 
                className={cn("inline-block w-4 text-center", digitClassName, {
                  'opacity-0': char === ' ',
                  'text-amber-400 font-bold text-2xl': !digitClassName
                })}
              >
                {char === ' ' ? '0' : char}
              </span>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
      
      {suffix && <span className="ml-1">{suffix}</span>}
    </div>
  );
}
