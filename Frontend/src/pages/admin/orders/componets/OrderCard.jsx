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
    
        <div className="p-4">
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

          <p className="text-xl font-bold text-gray-900">
            Rs {Number(order.totalAmount || 0).toLocaleString("en-IN", {
              minimumFractionDigits: 2,
            })}
          </p>
        </div>

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

