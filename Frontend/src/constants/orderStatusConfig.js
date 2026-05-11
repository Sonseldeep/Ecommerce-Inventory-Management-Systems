// Single source of truth — numeric IDs match backend C# OrderStatus enum

export const ORDER_STATUS = {
  PENDING:   { id: 1, label: "Pending",   color: "#b45309", bgColor: "#fef3c7", borderColor: "#fcd34d", dotColor: "#f59e0b", isLocked: false },
  CONFIRMED: { id: 2, label: "Confirmed", color: "#1d4ed8", bgColor: "#dbeafe", borderColor: "#93c5fd", dotColor: "#3b82f6", isLocked: false },
  PAID:      { id: 3, label: "Paid",      color: "#065f46", bgColor: "#d1fae5", borderColor: "#6ee7b7", dotColor: "#10b981", isLocked: false },
  SHIPPED:   { id: 4, label: "Shipped",   color: "#5b21b6", bgColor: "#ede9fe", borderColor: "#c4b5fd", dotColor: "#8b5cf6", isLocked: false },
  DELIVERED: { id: 5, label: "Delivered", color: "#14532d", bgColor: "#dcfce7", borderColor: "#86efac", dotColor: "#22c55e", isLocked: true  },
  CANCELLED: { id: 6, label: "Cancelled", color: "#991b1b", bgColor: "#fee2e2", borderColor: "#fca5a5", dotColor: "#ef4444", isLocked: true  },
};

// Look up config by numeric id — ORDER_STATUS_BY_ID[2] → CONFIRMED config
export const ORDER_STATUS_BY_ID = Object.fromEntries(
  Object.values(ORDER_STATUS).map((s) => [s.id, s])
);

// For dropdowns
export const ORDER_STATUS_ARRAY = Object.values(ORDER_STATUS).map((s) => ({
  id: s.id,
  name: s.label,
}));

// Valid transitions (numeric IDs)
const ALLOWED_TRANSITIONS = {
  1: [2, 6], // Pending   → Confirmed | Cancelled
  2: [3, 6], // Confirmed → Paid      | Cancelled
  3: [4, 6], // Paid      → Shipped   | Cancelled
  4: [5, 6], // Shipped   → Delivered | Cancelled
  5: [],     // Delivered (locked)
  6: [],     // Cancelled (locked)
};

export const canTransitionTo = (currentId, nextId) =>
  ALLOWED_TRANSITIONS[currentId]?.includes(nextId) ?? false;

export const isStatusLocked = (statusId) => statusId === 5 || statusId === 6;

export const ALLOWED_PAGE_SIZES = [10, 25, 50];







// export const ORDER_STATUS = {
//   PENDING: {
//     id: 1,
//     key: "Pending",
//     label: "Pending",
//     color: "#f59e0b",
//     bgColor: "#fef3c7",
//     borderColor: "#fbbf24",

//     isLocked: false,
//   },

//   CONFIRMED: {
//     id: 2,
//     key: "Confirmed",
//     label: "Confirmed",
//     color: "#3b82f6",
//     bgColor: "#dbeafe",
//     borderColor: "#60a5fa",
 
//     isLocked: false,
//   },

//   PAID: {
//     id: 3,
//     key: "Paid",
//     label: "Paid",
//     color: "#10b981",
//     bgColor: "#d1fae5",
//     borderColor: "#34d399",
  
//     isLocked: false,
//   },

//   SHIPPED: {
//     id: 4,
//     key: "Shipped",
//     label: "Shipped",
//     color: "#8b5cf6",
//     bgColor: "#ede9fe",
//     borderColor: "#a78bfa",
   
//     isLocked: false,
//   },

//   DELIVERED: {
//     id: 5,
//     key: "Delivered",
//     label: "Delivered",
//     color: "#22c55e",
//     bgColor: "#dcfce7",
//     borderColor: "#4ade80",
  
//     isLocked: true,
//   },

//   CANCELLED: {
//     id: 6,
//     key: "Cancelled",
//     label: "Cancelled",
//     color: "#ef4444",
//     bgColor: "#fee2e2",
//     borderColor: "#f87171",
  
//     isLocked: true,
//   },
// };

// export const ORDER_STATUS_ARRAY = Object.values(ORDER_STATUS).map((s) => ({
//   id: s.id,
//   name: s.label,
// }));

// export const ORDER_STATUS_LABELS = Object.fromEntries(
//   Object.values(ORDER_STATUS).map((s) => [s.id, s.label])
// );

// export const ORDER_STATUS_MAP = Object.fromEntries(
//   Object.values(ORDER_STATUS).map((s) => [s.key, s.id])
// );







// export const ORDER_STATUSES = {
//   PENDING: {
//     id: "PENDING",
//     label: "Pending",
//     color: "#f59e0b",           // Amber-500
//     bgColor: "#fffbeb",          // Amber-50
//     borderColor: "#fed7aa",      // Amber-200
//     textColor: "#92400e",        // Amber-900
//     canTransitionTo: ["PAID", "CANCELLED"],
//     description: "Awaiting payment or confirmation"
//   },
//   PAID: {
//     id: "PAID",
//     label: "Paid",
//     color: "#10b981",            // Emerald-500
//     bgColor: "#f0fdf4",          // Emerald-50
//     borderColor: "#a7f3d0",      // Emerald-200
//     textColor: "#065f46",        // Emerald-900
//     canTransitionTo: ["SHIPPED", "CANCELLED"],
//     description: "Payment received"
//   },
//   SHIPPED: {
//     id: "SHIPPED",
//     label: "Shipped",
//     color: "#3b82f6",            // Blue-500
//     bgColor: "#eff6ff",          // Blue-50
//     borderColor: "#bfdbfe",      // Blue-200
//     textColor: "#1e3a8a",        // Blue-900
//     canTransitionTo: ["DELIVERED"],
//     description: "In transit to customer"
//   },
//   DELIVERED: {
//     id: "DELIVERED",
//     label: "Delivered",
//     color: "#06b6d4",            // Cyan-500
//     bgColor: "#ecfdf5",          // Cyan-50
//     borderColor: "#a5f3fc",      // Cyan-200
//     textColor: "#164e63",        // Cyan-900
//     canTransitionTo: [],         // LOCKED - no transitions
//     locked: true,
//     description: "Order successfully delivered"
//   },
//   CANCELLED: {
//     id: "CANCELLED",
//     label: "Cancelled",
//     color: "#ef4444",            // Red-500
//     bgColor: "#fef2f2",          // Red-50
//     borderColor: "#fecaca",      // Red-200
//     textColor: "#7f1d1d",        // Red-900
//     canTransitionTo: [],         // LOCKED - no transitions
//     locked: true,
//     description: "Order has been cancelled"
//   }
// };

// // Helper functions
// export const getStatusConfig = (status) => ORDER_STATUSES[status];

// export const canTransitionTo = (fromStatus, toStatus) => {
//   const config = getStatusConfig(fromStatus);
//   return config?.canTransitionTo?.includes(toStatus) ?? false;
// };

// export const isStatusLocked = (status) => {
//   return getStatusConfig(status)?.locked ?? false;
// };

// export const getAllStatuses = () => Object.values(ORDER_STATUSES);
