

import axiosClient from "./axiosClient";

export const getMyCartApi = () => axiosClient.get("/cart");
export const addToCartApi = (payload) => axiosClient.post("/cart/items", payload);
export const updateCartItemApi = (cartItemId, quantity) =>
  axiosClient.put(`/cart/items/${cartItemId}`, { quantity });
export const removeCartItemApi = (cartItemId) =>
  axiosClient.delete(`/cart/items/${cartItemId}`);