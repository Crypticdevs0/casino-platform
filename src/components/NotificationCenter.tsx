import { useMemo } from 'react';
import { Bell, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import type { GameSessionModel } from '@/components/data/orm/orm_game_session';
import { GameSessionStatus } from '@/components/data/orm/orm_game_session';

interface NotificationCenterProps {
  sessions: GameSessionModel[];
  currency: string;
}

export function NotificationCenter({ sessions, currency }: NotificationCenterProps) {
  const items = useMemo(() => {
    if (!sessions.length)
      return [] as Array<{
        id: string;
        won: boolean;
        amount: number;
        createdAt: string;
      }>;

    const sorted = [...sessions].sort(
      (a, b) => parseInt(b.create_time, 10) - parseInt(a.create_time, 10),
    );

    return sorted.slice(0, 8).map((s) => {
      const won =
        s.status === GameSessionStatus.WON &&
        parseFloat(s.win_amount || '0') > 0;
      const amount = parseFloat(s.win_amount || '0');
      const createdAt = new Date(
        parseInt(s.create_time, 10) * 1000,
      ).toLocaleString();

      return {
        id: s.id,
        won,
        amount,
        createdAt,
      };
    });
  }, [sessions]);

  const unreadCount = items.length;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative"
          aria-label="Open notifications"
        >
          <Bell className="w-4 h-4" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 inline-flex items-center justify-center rounded-full bg-primary text-primary-foreground text-[10px] px-1.5 py-0.5">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-80" align="end">
        <DropdownMenuLabel>Notifications</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {items.length === 0 ? (
          <DropdownMenuItem disabled className="text-xs text-muted-foreground">
            No recent game activity.
          </DropdownMenuItem>
        ) : (
          items.map((item) => (
            <DropdownMenuItem key={item.id} className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2">
                <span
                  className={
                    item.won
                      ? 'inline-flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-400'
                      : 'inline-flex h-6 w-6 items-center justify-center rounded-full bg-red-500/10 text-red-400'
                  }
                >
                  {item.won ? (
                    <ArrowUpRight className="w-3 h-3" />
                  ) : (
                    <ArrowDownRight className="w-3 h-3" />
                  )}
                </span>
                <div>
                  <div className="text-xs font-medium">
                    {item.won ? 'Win' : 'Loss'}{' '}
                    {item.amount > 0
                      ? `+${item.amount.toFixed(8)} ${currency}`
                      : `${item.amount.toFixed(8)} ${currency}`}
                  </div>
                  <div className="text-[10px] text-muted-foreground">
                    {item.createdAt}
                  </div>
                </div>
              </div>
            </DropdownMenuItem>
          ))
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
