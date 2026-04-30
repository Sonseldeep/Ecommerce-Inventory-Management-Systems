

import axiosClient from "./axiosClient";

// Backend: POST /api/orders/checkout
export const checkoutApi = (payload) =>
  axiosClient.post("/orders/checkout", payload);

// Backend: GET /api/orders/my-orders (paged + filters)
export const getMyOrdersApi = (params = {}) =>
  axiosClient.get("/orders/my-orders", { params });