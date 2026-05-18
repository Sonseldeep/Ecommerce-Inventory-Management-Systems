import { useState } from "react";

export default function useCategoryDelete(onDelete) {
  const [state, setState] = useState({
    isOpen: false,
    categoryId: null,
  });

  const requestDelete = (id) => {
    setState({ isOpen: true, categoryId: id });
  };

  const cancelDelete = () => {
    setState({ isOpen: false, categoryId: null });
  };

  const confirmDelete = () => {
    onDelete(state.categoryId);
    cancelDelete();
  };

  return {
    deleteState: state,
    requestDelete,
    cancelDelete,
    confirmDelete,
  };
}