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
  // ── Grid ref ────────────────────────────────────────────────────
  // Passed down to ProductsGrid so mutations can call .refresh()
  // instead of manually tracking page number and re-fetching.
  const gridRef = useRef(null);

  // ── State ────────────────────────────────────────────────────────
  // We no longer store `products` here — the CustomStore inside
  // ProductsGrid owns fetching. We only keep categories and UI flags.
  const [categories, setCategories] = useState([]);
  const [loadingData, setLoadingData] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // ── Real-time (SignalR) ──────────────────────────────────────────
  useEffect(() => {
    const connection = createNotificationsHub();

    connection
      .start()
      .then(() => console.log("NotificationsHub started"))
      .catch((err) => console.error(err));

    connection.on("ProductStockUpdated", (updatedProduct) => {
      toast.success(
        `Stock updated: ${updatedProduct.name} (${updatedProduct.quantityInStock})`
      );
      // Refresh the grid so the new stock value is visible
      gridRef.current?.instance?.refresh();
    });

    return () => connection.stop();
  }, []);

  // ── Load categories ──────────────────────────────────────────────
  // Products are no longer loaded here — the grid's CustomStore
  // handles that automatically on every page/sort/filter change.
  const loadCategories = useCallback(async () => {
    setLoadingData(true);
    try {
      const cRes = await getCategoriesApi({
        pageNumber: 1,
        pageSize: 100,
        sortBy: "name",
        sortOrder: "asc",
      });
      setCategories(cRes.data?.data?.items || []);
    } catch {
      toast.error("Failed to load categories");
    } finally {
      setLoadingData(false);
    }
  }, []);

  // ── Helper: tell DevExtreme to re-fetch the current page ─────────
  const refreshGrid = useCallback(() => {
    gridRef.current?.instance?.refresh();
  }, []);

  // ── CREATE ───────────────────────────────────────────────────────
  const createProduct = useCallback(
    async (payload, files = []) => {
      setSubmitting(true);
      try {
        const res = await createProductApi(payload);
        const productId = res.data?.data?.id;

        toast.success("Product created");

        if (productId && files.length > 0) {
          await uploadProductImagesApi(productId, files);
          toast.success("Images uploaded");
        }

        refreshGrid(); // re-fetch current page — no page-number tracking needed
        return true;
      } catch (err) {
        toast.error(err?.response?.data?.message || "Create failed");
        return false;
      } finally {
        setSubmitting(false);
      }
    },
    [refreshGrid]
  );

  // ── UPDATE ───────────────────────────────────────────────────────
  const updateProduct = useCallback(
    async (id, payload, files = []) => {
      setSubmitting(true);
      try {
        await updateProductApi(id, payload);
        toast.success("Product updated");

        if (files.length > 0) {
          await uploadProductImagesApi(id, files);
          toast.success("Images uploaded");
        }

        refreshGrid();
        return true;
      } catch (err) {
        toast.error(err?.response?.data?.message || "Update failed");
        return false;
      } finally {
        setSubmitting(false);
      }
    },
    [refreshGrid]
  );

  // ── DELETE ───────────────────────────────────────────────────────
  const deleteProduct = useCallback(
    async (id) => {
      try {
        await deleteProductApi(id);
        toast.success("Product deleted");
        refreshGrid();
      } catch {
        toast.error("Delete failed");
      }
    },
    [refreshGrid]
  );

  return {
    gridRef,          // pass to <ProductsGrid gridRef={gridRef} />
    categories,
    loadingData,
    submitting,
    loadCategories,   // call once on mount in AdminProductsPage
    createProduct,
    updateProduct,
    deleteProduct,
  };
}













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
