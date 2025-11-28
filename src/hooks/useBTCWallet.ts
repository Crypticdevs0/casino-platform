import { useState, useCallback, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { btcService, type BTCTransaction } from '@/services/btc.service';
import { authService } from '@/services/auth.service';
import { gameService } from '@/services/game.service';
import type { UserModel } from '@/components/data/orm/orm_user';

/**
 * Hook for Bitcoin wallet management on mainnet
 */
export function useBTCWallet() {
  const [currentUser, setCurrentUser] = useState<UserModel | null>(null);
  const [btcAddress, setBTCAddress] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const [walletStatus, setWalletStatus] = useState<'disconnected' | 'connected' | 'monitoring'>('disconnected');
  const queryClient = useQueryClient();

  /**
   * Connect wallet by registering deposit address
   */
  const connectWallet = useCallback(async () => {
    setIsConnecting(true);
    setConnectionError(null);

    try {
      const depositAddress = btcService.getDepositAddress();

      if (!BTCService.validateAddress(depositAddress)) {
        throw new Error('Invalid BTC deposit address configured');
      }

      const result = await authService.connectBTCWallet(depositAddress);
      setBTCAddress(depositAddress);
      setCurrentUser(result.user);
      setWalletStatus('connected');

      queryClient.invalidateQueries({ queryKey: ['btc-wallet'] });

      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to connect wallet';
      console.error('Failed to connect BTC wallet:', error);
      setConnectionError(errorMessage);
      throw error;
    } finally {
      setIsConnecting(false);
    }
  }, [queryClient]);

  /**
   * Disconnect wallet
   */
  const disconnectWallet = useCallback(async () => {
    await authService.disconnectWallet();
    setBTCAddress(null);
    setCurrentUser(null);
    setConnectionError(null);
    setWalletStatus('disconnected');
    queryClient.clear();
  }, [queryClient]);

  /**
   * Monitor incoming transaction
   */
  const monitorDeposit = useCallback(
    async (txid: string) => {
      if (!currentUser) {
        throw new Error('User not connected');
      }

      setWalletStatus('monitoring');

      try {
        const tx = await btcService.monitorTransaction(txid, (updatedTx) => {
          queryClient.setQueryData(['btc-deposit', txid], updatedTx);
        });

        if (!tx) {
          throw new Error('Transaction monitoring timeout');
        }

        if (tx.confirmations >= 3) {
          await updateBalance(currentUser.id, tx);
        }

        setWalletStatus('connected');
        return tx;
      } catch (error) {
        console.error('Error monitoring deposit:', error);
        setWalletStatus('connected');
        throw error;
      }
    },
    [currentUser, queryClient],
  );

  /**
   * Update user balance after confirmed deposit
   */
  const updateBalance = useCallback(
    async (userId: string, tx: BTCTransaction) => {
      const wallet = await gameService.getWalletBalance(userId, 'BTC');

      if (!wallet) {
        throw new Error('BTC wallet not found');
      }

      const currentBalance = parseFloat(wallet.available_balance);
      const newBalance = (currentBalance + tx.value).toString();

      const walletOrm = await import('@/components/data/orm/orm_wallet');
      await walletOrm.WalletORM.getInstance().setWalletByCurrencyUserId('BTC', userId, {
        ...wallet,
        available_balance: newBalance,
      });

      const transactionOrm = await import('@/components/data/orm/orm_transaction');
      await transactionOrm.TransactionORM.getInstance().insertTransaction([
        {
          user_id: userId,
          type: transactionOrm.TransactionType.DEPOSIT,
          currency: 'BTC',
          amount: tx.value.toString(),
          balance_before: wallet.available_balance,
          balance_after: newBalance,
          status: transactionOrm.TransactionStatus.COMPLETED,
          game_session_id: null,
          metadata: JSON.stringify({
            method: 'btc-mainnet',
            txid: tx.txid,
            confirmations: tx.confirmations,
          }),
          completed_at: Math.floor(Date.now() / 1000).toString(),
        } as any,
      ]);

      queryClient.invalidateQueries({ queryKey: ['btc-wallet'] });
    },
    [queryClient],
  );

  return {
    currentUser,
    btcAddress,
    isConnected: !!btcAddress && walletStatus !== 'disconnected',
    isConnecting,
    connectionError,
    walletStatus,
    connectWallet,
    disconnectWallet,
    monitorDeposit,
    depositAddress: btcService.getDepositAddress(),
  };
}

/**
 * Hook to get BTC address balance from Mempool
 */
export function useBTCBalance(address: string | null) {
  return useQuery({
    queryKey: ['btc-balance', address],
    queryFn: async () => {
      if (!address) return null;
      return await btcService.getAddressInfo(address);
    },
    enabled: !!address,
    refetchInterval: 10000,
    refetchOnWindowFocus: true,
    staleTime: 5000,
  });
}

/**
 * Hook to get address transactions
 */
export function useBTCTransactions(address: string | null) {
  return useQuery({
    queryKey: ['btc-transactions', address],
    queryFn: async () => {
      if (!address) return [];
      return await btcService.getAddressTransactions(address);
    },
    enabled: !!address,
    refetchInterval: 15000,
    staleTime: 5000,
  });
}

/**
 * Hook to process BTC deposit
 */
export function useBTCDeposit(onSuccess?: () => void) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ txid }: { txid: string }) => {
      const tx = await btcService.getTransaction(txid);

      if (!tx) {
        throw new Error('Transaction not found');
      }

      if (tx.confirmations < 3) {
        throw new Error(`Transaction needs ${3 - tx.confirmations} more confirmations`);
      }

      return tx;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['btc-wallet'] });
      onSuccess?.();
    },
  });
}

/**
 * Hook to get BTC price in USD
 */
export function useBTCPrice() {
  return useQuery({
    queryKey: ['btc-price'],
    queryFn: () => btcService.getBTCPrice(),
    refetchInterval: 60000,
    staleTime: 30000,
  });
}
