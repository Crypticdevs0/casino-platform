import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Gift } from 'lucide-react';
import { displaySuccess } from '@/utils/errorHandler';

interface WelcomeOfferModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function WelcomeOfferModal({ isOpen, onClose }: WelcomeOfferModalProps) {

  const handleClaimBonus = () => {
    displaySuccess('Bonus Claimed!', 'It will be added to your next deposit.');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md text-center">
        <DialogHeader>
          <div className="mx-auto mb-4 w-fit bg-primary/20 p-4 rounded-full">
            <Gift className="h-12 w-12 text-primary" />
          </div>
          <DialogTitle className="text-2xl font-bold">Welcome to the Casino!</DialogTitle>
          <DialogDescription>
            As a new player, you're eligible for a 100% match bonus on your first deposit, up to 0.05 BTC.
          </DialogDescription>
        </DialogHeader>
        <p className="text-sm text-muted-foreground py-4">
            Deposit now to double your starting balance and maximize your chances to win big!
        </p>
        <DialogFooter className="sm:justify-center">
          <Button type="button" variant="secondary" onClick={onClose}>
            Maybe Later
          </Button>
          <Button type="button" onClick={handleClaimBonus}>
            Claim Bonus & Deposit
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
