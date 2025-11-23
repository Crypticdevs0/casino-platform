import { useMemo, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Download, Filter, ArrowDownRight, ArrowUpRight, Info } from 'lucide-react';
import type { TransactionModel } from '@/components/data/orm/orm_transaction';
import { TransactionType, TransactionStatus } from '@/components/data/orm/orm_transaction';

interface TransactionHistoryProps {
  transactions: TransactionModel[];
  currency?: string;
}

const formatTimestamp = (timestamp: string | null | undefined) => {
  if (!timestamp) return 'N/A';
  const date = new Date(parseInt(timestamp, 10) * 1000);
  if (Number.isNaN(date.getTime())) return 'N/A';
  return date.toLocaleString();
};

const formatAmount = (amount: string) => {
  if (!amount) return '0.00000000';
  const num = parseFloat(amount);
  if (Number.isNaN(num)) return amount;
  return num.toFixed(8);
};

const getTypeLabel = (type: TransactionType) => {
  if (type === TransactionType.DEPOSIT) return 'Deposit';
  if (type === TransactionType.WAGER) return 'Wager';
  if (type === TransactionType.WIN) return 'Win';
  if (type === TransactionType.LOSS) return 'Loss';
  if (type === TransactionType.WITHDRAWAL) return 'Withdrawal';
  return 'Unknown';
};

const getStatusLabel = (status: TransactionStatus) => {
  if (status === TransactionStatus.PENDING) return 'Pending';
  if (status === TransactionStatus.COMPLETED) return 'Completed';
  if (status === TransactionStatus.FAILED) return 'Failed';
  return 'Unknown';
};

const getTypeColor = (type: TransactionType) => {
  if (type === TransactionType.DEPOSIT || type === TransactionType.WIN) return 'text-green-500';
  if (type === TransactionType.WITHDRAWAL || type === TransactionType.LOSS) return 'text-red-500';
  if (type === TransactionType.WAGER) return 'text-yellow-500';
  return 'text-muted-foreground';
};

export function TransactionHistory({ transactions, currency }: TransactionHistoryProps) {
  const [typeFilter, setTypeFilter] = useState<'all' | 'deposit' | 'wager' | 'win' | 'loss' | 'withdrawal'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'completed' | 'failed'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredTransactions = useMemo(() => {
    const lowerSearch = searchTerm.toLowerCase();

    return transactions.filter((tx) => {
      if (currency && tx.currency !== currency) return false;

      if (typeFilter !== 'all') {
        if (typeFilter === 'deposit' && tx.type !== TransactionType.DEPOSIT) return false;
        if (typeFilter === 'wager' && tx.type !== TransactionType.WAGER) return false;
        if (typeFilter === 'win' && tx.type !== TransactionType.WIN) return false;
        if (typeFilter === 'loss' && tx.type !== TransactionType.LOSS) return false;
        if (typeFilter === 'withdrawal' && tx.type !== TransactionType.WITHDRAWAL) return false;
      }

      if (statusFilter !== 'all') {
        const desiredStatus =
          statusFilter === 'pending'
            ? TransactionStatus.PENDING
            : statusFilter === 'completed'
            ? TransactionStatus.COMPLETED
            : TransactionStatus.FAILED;
        if (tx.status !== desiredStatus) return false;
      }

      if (!lowerSearch) return true;

      const fields = [
        tx.currency,
        tx.amount,
        tx.balance_before,
        tx.balance_after,
        tx.game_session_id || '',
        tx.id,
      ];

      return fields.some((field) => field.toLowerCase().includes(lowerSearch));
    });
  }, [transactions, currency, typeFilter, statusFilter, searchTerm]);

  const exportToCsv = () => {
    if (!filteredTransactions.length) return;

    const headers = [
      'Timestamp',
      'Type',
      'Status',
      'Currency',
      'Amount',
      'Balance Before',
      'Balance After',
      'Session ID',
    ];

    const rows = filteredTransactions.map((tx) => [
      formatTimestamp(tx.completed_at || tx.create_time),
      getTypeLabel(tx.type),
      getStatusLabel(tx.status),
      tx.currency,
      formatAmount(tx.amount),
      formatAmount(tx.balance_before),
      formatAmount(tx.balance_after),
      tx.game_session_id || '',
    ]);

    const csvContent = [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `transactions-${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Card className="p-6 h-full flex flex-col">
      <div className="flex items-center justify-between mb-4 gap-2">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-primary" />
          <h3 className="text-lg font-semibold">Transaction History</h3>
          <Badge variant="secondary">{filteredTransactions.length}</Badge>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={exportToCsv}
          disabled={!filteredTransactions.length}
        >
          <Download className="w-4 h-4 mr-1" />
          Export CSV
        </Button>
      </div>

      <div className="flex flex-wrap gap-2 mb-3">
        <Button
          variant={typeFilter === 'all' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setTypeFilter('all')}
        >
          All
        </Button>
        <Button
          variant={typeFilter === 'deposit' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setTypeFilter('deposit')}
        >
          Deposits
        </Button>
        <Button
          variant={typeFilter === 'wager' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setTypeFilter('wager')}
        >
          Wagers
        </Button>
        <Button
          variant={typeFilter === 'win' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setTypeFilter('win')}
        >
          Wins
        </Button>
        <Button
          variant={typeFilter === 'loss' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setTypeFilter('loss')}
        >
          Losses
        </Button>
        <Button
          variant={typeFilter === 'withdrawal' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setTypeFilter('withdrawal')}
        >
          Withdrawals
        </Button>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        <Button
          variant={statusFilter === 'all' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setStatusFilter('all')}
        >
          All Statuses
        </Button>
        <Button
          variant={statusFilter === 'pending' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setStatusFilter('pending')}
        >
          Pending
        </Button>
        <Button
          variant={statusFilter === 'completed' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setStatusFilter('completed')}
        >
          Completed
        </Button>
        <Button
          variant={statusFilter === 'failed' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setStatusFilter('failed')}
        >
          Failed
        </Button>
      </div>

      <div className="mb-4">
        <Input
          placeholder="Search by amount, currency, or session ID"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <ScrollArea className="flex-1 pr-2">
        {!transactions.length ? (
          <div className="text-center py-8 text-muted-foreground text-sm">
            <Info className="w-5 h-5 mx-auto mb-2" />
            <p>No transactions yet.</p>
          </div>
        ) : !filteredTransactions.length ? (
          <div className="text-center py-8 text-muted-foreground text-sm">
            <Info className="w-5 h-5 mx-auto mb-2" />
            <p>No transactions match your filters.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {filteredTransactions.map((tx) => {
              const isCredit = tx.type === TransactionType.DEPOSIT || tx.type === TransactionType.WIN;
              const icon = isCredit ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />;
              const colorClass = getTypeColor(tx.type);

              return (
                <div
                  key={tx.id}
                  className="p-3 rounded-md border bg-muted/50 flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${colorClass.replace('text-', 'bg-')}/20`}>
                      <span className={colorClass}>{icon}</span>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 text-sm">
                        <span className="font-medium">{getTypeLabel(tx.type)}</span>
                        <Badge variant="outline" className="text-[10px]">
                          {tx.currency}
                        </Badge>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {formatTimestamp(tx.completed_at || tx.create_time)}
                      </div>
                      {tx.game_session_id && (
                        <div className="text-[10px] text-muted-foreground mt-1 truncate max-w-[220px]">
                          Session: {tx.game_session_id}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="text-right text-sm">
                    <div className={`font-mono font-semibold ${colorClass}`}>
                      {isCredit ? '+' : ''}
                      {formatAmount(tx.amount)}
                    </div>
                    <div className="text-[10px] text-muted-foreground mt-1">
                      {formatAmount(tx.balance_before)}  {formatAmount(tx.balance_after)}
                    </div>
                    <div className="mt-1">
                      <Badge
                        variant={tx.status === TransactionStatus.COMPLETED ? 'outline' : 'secondary'}
                        className="text-[10px]"
                      >
                        {getStatusLabel(tx.status)}
                      </Badge>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </ScrollArea>
    </Card>
  );
}
