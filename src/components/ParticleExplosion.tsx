import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
}

interface ParticleExplosionProps {
  isWin: boolean;
  trigger: number;
}

const colors = {
  win: ['#fde047', '#facc15', '#eab308', '#f59e0b'],
  lose: ['#9ca3af', '#6b7280', '#4b5563'],
};

export function ParticleExplosion({ isWin, trigger }: ParticleExplosionProps) {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    if (trigger > 0) {
      const newParticles = Array.from({ length: 50 }).map((_, i) => ({
        id: i,
        x: Math.random() * 200 - 100,
        y: Math.random() * 200 - 100,
        size: Math.random() * 8 + 2,
        color: isWin
          ? colors.win[Math.floor(Math.random() * colors.win.length)]
          : colors.lose[Math.floor(Math.random() * colors.lose.length)],
      }));
      setParticles(newParticles);
    }
  }, [trigger, isWin]);

  if (!particles.length) return null;

  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full"
          initial={{ opacity: 1, x: 0, y: 0, scale: 1 }}
          animate={{
            opacity: 0,
            x: p.x,
            y: p.y,
            scale: 0,
            transition: { duration: 1, ease: 'easeOut' },
          }}
          style={{
            width: p.size,
            height: p.size,
            backgroundColor: p.color,
          }}
        />
      ))}
    </div>
  );
}
