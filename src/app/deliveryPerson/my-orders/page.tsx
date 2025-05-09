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

const MyOrdersPage = () => {
  const [myOrders, setMyOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { deliveryPerson } = useDeliveryPersonStore();
  const [socket, setSocket] = useState<any>(null);

  // Initialize socket connection on component mount
  useEffect(() => {
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

    // Fetch my orders
    if (deliveryPerson?._id) {
      fetchMyOrders();
    } else {
      setLoading(false);
    }

    // Cleanup on unmount
    return () => {
      socketInstance.disconnect();
    };
  }, [deliveryPerson]);

  // Real-time updates from socket
  useEffect(() => {
    if (socket) {
      socket.on("order_status_update", (data: any) => {
        console.log("Order status update received:", data);
        fetchMyOrders();
      });
    }

    return () => {
      if (socket) {
        socket.off("order_status_update");
      }
    };
  }, [socket]);

  // Fetch my orders for the logged-in delivery person
  const fetchMyOrders = async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:5001/api/order/delivery-person/${deliveryPerson?._id}`);
      if (response.ok) {
        const data = await response.json();
        setMyOrders(data);
        
        // Join socket rooms for each order
        if (socket && data.length > 0) {
          data.forEach((order: Order) => {
            socket.emit("join_order", order._id);
          });
        }
      } else {
        setError("Failed to fetch your orders");
      }
    } catch (err) {
      setError("Error connecting to server");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Mark order as delivered
  const markAsDelivered = async (orderId: string) => {
    try {
      const response = await fetch(`http://localhost:5001/api/order/${orderId}/delivered`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ deliveryPersonId: deliveryPerson?._id }),
      });

      if (response.ok) {
        // Update the order's status locally
        setMyOrders((prevOrders) =>
          prevOrders.map((order) =>
            order._id === orderId ? { ...order, status: "delivered" } : order
          )
        );
        console.log("Order marked as delivered successfully");
      } else {
        const errorData = await response.json();
        setError(errorData.message || "Failed to mark order as delivered");
      }
    } catch (err) {
      setError("Error connecting to server");
      console.error(err);
    }
  };

  // Cancel order
  const cancelOrder = async (orderId: string) => {
    try {
      const response = await fetch(`http://localhost:5001/api/order/${orderId}/cancel`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ deliveryPersonId: deliveryPerson?._id }),
      });

      if (response.ok) {
        // Update the order's status locally
        setMyOrders((prevOrders) =>
          prevOrders.map((order) =>
            order._id === orderId ? { ...order, status: "cancelled" } : order
          )
        );
        console.log("Order cancelled successfully");
      } else {
        const errorData = await response.json();
        setError(errorData.message || "Failed to cancel order");
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
    return <div className="flex justify-center items-center h-screen">Loading your orders...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">My Orders</h1>

      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4">
          <p>{error}</p>
        </div>
      )}

      {myOrders.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">You don't have any active orders</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {myOrders.map((order) => (
            <Card key={order._id} className="shadow-md">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">Order #{order._id.slice(-6)}</h3>
                  <div className={`px-2 py-1 rounded-full ${
                    order.status === 'delivered' 
                      ? 'bg-green-100 text-green-800' 
                      : order.status === 'cancelled'
                      ? 'bg-red-100 text-red-800'
                      : 'bg-blue-100 text-blue-800'
                  } text-sm`}>
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

              <CardFooter className="flex flex-col gap-2">
                {order.status === 'delivering' && (
                  <>
                    <Button
                      className="w-full bg-green-600 hover:bg-green-700 text-white"
                      onClick={() => markAsDelivered(order._id)}
                    >
                      Mark as Delivered
                    </Button>
                    <Button
                      className="w-full bg-red-600 hover:bg-red-700 text-white"
                      onClick={() => cancelOrder(order._id)}
                    >
                      Cancel Order
                    </Button>
                  </>
                )}
                {order.status === 'delivered' && (
                  <div className="w-full text-center text-green-600 font-medium">
                    Order Completed
                  </div>
                )}
                {order.status === 'cancelled' && (
                  <div className="w-full text-center text-red-600 font-medium">
                    Order Cancelled
                  </div>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyOrdersPage;
