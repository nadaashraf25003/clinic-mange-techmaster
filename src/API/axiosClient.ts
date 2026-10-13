/**
 * HTTP Client Wrapper configured for future ASP.NET Core Web API integration
 */
export const BASE_API_URL = import.meta.env.VITE_API_URL || 'http://tech-master-clinic-management.runasp.net/clinic';

export const getAuthHeader = (): Record<string, string> => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// Generic fetch wrapper with standard error handling
export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${BASE_API_URL}${endpoint}`;
  const headers = {
    'Content-Type': 'application/json',
    ...getAuthHeader(),
    ...options.headers,
  };

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Request failed with status ${response.status}`);
    }

    return (await response.json()) as T;
  } catch (error) {
    console.warn(`[API Info] Simulated / offline fallback for ${endpoint}:`, error);
    throw error;
  }
}
