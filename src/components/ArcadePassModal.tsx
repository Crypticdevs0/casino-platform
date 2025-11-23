import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Star, Gift, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

// Mock Data for the Arcade Pass
const arcadePassData = {
  level: 12,
  levelName: 'Bronze III',
  currentXp: 1250,
  xpForNextLevel: 2000,
  rewards: [
    { level: 13, name: '0.05 ETH Bonus', unlocked: false, icon: <Gift /> },
    { level: 14, name: 'Exclusive "Neon" Theme', unlocked: false, icon: <Zap /> },
    { level: 15, name: 'Golden Avatar Frame', unlocked: false, icon: <Star /> },
    { level: 10, name: '10 Free Spins', unlocked: true, icon: <Gift /> },
    { level: 5, name: 'Welcome Bonus', unlocked: true, icon: <Star /> },
  ],
};

interface ArcadePassModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ArcadePassModal({ isOpen, onClose }: ArcadePassModalProps) {
  const upcomingRewards = arcadePassData.rewards.filter(r => !r.unlocked).slice(0, 3);
  const claimedRewards = arcadePassData.rewards.filter(r => r.unlocked);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl h-4/5 flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-3xl font-bold text-center">Arcade Pass</DialogTitle>
          <DialogDescription className="text-center">Your progression and rewards.</DialogDescription>
        </DialogHeader>
        <div className="flex-grow overflow-y-auto p-4">
          {/* Player Level and XP */}
          <div className="mb-8 p-4 bg-muted/50 rounded-lg">
            <div className="flex justify-between items-center mb-2">
              <p className="text-xl font-bold">Level {arcadePassData.level} ({arcadePassData.levelName})</p>
              <p className="text-lg font-mono">{arcadePassData.currentXp} / {arcadePassData.xpForNextLevel} XP</p>
            </div>
            <Progress value={(arcadePassData.currentXp / arcadePassData.xpForNextLevel) * 100} />
          </div>

          {/* Upcoming Rewards */}
          <div>
            <h3 className="text-2xl font-semibold mb-4">Next 3 Rewards</h3>
            <div className="space-y-4">
              {upcomingRewards.map((reward, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="flex items-center p-4 bg-background rounded-lg border"
                >
                  <div className="p-2 bg-primary/20 rounded-full mr-4">{reward.icon}</div>
                  <div>
                    <p className="font-bold text-lg">Level {reward.level}</p>
                    <p className="text-muted-foreground">{reward.name}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Claimed Rewards */}
          <div className="mt-8">
            <h3 className="text-2xl font-semibold mb-4">Claimed Rewards</h3>
             <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
               {claimedRewards.map((reward, i) => (
                 <div key={i} className="p-4 bg-muted/50 rounded-lg text-center opacity-70">
                    <div className="mx-auto w-fit p-2 rounded-full mb-2">{reward.icon}</div>
                    <p className="font-semibold text-sm">Level {reward.level}</p>
                    <p className="text-xs text-muted-foreground">{reward.name}</p>
                 </div>
               ))}
             </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
