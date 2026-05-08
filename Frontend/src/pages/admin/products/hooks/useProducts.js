/* eslint-disable no-unused-vars */
// import { useRef, useState, useEffect, useCallback } from "react";
// import toast from "react-hot-toast";
// import { getCategoriesApi } from "../../../../api/categoryApi";
// import {
//   createProductApi,
//   deleteProductApi,
//   updateProductApi,
//   uploadProductImagesApi,
// } from "../../../../api/productApi";
// import { createNotificationsHub } from "../../../../realtime/signalr";

// export function useProducts() {

//   const gridRef = useRef(null);
//   const [categories, setCategories] = useState([]);
//   const [loadingData, setLoadingData] = useState(false);
//   const [submitting, setSubmitting] = useState(false);


//   useEffect(() => {
//     const connection = createNotificationsHub();

//     connection
//       .start()
//       .then(() => console.log("NotificationsHub started"))
//       .catch((err) => console.error(err));

//     connection.on("ProductStockUpdated", (updatedProduct) => {
//       toast.success(
//         `Stock updated: ${updatedProduct.name} (${updatedProduct.quantityInStock})`
//       );
      
//       gridRef.current?.instance?.refresh();
//     });

//     return () => connection.stop();
//   }, []);

 
//   const loadCategories = useCallback(async () => {
//     setLoadingData(true);
//     try {
//       const cRes = await getCategoriesApi({
//         pageNumber: 1,
//         pageSize: 100,
//         sortBy: "name",
//         sortOrder: "asc",
//       });
//       setCategories(cRes.data?.data?.items || []);
//     } catch {
//       toast.error("Failed to load categories");
//     } finally {
//       setLoadingData(false);
//     }
//   }, []);


//   const refreshGrid = useCallback(() => {
//     gridRef.current?.instance?.refresh();
//   }, []);


//   const createProduct = useCallback(
//     async (payload, files = []) => {
//       setSubmitting(true);
//       try {
//         const res = await createProductApi(payload);
//         const productId = res.data?.data?.id;

//         toast.success("Product created");

//         if (productId && files.length > 0) {
//           await uploadProductImagesApi(productId, files);
//           toast.success("Images uploaded");
//         }

//         refreshGrid(); 
//         return true;
//       } catch (err) {
//         toast.error(err?.response?.data?.message || "Create failed");
//         return false;
//       } finally {
//         setSubmitting(false);
//       }
//     },
//     [refreshGrid]
//   );

 
//   const updateProduct = useCallback(
//     async (id, payload, files = []) => {
//       setSubmitting(true);
//       try {
//         await updateProductApi(id, payload);
//         toast.success("Product updated");

//         if (files.length > 0) {
//           await uploadProductImagesApi(id, files);
//           toast.success("Images uploaded");
//         }

//         refreshGrid();
//         return true;
//       } catch (err) {
//         toast.error(err?.response?.data?.message || "Update failed");
//         return false;
//       } finally {
//         setSubmitting(false);
//       }
//     },
//     [refreshGrid]
//   );

//   // ── DELETE ───────────────────────────────────────────────────────
// const deleteProduct = useCallback(
//   async (id) => {
//     try {
//       setSubmitting(true);

//       // 1. Delete product
//       await deleteProductApi(id);

//       // 2. Refresh grid safely
//       try {
//         await gridRef.current?.instance?.refresh();
//       } catch (refreshErr) {
//         console.warn("Grid refresh warning:", refreshErr);
//       }

//       // 3. Show success LAST
//       toast.success("Product deleted successfully");

//       return true;

//     } catch (err) {
//       console.error("DELETE ERROR:", err);

//       toast.error(
//         err?.response?.data?.message ||
//         "Delete failed"
//       );

//       return false;

//     } finally {
//       setSubmitting(false);
//     }
//   },
//   []
// );

//   return {
//     gridRef,          // pass to <ProductsGrid gridRef={gridRef} />
//     categories,
//     loadingData,
//     submitting,
//     loadCategories,   // call once on mount in AdminProductsPage
//     createProduct,
//     updateProduct,
//     deleteProduct,
//   };
// }













// import { useState, useEffect, useCallback } from "react";
// import toast from "react-hot-toast";
// import { getCategoriesApi } from "../../../../api/categoryApi";
// import { createProductApi, deleteProductApi, getProductsApi, updateProductApi, uploadProductImagesApi } from "../../../../api/productApi";
// import { createNotificationsHub } from "../../../../realtime/signalr";


// export function useProducts() {
//   const [products, setProducts] = useState([]);
//   const [categories, setCategories] = useState([]);
//   const [loadingData, setLoadingData] = useState(false);
//   const [submitting, setSubmitting] = useState(false);


//   useEffect(() => {
    
//     const connection = createNotificationsHub();

//     connection
//       .start()
//       .then(() => console.log("NotificationsHub Connection started for admin!"))
//       .catch((err) => console.error("NotificationsHub Connection failed: ", err));
      
//     connection.on("ProductStockUpdated", (updatedProduct) => {
//       console.log("EVENT RECEIVED: ProductStockUpdated", updatedProduct);
//       toast.success(`Live Stock Update: ${updatedProduct.name} is now ${updatedProduct.quantityInStock}.`);
      
//       setProducts(currentProducts => 
//         currentProducts.map(p => 
//           p.id === updatedProduct.id ? { ...p, quantityInStock: updatedProduct.quantityInStock } : p
//         )
//       );
//     });


//     return () => {
//       connection.stop().then(() => console.log("NotificationsHub Connection stopped."));
//     };
//   }, []); 

 
//   const loadAll = useCallback(async () => {
//     setLoadingData(true);
//     try {
//       const [pRes, cRes] = await Promise.all([
//         getProductsApi({ pageNumber: 1, pageSize: 500 }),
//         getCategoriesApi({ pageNumber: 1, pageSize: 100, sortBy: "name", sortOrder: "asc" }),
//       ]);
//       setProducts(pRes.data?.data?.items || []);
//       setCategories(cRes.data?.data?.items || []);
//     } catch {
//       toast.error("Failed to load data");
//     } finally {
//       setLoadingData(false);
//     }
//   }, []);

//   const createProduct = useCallback(
//     async (payload, files = []) => {
//       setSubmitting(true);
//       try {
//         const res = await createProductApi(payload);
//         const productId = res.data?.data?.id;
//         toast.success("Product created");

//         if (productId && files.length > 0) {
//           await uploadProductImagesApi(productId, files);
//           toast.success("Images uploaded");
//         }

//         await loadAll();
//         return true;
//       } catch (err) {
//         toast.error(err?.response?.data?.message || "Create failed");
//         return false;
//       } finally {
//         setSubmitting(false);
//       }
//     },
//     [loadAll]
//   );
  
//   const updateProduct = useCallback(async (id, payload, files = []) => {
//       setSubmitting(true);
//       try {
//         await updateProductApi(id, payload);
//         toast.success("Product updated");

//         if (files.length > 0) {
//           await uploadProductImagesApi(id, files);
//           toast.success("Images uploaded");
//         }

//         await loadAll();
//         return true;
//       } catch (err) {
//         toast.error(err?.response?.data?.message || "Update failed");
//         return false;
//       } finally {
//         setSubmitting(false);
//       }
//     },
//     [loadAll]
//   );

//   const deleteProduct = useCallback(async (id) => {
//       try {
//         await deleteProductApi(id);
//         toast.success("Product deleted");
//         await loadAll();
//       } catch {
//         toast.error("Delete failed");
//       }
//     },
//     [loadAll]
//   );

//   return {
//     products,
//     categories,
//     loadingData,
//     submitting,
//     loadAll,
//     createProduct,
//     updateProduct,
//     deleteProduct,
//   };
// }



import { useRef, useState, useEffect, useCallback } from "react";
import toast from "react-hot-toast";

import { getCategoriesApi } from "../../../../api/categoryApi";

import {
  createProductApi,
  deleteProductApi,
  updateProductApi,
  uploadProductImagesApi,
} from "../../../../api/productApi";

import { createNotificationsHub } from "../../../../realtime/signalr";

export function useProducts() {
  const gridRef = useRef(null);

  const [categories, setCategories] = useState([]);
  const [loadingData, setLoadingData] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // =========================================================
  // SIGNALR
  // =========================================================

  useEffect(() => {
    const connection = createNotificationsHub();

    connection.start().catch(console.error);

    connection.on("ProductStockUpdated", (updatedProduct) => {
      toast.success(
        `Stock updated: ${updatedProduct.name} (${updatedProduct.quantityInStock})`
      );

      gridRef.current?.instance?.refresh();
    });

    return () => connection.stop();
  }, []);

  // =========================================================
  // LOAD CATEGORIES
  // =========================================================

  const loadCategories = useCallback(async () => {
    setLoadingData(true);

    try {
      const response = await getCategoriesApi({
        pageNumber: 1,
        pageSize: 100,
        sortBy: "name",
        sortOrder: "asc",
      });

      setCategories(response.data?.data?.items || []);
    } catch (err) {
      toast.error("Failed to load categories");
    } finally {
      setLoadingData(false);
    }
  }, []);

  // =========================================================
  // REFRESH GRID
  // =========================================================

 const refreshGrid = useCallback(() => {
  try {
    const grid = gridRef.current?.instance;

    // DevExtreme compatibility
    if (typeof grid === "function") {
      grid().refresh();
      return;
    }

    if (grid?.refresh) {
      grid.refresh();
      return;
    }

    console.warn("Grid refresh unavailable");
  } catch (err) {
    console.error("GRID REFRESH ERROR:", err);
  }
}, []);

  // =========================================================
  // CREATE PRODUCT
  // =========================================================

  const createProduct = useCallback(
    async (payload, files = []) => {
      setSubmitting(true);

      const toastId = toast.loading("Creating product...");

      try {
        // STEP 1
        const response = await createProductApi(payload);

        console.log("CREATE PRODUCT RESPONSE:", response);

        const createdProduct = response?.data?.data;

        // SAFETY CHECK
        if (!createdProduct?.id) {
          throw new Error("Product created but ID missing");
        }

        // STEP 2 - IMAGE UPLOAD
        if (files.length > 0) {
          try {
            await uploadProductImagesApi(createdProduct.id, files);
          } catch (uploadError) {
            console.error(uploadError);

            toast.error(
              "Product created but image upload failed"
            );
          }
        }

        toast.success("Product created successfully!", {
          id: toastId,
        });

        refreshGrid();

        return true;
      } catch (err) {
        console.error("CREATE PRODUCT ERROR:", err);

        toast.error(
          err?.response?.data?.message ||
            err?.message ||
            "Failed to create product",
          {
            id: toastId,
          }
        );

        return false;
      } finally {
        setSubmitting(false);
      }
    },
    [refreshGrid]
  );

  // =========================================================
  // UPDATE PRODUCT
  // =========================================================

  const updateProduct = useCallback(
    async (id, payload, files = []) => {
      setSubmitting(true);

      const toastId = toast.loading("Updating product...");

      try {
        await updateProductApi(id, payload);

        // OPTIONAL IMAGE UPLOAD
        if (files.length > 0) {
          try {
            await uploadProductImagesApi(id, files);
          } catch (uploadError) {
            console.error(uploadError);

            toast.error(
              "Product updated but image upload failed"
            );
          }
        }

        toast.success("Product updated successfully!", {
          id: toastId,
        });

        refreshGrid();

        return true;
      } catch (err) {
        console.error("UPDATE PRODUCT ERROR:", err);

        toast.error(
          err?.response?.data?.message ||
            err?.message ||
            "Failed to update product",
          {
            id: toastId,
          }
        );

        return false;
      } finally {
        setSubmitting(false);
      }
    },
    [refreshGrid]
  );

  // =========================================================
  // DELETE PRODUCT
  // =========================================================

  const deleteProduct = useCallback(
    async (id) => {
      const toastId = toast.loading("Deleting product...");

      try {
        await deleteProductApi(id);

        toast.success("Product deleted successfully!", {
          id: toastId,
        });

        refreshGrid();

        return true;
      } catch (err) {
        console.error("DELETE PRODUCT ERROR:", err);

        toast.error(
          err?.response?.data?.message ||
            "Failed to delete product",
          {
            id: toastId,
          }
        );

        return false;
      }
    },
    [refreshGrid]
  );

  return {
    gridRef,
    categories,
    loadingData,
    submitting,
    loadCategories,
    createProduct,
    updateProduct,
    deleteProduct,
  };
}