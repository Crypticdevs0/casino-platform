import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/card';

interface Result {
  won: boolean;
  multiplier: number;
}

interface RecentResultsProps {
  results: Result[];
}

export function RecentResults({ results }: RecentResultsProps) {
  const wins = results.filter((r) => r.won).length;
  const winRate = results.length > 0 ? (wins / results.length) * 100 : 0;

  return (
    <Card className="p-4">
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-semibold">Recent Results</h3>
        <div className="text-sm text-muted-foreground">
          {wins}W / {results.length - wins}L ({winRate.toFixed(0)}%)
        </div>
      </div>
      <div className="flex gap-1 overflow-x-auto pb-2">
        <AnimatePresence>
          {results.slice(0, 10).map((result, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0 }}
              layout
            >
              <div
                className={`w-12 h-12 rounded-md flex items-center justify-center font-bold text-xs ${
                  result.won ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'
                }`}
              >
                {result.multiplier.toFixed(2)}x
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </Card>
  );
}
