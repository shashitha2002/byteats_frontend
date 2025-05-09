"use client";

import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { useUserStore } from "@/store/userStore";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

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

const TrackOrdersPage = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useUserStore();
  const [socket, setSocket] = useState<any>(null);
  const [showTracker, setShowTracker] = useState(false);

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

    // Fetch user orders
    if (user?._id) {
      fetchUserOrders();
    } else {
      setLoading(false);
      
    }

    // Cleanup on unmount
    return () => {
      socketInstance.disconnect();
    };
  }, [user]);

  // Listen for real-time updates
  useEffect(() => {
    if (socket) {
      socket.on("order_status_update", (data: any) => {
        console.log("Order status update received:", data);
        
        // Update the order in state
        setOrders(prevOrders => 
          prevOrders.map(order => 
            order._id === data.orderId 
              ? { ...order, status: data.status, updatedAt: data.updatedAt } 
              : order
          )
        );
        
        // Also update selected order if it's the one that changed
        if (selectedOrder && selectedOrder._id === data.orderId) {
          setSelectedOrder(prev => 
            prev ? { ...prev, status: data.status, updatedAt: data.updatedAt } : null
          );
        }
      });
    }

    return () => {
      if (socket) {
        socket.off("order_status_update");
      }
    };
  }, [socket, selectedOrder]);

  // Join socket rooms for each order
  useEffect(() => {
    if (socket && orders.length > 0) {
      orders.forEach(order => {
        socket.emit("join_order", order._id);
      });
    }
  }, [orders, socket]);

  const fetchUserOrders = async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:5001/api/order/user/${user?._id}`);
      if (response.ok) {
        const data = await response.json();
        setOrders(data);
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "paid":
        return "bg-blue-100 text-blue-800";
      case "delivering":
        return "bg-yellow-100 text-yellow-800";
      case "delivered":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStepStatus = (step: string) => {
    if (!selectedOrder) return "pending";
    
    const statusMap: Record<string, number> = {
      'paid': 1,
      'delivering': 3,
      'delivered': 4,
      'cancelled': -1
    };
    
    const currentStatus = statusMap[selectedOrder.status] || 0;
    const stepStatus = statusMap[step] || 0;
    
    if (currentStatus === -1) return "cancelled";
    if (stepStatus < currentStatus) return "completed";
    if (stepStatus === currentStatus) return "current";
    return "pending";
  };

  const openOrderTracker = (order: Order) => {
    setSelectedOrder(order);
    setShowTracker(true);
  };

  const closeOrderTracker = () => {
    setShowTracker(false);
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading your orders...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Track Your Orders</h1>
      
      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4">
          <p>{error}</p>
        </div>
      )}
      
      {orders.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">You don't have any orders yet</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {orders.map((order) => (
            <Card key={order._id} className="shadow-md cursor-pointer hover:shadow-lg transition-shadow" onClick={() => openOrderTracker(order)}>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">Order #{order._id.slice(-6)}</h3>
                  <div className={`px-2 py-1 rounded-full ${getStatusColor(order.status)} text-sm`}>
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </div>
                </div>
                <p className="text-sm text-gray-500">
                  Placed on {formatDate(order.updatedAt)}
                </p>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-2">
                  {order.items.slice(0, 2).map((item) => (
                    <div key={item._id} className="flex justify-between">
                      <span>{item.quantity} x {item.name}</span>
                      <span>${(item.price / 100).toFixed(2)}</span>
                    </div>
                  ))}
                  {order.items.length > 2 && (
                    <div className="text-sm text-gray-500">
                      +{order.items.length - 2} more items
                    </div>
                  )}
                  <div className="border-t pt-2 mt-4 font-bold flex justify-between">
                    <span>Total</span>
                    <span>${(order.totalPrice / 100).toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Order Tracking Modal */}
      {showTracker && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Order #{selectedOrder._id.slice(-6)}</h2>
                <button 
                  onClick={closeOrderTracker}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>

              {/* Order Details */}
              <div className="mb-6">
                <div className="flex justify-between text-sm text-gray-500 mb-2">
                  <span>Placed on {formatDate(selectedOrder.updatedAt)}</span>
                  <span className={`px-2 py-1 rounded-full ${getStatusColor(selectedOrder.status)}`}>
                    {selectedOrder.status.charAt(0).toUpperCase() + selectedOrder.status.slice(1)}
                  </span>
                </div>
              </div>

              {/* Order Tracking Timeline */}
              <div className="mb-8">
                <h3 className="text-lg font-medium mb-4">Order Status</h3>
                
                {selectedOrder.status === 'cancelled' ? (
                  <div className="bg-red-50 border border-red-200 rounded-md p-4 text-center">
                    <p className="text-red-600 font-medium">This order has been cancelled</p>
                  </div>
                ) : (
                  <div className="relative">
                    {/* Timeline track */}
                    <div className="absolute left-[22px] top-0 h-full w-[2px] bg-gray-200"></div>
                    
                    {/* Timeline steps */}
                    <div className="space-y-8">
                      {/* Processing Step */}
                      <div className="flex items-start">
                        <div className={`relative z-10 flex h-11 w-11 items-center justify-center rounded-full ${
                          getStepStatus('paid') === 'completed' ? 'bg-black text-white' : 
                          getStepStatus('paid') === 'current' ? 'bg-black text-white' : 
                          'bg-gray-200 text-gray-500'
                        }`}>
                          {getStepStatus('paid') === 'completed' && <Check className="h-6 w-6" />}
                          {getStepStatus('paid') !== 'completed' && (
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24">
                              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2M9 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2M9 5h6"/>
                            </svg>
                          )}
                        </div>
                        <div className="ml-4">
                          <h4 className="font-medium">Processing</h4>
                          <p className="text-sm text-gray-500">Your order has been received</p>
                        </div>
                      </div>
                      
                      {/* Shipped Step */}
                      <div className="flex items-start">
                        <div className={`relative z-10 flex h-11 w-11 items-center justify-center rounded-full ${
                          getStepStatus('delivering') === 'completed' ? 'bg-black text-white' : 
                          getStepStatus('delivering') === 'current' ? 'bg-black text-white' : 
                          'bg-gray-200 text-gray-500'
                        }`}>
                          {getStepStatus('delivering') === 'completed' && <Check className="h-6 w-6" />}
                          {getStepStatus('delivering') !== 'completed' && (
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24">
                              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h14M5 12l4-4m-4 4 4 4"/>
                            </svg>
                          )}
                        </div>
                        <div className="ml-4">
                          <h4 className="font-medium">Shipped</h4>
                          <p className="text-sm text-gray-500">Your order is on the way</p>
                        </div>
                      </div>
                      
                      {/* Delivered Step */}
                      <div className="flex items-start">
                        <div className={`relative z-10 flex h-11 w-11 items-center justify-center rounded-full ${
                          getStepStatus('delivered') === 'completed' ? 'bg-black text-white' : 
                          getStepStatus('delivered') === 'current' ? 'bg-black text-white' : 
                          'bg-gray-200 text-gray-500'
                        }`}>
                          {getStepStatus('delivered') === 'completed' && <Check className="h-6 w-6" />}
                          {getStepStatus('delivered') !== 'completed' && (
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24">
                              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m5 13 4 4L19 7"/>
                            </svg>
                          )}
                        </div>
                        <div className="ml-4">
                          <h4 className="font-medium">Delivered</h4>
                          <p className="text-sm text-gray-500">
                            {selectedOrder.status === 'delivered' 
                              ? `Delivered on ${formatDate(selectedOrder.updatedAt)}` 
                              : 'Pending delivery'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Order Items */}
              <div>
                <h3 className="text-lg font-medium mb-4">Order Items</h3>
                <div className="space-y-4">
                  {selectedOrder.items.map((item) => (
                    <div key={item._id} className="flex justify-between items-center border-b pb-3">
                      <div className="flex items-center">
                        <div className="ml-3">
                          <p className="font-medium">{item.name}</p>
                          <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                        </div>
                      </div>
                      <p className="font-medium">${(item.price / 100).toFixed(2)}</p>
                    </div>
                  ))}
                  <div className="flex justify-between items-center pt-2 font-bold">
                    <span>Total</span>
                    <span>${(selectedOrder.totalPrice / 100).toFixed(2)}</span>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 flex justify-end">
                <Button onClick={closeOrderTracker}>Close</Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TrackOrdersPage;
