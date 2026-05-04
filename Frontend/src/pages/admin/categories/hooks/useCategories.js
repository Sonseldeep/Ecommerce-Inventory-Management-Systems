/* eslint-disable no-undef */
import { useCallback, useState } from "react";
import toast from "react-hot-toast";
import { createCategoryApi, deleteCategoryApi, getCategoriesApi, updateCategoryApi } from "../../../../api/categoryApi";


export function useCategories() {
  const [categories, setCategories] = useState([]);
  const [loadingData, setLoadingData] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Load all — DevExtreme DataGrid handles search / sort / filter / pagination client-side
  const loadAll = useCallback(async () => {
    setLoadingData(true);
    try {
      const res = await getCategoriesApi({
        pageNumber: 1,
        pageSize: 1000,
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

  const createCategory = useCallback(
    async (payload) => {
      setSubmitting(true);
      try {
        await createCategoryApi(payload);
        toast.success("Category created");
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

  const updateCategory = useCallback(
    async (id, payload) => {
      setSubmitting(true);
      try {
        await updateCategoryApi(id, payload);
        toast.success("Category updated");
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

  const deleteCategory = useCallback(
    async (id) => {
      try {
        await deleteCategoryApi(id);
        toast.success("Category deleted");
        await loadAll();
      } catch (err) {
        toast.error(err?.response?.data?.message || "Delete failed");
      }
    },
    [loadAll]
  );

  return {
    categories,
    loadingData,
    submitting,
    loadAll,
    createCategory,
    updateCategory,
    deleteCategory,
  };
}