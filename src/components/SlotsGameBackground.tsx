import { motion } from 'framer-motion';
import { slotsTheme } from '@/themes/slots';

export function SlotsGameBackground() {
  return (
    <div
      className="absolute inset-0 overflow-hidden -z-10"
      style={{ backgroundColor: slotsTheme.colors.background }}
    >
      {/* Repeating pattern */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `radial-gradient(${slotsTheme.colors.primary} 1px, transparent 1px)`,
          backgroundSize: '20px 20px',
        }}
      />
      {/* Animated light sweeps */}
      <motion.div
        className="absolute top-0 left-0 w-1/2 h-full bg-gradient-to-r from-transparent to-yellow-500/10"
        animate={{
          x: ['-100%', '200%'],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: 'linear',
        }}
      />
       <motion.div
        className="absolute bottom-0 right-0 w-1/3 h-full bg-gradient-to-l from-transparent to-red-500/10"
        animate={{
          x: ['200%', '-100%'],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: 'linear',
          delay: 5,
        }}
      />
    </div>
  );
}
