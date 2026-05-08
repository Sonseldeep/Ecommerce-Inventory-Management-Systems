import { useState } from "react";
import toast from "react-hot-toast";
import {
  ORDER_STATUS_BY_ID,
  ORDER_STATUS_ARRAY,
  isStatusLocked,
  canTransitionTo,
} from "../../../../constants/orderStatusConfig";

function ConfirmModal({ fromLabel, toLabel, onConfirm, onCancel, isLoading }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-xl p-6 w-full max-w-sm shadow-xl">
        <h3 className="text-lg font-bold text-gray-900 mb-2">Confirm Change</h3>
        <p className="text-sm text-gray-600 mb-4">
          Change status from <strong>{fromLabel}</strong> →{" "}
          <strong className={toLabel === "Cancelled" ? "text-red-600" : "text-green-600"}>
            {toLabel}
          </strong>
          ?
        </p>
        <p className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-lg p-3 mb-4">
          ⚠️ This will <strong>lock the order</strong>. No further changes will be possible.
        </p>
        <div className="flex gap-2">
          <button
            onClick={onCancel}
            disabled={isLoading}
            className="flex-1 py-2 rounded-lg border border-gray-200 text-sm font-medium hover:bg-gray-50"
          >
            Go back
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className={`flex-1 py-2 rounded-lg text-sm font-semibold text-white ${
              toLabel === "Cancelled"
                ? "bg-red-600 hover:bg-red-700"
                : "bg-green-600 hover:bg-green-700"
            }`}
          >
            {isLoading ? "Updating..." : `Yes, ${toLabel}`}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function OrderCard({ order, onStatusUpdate }) {
  const [pending, setPending] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showItems, setShowItems] = useState(false);

  const currentId =
    typeof order.orderStatus === "number"
      ? order.orderStatus
      : parseInt(order.orderStatus, 10);

  const currentConfig = ORDER_STATUS_BY_ID[currentId];
  const locked = isStatusLocked(currentId);
  const items = order.items || [];

  const handleSelectChange = (e) => {
    const newId = Number(e.target.value);
    if (newId === currentId) return;

    const newConfig = ORDER_STATUS_BY_ID[newId];

    if (newId === 5 || newId === 6) {
      setPending({ newId, newLabel: newConfig.label });
      return;
    }

    if (!canTransitionTo(currentId, newId)) {
      toast.error(`Cannot go from "${currentConfig?.label}" to "${newConfig?.label}"`);
      return;
    }

    doUpdate(newId);
  };

  const doUpdate = async (newId) => {
    setIsLoading(true);
    try {
      await onStatusUpdate(order.id, currentId, newId);
    } finally {
      setIsLoading(false);
      setPending(null);
    }
  };

  const formattedDate = order.createdAtUtc
    ? new Date(order.createdAtUtc).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "";

  return (
    <>
      {pending && (
        <ConfirmModal
          fromLabel={currentConfig?.label}
          toLabel={pending.newLabel}
          onConfirm={() => doUpdate(pending.newId)}
          onCancel={() => setPending(null)}
          isLoading={isLoading}
        />
      )}

      <div
        className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
        style={{ borderLeft: `4px solid ${currentConfig?.dotColor || "#e5e7eb"}` }}
      >
        {/* ── Top section ── */}
        <div className="p-4">
          {/* Header */}
          <div className="flex justify-between items-start mb-3">
            <div>
              <p className="text-xs font-mono text-gray-400">{order.orderNumber}</p>
              <p className="text-sm font-semibold text-gray-800">{order.customerName}</p>
              <p className="text-xs text-gray-400">{order.customerEmail}</p>
              {formattedDate && (
                <p className="text-xs text-gray-400 mt-0.5">{formattedDate}</p>
              )}
            </div>
            <span
              className="text-xs font-semibold px-2.5 py-1 rounded-full border"
              style={{
                color: currentConfig?.color,
                background: currentConfig?.bgColor,
                borderColor: currentConfig?.borderColor,
              }}
            >
              {currentConfig?.label}
            </span>
          </div>

          {/* Amount */}
          <p className="text-xl font-bold text-gray-900">
            Rs {Number(order.totalAmount || 0).toLocaleString("en-IN", {
              minimumFractionDigits: 2,
            })}
          </p>
        </div>

        {/* ── Products section ── */}
        <div className="border-t border-gray-100">
          <button
            onClick={() => setShowItems((v) => !v)}
            className="w-full flex items-center justify-between px-4 py-2.5 text-xs text-gray-500 hover:bg-gray-50 transition-colors"
          >
            <span className="font-medium">
              {items.length} item{items.length !== 1 ? "s" : ""}
              {items.length > 0 && (
                <span className="text-gray-400 font-normal ml-1">
                  — {items[0].productName}
                  {items.length > 1 && ` +${items.length - 1} more`}
                </span>
              )}
            </span>
            <span>{showItems ? "▲" : "▼"}</span>
          </button>

          {showItems && (
            <div className="px-4 pb-3 space-y-2">
              {items.map((item, i) => (
                <div
                  key={i}
                  className="flex items-start justify-between gap-2 text-xs bg-gray-50 rounded-lg px-3 py-2"
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-800 truncate">{item.productName}</p>
                    <p className="text-gray-400 mt-0.5">SKU: {item.sku}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="font-semibold text-gray-700">
                      Rs {Number(item.lineTotal).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                    </p>
                    <p className="text-gray-400">
                      {item.quantity} × Rs {Number(item.unitPrice).toLocaleString("en-IN")}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── Status control ── */}
        <div className="border-t border-gray-100 px-4 py-3">
          {locked ? (
            <div className="text-xs text-gray-400 bg-gray-50 rounded-lg px-3 py-2 border border-gray-100">
              🔒 {currentConfig?.label} — no further changes allowed
            </div>
          ) : (
            <select
              value={currentId}
              onChange={handleSelectChange}
              disabled={isLoading}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 bg-white cursor-pointer disabled:opacity-50"
            >
              {ORDER_STATUS_ARRAY.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          )}
        </div>
      </div>
    </>
  );
}


// v2 
// import StatusBadge from "../../../../components/StatusBadge";
// import { ORDER_STATUS_LABELS } from "../../../../constants/orderStatusConfig";


// export default function OrderCard({ order, onStatusUpdate }) {
//   // Normalize status (number → label)
//   const statusLabel =
//     typeof order.orderStatus === "number"
//       ? ORDER_STATUS_LABELS[order.orderStatus]
//       : order.orderStatus;

//   // Locked states
//   const isLocked =
//     statusLabel === "Delivered" || statusLabel === "Cancelled";

//   return (
//     <div
//       style={{
//         background: "#fff",
//         borderRadius: 12,
//         padding: 16,
//         boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
//         display: "flex",
//         flexDirection: "column",
//         gap: 10,
//       }}
//     >
//       {/* HEADER */}
//       <div
//         style={{
//           display: "flex",
//           justifyContent: "space-between",
//           alignItems: "flex-start",
//         }}
//       >
//         {/* LEFT SIDE */}
//         <div>
//           <h3 style={{ margin: 0, fontSize: 16 }}>
//             Order #{order.orderNumber}
//           </h3>

//           <p style={{ margin: 0, fontSize: 13, color: "#666" }}>
//             {order.customerName} ({order.customerEmail})
//           </p>
//         </div>

//         {/* RIGHT SIDE BADGE */}
//         <StatusBadge status={statusLabel} />
//       </div>

//       {/* AMOUNT */}
//       <div style={{ fontSize: 18, fontWeight: 700 }}>
//         Rs  {Number(order.totalAmount || 0).toFixed(2)}
//       </div>

//       {/* STATUS ACTION AREA */}
//       <div
//         style={{
//           display: "flex",
//           justifyContent: "flex-end",
//           alignItems: "center",
//           gap: 10,
//           marginTop: 8,
//         }}
//       >
//         {/* SHOW DROPDOWN ONLY IF NOT LOCKED */}
//         {!isLocked ? (
//           <select
//             value={order.orderStatus}
//             onChange={(e) =>
//              onStatusUpdate(
//   order.id,
//   order.orderStatus,
//   Number(e.target.value)
// )
//             }
//             style={{
//               padding: "6px 10px",
//               borderRadius: 8,
//               border: "1px solid #ddd",
//               minWidth: 150,
//               background: "#fff",
//             }}
//           >
//             <option value={1}>Pending</option>
//             <option value={2}>Confirmed</option>
//             <option value={3}>Paid</option>
//             <option value={4}>Shipped</option>
//             <option value={5}>Delivered</option>
//             <option value={6}>Cancelled</option>
//           </select>
//         ) : (
//           <span style={{ fontSize: 12, color: "#888" }}>
          
//           </span>
//         )}
//       </div>
//     </div>
//   );
// }









// import { ORDER_STATUS_LABELS, ORDER_STATUS_ARRAY } from '../constants';

// import StatusBadge from "../../../../components/StatusBadge";

// export default function OrderCard({ order, onStatusUpdate }) {
//   const statusName = ORDER_STATUS_LABELS[order.orderStatus] || "Pending";
//   const statusOptions = ORDER_STATUS_ARRAY.map(s => s.name);

//   return (
//     <div className="bg-white rounded-xl shadow-md p-4 transition-shadow hover:shadow-lg">
//       <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
//         {/* Left Side: Order & Customer Details */}
//         <div>
//           <p className="font-semibold text-gray-800">Order #{order.orderNumber}</p>
//           <p className="text-sm text-gray-600">{order.customerName} ({order.customerEmail})</p>
//           <p className="text-lg font-bold text-gray-900 mt-1">
//             Rs  {Number(order.totalAmount || 0).toFixed(2)}
//           </p>
//         </div>
        
//         {/* Right Side: Status Update */}
//         <div className="flex items-center gap-2">
//           <span className="text-sm font-medium text-gray-500">Status:</span>
//           <select
//             className="border rounded p-2 bg-gray-50 focus:ring-2 focus:ring-blue-500"
//             value={statusName}
//             onChange={(e) => onStatusUpdate(order.id, e.target.value)}
//           >
//             {statusOptions.map((s) => <option key={s} value={s}>{s}</option>)}
//           </select>
//         </div>
//       </div>
//     </div>
//   );
// }




// latest 



// export default function OrderCard({ order, onStatusUpdate }) {
//   return (
//     <div
//       style={{
//         background: "#fff",
//         padding: 16,
//         borderRadius: 12,
//         boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
//       }}
//     >
//       <h3>Order #{order.orderNumber}</h3>

//       <p>{order.customerName}</p>

//       <p style={{ fontWeight: 700 }}>Rs {order.totalAmount}</p>

//       <StatusBadge status={order.orderStatus} />

//       <select
//         value={order.orderStatus}
//         onChange={(e) =>
//           onStatusUpdate(order.id, order.orderStatus, e.target.value)
//         }
//       >
//         <option>Pending</option>
//         <option>Confirmed</option>
//         <option>Paid</option>
//         <option>Shipped</option>
//         <option>Delivered</option>
//         <option>Cancelled</option>
//       </select>
//     </div>
//   );
// }