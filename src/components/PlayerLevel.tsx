import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

// Mock data for now
const userLevel = {
  level: 12,
  levelName: 'Bronze III',
  currentXp: 1250,
  xpForNextLevel: 2000,
  levelUpReward: '0.05 ETH Bonus',
};

interface PlayerLevelProps {
  onClick?: () => void;
}

export function PlayerLevel({ onClick }: PlayerLevelProps) {
  const progress = (userLevel.currentXp / userLevel.xpForNextLevel) * 100;

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <motion.div
            onClick={onClick}
            className="flex items-center gap-3 bg-muted/50 p-2 rounded-lg border cursor-pointer w-64 shadow-inner"
            whileHover={{ scale: 1.05, boxShadow: "0 0 15px rgba(var(--primary-rgb), 0.3)" }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            <motion.div
              className="bg-background p-2 rounded-md"
              animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
            >
              <Star className="text-yellow-400" />
            </motion.div>
            <div className="flex-grow">
              <div className="flex justify-between items-center mb-1">
                <p className="text-sm font-bold">
                  Level {userLevel.level}
                </p>
                <p className="text-xs font-mono text-muted-foreground">
                  {userLevel.levelName}
                </p>
              </div>
              <div className="w-full bg-background rounded-full h-2.5">
                  <motion.div
                    className="bg-primary h-2.5 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                  />
              </div>
              <div className="text-xs text-muted-foreground mt-1 text-center font-mono">
                {userLevel.currentXp} / {userLevel.xpForNextLevel} XP
              </div>
            </div>
          </motion.div>
        </TooltipTrigger>
        <TooltipContent>
          <p className="font-bold">Next Reward:</p>
          <p>{userLevel.levelUpReward}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
