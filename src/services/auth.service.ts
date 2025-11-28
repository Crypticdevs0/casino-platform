import { UserORM, type UserModel } from '@/components/data/orm/orm_user';
import { WalletORM } from '@/components/data/orm/orm_wallet';

/**
 * Web3 Wallet Authentication Service
 * Handles user authentication via crypto wallet signatures
 */

export interface AuthenticatedUser {
  user: UserModel;
  isAuthenticated: boolean;
}

class AuthService {
  private userOrm = UserORM.getInstance();
  private walletOrm = WalletORM.getInstance();

  /**
   * Connect wallet and authenticate user
   * Creates new user if doesn't exist
   */
  async connectWallet(walletAddress: string): Promise<AuthenticatedUser> {
    // Normalize wallet address to lowercase
    const normalizedAddress = walletAddress.toLowerCase();

    // Check if user exists
    const existingUsers = await this.userOrm.getUserByWalletAddress(normalizedAddress);

    if (existingUsers.length > 0) {
      const user = existingUsers[0];

      // Update last login
      const updatedUser = await this.userOrm.setUserByWalletAddress(normalizedAddress, {
        ...user,
        last_login_at: Math.floor(Date.now() / 1000).toString(),
      });

      return {
        user: updatedUser[0],
        isAuthenticated: true,
      };
    }

    // Create new user
    const newUsers = await this.userOrm.insertUser([
      {
        wallet_address: normalizedAddress,
        kyc_level: 0,
        is_banned: false,
        last_login_at: Math.floor(Date.now() / 1000).toString(),
      } as UserModel,
    ]);

    const newUser = newUsers[0];

    // Initialize wallets for supported currencies
    const currencies = ['ETH', 'BTC', 'USDT'];
    await this.walletOrm.insertWallet(
      currencies.map((currency) => ({
        user_id: newUser.id,
        currency,
        available_balance: '0',
        locked_balance: '0',
      } as any))
    );

    return {
      user: newUser,
      isAuthenticated: true,
    };
  }

  /**
   * Connect Bitcoin wallet and authenticate user
   * Uses BTC mainnet deposit address
   */
  async connectBTCWallet(btcAddress: string): Promise<AuthenticatedUser> {
    // Validate BTC address format
    const { btcService, BTCService } = await import('@/services/btc.service');
    if (!BTCService.validateAddress(btcAddress)) {
      throw new Error('Invalid BTC address format');
    }

    // For BTC, we use the deposit address as the wallet identifier
    // This allows multiple users to fund the same casino address
    const existingUsers = await this.userOrm.getUserByWalletAddress(btcAddress.toLowerCase());

    // For BTC flow, each connection gets a fresh user (since the address is shared)
    // Or we can link by IP/browser fingerprint in production
    // For now, create a new user or get existing
    if (existingUsers.length > 0) {
      const user = existingUsers[0];
      const updatedUser = await this.userOrm.setUserByWalletAddress(btcAddress.toLowerCase(), {
        ...user,
        last_login_at: Math.floor(Date.now() / 1000).toString(),
      });

      return {
        user: updatedUser[0],
        isAuthenticated: true,
      };
    }

    const newUsers = await this.userOrm.insertUser([
      {
        wallet_address: btcAddress.toLowerCase(),
        kyc_level: 0,
        is_banned: false,
        last_login_at: Math.floor(Date.now() / 1000).toString(),
      } as UserModel,
    ]);

    const newUser = newUsers[0];

    // Initialize wallet for BTC only
    await this.walletOrm.insertWallet([
      {
        user_id: newUser.id,
        currency: 'BTC',
        available_balance: '0',
        locked_balance: '0',
      } as any,
    ]);

    return {
      user: newUser,
      isAuthenticated: true,
    };
  }

  /**
   * Disconnect wallet
   */
  async disconnectWallet(): Promise<void> {
    // In a real implementation, this would clear session/tokens
    // For this demo, we just return
    return;
  }

  /**
   * Get user by wallet address
   */
  async getUserByWallet(walletAddress: string): Promise<UserModel | null> {
    const normalizedAddress = walletAddress.toLowerCase();
    const users = await this.userOrm.getUserByWalletAddress(normalizedAddress);
    return users.length > 0 ? users[0] : null;
  }

  /**
   * Check if user is banned
   */
  async isUserBanned(userId: string): Promise<boolean> {
    const users = await this.userOrm.getUserById(userId);
    return users.length > 0 ? users[0].is_banned : true;
  }

  /**
   * Get user KYC level
   */
  async getUserKycLevel(userId: string): Promise<number> {
    const users = await this.userOrm.getUserById(userId);
    return users.length > 0 ? users[0].kyc_level : 0;
  }

  /**
   * Update user KYC level
   * In a real system this would be driven by an external KYC provider.
   */
  async setUserKycLevel(userId: string, level: number): Promise<UserModel> {
    const users = await this.userOrm.getUserById(userId);
    if (users.length === 0) {
      throw new Error('User not found');
    }

    const user = users[0];
    const [updated] = await this.userOrm.setUserById(userId, {
      ...user,
      kyc_level: level,
    });

    return updated;
  }
}

export const authService = new AuthService();
