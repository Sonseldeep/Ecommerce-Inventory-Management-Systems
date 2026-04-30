import axiosClient from "./axiosClient";

// ✅ paginated list with filters
export const getProductsApi = (params = {}) =>
  axiosClient.get("/products", { params });

// ✅ single product by id
export const getProductByIdApi = (id) =>
  axiosClient.get(`/products/${id}`);

export const createProductApi = (payload) =>
  axiosClient.post("/products", payload);

export const updateProductApi = (id, payload) =>
  axiosClient.put(`/products/${id}`, payload);

export const deleteProductApi = (id) =>
  axiosClient.delete(`/products/${id}`);

export const uploadProductImagesApi = async (productId, files) => {
  const uploaded = [];

  for (let i = 0; i < files.length; i++) {
    const fd = new FormData();
    fd.append("file", files[i]);

    const isPrimary = i === 0;

    const res = await axiosClient.post(
      `/admin/products/${productId}/images?isPrimary=${isPrimary}`,
      fd
    );

    uploaded.push(res.data);
  }

  return uploaded;
};




// import axiosClient from "./axiosClient";

// // export const getProductsApi = () => axiosClient.get("/products");
// export const getProductsApi = (params = {}) =>
//   axiosClient.get("/products", { params });

// // export const searchProductsApi = (queryString) =>
// //   axiosClient.get(`/products/search?${queryString}`);

// export const createProductApi = (payload) =>
//   axiosClient.post("/products", payload);

// export const updateProductApi = (id, payload) =>
//   axiosClient.put(`/products/${id}`, payload);

// export const deleteProductApi = (id) =>
//   axiosClient.delete(`/products/${id}`);

// export const uploadProductImagesApi = async (productId, files) => {
//   const uploaded = [];

//   for (let i = 0; i < files.length; i++) {
//     const fd = new FormData();
//     fd.append("file", files[i]);

//     const isPrimary = i === 0;

//     const res = await axiosClient.post(
//       `/admin/products/${productId}/images?isPrimary=${isPrimary}`,
//       fd
//     );

//     uploaded.push(res.data);
//   }

//   return uploaded;
// };