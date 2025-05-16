// pages/OrdersPage.tsx
import React, { useEffect, useState } from "react";
import ChatBot from "../components/ChatBot";
import { BiBot } from "react-icons/bi";
import axios from "axios";

const OrdersPage: React.FC = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [showReminder, setShowReminder] = useState(true);

  type Order = {
    order_id: string;
    item: string;
    related_tickets: number;
    status: string;
    thumbnail: string;
  }

  const [orders, setOrders] = useState<Order[]>([]);

  const fetchOrders = async () => {
    try {
      const res = await axios.get("http://localhost:8000/orders", {
        headers: { "Content-Type": "application/json" },
      });
      setOrders(res.data.orders);    
    } catch (error) {
      console.error("Error fetching orders:", error)
      setOrders([]);
    }
  };
  
  useEffect(() => {
    fetchOrders();

    const timer = setTimeout(() => setShowReminder(false), 4000); // Hide after 4 seconds
    return () => clearTimeout(timer);

  }, []);

  return (
    <div className="relative min-h-screen bg-gray-100 p-6">
    <div className="max-w-3xl mx-auto">
    <h1 className="text-2xl font-bold mb-4">Your Orders</h1>
      <div className="space-y-3">
        {orders.map((order) => (
            <div
                key={order.order_id}
                className="p-4 bg-white rounded shadow flex items-center justify-between"
            >
                {/* Left: Thumbnail + Details */}
                <div className="flex items-center gap-4">
                <img
                    src={order.thumbnail}
                    alt={order.item}
                    className="w-16 h-16 rounded object-cover"
                />
                <div>
                    <div className="font-semibold">Order ID: {order.order_id}</div>
                    <div>Item: {order.item}</div>
                    <div>Related Tickets: {order.related_tickets}</div>
                </div>
                </div>

                {/* Right: Status */}
                <span className="text-sm text-gray-500">{order.status}</span>
            </div>
        ))}
      </div>  
    </div>

      {/* Reminder Toast */}
      {showReminder && (
        <div className="fixed bottom-24 right-6 bg-blue-600 text-white px-4 py-2 rounded shadow-lg transition-opacity animate-bounce">
          💬 Need help? Chat with us below!
        </div>
      )}

      {/* Floating Chat Head */}
      <button
        onClick={() => {
          setIsChatOpen((prev) => !prev);
          fetchOrders();
        }}
        className="fixed bottom-6 right-6 bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-lg transition"
        aria-label={isChatOpen ? "Close Chat": "Open Chat"}
      >
        <BiBot size={28} />
      </button>

      {/* ChatBot Popup */}
      <div className="fixed bottom-20 right-6 w-80 max-w-full z-50">
        <div className={isChatOpen ? "block" : "hidden"}>
          <ChatBot />
        </div>
      </div>
    </div>
  );
};

export default OrdersPage;
