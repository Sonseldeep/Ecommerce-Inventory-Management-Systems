


// import { useEffect, useState } from "react";
// import toast from "react-hot-toast";
// import { createNotificationsHub } from "../../realtime/signalr";

// export default function AdminNotificationBell() {
//   const [count, setCount] = useState(0);
//   const [items, setItems] = useState([]);
//   const [open, setOpen] = useState(false);

//   useEffect(() => {
//     const token = localStorage.getItem("accessToken");
//     const hub = createNotificationsHub(token);

//     hub.start().catch(console.error);

//     // ── New order placed ──────────────────────────────────────────────────
//     hub.on("OrderPlaced", (payload) => {
//       const entry = {
//         id: crypto.randomUUID(),
//         type: "order",
//         text: `New order ${payload.orderNumber} — ₹${payload.total}`,
//         time: new Date().toLocaleTimeString(),
//       };
//       setItems((prev) => [entry, ...prev]);
//       setCount((c) => c + 1);
//       toast.success(entry.text);
//     });

//     // ── Low stock alert ───────────────────────────────────────────────────
//     hub.on("LowStock", (payload) => {
//       const entry = {
//         id: crypto.randomUUID(),
//         type: "lowstock",
//         text: `Low stock: ${payload.productName} (${payload.remaining} left)`,
//         time: new Date().toLocaleTimeString(),
//       };
//       setItems((prev) => [entry, ...prev]);
//       setCount((c) => c + 1);
//       toast.error(entry.text);
//     });

//     return () => hub.stop();
//   }, []);

//   const markAllRead = () => setCount(0);
//   const clearAll    = () => { setItems([]); setCount(0); };

//   return (
//     <div className="relative">
//       <button
//         onClick={() => setOpen((o) => !o)}
//         className="relative text-xl"
//       >
//         🔔
//         {count > 0 && (
//           <span className="absolute -top-2 -right-2 text-xs bg-red-500 text-white rounded-full px-1.5">
//             {count}
//           </span>
//         )}
//       </button>

//       {open && (
//         <div className="absolute right-0 mt-2 w-80 bg-white border rounded-xl shadow-lg z-50">
//           <div className="flex items-center justify-between px-3 py-2 border-b">
//             <p className="font-semibold text-sm">Notifications</p>
//             <button onClick={markAllRead} className="text-xs text-blue-600">
//               Mark all as read
//             </button>
//           </div>

//           <div className="max-h-72 overflow-auto">
//             {items.length === 0 ? (
//               <p className="text-sm text-gray-500 p-3">No notifications</p>
//             ) : (
//               items.map((n) => (
//                 <div key={n.id} className="px-3 py-2 border-b text-sm">
//                   {/* ✅ colour-coded dot per type */}
//                   <div className="flex items-start gap-2">
//                     <span className="mt-0.5 text-base">
//                       {n.type === "lowstock" ? "⚠️" : "🛒"}
//                     </span>
//                     <div>
//                       <p>{n.text}</p>
//                       <p className="text-xs text-gray-400">{n.time}</p>
//                     </div>
//                   </div>
//                 </div>
//               ))
//             )}
//           </div>

//           {items.length > 0 && (
//             <button
//               onClick={clearAll}
//               className="w-full py-2 text-xs text-red-600 border-t"
//             >
//               Clear all
//             </button>
//           )}
//         </div>
//       )}
//     </div>
//   );
// }


import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { createNotificationsHub } from "../../realtime/signalr";

export default function AdminNotificationBell() {
  const [count, setCount] = useState(0);
  const [items, setItems] = useState([]);
  const [open, setOpen] = useState(false);
  const ref = useRef(null); // ✅ ref to the whole bell + dropdown wrapper

  // ── Close on outside click ────────────────────────────────────────────────
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ── SignalR ───────────────────────────────────────────────────────────────
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    const hub = createNotificationsHub(token);

    hub.start().catch(console.error);

    hub.on("OrderPlaced", (payload) => {
      const entry = {
        id: crypto.randomUUID(),
        type: "order",
        text: `New order ${payload.orderNumber} — ₹${payload.total}`,
        time: new Date().toLocaleTimeString(),
      };
      setItems((prev) => [entry, ...prev]);
      setCount((c) => c + 1);
      toast.success(entry.text);
    });

    hub.on("LowStock", (payload) => {
      const entry = {
        id: crypto.randomUUID(),
        type: "lowstock",
        text: `Low stock: ${payload.productName} (${payload.remaining} left)`,
        time: new Date().toLocaleTimeString(),
      };
      setItems((prev) => [entry, ...prev]);
      setCount((c) => c + 1);
      toast.error(entry.text);
    });

    return () => hub.stop();
  }, []);

  const markAllRead = () => setCount(0);
  const clearAll    = () => { setItems([]); setCount(0); };

  return (
    // ✅ ref attached here so clicks inside never trigger close
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="relative text-xl"
      >
        🔔
        {count > 0 && (
          <span className="absolute -top-2 -right-2 text-xs bg-red-500 text-white rounded-full px-1.5">
            {count}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-80 bg-white border rounded-xl shadow-lg z-50">
          <div className="flex items-center justify-between px-3 py-2 border-b">
            <p className="font-semibold text-sm">Notifications</p>
            <button onClick={markAllRead} className="text-xs text-blue-600">
              Mark all as read
            </button>
          </div>

          <div className="max-h-72 overflow-auto">
            {items.length === 0 ? (
              <p className="text-sm text-gray-500 p-3">No notifications</p>
            ) : (
              items.map((n) => (
                <div key={n.id} className="px-3 py-2 border-b text-sm">
                  <div className="flex items-start gap-2">
                    <span className="mt-0.5 text-base">
                      {n.type === "lowstock" ? "⚠️" : "🛒"}
                    </span>
                    <div>
                      <p>{n.text}</p>
                      <p className="text-xs text-gray-400">{n.time}</p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {items.length > 0 && (
            <button
              onClick={clearAll}
              className="w-full py-2 text-xs text-red-600 border-t"
            >
              Clear all
            </button>
          )}
        </div>
      )}
    </div>
  );
}