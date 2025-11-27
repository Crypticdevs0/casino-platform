let axios: any;
let AxiosInstance: any;
let AxiosRequestConfig: any;
let AxiosResponse: any;

try {
  const axiosModule = require('axios');
  axios = axiosModule.default || axiosModule;
  AxiosInstance = axios;
  AxiosRequestConfig = axios;
  AxiosResponse = axios;
} catch (e) {
  // axios not installed, create stub
  axios = {
    create: () => ({
      interceptors: { request: { use: () => {} }, response: { use: () => {} } },
      get: () => Promise.resolve({ data: {} }),
      post: () => Promise.resolve({ data: {} }),
      put: () => Promise.resolve({ data: {} }),
      delete: () => Promise.resolve({ data: {} }),
      patch: () => Promise.resolve({ data: {} }),
      request: () => Promise.resolve({ data: {} }),
    }),
  };
  AxiosInstance = undefined;
  AxiosRequestConfig = undefined;
  AxiosResponse = undefined;
}

import { toast } from 'sonner';

// Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
  meta?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ApiConfig {
  skipAuth?: boolean;
  skipErrorToast?: boolean;
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'HEAD';
  url?: string;
  data?: any;
  params?: any;
  headers?: Record<string, any>;
}

class ApiService {
  private api: any;
  private static instance: ApiService;

  private constructor() {
    this.api = axios.create({
      baseURL: import.meta.env.VITE_API_URL || '/api',
      timeout: 30000, // 30 seconds
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });

    // Request interceptor
    this.api.interceptors.request.use(
      (config: any) => {
        // Add auth token if available
        const token = localStorage.getItem('auth_token');
        if (token && !config.skipAuth) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error: any) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.api.interceptors.response.use(
      (response: any) => {
        // Handle successful responses
        if (response.data && !response.data.success) {
          return Promise.reject(response.data.error);
        }
        return response;
      },
      (error: any) => {
        // Handle errors
        if (error.response) {
          // Server responded with a status code outside 2xx
          const { status, data } = error.response;
          
          // Handle specific status codes
          if (status === 401) {
            // Unauthorized - redirect to login
            this.handleUnauthorized();
          } else if (status === 403) {
            // Forbidden - show access denied
            toast.error('You do not have permission to perform this action');
          } else if (status >= 500) {
            // Server error
            toast.error('Server error. Please try again later.');
          }
          
          return Promise.reject(data?.error || { message: 'An error occurred' });
        } else if (error.request) {
          // Request was made but no response received
          toast.error('Network error. Please check your connection.');
          return Promise.reject({ message: 'Network error' });
        } else {
          // Something happened in setting up the request
          console.error('Request error:', error.message);
          return Promise.reject({ message: 'Request error' });
        }
      }
    );
  }

  public static getInstance(): ApiService {
    if (!ApiService.instance) {
      ApiService.instance = new ApiService();
    }
    return ApiService.instance;
  }

  private handleUnauthorized() {
    // Clear auth data
    localStorage.removeItem('auth_token');
    // Redirect to login page
    window.location.href = '/login?session_expired=true';
  }

  // Auth API
  public async login(email: string, password: string): Promise<{ token: string; user: any }> {
    const response = await this.api.post<ApiResponse<{ token: string; user: any }>>('/auth/login', {
      email,
      password,
    });
    return response.data.data!;
  }

  public async register(userData: {
    email: string;
    password: string;
    username: string;
    currency: string;
  }): Promise<{ token: string; user: any }> {
    const response = await this.api.post<ApiResponse<{ token: string; user: any }>>(
      '/auth/register',
      userData
    );
    return response.data.data!;
  }

  // Games API
  public async getGames(params?: {
    category?: string;
    provider?: string;
    search?: string;
    page?: number;
    limit?: number;
  }): Promise<{ games: any[]; meta: any }> {
    const response = await this.api.get<ApiResponse<{ games: any[]; meta: any }>>('/games', {
      params,
    });
    return response.data.data!;
  }

  public async getGameById(id: string): Promise<any> {
    const response = await this.api.get<ApiResponse<any>>(`/games/${id}`);
    return response.data.data!;
  }

  // Wallet API
  public async getWallet(): Promise<{ balance: number; currency: string }> {
    const response = await this.api.get<ApiResponse<{ balance: number; currency: string }>>(
      '/wallet'
    );
    return response.data.data!;
  }

  public async deposit(amount: number, method: string): Promise<{ transactionId: string }> {
    const response = await this.api.post<ApiResponse<{ transactionId: string }>>('/wallet/deposit', {
      amount,
      method,
    });
    return response.data.data!;
  }

  public async withdraw(amount: number, address: string): Promise<{ transactionId: string }> {
    const response = await this.api.post<ApiResponse<{ transactionId: string }>>(
      '/wallet/withdraw',
      {
        amount,
        address,
      }
    );
    return response.data.data!;
  }

  // Game Session API
  public async createGameSession(gameId: string, bet: number): Promise<{ sessionId: string }> {
    const response = await this.api.post<ApiResponse<{ sessionId: string }>>('/game-sessions', {
      gameId,
      bet,
    });
    return response.data.data!;
  }

  public async endGameSession(sessionId: string, result: any): Promise<void> {
    await this.api.put(`/game-sessions/${sessionId}/end`, { result });
  }

  // User API
  public async getProfile(): Promise<any> {
    const response = await this.api.get<ApiResponse<any>>('/users/me');
    return response.data.data!;
  }

  public async updateProfile(data: {
    username?: string;
    email?: string;
    avatar?: string;
  }): Promise<any> {
    const response = await this.api.put<ApiResponse<any>>('/users/me', data);
    return response.data.data!;
  }

  // Helper method for custom requests
  public async request<T = any>(config: ApiConfig): Promise<T> {
    const response = await this.api.request<ApiResponse<T>>(config);
    return response.data.data!;
  }
}

export const api = ApiService.getInstance();

// Export commonly used HTTP methods with proper typing
export const http = {
  get: <T = any>(url: string, config?: ApiConfig) => api.request<T>({ ...config, method: 'GET', url }),
  post: <T = any>(url: string, data?: any, config?: ApiConfig) =>
    api.request<T>({ ...config, method: 'POST', url, data }),
  put: <T = any>(url: string, data?: any, config?: ApiConfig) =>
    api.request<T>({ ...config, method: 'PUT', url, data }),
  delete: <T = any>(url: string, config?: ApiConfig) =>
    api.request<T>({ ...config, method: 'DELETE', url }),
  patch: <T = any>(url: string, data?: any, config?: ApiConfig) =>
    api.request<T>({ ...config, method: 'PATCH', url, data }),
};
