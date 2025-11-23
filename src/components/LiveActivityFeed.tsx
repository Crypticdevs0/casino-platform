import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { motion, AnimatePresence } from 'framer-motion';
import { Dice5, Gem, DollarSign, Link } from 'lucide-react';
import { Button } from '@/components/ui/button';

import type { GameSessionModel } from '@/components/data/orm/orm_game_session';
import { GameSessionStatus } from '@/components/data/orm/orm_game_session';

type WinEntry = {
  id: string;
  user: string;
  game: { name: string; icon: React.ReactElement };
  amount: string;
  multiplier: string;
};

interface LiveActivityFeedProps {
  sessions?: GameSessionModel[];
  currency?: string;
}

// Mock data generator
const games = [
  { name: 'Dice', icon: <Dice5 className="h-4 w-4 text-red-400" /> },
  { name: 'Slots', icon: <Gem className="h-4 w-4 text-blue-400" /> },
  { name: 'Plinko', icon: <DollarSign className="h-4 w-4 text-green-400" /> },
];

const generateRandomWin = (): WinEntry => ({
  id: `${Date.now()}-${Math.random()}`,
  user: `User${Math.floor(Math.random() * 9000) + 1000}`,
  game: games[Math.floor(Math.random() * games.length)],
  amount: (Math.random() * 5).toFixed(3),
  multiplier: (Math.random() * 99 + 1).toFixed(2),
});

export function LiveActivityFeed({ sessions = [], currency = 'ETH' }: LiveActivityFeedProps) {
  const initialWins = sessions.length
    ? sessions
        .filter((s) => s.status === GameSessionStatus.WON && parseFloat(s.win_amount || '0') > 0)
        .sort((a, b) => parseInt(b.create_time, 10) - parseInt(a.create_time, 10))
        .slice(0, 7)
        .map((s) => ({
          id: s.id,
          user: `User${s.user_id.slice(0,4)}`,
          game: { name: (s as any).game_name || 'Game', icon: <DollarSign className="h-4 w-4 text-green-400" /> },
          amount: parseFloat(s.win_amount || '0').toFixed(3),
          multiplier: (s.multiplier || 0).toFixed(2),
        }))
    : Array.from({ length: 7 }, generateRandomWin);

  const [wins, setWins] = useState<WinEntry[]>(initialWins);

  // On sessions update, prepend new win
  useEffect(() => {
    if (!sessions.length) return;
    const latest = sessions[0];
    if (
      latest.status === GameSessionStatus.WON &&
      parseFloat(latest.win_amount || '0') > 0 &&
      !wins.some((w) => w.id === latest.id)
    ) {
      const entry = {
        id: latest.id,
        user: `User${latest.user_id.slice(0,4)}`,
        game: { name: (latest as any).game_name || 'Game', icon: <DollarSign className="h-4 w-4 text-green-400" /> },
        amount: parseFloat(latest.win_amount || '0').toFixed(3),
        multiplier: (latest.multiplier || 0).toFixed(2),
      };
      setWins((prev) => [entry, ...prev.slice(0, 6)]);
    }
  }, [sessions]);

  useEffect(() => {
    const interval = setInterval(() => {
      setWins(prevWins => [generateRandomWin(), ...prevWins.slice(0, 6)] as WinEntry[]);
    }, 2500);

    return () => clearInterval(interval);
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Live Wins</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 overflow-hidden h-64">
          <AnimatePresence>
            {wins.map((win) => {
                const isBigWin = parseFloat(win.multiplier) > 50;
                return (
                  <motion.div
                    key={win.id}
                    layout
                    initial={{ opacity: 0, y: -20, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, x: -20, transition: { duration: 0.2 } }}
                    transition={{ duration: 0.5, type: 'spring' }}
                    className={`flex items-center justify-between p-2 rounded-md ${isBigWin ? 'bg-primary/20 border border-primary' : 'bg-muted/50'}`}
                  >
                    <div className="flex items-center gap-2">
                      {win.game.icon}
                      <div>
                        <span className="font-semibold text-sm">{win.user}</span>
                        <span className="text-xs text-muted-foreground"> won in {win.game.name}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`font-bold text-sm ${isBigWin ? 'text-primary' : 'text-green-500'}`}>{win.amount} ETH</p>
                      <p className="text-xs text-muted-foreground">@{win.multiplier}x</p>
                      {isBigWin && (
                          <Button variant="link" size="sm" className="h-auto p-0 mt-1 text-xs">
                              <Link className="w-3 h-3 mr-1" />
                              View Bet
                          </Button>
                      )}
                    </div>
                  </motion.div>
                )
            })}
          </AnimatePresence>
        </div>
      </CardContent>
    </Card>
  );
}
