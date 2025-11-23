import { useEffect, useState } from 'react';
import { motion, useSpring } from 'framer-motion';

interface CountingNumberProps {
  value: number;
  decimals?: number;
}

export function CountingNumber({ value, decimals = 2 }: CountingNumberProps) {
  const [displayValue, setDisplayValue] = useState(value);
  const spring = useSpring(value, { damping: 20, stiffness: 100 });

  useEffect(() => {
    spring.set(value);
  }, [spring, value]);

  useEffect(() => {
    const unsubscribe = spring.on('change', (latest) => {
      setDisplayValue(latest);
    });
    return unsubscribe;
  }, [spring]);

  return <span>{displayValue.toFixed(decimals)}</span>;
}

export function PulseNumber({ value, decimals = 2 }: CountingNumberProps) {
  return (
    <motion.span
      key={value}
      initial={{ scale: 1 }}
      animate={{ scale: [1, 1.1, 1] }}
      transition={{ duration: 0.3 }}
    >
      <CountingNumber value={value} decimals={decimals} />
    </motion.span>
  );
}
