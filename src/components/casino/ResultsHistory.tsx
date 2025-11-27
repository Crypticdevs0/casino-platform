import { ScrollArea } from '@/components/ui/scroll-area';
import { useGameStore } from '@/stores/useGameStore';
import { format } from 'date-fns';
import { Clock, Zap, Gift, Trophy } from 'lucide-react';
import { cn } from '@/lib/utils';

export function ResultsHistory() {
  const { gameHistory } = useGameStore();

  if (gameHistory.length === 0) {
    return (
      <div className="text-center p-6 text-muted-foreground">
        <p>No game history yet. Play a game to see your results here!</p>
      </div>
    );
  }

  return (
    <ScrollArea className="h-[400px] pr-4">
      <div className="space-y-3">
        {gameHistory.map((result) => {
          const isWin = result.result.winAmount > 0;
          const hasFreeSpins = (result.result.freeSpins ?? 0) > 0;
          const hasBonusRounds = (result.result.bonusRounds ?? 0) > 0;
          const isJackpot = result.result.isJackpot;

          return (
            <div 
              key={result.id}
              className={cn(
                "p-4 rounded-lg border",
                isWin 
                  ? "bg-green-500/5 border-green-500/20" 
                  : "bg-muted/50 border-border"
              )}
            >
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-2">
                    <span className={cn(
                      "font-medium",
                      isWin ? "text-green-500" : "text-muted-foreground"
                    )}>
                      {isWin 
                        ? `+$${result.result.winAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` 
                        : 'No Win'}
                    </span>
                    
                    {isJackpot && (
                      <span className="inline-flex items-center gap-1 bg-yellow-500/10 text-yellow-500 text-xs px-2 py-0.5 rounded-full">
                        <Trophy className="h-3 w-3" />
                        Jackpot
                      </span>
                    )}
                  </div>
                  
                  <div className="text-xs text-muted-foreground mt-1">
                    {format(new Date(result.timestamp), 'MMM d, yyyy - h:mm a')}
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  {hasFreeSpins && (
                    <span className="text-xs bg-blue-500/10 text-blue-500 px-2 py-1 rounded-full flex items-center gap-1">
                      <Zap className="h-3 w-3" />
                      {result.result.freeSpins}
                    </span>
                  )}
                  
                  {hasBonusRounds && (
                    <span className="text-xs bg-purple-500/10 text-purple-500 px-2 py-1 rounded-full flex items-center gap-1">
                      <Gift className="h-3 w-3" />
                      {result.result.bonusRounds}
                    </span>
                  )}
                </div>
              </div>
              
              {result.result.multiplier && result.result.multiplier > 1 && (
                <div className="mt-2 text-xs text-muted-foreground">
                  <span className="font-medium">Multiplier:</span> x{result.result.multiplier.toFixed(2)}
                </div>
              )}
              
              {result.result.winningLines?.length > 0 && (
                <div className="mt-2">
                  <div className="text-xs text-muted-foreground">Winning Lines:</div>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {result.result.winningLines.map((line: number) => (
                      <span 
                        key={line}
                        className="text-xs bg-foreground/5 text-foreground/80 px-2 py-0.5 rounded"
                      >
                        {line}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </ScrollArea>
  );
}
