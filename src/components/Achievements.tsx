import { Card } from '@/components/ui/card';
import { Award } from 'lucide-react';

// Mock data for now
const achievements = [
  { name: 'First Win', description: 'Win your first game', unlocked: true },
  { name: 'Hot Streak', description: 'Win 5 games in a row', unlocked: true },
  { name: 'High Roller', description: 'Bet over 1 ETH in a single game', unlocked: false },
  { name: 'Century Club', description: 'Play 100 games', unlocked: false },
];

export function Achievements() {
  return (
    <Card className="p-6">
      <div className="flex items-center gap-2 mb-4">
        <Award className="w-6 h-6 text-yellow-500" />
        <h2 className="text-2xl font-bold">Achievements</h2>
      </div>
      <div className="grid grid-cols-2 gap-4">
        {achievements.map((ach, i) => (
          <div
            key={i}
            className={`p-4 rounded-md ${
              ach.unlocked ? 'bg-green-500/20' : 'bg-muted/50'
            }`}
          >
            <p className="font-bold">{ach.name}</p>
            <p className="text-sm text-muted-foreground">{ach.description}</p>
          </div>
        ))}
      </div>
    </Card>
  );
}
