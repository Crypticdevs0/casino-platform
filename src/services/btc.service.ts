import axios from 'axios';
import type { AxiosInstance } from 'axios';

const MEMPOOL_API_URL = 'https://mempool.space/api';
const CONFIRMATIONS_REQUIRED = 3;

export interface BTCTransaction {
  txid: string;
  vout: number;
  value: number;
  status: 'pending' | 'confirmed' | 'failed';
  confirmations: number;
  timestamp?: number;
}

export interface BTCAddressInfo {
  address: string;
  balance: number;
  transactions: BTCTransaction[];
  unconfirmedBalance: number;
}

class BTCService {
  private apiClient: AxiosInstance;
  private mainnetAddress: string;

  constructor() {
    this.apiClient = axios.create({
      baseURL: MEMPOOL_API_URL,
      timeout: 10000,
    });
    this.mainnetAddress = process.env.VITE_BTC_DEPOSIT_ADDRESS || '';
  }

  /**
   * Get main deposit address (casino's receiving address)
   */
  getDepositAddress(): string {
    if (!this.mainnetAddress) {
      throw new Error('BTC deposit address not configured. Set VITE_BTC_DEPOSIT_ADDRESS env var.');
    }
    return this.mainnetAddress;
  }

  /**
   * Fetch address info from Mempool API
   */
  async getAddressInfo(address: string): Promise<BTCAddressInfo> {
    try {
      const response = await this.apiClient.get(`/address/${address}`);
      const data = response.data;

      const balance = (data.chain_stats.funded_txo_sum - data.chain_stats.spent_txo_sum) / 100_000_000;
      const unconfirmedBalance = (data.mempool_stats.funded_txo_sum - data.mempool_stats.spent_txo_sum) / 100_000_000;

      return {
        address,
        balance,
        unconfirmedBalance,
        transactions: [],
      };
    } catch (error) {
      console.error('Error fetching BTC address info:', error);
      throw new Error('Failed to fetch address info from Mempool');
    }
  }

  /**
   * Get all transactions for an address
   */
  async getAddressTransactions(address: string): Promise<BTCTransaction[]> {
    try {
      const response = await this.apiClient.get(`/address/${address}/txs`);
      const txs = response.data;

      return txs.map((tx: any) => ({
        txid: tx.txid,
        vout: 0,
        value: this.extractOutputValue(tx, address),
        status: this.getTransactionStatus(tx),
        confirmations: tx.status?.confirmed ? (tx.status.block_height ? 999999 - tx.status.block_height : 0) : 0,
        timestamp: tx.status?.block_time,
      }));
    } catch (error) {
      console.error('Error fetching transactions:', error);
      throw new Error('Failed to fetch transactions from Mempool');
    }
  }

  /**
   * Get single transaction details
   */
  async getTransaction(txid: string): Promise<BTCTransaction | null> {
    try {
      const response = await this.apiClient.get(`/tx/${txid}`);
      const tx = response.data;

      return {
        txid: tx.txid,
        vout: 0,
        value: tx.vout.reduce((sum: number, out: any) => sum + out.value, 0) / 100_000_000,
        status: this.getTransactionStatus(tx),
        confirmations: tx.status?.confirmed ? (tx.status.block_height ? 999999 - tx.status.block_height : 0) : 0,
        timestamp: tx.status?.block_time,
      };
    } catch (error) {
      console.error('Error fetching transaction:', error);
      return null;
    }
  }

  /**
   * Check if transaction is confirmed
   */
  async isTransactionConfirmed(txid: string): Promise<boolean> {
    try {
      const tx = await this.getTransaction(txid);
      return tx ? (tx.confirmations >= CONFIRMATIONS_REQUIRED) : false;
    } catch {
      return false;
    }
  }

  /**
   * Monitor a transaction for confirmations (polling)
   */
  async monitorTransaction(
    txid: string,
    onUpdate: (tx: BTCTransaction) => void,
    maxRetries: number = 120, // 10 minutes with 5s intervals
  ): Promise<BTCTransaction | null> {
    let retries = 0;

    return new Promise((resolve) => {
      const checkTx = async () => {
        const tx = await this.getTransaction(txid);

        if (!tx) {
          if (retries < maxRetries) {
            retries++;
            setTimeout(checkTx, 5000);
          } else {
            resolve(null);
          }
          return;
        }

        onUpdate(tx);

        if (tx.confirmations >= CONFIRMATIONS_REQUIRED) {
          resolve(tx);
        } else if (retries < maxRetries) {
          retries++;
          setTimeout(checkTx, 5000);
        } else {
          resolve(tx);
        }
      };

      checkTx();
    });
  }

  /**
   * Get current BTC price in USD
   */
  async getBTCPrice(): Promise<number> {
    try {
      const response = await axios.get('https://api.coindesk.com/v1/bpi/currentprice/BTC.json');
      return response.data.bpi.USD.rate_float;
    } catch {
      return 0;
    }
  }

  /**
   * Extract output value to our deposit address
   */
  private extractOutputValue(tx: any, address: string): number {
    if (!tx.vout) return 0;
    return tx.vout
      .filter((out: any) => out.scriptpubkey_address === address)
      .reduce((sum: number, out: any) => sum + out.value, 0) / 100_000_000;
  }

  /**
   * Get transaction status
   */
  private getTransactionStatus(tx: any): 'pending' | 'confirmed' | 'failed' {
    if (!tx.status) return 'pending';
    if (tx.status.confirmed) return 'confirmed';
    return 'pending';
  }

  /**
   * Validate BTC address format
   */
  validateAddress(address: string): boolean {
    const patterns = {
      p2pkh: /^[13][a-km-zA-HJ-NP-Z1-9]{25,34}$/, // Legacy (1...)
      p2sh: /^[3][a-km-zA-HJ-NP-Z1-9]{25,34}$/, // Pay-to-script-hash (3...)
      bech32: /^bc1[a-z0-9]{39,59}$/, // Native SegWit (bc1...)
    };

    return Object.values(patterns).some(pattern => pattern.test(address));
  }

  /**
   * Format BTC amount for display
   */
  static formatBTC(satoshis: number): string {
    const btc = satoshis / 100_000_000;
    return btc.toFixed(8).replace(/0+$/, '').replace(/\.$/, '');
  }

  /**
   * Convert BTC to satoshis
   */
  static toSatoshis(btc: number): number {
    return Math.round(btc * 100_000_000);
  }
}

export { BTCService };
export const btcService = new BTCService();
