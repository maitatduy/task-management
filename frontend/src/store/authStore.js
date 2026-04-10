import { create } from "zustand";

export const useAuthStore = create((set) => ({
  user: null, // Stores the user info { _id, name, email }
  isAuthenticated: false,

  setUser: (user) => set({ user, isAuthenticated: !!user }),
  clearAuth: () => set({ user: null, isAuthenticated: false }),
}));
