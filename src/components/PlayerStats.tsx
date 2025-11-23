import { Card } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, TrendingDown, Clock } from 'lucide-react';

// Mock data for now
const statsData = {
  pnl: 150.75,
  winRate: 62.5,
  bets: 128,
  avgBet: 0.05,
  history: [
    { name: 'Dice', profit: 50 },
    { name: 'Slots', profit: -25 },
    { name: 'Plinko', profit: 75 },
    { name: 'Balloon', profit: 50.75 },
  ],
};

export function PlayerStats() {
  return (
    <Card className="p-4">
      <h3 className="font-semibold mb-4">Player Stats</h3>
      <div className="grid grid-cols-2 gap-4 text-sm mb-4">
        <div>
          <p className="text-muted-foreground">Profit/Loss</p>
          <div
            className={`flex items-center font-bold ${
              statsData.pnl >= 0 ? 'text-green-500' : 'text-red-500'
            }`}
          >
            {statsData.pnl >= 0 ? (
              <TrendingUp className="w-4 h-4 mr-1" />
            ) : (
              <TrendingDown className="w-4 h-4 mr-1" />
            )}
            {statsData.pnl.toFixed(2)} ETH
          </div>
        </div>
        <div>
          <p className="text-muted-foreground">Win Rate</p>
          <p className="font-bold">{statsData.winRate.toFixed(1)}%</p>
        </div>
        <div>
          <p className="text-muted-foreground">Total Bets</p>
          <p className="font-bold">{statsData.bets}</p>
        </div>
        <div>
          <p className="text-muted-foreground">Avg. Bet</p>
          <p className="font-bold">{statsData.avgBet.toFixed(3)} ETH</p>
        </div>
      </div>
      <div>
        <h4 className="text-sm font-semibold mb-2">Profit by Game</h4>
        <ResponsiveContainer width="100%" height={150}>
          <BarChart data={statsData.history}>
            <XAxis dataKey="name" stroke="#888888" fontSize={12} />
            <YAxis stroke="#888888" fontSize={12} />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1f2937',
                border: '1px solid #374151',
              }}
            />
            <Bar dataKey="profit" fill="#8884d8" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
