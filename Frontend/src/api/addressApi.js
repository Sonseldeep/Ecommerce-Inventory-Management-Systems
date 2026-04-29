

import axiosClient from "./axiosClient";

export const getMyAddressesApi = () => axiosClient.get("/addresses");
export const createAddressApi = (payload) => axiosClient.post("/addresses", payload);
export const deleteAddressApi = (id) => axiosClient.delete(`/addresses/${id}`);
export const setDefaultAddressApi = (id) => axiosClient.patch(`/addresses/${id}/set-default`);