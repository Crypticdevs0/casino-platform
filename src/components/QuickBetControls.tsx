import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

interface QuickBetControlsProps {
  betAmount: string;
  onSetBetAmount: (amount: string) => void;
  disabled: boolean;
  currentBalance: number;
}

const QUICK_AMOUNTS = ['0.001', '0.01', '0.1', '1.0'];

export function QuickBetControls({
  betAmount,
  onSetBetAmount,
  disabled,
  currentBalance,
}: QuickBetControlsProps) {
  return (
    <div>
      <p className="text-sm font-medium mb-2">Quick Bet</p>
      <div className="grid grid-cols-4 gap-2">
        {QUICK_AMOUNTS.map((amount) => {
          const isDisabled = disabled || parseFloat(amount) > currentBalance;
          return (
            <motion.div
              key={amount}
              whileHover={{ scale: isDisabled ? 1 : 1.05 }}
              whileTap={{ scale: isDisabled ? 1 : 0.95 }}
            >
              <Button
                variant={betAmount === amount ? 'secondary' : 'outline'}
                className="w-full"
                onClick={() => onSetBetAmount(amount)}
                disabled={isDisabled}
              >
                {amount}
              </Button>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
