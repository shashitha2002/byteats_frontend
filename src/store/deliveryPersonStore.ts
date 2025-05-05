import { create } from "zustand";
import { persist } from "zustand/middleware";

interface IDeliveryPerson {
    _id : string;
    name : string;
    email : string;
    password : string;
    mobile : string;
    role : string;
    age : number;
    NIC : string;
    vehicleNumber : string;
    currentLocation : string;
    address : string;
    licenseNumber : string;
    isAvailable : boolean;
}

interface DeliveryPersonStore {
  token: string | null;
  deliveryPerson: IDeliveryPerson | null;
  setDeliveryPersonToken: (token: string | null) => void;
  setDeliveryPerson: (deliveryPerson: IDeliveryPerson | null) => void;
  logout: () => void;
}

export const useDeliveryPersonStore = create<DeliveryPersonStore>()(
  persist(
    (set) => ({
      token: null,
      deliveryPerson: null,
      setDeliveryPersonToken: (token) => set({ token }),
      setDeliveryPerson: (deliveryPerson) => set({ deliveryPerson }),
      logout: () => set({ token: null, deliveryPerson: null }),
    }),
    {
      name: "user-storage", // key in localStorage
    }
  )
);
