// Auth utility functions for CourseHive
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

interface AuthTokens {
  accessToken: string;
  refreshToken?: string;
  expiresIn: number;
}

interface User {
  id: string;
  email: string;
  username: string;
  avatar_url: string | null;
  field: string | null;
  type: string | null;
  xp: number;
  streak: number;
}

// Token storage keys
const ACCESS_TOKEN_KEY = 'coursehive_access_token';
const TOKEN_EXPIRY_KEY = 'coursehive_token_expiry';

// Store tokens in localStorage
export function setTokens(tokens: AuthTokens): void {
  if (typeof window === 'undefined') return;
  
  localStorage.setItem(ACCESS_TOKEN_KEY, tokens.accessToken);
  const expiryTime = Date.now() + (tokens.expiresIn * 1000);
  localStorage.setItem(TOKEN_EXPIRY_KEY, expiryTime.toString());
}

// Get access token from localStorage
export function getAccessToken(): string | null {
  if (typeof window === 'undefined') return null;
  
  const token = localStorage.getItem(ACCESS_TOKEN_KEY);
  const expiry = localStorage.getItem(TOKEN_EXPIRY_KEY);
  
  if (!token || !expiry) return null;
  
  // Check if token is expired (with 30 second buffer)
  if (Date.now() >= parseInt(expiry) - 30000) {
    // Token expired, try to refresh
    return null;
  }
  
  return token;
}

// Clear tokens from localStorage
export function clearTokens(): void {
  if (typeof window === 'undefined') return;
  
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(TOKEN_EXPIRY_KEY);
}

// Check if user is authenticated
export function isAuthenticated(): boolean {
  return !!getAccessToken();
}

// Get Google OAuth URL
export function getGoogleAuthUrl(field?: string, type?: string, redirectUrl?: string): string {
  const url = new URL(`${API_URL}/api/auth/google`);
  if (field) url.searchParams.set('field', field);
  if (type) url.searchParams.set('type', type);
  if (redirectUrl) url.searchParams.set('redirect_url', redirectUrl);
  return url.toString();
}

// Get GitHub OAuth URL
export function getGithubAuthUrl(field?: string, type?: string, redirectUrl?: string): string {
  const url = new URL(`${API_URL}/api/auth/github`);
  if (field) url.searchParams.set('field', field);
  if (type) url.searchParams.set('type', type);
  if (redirectUrl) url.searchParams.set('redirect_url', redirectUrl);
  return url.toString();
}

// Refresh access token
export async function refreshAccessToken(): Promise<AuthTokens | null> {
  try {
    const response = await fetch(`${API_URL}/api/auth/refresh`, {
      method: 'POST',
      credentials: 'include', // Send cookies
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      clearTokens();
      return null;
    }

    const data = await response.json();
    
    if (data.success && data.data) {
      const tokens: AuthTokens = {
        accessToken: data.data.access_token,
        expiresIn: data.data.expires_in,
      };
      setTokens(tokens);
      return tokens;
    }

    return null;
  } catch (error) {
    console.error('Failed to refresh token:', error);
    clearTokens();
    return null;
  }
}

// Get current user
export async function getCurrentUser(): Promise<User | null> {
  const token = getAccessToken();
  
  if (!token) {
    // Try to refresh
    const newTokens = await refreshAccessToken();
    if (!newTokens) return null;
  }

  try {
    const response = await fetch(`${API_URL}/api/auth/me`, {
      headers: {
        'Authorization': `Bearer ${getAccessToken()}`,
      },
    });

    if (!response.ok) {
      if (response.status === 401) {
        // Token invalid, try refresh
        const newTokens = await refreshAccessToken();
        if (newTokens) {
          // Retry with new token
          const retryResponse = await fetch(`${API_URL}/api/auth/me`, {
            headers: {
              'Authorization': `Bearer ${newTokens.accessToken}`,
            },
          });
          if (retryResponse.ok) {
            const data = await retryResponse.json();
            return data.data;
          }
        }
      }
      clearTokens();
      return null;
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Failed to get current user:', error);
    return null;
  }
}

// Logout
export async function logout(): Promise<void> {
  const token = getAccessToken();
  
  try {
    await fetch(`${API_URL}/api/auth/logout`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Authorization': token ? `Bearer ${token}` : '',
      },
    });
  } catch (error) {
    console.error('Logout error:', error);
  } finally {
    clearTokens();
  }
}

// API request helper with auth
export async function authFetch(
  endpoint: string,
  options: RequestInit = {}
): Promise<Response> {
  let token = getAccessToken();
  
  if (!token) {
    const newTokens = await refreshAccessToken();
    token = newTokens?.accessToken || null;
  }
  
  if (!token) {
    throw new Error('Not authenticated');
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      ...options.headers,
      'Authorization': `Bearer ${token}`,
    },
  });

  // Handle 401 - try refresh once
  if (response.status === 401) {
    const newTokens = await refreshAccessToken();
    if (newTokens) {
      return fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers: {
          ...options.headers,
          'Authorization': `Bearer ${newTokens.accessToken}`,
        },
      });
    }
    throw new Error('Session expired');
  }

  return response;
}
