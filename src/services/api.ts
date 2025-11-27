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

export interface ApiConfig extends RequestInit {
  skipAuth?: boolean;
  skipErrorToast?: boolean;
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'HEAD';
  url?: string;
  data?: any;
  params?: any;
  headers?: Record<string, any>;
}

class ApiService {
  private static instance: ApiService;
  private baseURL: string;

  private constructor() {
    this.baseURL = import.meta.env.VITE_API_URL || '/api';
  }

  static getInstance(): ApiService {
    if (!ApiService.instance) {
      ApiService.instance = new ApiService();
    }
    return ApiService.instance;
  }

  async request<T = any>(url: string, config?: ApiConfig): Promise<T> {
    try {
      const finalUrl = url.startsWith('http') ? url : `${this.baseURL}${url}`;
      
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...config?.headers,
      };

      // Add auth token if available
      if (!config?.skipAuth) {
        const token = localStorage.getItem('auth_token');
        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
        }
      }

      const response = await fetch(finalUrl, {
        ...config,
        headers,
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({
          message: response.statusText,
        }));
        
        if (!config?.skipErrorToast) {
          toast.error(error.message || `API Error: ${response.status}`);
        }
        
        throw new Error(error.message || `HTTP ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      if (!config?.skipErrorToast) {
        toast.error(
          error instanceof Error ? error.message : 'An error occurred'
        );
      }
      throw error;
    }
  }

  get<T = any>(url: string, config?: ApiConfig): Promise<T> {
    return this.request<T>(url, { ...config, method: 'GET' });
  }

  post<T = any>(url: string, data?: any, config?: ApiConfig): Promise<T> {
    return this.request<T>(url, {
      ...config,
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  put<T = any>(url: string, data?: any, config?: ApiConfig): Promise<T> {
    return this.request<T>(url, {
      ...config,
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  patch<T = any>(url: string, data?: any, config?: ApiConfig): Promise<T> {
    return this.request<T>(url, {
      ...config,
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  delete<T = any>(url: string, config?: ApiConfig): Promise<T> {
    return this.request<T>(url, { ...config, method: 'DELETE' });
  }
}

export const api = ApiService.getInstance();

// Export commonly used HTTP methods with proper typing
export const http = {
  get: <T = any>(url: string, config?: ApiConfig) => api.get<T>(url, config),
  post: <T = any>(url: string, data?: any, config?: ApiConfig) =>
    api.post<T>(url, data, config),
  put: <T = any>(url: string, data?: any, config?: ApiConfig) =>
    api.put<T>(url, data, config),
  delete: <T = any>(url: string, config?: ApiConfig) =>
    api.delete<T>(url, config),
  patch: <T = any>(url: string, data?: any, config?: ApiConfig) =>
    api.patch<T>(url, data, config),
};
