

import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { createNotificationsHub } from "../../realtime/signalr";

export default function AdminNotificationBell() {
  const [count, setCount] = useState(0);
  const [items, setItems] = useState([]);
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const hubRef = useRef(null); // Keep connection reference

  // -- Close on outside click --
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // -- SignalR Connection Management --
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) return;

    const hub = createNotificationsHub(token);
    hubRef.current = hub;

    const startConnection = async () => {
      try {
        await hub.start();
        console.log("Connected to Notifications Hub");
      } catch (err) {
        console.error("SignalR Connection Error: ", err);
        // Optional: retry logic
        setTimeout(startConnection, 5000);
      }
    };

    startConnection();

    // Event: New Order
    hub.on("OrderPlaced", (payload) => {
      const entry = {
        id: crypto.randomUUID(),
        type: "order",
        text: `New order ${payload.orderNumber} — Rs.${payload.totalAmount}`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setItems((prev) => [entry, ...prev]);
      setCount((c) => c + 1);
      toast.success(entry.text, { icon: '🛒' });
      // playAudioNotification(); // Optional function
    });

    // Event: Low Stock
    hub.on("LowStock", (payload) => {
      const entry = {
        id: crypto.randomUUID(),
        type: "lowstock",
        text: `Low stock: ${payload.productName} (${payload.remaining} left)`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setItems((prev) => [entry, ...prev]);
      setCount((c) => c + 1);
      toast.error(entry.text, { icon: '⚠️' });
    });

    return () => {
      if (hubRef.current) hubRef.current.stop();
    };
  }, []);

  const markAllRead = () => setCount(0);
  const clearAll = () => {
    setItems([]);
    setCount(0);
  };

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => {
          setOpen((o) => !o);
          if (!open) markAllRead(); // Mark read when opening
        }}
        className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors text-2xl"
      >
        🔔
        {count > 0 && (
          <span className="absolute top-1 right-1 flex h-5 w-5 items-center justify-center text-[10px] font-bold bg-red-500 text-white rounded-full ring-2 ring-white">
            {count > 9 ? "9+" : count}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-3 w-80 bg-white border border-gray-200 rounded-2xl shadow-2xl z-50 overflow-hidden animate-in fade-in zoom-in duration-200">
          <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-b">
            <h3 className="font-bold text-sm text-gray-800">Notifications</h3>
            {items.length > 0 && (
              <button onClick={markAllRead} className="text-xs font-medium text-blue-600 hover:underline">
                Mark read
              </button>
            )}
          </div>

          <div className="max-h-80 overflow-y-auto">
            {items.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 text-gray-400">
                <span className="text-4xl mb-2">☁️</span>
                <p className="text-xs">All caught up!</p>
              </div>
            ) : (
              items.map((n) => (
                <div key={n.id} className="px-4 py-3 border-b border-gray-50 hover:bg-gray-50 transition-colors cursor-default">
                  <div className="flex gap-3">
                    <div className={`mt-1 shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${n.type === 'order' ? 'bg-green-100' : 'bg-amber-100'}`}>
                      {n.type === "lowstock" ? "⚠️" : "🛒"}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-700 leading-snug">{n.text}</p>
                      <p className="text-[10px] text-gray-400 mt-1 font-medium">{n.time}</p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {items.length > 0 && (
            <button
              onClick={clearAll}
              className="w-full py-3 text-xs font-semibold text-red-500 bg-white hover:bg-red-50 border-t transition-colors"
            >
              Clear History
            </button>
          )}
        </div>
      )}
    </div>
  );
}