export const ORDER_STATUSES = {
  PENDING: {
    id: "PENDING",
    label: "Pending",
    color: "#f59e0b",           // Amber-500
    bgColor: "#fffbeb",          // Amber-50
    borderColor: "#fed7aa",      // Amber-200
    textColor: "#92400e",        // Amber-900
    canTransitionTo: ["PAID", "CANCELLED"],
    description: "Awaiting payment or confirmation"
  },
  PAID: {
    id: "PAID",
    label: "Paid",
    color: "#10b981",            // Emerald-500
    bgColor: "#f0fdf4",          // Emerald-50
    borderColor: "#a7f3d0",      // Emerald-200
    textColor: "#065f46",        // Emerald-900
    canTransitionTo: ["SHIPPED", "CANCELLED"],
    description: "Payment received"
  },
  SHIPPED: {
    id: "SHIPPED",
    label: "Shipped",
    color: "#3b82f6",            // Blue-500
    bgColor: "#eff6ff",          // Blue-50
    borderColor: "#bfdbfe",      // Blue-200
    textColor: "#1e3a8a",        // Blue-900
    canTransitionTo: ["DELIVERED"],
    description: "In transit to customer"
  },
  DELIVERED: {
    id: "DELIVERED",
    label: "Delivered",
    color: "#06b6d4",            // Cyan-500
    bgColor: "#ecfdf5",          // Cyan-50
    borderColor: "#a5f3fc",      // Cyan-200
    textColor: "#164e63",        // Cyan-900
    canTransitionTo: [],         // LOCKED - no transitions
    locked: true,
    description: "Order successfully delivered"
  },
  CANCELLED: {
    id: "CANCELLED",
    label: "Cancelled",
    color: "#ef4444",            // Red-500
    bgColor: "#fef2f2",          // Red-50
    borderColor: "#fecaca",      // Red-200
    textColor: "#7f1d1d",        // Red-900
    canTransitionTo: [],         // LOCKED - no transitions
    locked: true,
    description: "Order has been cancelled"
  }
};

// Helper functions
export const getStatusConfig = (status) => ORDER_STATUSES[status];

export const canTransitionTo = (fromStatus, toStatus) => {
  const config = getStatusConfig(fromStatus);
  return config?.canTransitionTo?.includes(toStatus) ?? false;
};

export const isStatusLocked = (status) => {
  return getStatusConfig(status)?.locked ?? false;
};

export const getAllStatuses = () => Object.values(ORDER_STATUSES);
