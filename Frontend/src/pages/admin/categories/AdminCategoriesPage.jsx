import { useState } from "react";
import { useCategories } from "./hooks/useCategories";
import CategoriesGrid from "./components/CategoriesGrid";
import CategoryFormModal from "./components/CategoryFormModal";

export default function AdminCategoriesPage() {
  const [modalState, setModalState] = useState({ open: false, editData: null });

  const {
    gridRef,
    submitting,
    statusOverrides,
    createCategory,
    updateCategory,
    deleteCategory,
    toggleCategoryStatus,
  } = useCategories();

  const openCreate = () => setModalState({ open: true, editData: null });
  const openEdit = (row) => setModalState({ open: true, editData: row });
  const closeModal = () => setModalState({ open: false, editData: null });

  const handleSubmit = async (payload) => {
    const success = modalState.editData
      ? await updateCategory(modalState.editData.id, payload)
      : await createCategory(payload);
    if (success) closeModal();
  };

  const handleDelete = async (id) => {
    await deleteCategory(id);
  };

  return (
    <div style={{ padding: 24 }}>
      <CategoriesGrid
        gridRef={gridRef}
        onEdit={openEdit}
        onDelete={handleDelete}
        onAddNew={openCreate}
        onToggleStatus={toggleCategoryStatus}
        statusOverrides={statusOverrides}
      />

      {modalState.open && (
        <CategoryFormModal
          editData={modalState.editData}
          submitting={submitting}
          onSubmit={handleSubmit}
          onClose={closeModal}
        />
      )}
    </div>
  );
}
