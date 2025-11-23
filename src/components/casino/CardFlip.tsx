import { useState, useEffect, useRef, ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

interface CardFlipProps {
  isFlipped: boolean;
  front: ReactNode;
  back: ReactNode;
  onFlipStart?: () => void;
  onFlipEnd?: () => void;
  flipDirection?: 'horizontal' | 'vertical';
  flipSpeed?: number;
  perspective?: number;
  className?: string;
  frontClassName?: string;
  backClassName?: string;
  isClickable?: boolean;
  onCardClick?: () => void;
}

export function CardFlip({
  isFlipped: isFlippedProp = false,
  front,
  back,
  onFlipStart,
  onFlipEnd,
  flipDirection = 'horizontal',
  flipSpeed = 0.5,
  perspective = 1000,
  className = '',
  frontClassName = '',
  backClassName = '',
  isClickable = false,
  onCardClick,
}: CardFlipProps) {
  const [isFlipped, setIsFlipped] = useState(isFlippedProp);
  const [isAnimating, setIsAnimating] = useState(false);
  const prevFlippedRef = useRef(isFlippedProp);

  // Handle prop changes
  useEffect(() => {
    if (isFlippedProp !== prevFlippedRef.current) {
      handleFlip();
      prevFlippedRef.current = isFlippedProp;
    }
  }, [isFlippedProp]);

  const handleFlip = () => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    if (onFlipStart) onFlipStart();
    
    setIsFlipped(!isFlipped);
    
    // Call onFlipEnd after animation completes
    setTimeout(() => {
      setIsAnimating(false);
      if (onFlipEnd) onFlipEnd();
    }, flipSpeed * 1000);
  };

  const handleCardClick = () => {
    if (isClickable) {
      if (onCardClick) {
        onCardClick();
      } else {
        handleFlip();
      }
    }
  };

  const flipVariants = {
    front: {
      rotateY: flipDirection === 'horizontal' ? 0 : 0,
      rotateX: flipDirection === 'vertical' ? 0 : 0,
      scale: 1,
      transition: {
        duration: flipSpeed,
        ease: [0.4, 0.0, 0.2, 1],
      },
    },
    back: {
      rotateY: flipDirection === 'horizontal' ? 180 : 0,
      rotateX: flipDirection === 'vertical' ? 180 : 0,
      scale: 0.95,
      transition: {
        duration: flipSpeed,
        ease: [0.4, 0.0, 0.2, 1],
      },
    },
  };

  return (
    <div 
      className={cn("relative w-full h-full", className, {
        'cursor-pointer': isClickable,
      })}
      onClick={handleCardClick}
      style={{
        perspective: `${perspective}px`,
        transformStyle: 'preserve-3d',
      }}
    >
      <AnimatePresence mode="wait">
        {/* Front of the card */}
        {!isFlipped ? (
          <motion.div
            key="front"
            className={cn(
              "absolute w-full h-full bg-white rounded-lg shadow-lg overflow-hidden backface-hidden",
              "flex items-center justify-center",
              frontClassName
            )}
            initial={false}
            animate={flipVariants.front}
            exit={flipVariants.back}
            style={{
              backfaceVisibility: 'hidden',
              WebkitBackfaceVisibility: 'hidden',
              transformStyle: 'preserve-3d',
            }}
          >
            {front}
          </motion.div>
        ) : (
          <motion.div
            key="back"
            className={cn(
              "absolute w-full h-full bg-white rounded-lg shadow-lg overflow-hidden backface-hidden",
              "flex items-center justify-center",
              backClassName
            )}
            initial={false}
            animate={flipVariants.back}
            exit={flipVariants.front}
            style={{
              backfaceVisibility: 'hidden',
              WebkitBackfaceVisibility: 'hidden',
              transformStyle: 'preserve-3d',
              transform: flipDirection === 'horizontal' 
                ? 'rotateY(180deg)' 
                : 'rotateX(180deg)',
            }}
          >
            {back}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Example usage:
/*
<CardFlip
  isFlipped={isFlipped}
  flipDirection="horizontal"
  flipSpeed={0.6}
  isClickable={true}
  onCardClick={() => console.log('Card clicked!')}
  front={
    <div className="p-4 text-center">
      <h3 className="text-xl font-bold">Front of Card</h3>
      <p>Click to flip</p>
    </div>
  }
  back={
    <div className="p-4 text-center bg-blue-50">
      <h3 className="text-xl font-bold">Back of Card</h3>
      <p>Click to flip back</p>
    </div>
  }
/>
*/

// CardFlipSkeleton component for loading states
export function CardFlipSkeleton({ className = '' }: { className?: string }) {
  return (
    <div className={cn("bg-muted/20 rounded-lg animate-pulse", className)}>
      <div className="w-full h-full min-h-[200px] flex items-center justify-center">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    </div>
  );
}
