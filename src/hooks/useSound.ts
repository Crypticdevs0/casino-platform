import { useState, useEffect, useCallback } from 'react';

// Web Audio API context
let audioContext: AudioContext | null = null;
const getAudioContext = () => {
  if (typeof window !== 'undefined' && !audioContext) {
    audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  return audioContext;
};

// Sound generation function
const playTone = (
  frequency: number,
  duration: number,
  type: OscillatorType = 'sine',
  volume = 0.5,
) => {
  const context = getAudioContext();
  if (!context) return;

  const oscillator = context.createOscillator();
  const gainNode = context.createGain();

  oscillator.type = type;
  oscillator.frequency.setValueAtTime(frequency, context.currentTime);

  gainNode.gain.setValueAtTime(volume, context.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + duration);

  oscillator.connect(gainNode);
  gainNode.connect(context.destination);

  oscillator.start(context.currentTime);
  oscillator.stop(context.currentTime + duration);
};

export const useSound = () => {
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    const savedMuteState = localStorage.getItem('soundMuted');
    if (savedMuteState) {
      setIsMuted(JSON.parse(savedMuteState));
    }
  }, []);

  const toggleMute = useCallback(() => {
    const newMuteState = !isMuted;
    setIsMuted(newMuteState);
    localStorage.setItem('soundMuted', JSON.stringify(newMuteState));
  }, [isMuted]);

  const playSound = useCallback(
    (soundFunction: () => void) => {
      if (!isMuted) {
        soundFunction();
      }
    },
    [isMuted],
  );

  const playWin = () =>
    playSound(() => {
      // Ascending arpeggio
      playTone(523.25, 0.1, 'triangle', 0.6); // C5
      setTimeout(() => playTone(659.25, 0.1, 'triangle', 0.6), 100); // E5
      setTimeout(() => playTone(783.99, 0.1, 'triangle', 0.6), 200); // G5
      setTimeout(() => playTone(1046.5, 0.15, 'triangle', 0.7), 300); // C6
    });

  const playLose = () =>
    playSound(() => {
      // Descending tones
      playTone(392.0, 0.15, 'sawtooth', 0.5); // G4
      setTimeout(() => playTone(329.63, 0.2, 'sawtooth', 0.4), 150); // E4
    });

  const playSpin = () =>
    playSound(() => {
      // Whoosh sound
      playTone(200, 0.1, 'square', 0.3);
      setTimeout(() => playTone(800, 0.15, 'square', 0.1), 50);
    });

  const playClick = () =>
    playSound(() => {
      // Simple click
      playTone(1200, 0.05, 'triangle', 0.3);
    });

  return { isMuted, toggleMute, playWin, playLose, playSpin, playClick };
};
