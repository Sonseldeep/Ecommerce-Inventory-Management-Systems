/* eslint-disable no-unused-vars */


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

  const [statusOverrides, setStatusOverrides] = useState({});

  
  const lastToggleAt = useRef({});
  const TOGGLE_DEBOUNCE_MS = 600;

  const reloadGrid = useCallback(() => {
    const comp = gridRef.current;
    if (!comp) return;

    const inst =
      typeof comp.instance === "function" ? comp.instance() : comp.instance;
    inst?.refresh();
  }, []);

  const clearOverride = useCallback((id) => {
    setStatusOverrides((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
  }, []);

  const toggleCategoryStatus = useCallback(
    async (category) => {
      const now = Date.now();
      const last = lastToggleAt.current[category.id] || 0;
      if (now - last < TOGGLE_DEBOUNCE_MS) return;
      lastToggleAt.current[category.id] = now;

      const newStatus = !category.isActive;

      setStatusOverrides((prev) => ({ ...prev, [category.id]: newStatus }));

      try {
        await updateCategoryApi(category.id, {
          name: category.name,
          description: category.description || "",
          isActive: newStatus,
        });

        toast.success(
          `"${category.name}" marked ${newStatus ? "Active" : "Inactive"}`
        );

        reloadGrid();
        clearOverride(category.id);
      } catch (err) {
        clearOverride(category.id);
        toast.error(
          err?.response?.data?.message || "Failed to update status. Try again."
        );
      }
    },
    [reloadGrid, clearOverride]
  );

  const createCategory = useCallback(
    async (payload) => {
      setSubmitting(true);
      try {
        await createCategoryApi(payload);
        reloadGrid();
        toast.success("Category created successfully");
        return true;
      } catch (err) {
        toast.error(
          err?.response?.data?.message || "Failed to create category"
        );
        return false;
      } finally {
        setSubmitting(false);
      }
    },
    [reloadGrid]
  );

  const updateCategory = useCallback(
    async (id, payload) => {
      setSubmitting(true);
      try {
        await updateCategoryApi(id, payload);
        reloadGrid();
        toast.success("Category updated successfully");
        return true;
      } catch (err) {
        toast.error(
          err?.response?.data?.message || "Failed to update category"
        );
        return false;
      } finally {
        setSubmitting(false);
      }
    },
    [reloadGrid]
  );

  const deleteCategory = useCallback(
    async (id) => {
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
    },
    [reloadGrid]
  );

  return {
    gridRef,
    submitting,
    statusOverrides,
    createCategory,
    updateCategory,
    deleteCategory,
    toggleCategoryStatus,
  };
}
