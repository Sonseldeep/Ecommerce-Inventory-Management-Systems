/* eslint-disable no-unused-vars */

// import { useState, useCallback, useRef } from "react";
// import toast from "react-hot-toast";

// import {
//   createCategoryApi,
//   deleteCategoryApi,
//   updateCategoryApi,
// } from "../../../../api/categoryApi";

// export function useCategories() {
//   // ─────────────────────────────────────────────
//   // GRID REF
//   // ─────────────────────────────────────────────
//   const gridRef = useRef(null);

//   // ─────────────────────────────────────────────
//   // STATE
//   // ─────────────────────────────────────────────
//   const [submitting, setSubmitting] = useState(false);

//   // ─────────────────────────────────────────────
//   // SAFE GRID RELOAD (DEVEXTREME BEST PRACTICE)
//   // ─────────────────────────────────────────────
//   const reloadGrid = useCallback(async () => {
//     try {
//       await gridRef.current?.instance
//         ?.getDataSource()
//         ?.reload();
//     } catch (err) {
//       console.warn("Grid reload warning:", err);
//     }
//   }, []);

//   // ─────────────────────────────────────────────
//   // CREATE CATEGORY
//   // ─────────────────────────────────────────────
//   const createCategory = useCallback(
//     async (payload) => {
//       setSubmitting(true);

//       try {
//         // Create
//         await createCategoryApi(payload);

//         // Reload grid safely
//         await reloadGrid();

//         // Success toast LAST
//         toast.success("Category created successfully");

//         return true;

//       } catch (err) {
//         console.error("CREATE CATEGORY ERROR:", err);

//         toast.error(
//           err?.response?.data?.message ||
//             "Failed to create category"
//         );

//         return false;

//       } finally {
//         setSubmitting(false);
//       }
//     },
//     [reloadGrid]
//   );

//   // ─────────────────────────────────────────────
//   // UPDATE CATEGORY
//   // ─────────────────────────────────────────────
//   const updateCategory = useCallback(
//     async (id, payload) => {
//       setSubmitting(true);

//       try {
//         // Update
//         await updateCategoryApi(id, payload);

//         // Reload grid safely
//         await reloadGrid();

//         // Success toast LAST
//         toast.success("Category updated successfully");

//         return true;

//       } catch (err) {
//         console.error("UPDATE CATEGORY ERROR:", err);

//         toast.error(
//           err?.response?.data?.message ||
//             "Failed to update category"
//         );

//         return false;

//       } finally {
//         setSubmitting(false);
//       }
//     },
//     [reloadGrid]
//   );

//   // ─────────────────────────────────────────────
//   // DELETE CATEGORY
//   // ─────────────────────────────────────────────
//   const deleteCategory = useCallback(
//     async (id) => {
//       setSubmitting(true);

//       try {
//         // Delete category
//         await deleteCategoryApi(id);

//         // Reload datasource safely
//         await reloadGrid();

//         // Success toast LAST
//         toast.success("Category deleted successfully");

//         return true;

//       } catch (err) {
//         console.error("DELETE CATEGORY ERROR:", err);

//         toast.error(
//           err?.response?.data?.message ||
//             "Delete failed"
//         );

//         return false;

//       } finally {
//         setSubmitting(false);
//       }
//     },
//     [reloadGrid]
//   );

//   // ─────────────────────────────────────────────
//   // RETURN
//   // ─────────────────────────────────────────────
//   return {
//     gridRef,
//     submitting,

//     createCategory,
//     updateCategory,
//     deleteCategory,
//   };
// }


// v2 toggle 
// import { useState, useCallback, useRef } from "react";
// import toast from "react-hot-toast";

// import {
//   createCategoryApi,
//   deleteCategoryApi,
//   updateCategoryApi,
// } from "../../../../api/categoryApi";

// export function useCategories() {
//   const gridRef = useRef(null);
//   const [submitting, setSubmitting] = useState(false);

//   const reloadGrid = useCallback(async () => {
//     try {
//       await gridRef.current?.instance?.getDataSource()?.reload();
//     } catch (err) {
//       console.warn("Grid reload warning:", err);
//     }
//   }, []);

//   // --- NEW: TOGGLE STATUS FUNCTION ---
//   const toggleCategoryStatus = useCallback(
//     async (category) => {
//       const newStatus = !category.isActive;
//       const toastId = toast.loading(`Updating status to ${newStatus ? 'Active' : 'Inactive'}...`);

//       try {
//         // Optimistically create the payload
//         const payload = {
//           name: category.name,
//           description: category.description,
//           isActive: newStatus,
//         };

//         // Call the update API
//         await updateCategoryApi(category.id, payload);

//         // Reload the grid to show the change
//         await reloadGrid();

//         toast.success("Status updated successfully", { id: toastId });
//         return true;

//       } catch (err) {
//         console.error("TOGGLE STATUS ERROR:", err);
//         toast.error(err?.response?.data?.message || "Failed to update status", { id: toastId });
//         return false;
//       }
//     },
//     [reloadGrid]
//   );
  
//   const createCategory = useCallback(async (payload) => { setSubmitting(true); try { await createCategoryApi(payload); await reloadGrid(); toast.success("Category created successfully"); return true; } catch (err) { console.error("CREATE CATEGORY ERROR:", err); toast.error(err?.response?.data?.message || "Failed to create category"); return false; } finally { setSubmitting(false); } }, [reloadGrid] );
//   const updateCategory = useCallback(async (id, payload) => { setSubmitting(true); try { await updateCategoryApi(id, payload); await reloadGrid(); toast.success("Category updated successfully"); return true; } catch (err) { console.error("UPDATE CATEGORY ERROR:", err); toast.error( err?.response?.data?.message || "Failed to update category" ); return false; } finally { setSubmitting(false); } }, [reloadGrid] );
//   const deleteCategory = useCallback(async (id) => { setSubmitting(true); try { await deleteCategoryApi(id); await reloadGrid(); toast.success("Category deleted successfully"); return true; } catch (err) { console.error("DELETE CATEGORY ERROR:", err); toast.error(err?.response?.data?.message || "Delete failed"); return false; } finally { setSubmitting(false); } }, [reloadGrid] );

//   return {
//     gridRef,
//     submitting,
//     createCategory,
//     updateCategory,
//     deleteCategory,
//     toggleCategoryStatus, // Expose the new function
//   };
// }

// v3 with real time toggle but action part missing

// import { useState, useCallback, useRef } from "react";
// import toast from "react-hot-toast";
// import {
//   createCategoryApi,
//   deleteCategoryApi,
//   updateCategoryApi,
//   getCategoriesApi,
// } from "../../../../api/categoryApi";

// export function useCategories() {
//   const gridRef = useRef(null);
//   const [submitting, setSubmitting] = useState(false);
//   const [categories, setCategories] = useState([]);
//   const [loading, setLoading] = useState(true);

//   // --- CORRECTED: Make loadCategories a stable function with useCallback ---
//   const loadCategories = useCallback(async (options) => {
//     setLoading(true);
//     try {
//       const res = await getCategoriesApi(options);
//       const data = res.data?.data;
//       if (data?.items) {
//         setCategories(data.items);
//       }
//       return {
//         data: data?.items || [],
//         totalCount: data?.totalCount || 0,
//       };
//     } catch (err) {
//       toast.error("Failed to load categories");
//       return { data: [], totalCount: 0 };
//     } finally {
//       setLoading(false);
//     }
//   }, []); // Empty dependency array makes this function stable

//   const toggleCategoryStatus = useCallback(
//     async (categoryToToggle) => {
//       const originalCategories = categories;
//       setCategories((current) =>
//         current.map((cat) =>
//           cat.id === categoryToToggle.id
//             ? { ...cat, isActive: !cat.isActive }
//             : cat
//         )
//       );
//       try {
//         await updateCategoryApi(categoryToToggle.id, { ...categoryToToggle, isActive: !categoryToToggle.isActive });
//         toast.success("Status updated");
//       } catch (err) {
//         toast.error("Update failed. Reverting change.");
//         setCategories(originalCategories);
//       }
//     },
//     [categories]
//   );
  
//   const createCategory = useCallback(async (payload) => { setSubmitting(true); try { await createCategoryApi(payload); gridRef.current?.instance.refresh(); toast.success("Category created successfully"); return true; } catch (err) { toast.error(err?.response?.data?.message || "Failed to create category"); return false; } finally { setSubmitting(false); } }, []);
//   const updateCategory = useCallback(async (id, payload) => { setSubmitting(true); try { await updateCategoryApi(id, payload); gridRef.current?.instance.refresh(); toast.success("Category updated successfully"); return true; } catch (err) { toast.error(err?.response?.data?.message || "Failed to update category"); return false; } finally { setSubmitting(false); } }, []);
//   const deleteCategory = useCallback(async (id) => { setSubmitting(true); try { await deleteCategoryApi(id); gridRef.current?.instance.refresh(); toast.success("Category deleted successfully"); return true; } catch (err) { toast.error(err?.response?.data?.message || "Delete failed"); return false; } finally { setSubmitting(false); } }, []);

//   return {
//     gridRef,
//     submitting,
//     loading,
//     categories,
//     loadCategories,
//     createCategory,
//     updateCategory,
//     deleteCategory,
//     toggleCategoryStatus,
//   };
// }


import { useState, useCallback, useRef } from "react";
import toast from "react-hot-toast";
import {
  createCategoryApi,
  deleteCategoryApi,
  updateCategoryApi,
} from "../../../../api/categoryApi";

export function useCategories() {
  const gridRef = useRef(null);
  const [submitting, setSubmitting] = useState(false);

  const reloadGrid = useCallback(() => {
    gridRef.current?.instance.refresh();
  }, []);

  // --- THIS IS THE FINAL, CORRECTED FUNCTION ---
  const toggleCategoryStatus = useCallback(
    async (categoryToToggle) => {
      const grid = gridRef.current?.instance;
      if (!grid) return;

      const newStatus = !categoryToToggle.isActive;
      const rowIndex = grid.getRowIndexByKey(categoryToToggle.id);

      // 1. Instantly update the UI (Optimistic Update)
      grid.beginUpdate();
      grid.cellValue(rowIndex, "isActive", newStatus);
      grid.endUpdate();

      try {
        // 2. Make the API call and await the response
        const response = await updateCategoryApi(categoryToToggle.id, {
          ...categoryToToggle,
          description: categoryToToggle.description || "", // Ensure description is not null
          isActive: newStatus,
        });

        // 3. Check for a successful HTTP status (2xx). This handles 200, 204, etc.
        if (response && response.status >= 200 && response.status < 300) {
          toast.success("Status updated successfully");
          // Optionally, refresh data in the background to ensure consistency
          setTimeout(() => reloadGrid(), 500);
        } else {
          // If the status is not successful, manually throw an error
          throw new Error("Server responded with an error.");
        }

      } catch (err) {
        // 4. On actual failure, revert the UI and show an error toast
        toast.error("Status update failed. Reverting.");
        grid.beginUpdate();
        grid.cellValue(rowIndex, "isActive", categoryToToggle.isActive);
        grid.endUpdate();
      }
    },
    [reloadGrid]
  );

  const createCategory = useCallback(async (payload) => {
    setSubmitting(true);
    try {
      await createCategoryApi(payload);
      reloadGrid();
      toast.success("Category created successfully");
      return true;
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to create category");
      return false;
    } finally {
      setSubmitting(false);
    }
  }, [reloadGrid]);

  const updateCategory = useCallback(async (id, payload) => {
    setSubmitting(true);
    try {
      await updateCategoryApi(id, payload);
      reloadGrid();
      toast.success("Category updated successfully");
      return true;
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to update category");
      return false;
    } finally {
      setSubmitting(false);
    }
  }, [reloadGrid]);

  const deleteCategory = useCallback(async (id) => {
    setSubmitting(true);
    try {
      await deleteCategoryApi(id);
      reloadGrid();
      toast.success("Category deleted successfully");
      return true;
    } catch (err) {
      toast.error(err?.response?.data?.message || "Delete failed");
      return false;
    } finally {
      setSubmitting(false);
    }
  }, [reloadGrid]);

  return {
    gridRef,
    submitting,
    createCategory,
    updateCategory,
    deleteCategory,
    toggleCategoryStatus,
  };
}


// import { useState, useCallback, useRef } from "react";
// import toast from "react-hot-toast";
// import {
//   createCategoryApi,
//   deleteCategoryApi,
//   updateCategoryApi,
// } from "../../../../api/categoryApi";

// export function useCategories() {
//   const gridRef = useRef(null);
//   const [submitting, setSubmitting] = useState(false);

//   // Helper to safely reload the grid's data from the server
//   const reloadGrid = useCallback(() => {
//     gridRef.current?.instance.refresh();
//   }, []);

//   // Logic for the instant status toggle
//   const toggleCategoryStatus = useCallback(
//     async (categoryToToggle) => {
//       const grid = gridRef.current?.instance;
//       if (!grid) return;

//       // 1. Instantly update the specific cell's value in the UI
//       grid.beginUpdate();
//       grid.cellValue(
//         grid.getRowIndexByKey(categoryToToggle.id),
//         "isActive",
//         !categoryToToggle.isActive
//       );
//       grid.endUpdate();

//       try {
//         // 2. Make the API call in the background
//         await updateCategoryApi(categoryToToggle.id, {
//           ...categoryToToggle,
//           isActive: !categoryToToggle.isActive,
//         });
//         toast.success("Status updated successfully");
        
//         // 3. (Optional but recommended) Silently refresh data to ensure consistency
//         setTimeout(() => reloadGrid(), 1000);

//       } catch (err) {
//         toast.error("Status update failed. Reverting.");
//         // 4. If the API fails, revert the cell's value back to its original state
//         grid.beginUpdate();
//         grid.cellValue(
//           grid.getRowIndexByKey(categoryToToggle.id),
//           "isActive",
//           categoryToToggle.isActive
//         );
//         grid.endUpdate();
//       }
//     },
//     [reloadGrid]
//   );

//   const createCategory = useCallback(async (payload) => {
//     setSubmitting(true);
//     try {
//       await createCategoryApi(payload);
//       reloadGrid();
//       toast.success("Category created successfully");
//       return true;
//     } catch (err) {
//       toast.error(err?.response?.data?.message || "Failed to create category");
//       return false;
//     } finally {
//       setSubmitting(false);
//     }
//   }, [reloadGrid]);

//   const updateCategory = useCallback(async (id, payload) => {
//     setSubmitting(true);
//     try {
//       await updateCategoryApi(id, payload);
//       reloadGrid();
//       toast.success("Category updated successfully");
//       return true;
//     } catch (err) {
//       toast.error(err?.response?.data?.message || "Failed to update category");
//       return false;
//     } finally {
//       setSubmitting(false);
//     }
//   }, [reloadGrid]);

//   const deleteCategory = useCallback(async (id) => {
//     setSubmitting(true);
//     try {
//       await deleteCategoryApi(id);
//       reloadGrid();
//       toast.success("Category deleted successfully");
//       return true;
//     } catch (err) {
//       toast.error(err?.response?.data?.message || "Delete failed");
//       return false;
//     } finally {
//       setSubmitting(false);
//     }
//   }, [reloadGrid]);

//   return {
//     gridRef,
//     submitting,
//     createCategory,
//     updateCategory,
//     deleteCategory,
//     toggleCategoryStatus,
//   };
// }