export const ORDER_STATUS = {
  PENDING: 1,
  CONFIRMED: 2,
  PAID: 3,
  SHIPPED: 4,
  DELIVERED: 5,
  CANCELLED: 6,
};


export const ORDER_STATUS_LABELS = {
  1: "Pending",
  2: "Confirmed",
  3: "Paid",
  4: "Shipped",
  5: "Delivered",
  6: "Cancelled",
};


export const ORDER_STATUS_COLORS = {
  1: "#f59e0b", // Pending - orange
  2: "#3b82f6", // Confirmed - blue
  3: "#10b981", // Paid - emerald
  4: "#8b5cf6", // Shipped - purple
  5: "#16a34a", // Delivered - green
  6: "#ef4444", // Cancelled - red
};


export const ORDER_STATUS_ARRAY = Object.entries(ORDER_STATUS).map(
  ([key, value]) => ({
    id: value,     
    name: key,     
  })
);

export const ALLOWED_PAGE_SIZES = [10, 25, 50];





