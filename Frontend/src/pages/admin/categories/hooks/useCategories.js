/* eslint-disable no-undef */
// import { useCallback, useState } from "react";
// import toast from "react-hot-toast";
// import { createCategoryApi, deleteCategoryApi, getCategoriesApi, updateCategoryApi } from "../../../../api/categoryApi";


// export function useCategories() {
//   const [categories, setCategories] = useState([]);
//   const [loadingData, setLoadingData] = useState(false);
//   const [submitting, setSubmitting] = useState(false);

//   // Load all — DevExtreme DataGrid handles search / sort / filter / pagination client-side
//   const loadAll = useCallback(async () => {
//     setLoadingData(true);
//     try {
//       const res = await getCategoriesApi({
//         pageNumber: 1,
//         pageSize: 1000,
//         sortBy: "name",
//         sortOrder: "asc",
//       });
//       setCategories(res.data?.data?.items || []);
//     } catch {
//       toast.error("Failed to load categories");
//     } finally {
//       setLoadingData(false);
//     }
//   }, []);

//   const createCategory = useCallback(
//     async (payload) => {
//       setSubmitting(true);
//       try {
//         await createCategoryApi(payload);
//         toast.success("Category created");
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

//   const updateCategory = useCallback(
//     async (id, payload) => {
//       setSubmitting(true);
//       try {
//         await updateCategoryApi(id, payload);
//         toast.success("Category updated");
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

//   const deleteCategory = useCallback(
//     async (id) => {
//       try {
//         await deleteCategoryApi(id);
//         toast.success("Category deleted");
//         await loadAll();
//       } catch (err) {
//         toast.error(err?.response?.data?.message || "Delete failed");
//       }
//     },
//     [loadAll]
//   );

//   return {
//     categories,
//     loadingData,
//     submitting,
//     loadAll,
//     createCategory,
//     updateCategory,
//     deleteCategory,
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
  // ─────────────────────────────────────────────
  // GRID REF
  // ─────────────────────────────────────────────
  const gridRef = useRef(null);

  // ─────────────────────────────────────────────
  // STATE
  // ─────────────────────────────────────────────
  const [submitting, setSubmitting] = useState(false);

  // ─────────────────────────────────────────────
  // SAFE GRID RELOAD (DEVEXTREME BEST PRACTICE)
  // ─────────────────────────────────────────────
  const reloadGrid = useCallback(async () => {
    try {
      await gridRef.current?.instance
        ?.getDataSource()
        ?.reload();
    } catch (err) {
      console.warn("Grid reload warning:", err);
    }
  }, []);

  // ─────────────────────────────────────────────
  // CREATE CATEGORY
  // ─────────────────────────────────────────────
  const createCategory = useCallback(
    async (payload) => {
      setSubmitting(true);

      try {
        // Create
        await createCategoryApi(payload);

        // Reload grid safely
        await reloadGrid();

        // Success toast LAST
        toast.success("Category created successfully");

        return true;

      } catch (err) {
        console.error("CREATE CATEGORY ERROR:", err);

        toast.error(
          err?.response?.data?.message ||
            "Failed to create category"
        );

        return false;

      } finally {
        setSubmitting(false);
      }
    },
    [reloadGrid]
  );

  // ─────────────────────────────────────────────
  // UPDATE CATEGORY
  // ─────────────────────────────────────────────
  const updateCategory = useCallback(
    async (id, payload) => {
      setSubmitting(true);

      try {
        // Update
        await updateCategoryApi(id, payload);

        // Reload grid safely
        await reloadGrid();

        // Success toast LAST
        toast.success("Category updated successfully");

        return true;

      } catch (err) {
        console.error("UPDATE CATEGORY ERROR:", err);

        toast.error(
          err?.response?.data?.message ||
            "Failed to update category"
        );

        return false;

      } finally {
        setSubmitting(false);
      }
    },
    [reloadGrid]
  );

  // ─────────────────────────────────────────────
  // DELETE CATEGORY
  // ─────────────────────────────────────────────
  const deleteCategory = useCallback(
    async (id) => {
      setSubmitting(true);

      try {
        // Delete category
        await deleteCategoryApi(id);

        // Reload datasource safely
        await reloadGrid();

        // Success toast LAST
        toast.success("Category deleted successfully");

        return true;

      } catch (err) {
        console.error("DELETE CATEGORY ERROR:", err);

        toast.error(
          err?.response?.data?.message ||
            "Delete failed"
        );

        return false;

      } finally {
        setSubmitting(false);
      }
    },
    [reloadGrid]
  );

  // ─────────────────────────────────────────────
  // RETURN
  // ─────────────────────────────────────────────
  return {
    gridRef,
    submitting,

    createCategory,
    updateCategory,
    deleteCategory,
  };
}

// import { useState, useCallback } from "react";
// import toast from "react-hot-toast";
// import {
//   createCategoryApi,
//   deleteCategoryApi,
//   updateCategoryApi,
// } from "../../../../api/categoryApi";

// export function useCategories() {
//   const [submitting, setSubmitting] = useState(false);

//   const createCategory = useCallback(async (payload) => {
//     setSubmitting(true);
//     try {
//       await createCategoryApi(payload);
//       toast.success("Category created");
//       return true;
//     } catch {
//       toast.error("Create failed");
//       return false;
//     } finally {
//       setSubmitting(false);
//     }
//   }, []);

//   const updateCategory = useCallback(async (id, payload) => {
//     setSubmitting(true);
//     try {
//       await updateCategoryApi(id, payload);
//       toast.success("Category updated");
//       return true;
//     } catch {
//       toast.error("Update failed");
//       return false;
//     } finally {
//       setSubmitting(false);
//     }
//   }, []);

//   const deleteCategory = useCallback(async (id) => {
//     try {
//       await deleteCategoryApi(id);
//       toast.success("Category deleted");
//     } catch {
//       toast.error("Delete failed");
//     }
//   }, []);

//   return {
//     submitting,
//     createCategory,
//     updateCategory,
//     deleteCategory,
//   };
// }