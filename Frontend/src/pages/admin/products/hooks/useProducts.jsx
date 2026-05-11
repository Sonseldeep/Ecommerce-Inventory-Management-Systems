/* eslint-disable react-hooks/immutability */
/* eslint-disable react-hooks/preserve-manual-memoization */
import { useRef, useState, useEffect, useCallback } from "react";
import toast from "react-hot-toast";
import { getCategoriesApi } from "../../../../api/categoryApi";
import {
  createProductApi,
  deleteProductApi,
  getProductsApi,
  updateProductApi,
  uploadProductImagesApi,
} from "../../../../api/productApi";
import { createNotificationsHub } from "../../../../realtime/signalr";

export function useProducts() {
  const gridRef = useRef(null);

  const [categories, setCategories] = useState([]);
  const [loadingData, setLoadingData] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // ── SignalR ───────────────────────────────────────────────────
  useEffect(() => {
    const connection = createNotificationsHub();
    connection.start().catch(console.error);

    connection.on("ProductStockUpdated", (updatedProduct) => {
      toast.success(
        `Stock updated: ${updatedProduct.name} (${updatedProduct.quantityInStock})`
      );
      refreshGrid();
    });

    return () => connection.stop();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Refresh Grid ──────────────────────────────────────────────
  const refreshGrid = useCallback(() => {
    try {
      const grid = gridRef.current?.instance;
      if (typeof grid === "function") {
        grid().refresh();
      } else if (grid?.refresh) {
        grid.refresh();
      } else {
        console.warn("Grid refresh unavailable");
      }
    } catch (err) {
      console.error("Grid refresh error:", err);
    }
  }, []);

  // ── Load Categories ───────────────────────────────────────────
  const loadCategories = useCallback(async () => {
    setLoadingData(true);
    try {
      const res = await getCategoriesApi({
        pageNumber: 1,
        pageSize: 100,
        sortBy: "name",
        sortOrder: "asc",
      });
      setCategories(res.data?.data?.items || []);
    } catch {
      toast.error("Failed to load categories");
    } finally {
      setLoadingData(false);
    }
  }, []);

  // ── Fetch ALL Products for Export ─────────────────────────────
  /**
   * Fetches every product across all pages so exports are never
   * limited by the grid's current pagination window.
   */
  const fetchAllProductsForExport = useCallback(async () => {
    try {
      // First call: get totalCount with a minimal payload
      const probe = await getProductsApi({
        pageNumber: 1,
        pageSize: 1,
        sortBy: "name",
        sortOrder: "asc",
      });
      const totalCount = probe.data?.data?.totalCount ?? 0;
      if (totalCount === 0) return [];

      const res = await getProductsApi({
        pageNumber: 1,
        pageSize: totalCount,
        sortBy: "name",
        sortOrder: "asc",
      });
      return res.data?.data?.items ?? [];
    } catch (err) {
      console.error("Failed to fetch all products for export:", err);
      toast.error("Export failed: could not load all products");
      return [];
    }
  }, []);

  // ── Create Product ────────────────────────────────────────────
  const createProduct = useCallback(
    async (payload, files = []) => {
      setSubmitting(true);
      const toastId = toast.loading("Creating product...");
      try {
        const res = await createProductApi(payload);
        const created = res?.data?.data;

        if (!created?.id) throw new Error("Product created but ID missing");

        if (files.length > 0) {
          try {
            await uploadProductImagesApi(created.id, files);
          } catch (uploadErr) {
            console.error(uploadErr);
            toast.error("Product created but image upload failed");
          }
        }

        toast.success("Product created successfully!", { id: toastId });
        refreshGrid();
        return true;
      } catch (err) {
        console.error("Create product error:", err);
        toast.error(
          err?.response?.data?.message || err?.message || "Failed to create product",
          { id: toastId }
        );
        return false;
      } finally {
        setSubmitting(false);
      }
    },
    [refreshGrid]
  );

  // ── Update Product ────────────────────────────────────────────
  const updateProduct = useCallback(
    async (id, payload, files = []) => {
      setSubmitting(true);
      const toastId = toast.loading("Updating product...");
      try {
        await updateProductApi(id, payload);

        if (files.length > 0) {
          try {
            await uploadProductImagesApi(id, files);
          } catch (uploadErr) {
            console.error(uploadErr);
            toast.error("Product updated but image upload failed");
          }
        }

        toast.success("Product updated successfully!", { id: toastId });
        refreshGrid();
        return true;
      } catch (err) {
        console.error("Update product error:", err);
        toast.error(
          err?.response?.data?.message || err?.message || "Failed to update product",
          { id: toastId }
        );
        return false;
      } finally {
        setSubmitting(false);
      }
    },
    [refreshGrid]
  );

  // ── Delete Product ────────────────────────────────────────────
  const deleteProduct = useCallback(
    async (id) => {
      const toastId = toast.loading("Deleting product...");
      try {
        await deleteProductApi(id);
        toast.success("Product deleted successfully!", { id: toastId });
        refreshGrid();
        return true;
      } catch (err) {
        console.error("Delete product error:", err);
        toast.error(
          err?.response?.data?.message || "Failed to delete product",
          { id: toastId }
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
    fetchAllProductsForExport,
  };
}

// aaja ko
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

//   // =========================================================
//   // SIGNALR
//   // =========================================================

//   useEffect(() => {
//     const connection = createNotificationsHub();

//     connection.start().catch(console.error);

//     connection.on("ProductStockUpdated", (updatedProduct) => {
//       toast.success(
//         `Stock updated: ${updatedProduct.name} (${updatedProduct.quantityInStock})`
//       );

//       gridRef.current?.instance?.refresh();
//     });

//     return () => connection.stop();
//   }, []);

//   // =========================================================
//   // LOAD CATEGORIES
//   // =========================================================

//   const loadCategories = useCallback(async () => {
//     setLoadingData(true);

//     try {
//       const response = await getCategoriesApi({
//         pageNumber: 1,
//         pageSize: 100,
//         sortBy: "name",
//         sortOrder: "asc",
//       });

//       setCategories(response.data?.data?.items || []);
//     } catch (err) {
//       toast.error("Failed to load categories");
//     } finally {
//       setLoadingData(false);
//     }
//   }, []);

//   // =========================================================
//   // REFRESH GRID
//   // =========================================================

//  const refreshGrid = useCallback(() => {
//   try {
//     const grid = gridRef.current?.instance;

//     // DevExtreme compatibility
//     if (typeof grid === "function") {
//       grid().refresh();
//       return;
//     }

//     if (grid?.refresh) {
//       grid.refresh();
//       return;
//     }

//     console.warn("Grid refresh unavailable");
//   } catch (err) {
//     console.error("GRID REFRESH ERROR:", err);
//   }
// }, []);

//   // =========================================================
//   // CREATE PRODUCT
//   // =========================================================

//   const createProduct = useCallback(
//     async (payload, files = []) => {
//       setSubmitting(true);

//       const toastId = toast.loading("Creating product...");

//       try {
//         // STEP 1
//         const response = await createProductApi(payload);

//         console.log("CREATE PRODUCT RESPONSE:", response);

//         const createdProduct = response?.data?.data;

//         // SAFETY CHECK
//         if (!createdProduct?.id) {
//           throw new Error("Product created but ID missing");
//         }

//         // STEP 2 - IMAGE UPLOAD
//         if (files.length > 0) {
//           try {
//             await uploadProductImagesApi(createdProduct.id, files);
//           } catch (uploadError) {
//             console.error(uploadError);

//             toast.error(
//               "Product created but image upload failed"
//             );
//           }
//         }

//         toast.success("Product created successfully!", {
//           id: toastId,
//         });

//         refreshGrid();

//         return true;
//       } catch (err) {
//         console.error("CREATE PRODUCT ERROR:", err);

//         toast.error(
//           err?.response?.data?.message ||
//             err?.message ||
//             "Failed to create product",
//           {
//             id: toastId,
//           }
//         );

//         return false;
//       } finally {
//         setSubmitting(false);
//       }
//     },
//     [refreshGrid]
//   );

//   // =========================================================
//   // UPDATE PRODUCT
//   // =========================================================

//   const updateProduct = useCallback(
//     async (id, payload, files = []) => {
//       setSubmitting(true);

//       const toastId = toast.loading("Updating product...");

//       try {
//         await updateProductApi(id, payload);

//         // OPTIONAL IMAGE UPLOAD
//         if (files.length > 0) {
//           try {
//             await uploadProductImagesApi(id, files);
//           } catch (uploadError) {
//             console.error(uploadError);

//             toast.error(
//               "Product updated but image upload failed"
//             );
//           }
//         }

//         toast.success("Product updated successfully!", {
//           id: toastId,
//         });

//         refreshGrid();

//         return true;
//       } catch (err) {
//         console.error("UPDATE PRODUCT ERROR:", err);

//         toast.error(
//           err?.response?.data?.message ||
//             err?.message ||
//             "Failed to update product",
//           {
//             id: toastId,
//           }
//         );

//         return false;
//       } finally {
//         setSubmitting(false);
//       }
//     },
//     [refreshGrid]
//   );

//   // =========================================================
//   // DELETE PRODUCT
//   // =========================================================

//   const deleteProduct = useCallback(
//     async (id) => {
//       const toastId = toast.loading("Deleting product...");

//       try {
//         await deleteProductApi(id);

//         toast.success("Product deleted successfully!", {
//           id: toastId,
//         });

//         refreshGrid();

//         return true;
//       } catch (err) {
//         console.error("DELETE PRODUCT ERROR:", err);

//         toast.error(
//           err?.response?.data?.message ||
//             "Failed to delete product",
//           {
//             id: toastId,
//           }
//         );

//         return false;
//       }
//     },
//     [refreshGrid]
//   );

//   return {
//     gridRef,
//     categories,
//     loadingData,
//     submitting,
//     loadCategories,
//     createProduct,
//     updateProduct,
//     deleteProduct,
//   };
// }