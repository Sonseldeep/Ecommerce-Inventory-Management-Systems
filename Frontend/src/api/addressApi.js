import axiosClient from "./axiosClient";

export const getMyAddressesApi = () => axiosClient.get("/addresses");

export const createAddressApi = (payload) => axiosClient.post("/addresses", payload);

export const deleteAddressApi = (id) => axiosClient.delete(`/addresses/${id}`);

// Most .NET Put requests with no body require an empty object {} as the second argument
export const setDefaultAddressApi = (id) => axiosClient.put(`/addresses/${id}/set-default`, {});




// import axiosClient from "./axiosClient";

// export const getMyAddressesApi = () => axiosClient.get("/addresses");
// export const createAddressApi = (payload) => axiosClient.post("/addresses", payload);
// export const deleteAddressApi = (id) => axiosClient.delete(`/addresses/${id}`);
// export const setDefaultAddressApi = (id) => axiosClient.put(`/addresses/${id}/set-default`);