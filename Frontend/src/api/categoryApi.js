


// import axiosClient from "./axiosClient";

// export const getCategoriesApi = () => axiosClient.get("/categories");
// export const createCategoryApi = (payload) => axiosClient.post("/categories", payload);
// export const updateCategoryApi = (id, payload) => axiosClient.put(`/categories/${id}`, payload);
// export const deleteCategoryApi = (id) => axiosClient.delete(`/categories/${id}`);




import axiosClient from "./axiosClient";

// ✅ paginated + search
export const getCategoriesApi = (params = {}) =>
  axiosClient.get("/categories", { params });

export const createCategoryApi = (payload) =>
  axiosClient.post("/categories", payload);

export const updateCategoryApi = (id, payload) =>
  axiosClient.put(`/categories/${id}`, payload);

export const deleteCategoryApi = (id) =>
  axiosClient.delete(`/categories/${id}`);