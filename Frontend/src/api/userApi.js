import axiosClient from "./axiosClient";

export const getMyProfileApi = () => axiosClient.get("/users/me");