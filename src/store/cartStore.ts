import { create } from "zustand";
import axios from "axios";
import { useUserStore } from "@/store/userStore";

export interface CartItem {
  itemId: {
    _id: string;
    name: string;
    price: number;
    imageUrl?: string;
  };
  quantity: number;
  address: string;
}

interface CartState {
  items: CartItem[];
  fetchCart: () => Promise<void>;
  addToCart: (item: CartItem) => Promise<void>;
  updateItem: (itemId: string, quantity: number) => Promise<void>;
  removeItem: (itemId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  checkout: (address: string) => Promise<void>;
}

export const CartStore = create<CartState>((set) => ({
  items: [],

  fetchCart: async () => {
    const userId = useUserStore.getState().user?._id;
    if (!userId) return;
    const res = await axios.get(`http://localhost:5002/api/cart/${userId}`);
    set({ items: res.data.items });
  },

  addToCart: async (item) => {
    const userId = useUserStore.getState().user?._id;
    if (!userId) return;
    await axios.post(`http://localhost:5002/api/cart/add`, {
      userId,
      itemId: item.itemId._id,
      quantity: item.quantity,
      name: item.itemId.name,
      price: item.itemId.price,
      imageUrl: item.itemId.imageUrl,
    });
    await CartStore.getState().fetchCart();
  },

  updateItem: async (itemId, quantity) => {
    const userId = useUserStore.getState().user?._id;
    if (!userId) return;
    await axios.put(`http://localhost:5002/api/cart/update`, {
      userId,
      itemId,
      quantity,
    });
    await CartStore.getState().fetchCart();
  },

  removeItem: async (itemId) => {
    const userId = useUserStore.getState().user?._id;
    if (!userId) return;
    await axios.delete(`http://localhost:5002/api/cart/remove`, {
      data: { userId, itemId },
    });
    await CartStore.getState().fetchCart();
  },

  clearCart: async () => {
    const userId = useUserStore.getState().user?._id;
    if (!userId) return;
    await axios.delete(`http://localhost:5002/api/cart/clear`, {
      data: { userId },
    });
    await CartStore.getState().fetchCart();
  },

  checkout: async (address) => {
    const userId = useUserStore.getState().user?._id;
    if (!userId) return;
    await axios.post(`http://localhost:5002/api/cart/checkout/${userId}`, {
      address,
    });
    await CartStore.getState().fetchCart();
  },
}));
