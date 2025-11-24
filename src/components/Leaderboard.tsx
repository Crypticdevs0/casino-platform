import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Trophy, TrendingUp, DollarSign } from 'lucide-react';

interface LeaderboardEntry {
  rank: number;
  user: string;
  value: string;
}

interface LeaderboardData {
  highestMultiplier: LeaderboardEntry[];
  wageredVolume: LeaderboardEntry[];
}

// Mock data for now
const generateLeaderboard = (): LeaderboardData => ({
  highestMultiplier: Array.from({ length: 5 }, (_, i) => ({
    rank: i + 1,
    user: `User${Math.floor(Math.random() * 9000) + 1000}`,
    value: (Math.random() * 1000).toFixed(2),
  })).sort((a, b) => parseFloat(b.value) - parseFloat(a.value)),
  wageredVolume: Array.from({ length: 5 }, (_, i) => ({
    rank: i + 1,
    user: `User${Math.floor(Math.random() * 9000) + 1000}`,
    value: (Math.random() * 100).toFixed(4),
  })).sort((a, b) => parseFloat(b.value) - parseFloat(a.value)),
});

interface LeaderboardTableProps {
  data: LeaderboardEntry[];
  unit: string;
}

const LeaderboardTable = ({ data, unit }: LeaderboardTableProps) => (
    <div className="space-y-2">
      {data.map((player: LeaderboardEntry) => (
        <div
          key={player.rank}
          className="flex items-center justify-between p-2 rounded-md bg-muted/50"
        >
          <div className="flex items-center gap-4">
            <span className="font-bold text-lg w-6 text-center">{player.rank}</span>
            <span className="font-mono text-sm">{player.user}</span>
          </div>
          <span className="font-semibold text-primary">
            {player.value} {unit}
          </span>
        </div>
      ))}
    </div>
);


export function Leaderboard() {
  // In a real app, you'd fetch data based on the selected tab.
  // For now, we'll just generate new data for each to show the concept.
  const dailyData = generateLeaderboard();
  const weeklyData = generateLeaderboard();
  const monthlyData = generateLeaderboard();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
            <Trophy className="w-6 h-6 text-yellow-500" />
            Leaderboards
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="daily">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="daily">Daily</TabsTrigger>
            <TabsTrigger value="weekly">Weekly</TabsTrigger>
            <TabsTrigger value="monthly">Monthly</TabsTrigger>
          </TabsList>

          <TabsContent value="daily" className="mt-4">
              <LeaderboardCategory data={dailyData} />
          </TabsContent>
          <TabsContent value="weekly" className="mt-4">
              <LeaderboardCategory data={weeklyData} />
          </TabsContent>
          <TabsContent value="monthly" className="mt-4">
              <LeaderboardCategory data={monthlyData} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

interface LeaderboardCategoryProps {
  data: LeaderboardData;
}

const LeaderboardCategory = ({ data }: LeaderboardCategoryProps) => (
    <div className="space-y-6">
        <div>
            <h3 className="font-semibold mb-2 flex items-center"><TrendingUp className="w-4 h-4 mr-2" />Highest Multiplier</h3>
            <LeaderboardTable data={data.highestMultiplier} unit="x" />
        </div>
        <div>
            <h3 className="font-semibold mb-2 flex items-center"><DollarSign className="w-4 h-4 mr-2" />Wagered Volume</h3>
            <LeaderboardTable data={data.wageredVolume} unit="ETH" />
        </div>
    </div>
);
