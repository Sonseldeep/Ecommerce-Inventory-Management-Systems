export const ALLOWED_TRANSITIONS = {
  Pending: ["Confirmed", "Cancelled"],
  Confirmed: ["Paid", "Cancelled"],
  Paid: ["Shipped", "Cancelled"],
  Shipped: ["Delivered"],
  Delivered: [],
  Cancelled: [],
};

export const canTransitionTo = (current, next) => {
  return ALLOWED_TRANSITIONS[current]?.includes(next);
};

export const isStatusLocked = (status) => {
  return status === "Delivered" || status === "Cancelled";
};