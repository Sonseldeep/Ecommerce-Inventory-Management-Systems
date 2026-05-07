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
    fd.append("file", files[i]); // ✅ must be "file"

    const isPrimary = i === 0;

    const res = await axiosClient.post(
      `/admin/products/${productId}/images?isPrimary=${isPrimary}`, // ✅ admin route
      fd,
      { headers: { "Content-Type": "multipart/form-data" } }
    );

    uploaded.push(res.data);
  }

  return uploaded;
};

// ============== NEW FUNCTIONS - ADD BELOW ==============

// ✅ GET all images for a product
export const getProductImagesApi = (productId) =>
  axiosClient.get(`/admin/products/${productId}/images`);

// ✅ DELETE a single product image
export const deleteProductImageApi = (productId, imageId) =>
  axiosClient.delete(`/admin/products/${productId}/images/${imageId}`);

// ✅ REPLACE/UPDATE an existing image with a new file
export const replaceProductImageApi = async (productId, imageId, file, isPrimary = false) => {
  const fd = new FormData();
  fd.append("file", file);

  return axiosClient.put(
    `/admin/products/${productId}/images/${imageId}?isPrimary=${isPrimary}`,
    fd,
    { headers: { "Content-Type": "multipart/form-data" } }
  );
};



// import axiosClient from "./axiosClient";

// // ... (getProductsApi, getProductByIdApi, etc. remain the same) ...
// export const getProductsApi = (params = {}) => axiosClient.get("/products", { params });
// export const getProductByIdApi = (id) => axiosClient.get(`/products/${id}`);
// export const createProductApi = (payload) => axiosClient.post("/products", payload);
// export const updateProductApi = (id, payload) => axiosClient.put(`/products/${id}`, payload);
// export const deleteProductApi = (id) => axiosClient.delete(`/products/${id}`);

// // --- ADD THESE NEW FUNCTIONS ---

// // Get all images for a specific product
// export const getProductImagesApi = (productId) =>
//   axiosClient.get(`/admin/products/${productId}/images`);

// // Delete a single product image
// export const deleteProductImageApi = (productId, imageId) =>
//   axiosClient.delete(`/admin/products/${productId}/images/${imageId}`);

// // --- Upload function remains the same ---
// export const uploadProductImagesApi = async (productId, files) => {
//   const uploaded = [];
//   for (let i = 0; i < files.length; i++) {
//     const fd = new FormData();
//     fd.append("file", files[i]);
//     const isPrimary = i === 0;
//     const res = await axiosClient.post(
//       `/admin/products/${productId}/images?isPrimary=${isPrimary}`,
//       fd,
//       { headers: { "Content-Type": "multipart/form-data" } }
//     );
//     uploaded.push(res.data);
//   }
//   return uploaded;
// };