/**
 * HTTP Client Configuration and Request Handler
 */
import { API_BASE_URL } from './URLs';
import { tokenManager } from './token';

export interface RequestConfig extends RequestInit {
  timeout?: number;
  skipAuth?: boolean;
}

export interface ApiError {
  status: number;
  message: string;
  code?: string;
  errors?: Record<string, string[]>;
}

export class AppApiError extends Error {
  status: number;
  code?: string;
  errors?: Record<string, string[]>;

  constructor(status: number, message: string, code?: string, errors?: Record<string, string[]>) {
    super(message);
    this.name = 'AppApiError';
    this.status = status;
    this.code = code;
    this.errors = errors;
  }
}

/**
 * Core HTTP client function for dispatching requests to .NET Backend
 */
export async function http<T>(endpoint: string, config: RequestConfig = {}): Promise<T> {
  const { timeout = 15000, skipAuth = false, headers: customHeaders, ...restConfig } = config;

  const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint}`;

  const defaultHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  };

  if (!skipAuth) {
    Object.assign(defaultHeaders, tokenManager.getAuthorizationHeader());
  }

  const mergedHeaders = {
    ...defaultHeaders,
    ...customHeaders,
  };

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      ...restConfig,
      headers: mergedHeaders,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    // Handle 204 No Content
    if (response.status === 204) {
      return {} as T;
    }

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      const errorMessage =
        data?.message ||
        data?.title ||
        (typeof data?.detail === 'string' ? data.detail : null) ||
        (typeof data?.error === 'string' ? data.error : null) ||
        (data?.error?.message ? data.error.message : null) ||
        `Request failed with status ${response.status}`;

      throw new AppApiError(
        response.status,
        errorMessage,
        data?.code || data?.error?.code,
        data?.errors
      );
    }

    return data as T;
  } catch (err: any) {
    clearTimeout(timeoutId);

    if (err instanceof AppApiError) {
      throw err;
    }

    if (err.name === 'AbortError') {
      throw new AppApiError(408, 'Request timed out. Please check your connection.');
    }

    throw new AppApiError(
      0,
      err.message || 'Network connection failed. Could not reach server.'
    );
  }
}

export const apiClient = {
  get: <T>(url: string, config?: RequestConfig) => http<T>(url, { method: 'GET', ...config }),
  post: <T>(url: string, body?: any, config?: RequestConfig) =>
    http<T>(url, { method: 'POST', body: body ? JSON.stringify(body) : undefined, ...config }),
  put: <T>(url: string, body?: any, config?: RequestConfig) =>
    http<T>(url, { method: 'PUT', body: body ? JSON.stringify(body) : undefined, ...config }),
  delete: <T>(url: string, config?: RequestConfig) =>
    http<T>(url, { method: 'DELETE', ...config }),
};
