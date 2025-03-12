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
  setUser: (user: User) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: undefined,
      isLoggedIn: false,
      setUser: (user: User) => set({ user, isLoggedIn: true }),
      logout: () => set({ user: undefined, isLoggedIn: false }),
    }),
    {
      name: "auth-store",
    }
  )
);
