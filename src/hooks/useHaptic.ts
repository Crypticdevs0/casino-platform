import { useCallback } from 'react';

export const useHaptic = () => {
  const vibrate = useCallback((pattern: VibratePattern) => {
    if (typeof window !== 'undefined' && window.navigator && 'vibrate' in window.navigator) {
      try {
        window.navigator.vibrate(pattern);
      } catch (error) {
        console.error('Haptic feedback failed:', error);
      }
    }
  }, []);

  const light = useCallback(() => {
    vibrate(10); // Light tap
  }, [vibrate]);

  const medium = useCallback(() => {
    vibrate(20); // Medium bump
  }, [vibrate]);

  const success = useCallback(() => {
    vibrate([10, 50, 10]); // Triple pulse for success
  }, [vibrate]);

  const error = useCallback(() => {
    vibrate([20, 30, 20]); // Double pulse for error/loss
  }, [vibrate]);

  return { light, medium, success, error };
};
