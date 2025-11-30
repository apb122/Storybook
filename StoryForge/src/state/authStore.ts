import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User, AuthState } from '@/types';

interface AuthStore extends AuthState {
  login: (email: string, password?: string) => Promise<void>;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: {
        id: 'mock-user-1',
        name: 'Alex Writer',
        email: 'alex@storyforge.app',
      }, // Default mock user for development
      isAuthenticated: true,
      isLoading: false,
      error: null,

      login: async (email) => {
        set({ isLoading: true, error: null });
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 500));

        set({
          user: {
            id: 'mock-user-1',
            name: 'Alex Writer',
            email: email,
          },
          isAuthenticated: true,
          isLoading: false,
        });
      },

      logout: () => {
        set({ user: null, isAuthenticated: false });
      },

      updateUser: (updates) => {
        set((state) => ({
          user: state.user ? { ...state.user, ...updates } : null,
        }));
      },
    }),
    {
      name: 'storyforge-auth',
    }
  )
);
