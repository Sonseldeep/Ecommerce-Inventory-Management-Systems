

import axiosClient from "./axiosClient";

// Backend: POST /api/orders/checkout
export const checkoutApi = (payload) => axiosClient.post("/orders/checkout", payload);

// Backend: GET /api/orders/my-orders
export const getMyOrdersApi = () => axiosClient.get("/orders/my-orders");


