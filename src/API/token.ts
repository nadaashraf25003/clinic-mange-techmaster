/**
 * Token and Auth Session Manager
 * Handles local storage persistence for JWT tokens and active sessions
 */

const TOKEN_KEY = 'caresync_auth_token';
const USER_ROLE_KEY = 'caresync_user_role';
const USER_SESSION_KEY = 'caresync_user_session';

export const tokenManager = {
  // Token handlers
  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  },

  setToken(token: string): void {
    localStorage.setItem(TOKEN_KEY, token);
  },

  removeToken(): void {
    localStorage.removeItem(TOKEN_KEY);
  },

  hasToken(): boolean {
    return Boolean(this.getToken());
  },

  // Role handlers
  getRole(): 'patient' | 'doctor' | 'admin' | null {
    return localStorage.getItem(USER_ROLE_KEY) as 'patient' | 'doctor' | 'admin' | null;
  },

  setRole(role: 'patient' | 'doctor' | 'admin'): void {
    localStorage.setItem(USER_ROLE_KEY, role);
  },

  removeRole(): void {
    localStorage.removeItem(USER_ROLE_KEY);
  },

  // User session details
  getUserSession<T = any>(): T | null {
    const raw = localStorage.getItem(USER_SESSION_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as T;
    } catch {
      return null;
    }
  },

  setUserSession<T = any>(data: T): void {
    localStorage.setItem(USER_SESSION_KEY, JSON.stringify(data));
  },

  removeUserSession(): void {
    localStorage.removeItem(USER_SESSION_KEY);
  },

  // Clear everything on logout
  clearAuth(): void {
    this.removeToken();
    this.removeRole();
    this.removeUserSession();
  },

  // Header helper
  getAuthorizationHeader(): Record<string, string> {
    const token = this.getToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
  }
};
