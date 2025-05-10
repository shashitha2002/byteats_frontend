'use client';
import Image from "next/image";
import { useEffect, useState } from "react";
import { CartStore } from "@/store/cartStore";
import { Trash2 } from 'lucide-react';
import { useUserStore } from "@/store/userStore";
import { toast, Toaster } from "react-hot-toast";
import Link from "next/link";
export default function CartPage() {
  const { items: cartItems, fetchCart, updateItem, removeItem, clearCart, checkout } = CartStore();
  const [address, setAddress] = useState<string>("");

  const userId = useUserStore((state) => state.user?._id);

  useEffect(() => {
    if (userId) fetchCart();
  }, [userId, fetchCart]);

  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.itemId.price * item.quantity,
    0
  );
  const taxes = subtotal * 0.1;
  const total = subtotal + taxes;

  if (!userId) {
    return <div className="text-center p-6">Loading user data...</div>;
  }

  return (
    <div className="p-6 max-w-7xl mx-auto bg-white min-h-screen">
      <Toaster/>
      <h1 className="text-3xl font-bold mb-8 text-center text-gray-800">
        Your Cart ({cartItems.length} {cartItems.length === 1 ? "item" : "items"})
      </h1>

      {cartItems.length === 0 ? (
        <div className="text-center text-gray-500">Your cart is empty.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Left - Items List */}
          <div className="md:col-span-2 space-y-6">
            {cartItems.map((item, idx) => (
              <div
                key={idx}
                className="flex items-start bg-gray-50 p-4 rounded-xl shadow-sm hover:shadow transition-all duration-300"
              >
                <div className="w-24 h-24 flex-shrink-0 bg-white border rounded overflow-hidden">
                  {item.itemId.imageUrl ? (
                    <Image
                      src={item.itemId.imageUrl}
                      alt={item.itemId.name}
                      width={50}
                      height={50}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
                      No Image
                    </div>
                  )}
                </div>

                <div className="flex-1 ml-6">
                  <h2 className="font-semibold text-lg text-gray-800">
                    {item.itemId.name}
                  </h2>
                  <p className="text-sm text-gray-500">Rs. {item.itemId.price}</p>

                  <div className="flex items-center mt-3 space-x-4">
                    <div className="flex items-center border rounded overflow-hidden">
                      <button
                        className="px-3 py-1 bg-gray-100 hover:bg-gray-200 transition"
                        onClick={() => updateQuantity(item.itemId._id, item.quantity - 1)}
                      >
                        -
                      </button>
                      <input
                        type="text"
                        value={item.quantity}
                        className="w-10 text-center text-gray-800 bg-white border-none outline-none"
                        readOnly
                      />
                      <button
                        className="px-3 py-1 bg-gray-100 hover:bg-gray-200 transition"
                        onClick={() => updateQuantity(item.itemId._id, item.quantity + 1)}
                      >
                        +
                      </button>
                    </div>

                    <p className="text-gray-700 font-medium">
                      Rs. {(item.itemId.price * item.quantity).toFixed(2)}
                    </p>

                    <button
                      className="ml-auto text-red-600 hover:text-red-700 transition"
                      onClick={() => removeItemFromCart(item.itemId._id)}
                      title="Remove Item"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}

            <button
              onClick={clearCartItems}
              className="flex items-center justify-center w-full mt-4 bg-red-600 hover:bg-red-700 text-white font-medium py-2 rounded-lg shadow-md transition space-x-2"
            >
              <Trash2 className="w-5 h-5" />
              <span>Clear Cart</span>
            </button>
          </div>

          {/* Right - Summary */}
          <div className="border p-6 rounded-xl shadow-lg bg-gray-50 sticky top-10 h-fit">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Order Summary</h2>
            <div className="space-y-3 text-gray-700">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>Rs. {subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Taxes (10%)</span>
                <span>Rs. {taxes.toFixed(2)}</span>
              </div>
              <hr />
              <div className="flex justify-between font-bold text-lg">
                <span>Total</span>
                <span>Rs. {total.toFixed(2)}</span>
              </div>
            </div>

            {/* Delivery Address Input */}
            <div className="mt-6">
              <label htmlFor="address" className="block text-gray-700 font-medium mb-1">
                Delivery Address
              </label>
              <textarea
                id="address"
                rows={3}
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400"
                placeholder="Enter your delivery address here..."
                required
              />
            </div>
            <Link href={`/user/payment/checkout?total=${total}`}>
            <button 
              onClick={handleCheckout}
              className="w-full mt-6 bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-semibold transition shadow-md"
            >
              Proceed to Checkout
            </button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );

  // === Handlers ===
  async function updateQuantity(itemId: string, newQuantity: number) {
    if (newQuantity < 1 || !userId) return;
    try {
      await updateItem(itemId, newQuantity);
      toast.success("Quantity updated successfully!");
    } catch (err) {
      console.error("Failed to update quantity:", err);
      toast.error("Failed to update quantity. Please try again.");
    }
  }

  async function removeItemFromCart(itemId: string) {
    if (!confirm("Remove this item from your cart?") || !userId) return;
    try {
      await removeItem(itemId);
      toast.success("Item removed from cart!");
    } catch (err) {
      console.error("Failed to remove item:", err);
      toast.error("Failed to remove item. Please try again.");
    }
  }

  async function clearCartItems() {
    if (!confirm("Are you sure you want to clear the cart?") || !userId) return;
    try {
      await clearCart();
      toast.success("Cart cleared successfully!");
    } catch (err) {
      console.error("Failed to clear cart:", err);
      toast.error("Failed to clear cart. Please try again.");
    }
  }

  async function handleCheckout() {
    if (!userId) {
      toast.error("User not found. Please log in.");
      return;
    }
  
    if (!address.trim()) {
      toast.error("Please enter a delivery address.");
      return;
    }
  
    const confirmed = confirm("Are you sure you want to place the order?");
    if (!confirmed) {
      toast("Order cancelled.");
      return;
    }
  
    try {
      await checkout(address);
      toast.success("Order placed successfully!");
    } catch (err) {
      console.error("Checkout failed:", err);
      toast.error("Checkout failed. Please try again.");
    }
  }
  
}
