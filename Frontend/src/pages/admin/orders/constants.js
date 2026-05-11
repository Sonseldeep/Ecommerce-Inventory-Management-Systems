/**
 * @fileoverview Constants for Order Status (Frontend-safe + Backend-aligned)
 */

// ===============================
// 1. CORE ENUM (MATCHES BACKEND)
// ===============================
export const ORDER_STATUS = {
  PENDING: 1,
  CONFIRMED: 2,
  PAID: 3,
  SHIPPED: 4,
  DELIVERED: 5,
  CANCELLED: 6,
};

// ===============================
// 2. LABELS (UI DISPLAY ONLY)
// ===============================
export const ORDER_STATUS_LABELS = {
  1: "Pending",
  2: "Confirmed",
  3: "Paid",
  4: "Shipped",
  5: "Delivered",
  6: "Cancelled",
};

// ===============================
// 3. COLORS (OPTIONAL UI UPGRADE)
// ===============================
export const ORDER_STATUS_COLORS = {
  1: "#f59e0b", // Pending - orange
  2: "#3b82f6", // Confirmed - blue
  3: "#10b981", // Paid - emerald
  4: "#8b5cf6", // Shipped - purple
  5: "#16a34a", // Delivered - green
  6: "#ef4444", // Cancelled - red
};

// ===============================
// 4. DEVEXTREME DATA SOURCE (IMPORTANT FIX)
// ===============================
export const ORDER_STATUS_ARRAY = Object.entries(ORDER_STATUS).map(
  ([key, value]) => ({
    id: value,     // ✅ ALWAYS NUMBER (BACKEND SAFE)
    name: key,     // UI label key
  })
);

// ===============================
// 5. PAGINATION
// ===============================
export const ALLOWED_PAGE_SIZES = [10, 25, 50];








// /**
//  * @fileoverview Constants for the Orders feature.
//  */

// // Mapping of status names to their corresponding API integer values.
// export const ORDER_STATUS_MAP = {
//   Pending: 1,
//   Confirmed: 2,
//   Paid: 3,
//   Shipped: 4,
//   Delivered: 5,
//   Cancelled: 6,
// };

// // Reverse mapping for display purposes (from API value to label).
// export const ORDER_STATUS_LABELS = {
//   1: "Pending",
//   2: "Confirmed",
//   3: "Paid",
//   4: "Shipped",
//   5: "Delivered",
//   6: "Cancelled",
// };

// // Array of status objects for use in DevExtreme SelectBoxes and filters.
// export const ORDER_STATUS_ARRAY = Object.keys(ORDER_STATUS_MAP).map((key) => ({
//   id: ORDER_STATUS_MAP[key],
//   name: key,
// }));

// // Allowed page sizes for the DataGrid pager.
// export const ALLOWED_PAGE_SIZES = [10, 25, 50];