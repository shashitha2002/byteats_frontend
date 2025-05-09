"use client";

import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { useDeliveryPersonStore } from "@/store/deliveryPersonStore";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface OrderItem {
  _id: string;
  itemId: string;
  quantity: number;
  name: string;
  price: number;
}

interface Order {
  _id: string;
  userId: string;
  items: OrderItem[];
  totalPrice: number;
  status: string;
  createdAt: string;
  updatedAt: string;
  deliveryPersonId?: string;
}

const DeliveryPersonHomePage = () => {
  const [availableOrders, setAvailableOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { deliveryPerson } = useDeliveryPersonStore();
  const [socket, setSocket] = useState<any>(null);

  useEffect(() => {
    // Initialize socket connection
    const socketInstance = io("http://localhost:5001", {
      withCredentials: true,
    });

    socketInstance.on("connect", () => {
      console.log("Connected to Socket.IO server");
    });

    socketInstance.on("disconnect", () => {
      console.log("Disconnected from Socket.IO server");
    });

    setSocket(socketInstance);

    // Fetch available orders
    fetchAvailableOrders();

    // Cleanup on unmount
    return () => {
      socketInstance.disconnect();
    };
  }, []);

  // Listen for real-time updates
  useEffect(() => {
    if (socket) {
      socket.on("order_status_update", (data: any) => {
        console.log("Order status update received:", data);
        // Fetch available orders after the status update
        fetchAvailableOrders();
      });
    }

    return () => {
      if (socket) {
        socket.off("order_status_update");
      }
    };
  }, [socket]);

  const fetchAvailableOrders = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:5001/api/order/available");
      if (response.ok) {
        const data = await response.json();
        setAvailableOrders(data);
      } else {
        setError("Failed to fetch available orders");
      }
    } catch (err) {
      setError("Error connecting to server");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const acceptOrder = async (orderId: string) => {
    if (!deliveryPerson?._id) {
      setError("You must be logged in to accept orders");
      return;
    }

    try {
      const response = await fetch(`http://localhost:5001/api/order/${orderId}/accept`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ deliveryPersonId: deliveryPerson._id }),
      });

      if (response.ok) {
        // Update the local state by removing the accepted order
        setAvailableOrders((prevOrders) => prevOrders.filter((order) => order._id !== orderId));
        console.log("Order accepted successfully");
      } else {
        const errorData = await response.json();
        setError(errorData.message || "Failed to accept order");
      }
    } catch (err) {
      setError("Error connecting to server");
      console.error(err);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading available orders...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Available Orders</h1>
      
      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4">
          <p>{error}</p>
        </div>
      )}
      
      {availableOrders.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">No available orders at the moment</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {availableOrders.map((order) => (
            <Card key={order._id} className="shadow-md">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">Order #{order._id.slice(-6)}</h3>
                  <div className="px-2 py-1 rounded-full bg-blue-100 text-blue-800 text-sm">
                    {order.status}
                  </div>
                </div>
                <p className="text-sm text-gray-500">
                  Placed on {formatDate(order.updatedAt)}
                </p>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-2">
                  {order.items.map((item) => (
                    <div key={item._id} className="flex justify-between">
                      <span>{item.quantity} x {item.name}</span>
                      <span>${(item.price / 100).toFixed(2)}</span>
                    </div>
                  ))}
                  <div className="border-t pt-2 mt-4 font-bold flex justify-between">
                    <span>Total</span>
                    <span>${(order.totalPrice / 100).toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
              
              <CardFooter>
                <Button 
                  className="w-full bg-green-600 hover:bg-green-700 text-white" 
                  onClick={() => acceptOrder(order._id)}
                >
                  Accept Order
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default DeliveryPersonHomePage;
