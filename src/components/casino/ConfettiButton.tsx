import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, CheckCircle, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

type ConfettiParticle = {
  id: number;
  x: number;
  y: number;
  rotation: number;
  scale: number;
  color: string;
  shape: 'circle' | 'square' | 'triangle';
  velocity: {
    x: number;
    y: number;
    rotation: number;
  };
};

interface ConfettiButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  isLoading?: boolean;
  isSuccess?: boolean;
  successText?: string;
  successDuration?: number;
  confettiCount?: number;
  colors?: string[];
  className?: string;
  buttonClassName?: string;
  successClassName?: string;
  loadingClassName?: string;
}

export function ConfettiButton({
  children,
  isLoading = false,
  isSuccess = false,
  successText = 'Success!',
  successDuration = 2000,
  confettiCount = 50,
  colors = ['#FF5252', '#4CAF50', '#2196F3', '#FFC107', '#9C27B0'],
  className = '',
  buttonClassName = '',
  successClassName = '',
  loadingClassName = '',
  onClick,
  disabled,
  ...props
}: ConfettiButtonProps) {
  const [showConfetti, setShowConfetti] = useState(false);
  const [particles, setParticles] = useState<ConfettiParticle[]>([]);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [isInternalLoading, setIsInternalLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (onClick) {
      const result = onClick(e) as any;

      // If onClick returns a promise, handle loading state
      if (result && typeof result.finally === 'function') {
        setIsInternalLoading(true);
        result.finally(() => {
          setIsInternalLoading(false);
        });
      }
    }

    // Show confetti if not in loading state
    if (!isLoading && !isInternalLoading) {
      createConfetti();
    }
  };

  const createConfetti = () => {
    if (!buttonRef.current) return;
    
    const buttonRect = buttonRef.current.getBoundingClientRect();
    const newParticles: ConfettiParticle[] = [];
    
    for (let i = 0; i < confettiCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const velocity = 3 + Math.random() * 5;
      
      newParticles.push({
        id: i,
        x: buttonRect.width / 2,
        y: buttonRect.height / 2,
        rotation: Math.random() * 360,
        scale: 0.5 + Math.random() * 0.5,
        color: colors[Math.floor(Math.random() * colors.length)],
        shape: ['circle', 'square', 'triangle'][Math.floor(Math.random() * 3)] as 'circle' | 'square' | 'triangle',
        velocity: {
          x: Math.cos(angle) * velocity,
          y: Math.sin(angle) * velocity,
          rotation: (Math.random() - 0.5) * 20,
        },
      });
    }
    
    setParticles(newParticles);
    setShowConfetti(true);
    
    // Reset after animation
    setTimeout(() => {
      setShowConfetti(false);
      // Small delay before removing particles to allow exit animation
      setTimeout(() => setParticles([]), 300);
    }, 3000);
    
    // Show success state if needed
    if (isSuccess) {
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), successDuration);
    }
  };

  const isDisabled = disabled || isLoading || isInternalLoading;
  
  return (
    <div className={cn("relative inline-block", className)}>
      <button
        ref={buttonRef}
        onClick={handleClick}
        disabled={isDisabled}
        className={cn(
          "relative z-10 px-6 py-3 rounded-lg font-medium transition-all duration-200 overflow-hidden",
          "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg",
          "hover:from-blue-600 hover:to-purple-700 hover:shadow-xl",
          "active:scale-95 active:shadow-inner",
          "disabled:opacity-70 disabled:cursor-not-allowed",
          "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500",
          buttonClassName
        )}
        {...props}
      >
        <div className="relative z-10 flex items-center justify-center">
          {(isLoading || isInternalLoading) ? (
            <span className={cn("flex items-center", loadingClassName)}>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              {children}
            </span>
          ) : showSuccess ? (
            <span className={cn("flex items-center text-green-100", successClassName)}>
              <CheckCircle className="w-5 h-5 mr-2" />
              {successText}
            </span>
          ) : (
            children
          )}
        </div>
        
        {/* Button hover effect */}
        <div className="absolute inset-0 bg-white/10 opacity-0 hover:opacity-20 transition-opacity duration-200" />
      </button>
      
      {/* Confetti particles */}
      <div className="absolute inset-0 pointer-events-none overflow-visible">
        <AnimatePresence>
          {showConfetti && particles.map((particle) => (
            <motion.div
              key={particle.id}
              className={cn(
                "absolute w-2 h-2 rounded-sm",
                {
                  'rounded-full': particle.shape === 'circle',
                  'w-3 h-1': particle.shape === 'square',
                }
              )}
              style={{
                backgroundColor: particle.color,
                left: '50%',
                top: '50%',
                x: 0,
                y: 0,
                rotate: particle.rotation,
                scale: particle.scale,
              }}
              initial={{
                x: 0,
                y: 0,
                opacity: 1,
              }}
              animate={{
                x: particle.velocity.x * 50,
                y: particle.velocity.y * 50 - 100, // Add some upward motion
                rotate: particle.rotation + particle.velocity.rotation * 10,
                opacity: 0,
              }}
              exit={{
                opacity: 0,
              }}
              transition={{
                duration: 2,
                ease: "easeOut",
              }}
            />
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
