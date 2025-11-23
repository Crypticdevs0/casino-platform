import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { X, Gamepad2, Wallet, Shield } from 'lucide-react';

const tutorialSteps = [
  {
    icon: <Gamepad2 className="h-8 w-8 text-white" />,
    title: 'Welcome to the Casino!',
    content: 'This quick tour will show you the ropes.',
    targetId: 'main-game-tabs',
  },
  {
    icon: <Wallet className="h-8 w-8 text-white" />,
    title: 'Manage Your Funds',
    content: 'Your balance is always visible here. Click to deposit or withdraw.',
    targetId: 'wallet-balance-display',
  },
  {
    icon: <Shield className="h-8 w-8 text-white" />,
    title: 'Play Responsibly',
    content: 'Set your own limits and play safely. Find tools in your account settings.',
    targetId: 'responsible-gaming-button',
  },
];

export function OnboardingTutorial() {
  const [step, setStep] = useState(0);
  const [isOpen, setIsOpen] = useState(true);
  const [highlightBox, setHighlightBox] = useState({ top: 0, left: 0, width: 0, height: 0, opacity: 0 });

  const currentStep = tutorialSteps[step];

  useEffect(() => {
    if (isOpen && currentStep.targetId) {
      const element = document.getElementById(currentStep.targetId);
      if (element) {
        const rect = element.getBoundingClientRect();
        setHighlightBox({
          top: rect.top - 10,
          left: rect.left - 10,
          width: rect.width + 20,
          height: rect.height + 20,
          opacity: 1,
        });
      }
    } else {
      setHighlightBox(prev => ({ ...prev, opacity: 0 }));
    }
  }, [step, isOpen, currentStep.targetId]);

  if (!isOpen) return null;

  const nextStep = () => setStep(s => Math.min(s + 1, tutorialSteps.length - 1));
  const prevStep = () => setStep(s => Math.max(s - 1, 0));
  const close = () => {
    setIsOpen(false);
    // Here you would typically set a flag in localStorage to not show the tutorial again
    // localStorage.setItem('hasSeenTutorial', 'true');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/80 z-50"
        >
          {/* Highlight Box */}
          <motion.div
            animate={highlightBox}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="absolute border-4 border-primary rounded-lg shadow-2xl"
            style={{ pointerEvents: 'none' }}
          />

          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            className="relative top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-card border-2 border-primary/50 p-8 rounded-xl shadow-2xl max-w-sm text-center"
          >
            <div className="flex justify-center items-center h-16 w-16 bg-primary/20 rounded-full mx-auto mb-4">
              {currentStep.icon}
            </div>
            <h2 className="text-2xl font-bold mb-2">{currentStep.title}</h2>
            <p className="text-muted-foreground mb-6">{currentStep.content}</p>

            <div className="flex justify-center space-x-4">
              {step > 0 && <Button variant="outline" onClick={prevStep}>Previous</Button>}
              {step < tutorialSteps.length - 1 && <Button onClick={nextStep}>Next</Button>}
              {step === tutorialSteps.length - 1 && <Button onClick={close}>Get Started</Button>}
            </div>

            <Button variant="ghost" size="icon" className="absolute top-4 right-4" onClick={close}>
              <X />
            </Button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
