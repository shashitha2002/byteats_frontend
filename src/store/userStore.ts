import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface IUser {
  _id: string;
  username: string;
  email: string;
  role?: string;
}

interface UserStore {
  token: string | null;
  user: IUser | null;
  setToken: (token: string | null) => void;
  setUser: (user: IUser | null) => void;
  logout: () => void;
}

export const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      setToken: (token) => set({ token }),
      setUser: (user) => set({ user }),
      logout: () => set({ token: null, user: null }),
    }),
    {
      name: 'user-storage', // key in localStorage
    }
  )
);
