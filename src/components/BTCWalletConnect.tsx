import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Bitcoin, LogOut, AlertCircle, Loader2, Copy, Check } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useBTCBalance } from '@/hooks/useBTCWallet';

interface BTCWalletConnectProps {
  isConnected: boolean;
  btcAddress: string | null;
  onConnect: () => Promise<any>;
  onDisconnect: () => void;
  isConnecting?: boolean;
  error?: string | null;
  walletStatus?: 'disconnected' | 'connected' | 'monitoring';
}

export function BTCWalletConnect({
  isConnected,
  btcAddress,
  onConnect,
  onDisconnect,
  isConnecting = false,
  error = null,
  walletStatus = 'disconnected',
}: BTCWalletConnectProps) {
  const [copiedAddress, setCopiedAddress] = useState(false);
  const { data: balanceData } = useBTCBalance(isConnected ? btcAddress : null);

  const formatAddress = (address: string) => {
    return `${address.substring(0, 12)}...${address.substring(address.length - 8)}`;
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedAddress(true);
      setTimeout(() => setCopiedAddress(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const getStatusBadge = () => {
    switch (walletStatus) {
      case 'monitoring':
        return (
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 text-xs font-medium">
            <Loader2 className="w-3 h-3 animate-spin" />
            Monitoring for deposits...
          </div>
        );
      case 'connected':
        return (
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-50 dark:bg-green-950 text-green-700 dark:text-green-300 text-xs font-medium">
            <div className="w-2 h-2 rounded-full bg-green-500" />
            Connected
          </div>
        );
      default:
        return null;
    }
  };

  if (isConnected && btcAddress) {
    return (
      <Card className="p-6 border border-amber-200 dark:border-amber-900 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30">
        <div className="space-y-4">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-orange-500/20 flex items-center justify-center flex-shrink-0">
                <Bitcoin className="w-6 h-6 text-orange-600 dark:text-orange-400" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium text-foreground">Bitcoin Deposit Address</p>
                <p className="text-xs text-muted-foreground mt-1">Send BTC to this address to deposit</p>
                <div className="mt-3 flex items-center gap-2 bg-white dark:bg-slate-900 rounded px-3 py-2 border border-amber-100 dark:border-amber-900/50">
                  <code className="text-xs font-mono truncate text-foreground/70">{formatAddress(btcAddress)}</code>
                  <button
                    onClick={() => copyToClipboard(btcAddress)}
                    className="ml-auto p-1 hover:bg-amber-100 dark:hover:bg-amber-900/30 rounded transition-colors flex-shrink-0"
                    title="Copy full address"
                  >
                    {copiedAddress ? (
                      <Check className="w-4 h-4 text-green-600 dark:text-green-400" />
                    ) : (
                      <Copy className="w-4 h-4 text-muted-foreground" />
                    )}
                  </button>
                </div>
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={onDisconnect} className="flex-shrink-0">
              <LogOut className="w-4 h-4 mr-2" />
              Disconnect
            </Button>
          </div>

          {getStatusBadge() && <div className="flex items-center gap-2">{getStatusBadge()}</div>}

          {balanceData && (
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="bg-white/60 dark:bg-slate-900/40 rounded p-3">
                <p className="text-xs text-muted-foreground">Confirmed Balance</p>
                <p className="text-lg font-semibold text-foreground">
                  {balanceData.balance.toFixed(8)} BTC
                </p>
              </div>
              <div className="bg-white/60 dark:bg-slate-900/40 rounded p-3">
                <p className="text-xs text-muted-foreground">Unconfirmed</p>
                <p className="text-lg font-semibold text-amber-600 dark:text-amber-400">
                  {balanceData.unconfirmedBalance.toFixed(8)} BTC
                </p>
              </div>
            </div>
          )}

          <div className="text-xs text-muted-foreground bg-blue-50 dark:bg-blue-950/30 rounded p-3">
            <p className="font-medium mb-1">📝 How to deposit:</p>
            <ol className="space-y-1 list-decimal list-inside">
              <li>Copy your deposit address (click the copy icon above)</li>
              <li>Send BTC from your wallet to this address</li>
              <li>Wait for 3 confirmations (~30 minutes)</li>
              <li>Your balance will update automatically</li>
            </ol>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 text-center">
      {error && (
        <Alert className="mb-4 border-red-200 bg-red-50 dark:bg-red-950/20 dark:border-red-900/50">
          <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
          <AlertDescription className="text-red-800 dark:text-red-300">{error}</AlertDescription>
        </Alert>
      )}
      <div className="w-16 h-16 rounded-full bg-orange-100 dark:bg-orange-950/40 flex items-center justify-center mx-auto mb-4">
        <Bitcoin className="w-8 h-8 text-orange-600 dark:text-orange-400" />
      </div>
      <h3 className="text-lg font-semibold mb-2">Bitcoin Wallet Connection</h3>
      <p className="text-sm text-muted-foreground mb-6">
        Connect to receive a Bitcoin deposit address. Send BTC mainnet to start playing.
      </p>
      <Button onClick={onConnect} size="lg" disabled={isConnecting} className="bg-orange-600 hover:bg-orange-700">
        {isConnecting ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Connecting...
          </>
        ) : (
          <>
            <Bitcoin className="w-4 h-4 mr-2" />
            Connect Bitcoin Wallet
          </>
        )}
      </Button>
      <p className="text-xs text-muted-foreground mt-4">
        🔒 Non-custodial. Your private keys stay with you.
      </p>
    </Card>
  );
}
