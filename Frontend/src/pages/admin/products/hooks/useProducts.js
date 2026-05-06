import { useState, useEffect, useCallback } from "react";
import toast from "react-hot-toast";
import { getCategoriesApi } from "../../../../api/categoryApi";
import { createProductApi, deleteProductApi, getProductsApi, updateProductApi, uploadProductImagesApi } from "../../../../api/productApi";
import { createNotificationsHub } from "../../../../realtime/signalr";


export function useProducts() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loadingData, setLoadingData] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // --- Real-time Logic ---
  useEffect(() => {
    // --- FIX: Use the CORRECT connection factory ---
    // This connects to /hubs/notifications, which requires a token and is where the backend sends the message.
    const connection = createNotificationsHub();

    connection
      .start()
      .then(() => console.log("NotificationsHub Connection started for admin!"))
      .catch((err) => console.error("NotificationsHub Connection failed: ", err));
      
    // The rest of this logic is now correct because it's listening on the right connection.
    connection.on("ProductStockUpdated", (updatedProduct) => {
      console.log("EVENT RECEIVED: ProductStockUpdated", updatedProduct);
      toast.success(`Live Stock Update: ${updatedProduct.name} is now ${updatedProduct.quantityInStock}.`);
      
      setProducts(currentProducts => 
        currentProducts.map(p => 
          p.id === updatedProduct.id ? { ...p, quantityInStock: updatedProduct.quantityInStock } : p
        )
      );
    });

    // ... other listeners for "ProductCreated", "ProductDeleted" etc. can be added here if needed ...

    // Cleanup
    return () => {
      connection.stop().then(() => console.log("NotificationsHub Connection stopped."));
    };
  }, []); // Runs once on mount

  // --- Data Fetching & Mutations ---
  // No changes needed below this line. The existing logic is correct.
  const loadAll = useCallback(async () => {
    setLoadingData(true);
    try {
      const [pRes, cRes] = await Promise.all([
        getProductsApi({ pageNumber: 1, pageSize: 500 }),
        getCategoriesApi({ pageNumber: 1, pageSize: 100, sortBy: "name", sortOrder: "asc" }),
      ]);
      setProducts(pRes.data?.data?.items || []);
      setCategories(cRes.data?.data?.items || []);
    } catch {
      toast.error("Failed to load data");
    } finally {
      setLoadingData(false);
    }
  }, []);

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

        await loadAll();
        return true;
      } catch (err) {
        toast.error(err?.response?.data?.message || "Create failed");
        return false;
      } finally {
        setSubmitting(false);
      }
    },
    [loadAll]
  );
  
  const updateProduct = useCallback(async (id, payload, files = []) => {
      setSubmitting(true);
      try {
        await updateProductApi(id, payload);
        toast.success("Product updated");

        if (files.length > 0) {
          await uploadProductImagesApi(id, files);
          toast.success("Images uploaded");
        }

        await loadAll();
        return true;
      } catch (err) {
        toast.error(err?.response?.data?.message || "Update failed");
        return false;
      } finally {
        setSubmitting(false);
      }
    },
    [loadAll]
  );

  const deleteProduct = useCallback(async (id) => {
      try {
        await deleteProductApi(id);
        toast.success("Product deleted");
        await loadAll();
      } catch {
        toast.error("Delete failed");
      }
    },
    [loadAll]
  );

  return {
    products,
    categories,
    loadingData,
    submitting,
    loadAll,
    createProduct,
    updateProduct,
    deleteProduct,
  };
}
