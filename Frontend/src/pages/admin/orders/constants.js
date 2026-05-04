/**
 * @fileoverview Constants for the Orders feature.
 */

// Mapping of status names to their corresponding API integer values.
export const ORDER_STATUS_MAP = {
  Pending: 1,
  Confirmed: 2,
  Paid: 3,
  Shipped: 4,
  Delivered: 5,
  Cancelled: 6,
};

// Reverse mapping for display purposes (from API value to label).
export const ORDER_STATUS_LABELS = {
  1: "Pending",
  2: "Confirmed",
  3: "Paid",
  4: "Shipped",
  5: "Delivered",
  6: "Cancelled",
};

// Array of status objects for use in DevExtreme SelectBoxes and filters.
export const ORDER_STATUS_ARRAY = Object.keys(ORDER_STATUS_MAP).map((key) => ({
  id: ORDER_STATUS_MAP[key],
  name: key,
}));

// Allowed page sizes for the DataGrid pager.
export const ALLOWED_PAGE_SIZES = [10, 25, 50];