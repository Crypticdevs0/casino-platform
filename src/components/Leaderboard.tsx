import { Card } from '@/components/ui/card';
import { Trophy } from 'lucide-react';

// Mock data for now
const leaderboardData = [
  { rank: 1, user: 'Wallet-abc...def', winnings: 1250.5 },
  { rank: 2, user: 'Player-xyz', winnings: 1100.2 },
  { rank: 3, user: 'HighRoller', winnings: 950.8 },
  { rank: 4, user: 'CryptoKing', winnings: 800.1 },
  { rank: 5, user: 'LadyLuck', winnings: 750.6 },
];

export function Leaderboard() {
  return (
    <Card className="p-6">
      <div className="flex items-center gap-2 mb-4">
        <Trophy className="w-6 h-6 text-yellow-500" />
        <h2 className="text-2xl font-bold">Leaderboard</h2>
      </div>
      <div className="space-y-2">
        {leaderboardData.map((player) => (
          <div
            key={player.rank}
            className="flex items-center justify-between p-2 rounded-md bg-muted/50"
          >
            <div className="flex items-center gap-4">
              <span className="font-bold text-lg">{player.rank}</span>
              <span>{player.user}</span>
            </div>
            <span className="font-semibold text-green-500">
              {player.winnings.toFixed(4)} ETH
            </span>
          </div>
        ))}
      </div>
    </Card>
  );
}
