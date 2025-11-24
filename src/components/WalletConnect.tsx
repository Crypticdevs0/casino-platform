import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Wallet, LogOut, AlertCircle, Loader2 } from 'lucide-react';

interface WalletConnectProps {
  isConnected: boolean;
  connectedAddress: string | null;
  onConnect: () => Promise<void>;
  onDisconnect: () => void;
  isConnecting?: boolean;
  error?: string | null;
}

export function WalletConnect({
  isConnected,
  connectedAddress,
  onConnect,
  onDisconnect,
  isConnecting = false,
  error = null,
}: WalletConnectProps) {
  const formatAddress = (address: string) => {
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  if (isConnected && connectedAddress) {
    return (
      <Card className="p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
            <Wallet className="w-5 h-5 text-primary" />
          </div>
          <div>
            <p className="text-sm font-medium">Connected Wallet</p>
            <p className="text-xs text-muted-foreground">{formatAddress(connectedAddress)}</p>
          </div>
        </div>
        <Button variant="outline" size="sm" onClick={onDisconnect}>
          <LogOut className="w-4 h-4 mr-2" />
          Disconnect
        </Button>
      </Card>
    );
  }

  return (
    <Card className="p-6 text-center">
      {error && (
        <Alert className="mb-4 border-red-200 bg-red-50">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">
            {error}
          </AlertDescription>
        </Alert>
      )}
      <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
        <Wallet className="w-8 h-8 text-primary" />
      </div>
      <h3 className="text-lg font-semibold mb-2">Connect Your Wallet</h3>
      <p className="text-sm text-muted-foreground mb-4">
        Connect your crypto wallet to start playing
      </p>
      <Button onClick={onConnect} size="lg" disabled={isConnecting}>
        {isConnecting ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Connecting...
          </>
        ) : (
          <>
            <Wallet className="w-4 h-4 mr-2" />
            Connect Wallet
          </>
        )}
      </Button>
    </Card>
  );
}
