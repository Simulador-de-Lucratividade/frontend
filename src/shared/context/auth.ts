import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface User {
  accessToken: string;
  refreshToken?: string;
  userData?: {
    name: string;
    email: string;
  };
}

interface AuthState {
  user?: User;
  isLoggedIn: boolean;
  hydrated: boolean;
  setUser: (user: User) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: undefined,
      isLoggedIn: false,
      hydrated: false,
      setUser: (user: User) => set({ user, isLoggedIn: true, hydrated: true }),
      logout: () => set({ user: undefined, isLoggedIn: false, hydrated: true }),
    }),
    {
      name: "auth-store",
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.hydrated = true;
        }
      },
    }
  )
);
