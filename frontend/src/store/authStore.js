import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useAuthStore = create(
  persist(
    (set) => ({
      user: null, // Stores the user info { _id, name, email }
      isAuthenticated: false,

      setUser: (user) => set({ user, isAuthenticated: !!user }),
      clearAuth: () => set({ user: null, isAuthenticated: false }),
    }),
    {
      name: "auth-storage", // name of the item in the storage (must be unique)
    }
  )
);
