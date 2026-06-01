import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiMe } from '../services/api';

interface User {
  id: number;
  name: string;
  email: string;
  is_premium: boolean;
  materia: string | null;
  nivel: string | null;
  meta: string | null;
  horas_dia: string | null;
  guia_id: string | null;
  streak: number;
}

interface AuthStore {
  token: string | null;
  user: User | null;
  isLoading: boolean;
  setToken: (token: string) => void;
  setUser: (user: User) => void;
  logout: () => void;
  fetchMe: (token: string) => Promise<void>;
  initAuth: () => Promise<void>;
  touchLastActive: () => Promise<void>;
}

export const useAuthStore = create<AuthStore>((set) => ({
  token: null,
  user: null,
  isLoading: false,

  setToken: (token) => {
    set({ token });
    (async () => {
      try {
        if (token) {
          await AsyncStorage.setItem('authToken', token);
          await AsyncStorage.setItem('lastActive', new Date().toISOString());
        } else {
          await AsyncStorage.removeItem('authToken');
          await AsyncStorage.removeItem('lastActive');
        }
      } catch {}
    })();
  },
  setUser: (user) => set({ user }),
  logout: () => {
    set({ token: null, user: null });
    (async () => {
      try {
        await AsyncStorage.removeItem('authToken');
        await AsyncStorage.removeItem('lastActive');
      } catch {}
    })();
  },

  fetchMe: async (token) => {
    set({ isLoading: true });
    try {
      const user = await apiMe(token);
      set({ user, token });
    } catch (e) {
      set({ token: null, user: null });
    } finally {
      set({ isLoading: false });
    }
  },
  initAuth: async () => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      const last = await AsyncStorage.getItem('lastActive');
      if (!token) return;
      if (last) {
        const lastDate = new Date(last);
        const now = new Date();
        const diffMs = now.getTime() - lastDate.getTime();
        const diffDays = diffMs / (1000 * 60 * 60 * 24);
        if (diffDays > 3) {
          // session expired due to inactivity
          await AsyncStorage.removeItem('authToken');
          await AsyncStorage.removeItem('lastActive');
          await AsyncStorage.setItem('sessionExpired', 'true');
          set({ token: null, user: null });
          return;
        }
      }
      // token still valid
      set({ token });
      // refresh user data
      try {
        const user = await apiMe(token);
        set({ user });
        await AsyncStorage.setItem('lastActive', new Date().toISOString());
      } catch {
        set({ token: null, user: null });
      }
    } catch (e) {
      // ignore
    }
  },
  touchLastActive: async () => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      if (token) {
        await AsyncStorage.setItem('lastActive', new Date().toISOString());
      }
    } catch {}
  },
}));