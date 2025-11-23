import { Card } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, TrendingDown } from 'lucide-react';
import type { GameSessionModel } from '@/components/data/orm/orm_game_session';
import { GameSessionStatus } from '@/components/data/orm/orm_game_session';


interface PlayerStatsProps {
  sessions: GameSessionModel[];
  currency: string;
}

export function PlayerStats({ sessions, currency }: PlayerStatsProps) {
    // Derive values
  const totalBets = sessions.length;
  const totalWagered = sessions.reduce((sum, s) => sum + parseFloat(s.bet_amount || '0'), 0);
  const totalWon = sessions.reduce((sum, s) => sum + parseFloat(s.win_amount || '0'), 0);
  const profitLoss = totalWon - totalWagered;
  const winSessions = sessions.filter(s => s.status === GameSessionStatus.WON);
  const winRate = totalBets > 0 ? (winSessions.length / totalBets) * 100 : 0;
  const avgBet = totalBets > 0 ? totalWagered / totalBets : 0;

  // Profit by game type
  const profitByGame: Record<string, number> = {};
  sessions.forEach(s => {
    const key = (s as any).game_name || 'Unknown';
    const bet = parseFloat(s.bet_amount || '0');
    const win = parseFloat(s.win_amount || '0');
    const pnl = win - bet;
    profitByGame[key] = (profitByGame[key] || 0) + pnl;
  });
  const history = Object.entries(profitByGame).map(([name, profit]) => ({ name, profit }));

  return (
    <Card className="p-4">
      <h3 className="font-semibold mb-4">Player Stats</h3>
      <div className="grid grid-cols-2 gap-4 text-sm mb-4">
        <div>
          <p className="text-muted-foreground">Profit/Loss</p>
          <div
            className={`flex items-center font-bold ${
              profitLoss >= 0 ? 'text-green-500' : 'text-red-500'
            }`}
          >
            {profitLoss >= 0 ? (
              <TrendingUp className="w-4 h-4 mr-1" />
            ) : (
              <TrendingDown className="w-4 h-4 mr-1" />
            )}
            {profitLoss.toFixed(8)} {currency}
          </div>
        </div>
        <div>
          <p className="text-muted-foreground">Win Rate</p>
          <p className="font-bold">{winRate.toFixed(1)}%</p>
        </div>
        <div>
          <p className="text-muted-foreground">Total Bets</p>
          <p className="font-bold">{totalBets}</p>
        </div>
        <div>
          <p className="text-muted-foreground">Avg. Bet</p>
          <p className="font-bold">{avgBet.toFixed(8)} {currency}</p>
        </div>
      </div>
      <div>
        <h4 className="text-sm font-semibold mb-2">Profit by Game</h4>
        <ResponsiveContainer width="100%" height={150}>
          <BarChart data={history}>
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
