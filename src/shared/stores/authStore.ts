import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { User } from '@/entities/user/types';

const clearLegacyToken = () => {
  try {
    localStorage.removeItem('token');
  } catch {
    // ignore storage errors
  }
};

const parseJwt = (token: string) => {
  const parts = token.split('.');
  if (parts.length !== 3) return null;
  try {
    const payload = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    const decoded = atob(payload);
    return JSON.parse(decoded) as { exp?: number };
  } catch {
    return null;
  }
};

export const isTokenValid = (token: string | null | undefined) => {
  if (!token) return false;
  const payload = parseJwt(token);
  if (!payload || typeof payload.exp !== 'number') return false;
  // exp is seconds since epoch, add small skew
  return payload.exp * 1000 > Date.now() + 30_000;
};

interface AuthState {
  user: User | null;
  token: string | null; 
  isAuthenticated: boolean;
  login: (user: User, token: string) => void; 
  setUser: (user: User) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      login: (user, token) => {
        clearLegacyToken();
        set({ 
          user, 
          token, 
          isAuthenticated: true 
        });
      },
      setUser: (user) => set({ user }),
      logout: () => {
        clearLegacyToken();
        set({ 
          user: null, 
          token: null, 
          isAuthenticated: false 
        });
      },
    }),
    {
      name: 'auth-storage', 
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export const getAuthorizedUser = (): User => {
  const { user } = useAuthStore.getState();
  
  if (!user) {
    throw new Error("Unauthorized: User is not logged in.");
  }
  
  return user;
};

export const getAuthToken = (): string | null => {
  return useAuthStore.getState().token;
};

export const logoutAndClear = () => {
  clearLegacyToken();
  useAuthStore.getState().logout();
};

export const clearLegacyAuthToken = clearLegacyToken;
