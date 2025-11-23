import { Card } from '@/components/ui/card';
import { CheckCircle, Clock } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

// Mock data for now
const missions = [
  {
    name: 'Daily Play',
    description: 'Play 10 games',
    progress: 7,
    goal: 10,
    reward: '0.01 ETH',
  },
  {
    name: 'Weekly Wager',
    description: 'Wager a total of 1 ETH',
    progress: 0.5,
    goal: 1,
    reward: '0.1 ETH',
  },
  {
    name: 'Dice Master',
    description: 'Win 5 dice games in a row',
    progress: 4,
    goal: 5,
    reward: '0.05 ETH',
  },
  {
    name: 'Slot King',
    description: 'Hit a 10x multiplier on slots',
    progress: 0,
    goal: 1,
    reward: '0.2 ETH',
  },
];

export function Missions() {
  return (
    <Card className="p-6">
      <h2 className="text-2xl font-bold mb-4">Missions</h2>
      <div className="space-y-4">
        {missions.map((mission, i) => (
          <div key={i} className="p-4 rounded-md bg-muted/50">
            <div className="flex justify-between items-center mb-2">
              <p className="font-bold">{mission.name}</p>
              <p className="text-sm font-semibold text-green-500">{mission.reward}</p>
            </div>
            <p className="text-sm text-muted-foreground mb-2">{mission.description}</p>
            <div className="flex items-center gap-2">
              <Progress value={(mission.progress / mission.goal) * 100} />
              <span className="text-xs text-muted-foreground">
                {mission.progress}/{mission.goal}
              </span>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
