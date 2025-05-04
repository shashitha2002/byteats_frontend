import { create } from "zustand";
import { persist } from "zustand/middleware";

interface IRestaurant {
  _id: string;
  name: string;
  location: string;
  owner_name: string;
  email: string;
  password: string;
  mobile: string;
  role: string;
  imageUrl: string;
}

interface RestaurantStore {
  token: string | null;
  restaurant: IRestaurant | null;
  setRestaurantToken: (token: string | null) => void;
  setRestaurant: (restaurant: IRestaurant | null) => void;
  logout: () => void;
}

export const useRestaurantStore = create<RestaurantStore>()(
  persist(
    (set) => ({
      token: null,
      restaurant: null,
      setRestaurantToken: (token) => set({ token }),
      setRestaurant: (restaurant) => set({ restaurant }),
      logout: () => set({ token: null, restaurant: null }),
    }),
    {
      name: "user-storage", // key in localStorage
    }
  )
);
