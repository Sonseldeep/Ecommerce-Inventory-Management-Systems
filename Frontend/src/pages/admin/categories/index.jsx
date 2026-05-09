

// import { useState } from "react";
// import { useCategories } from "./hooks/useCategories";
// import CategoriesGrid from "./components/CategoriesGrid";
// import CategoryFormModal from "./components/CategoryFormModal";

// export default function AdminCategoriesPage() {
//   const [modalState, setModalState] = useState({
//     open: false,
//     editData: null,
//   });

//   const {
//     gridRef, // Get the ref from the hook
//     submitting,
//     createCategory,
//     updateCategory,
//     deleteCategory,
//   } = useCategories();

//   const openCreate = () => setModalState({ open: true, editData: null });
//   const openEdit = (row) => setModalState({ open: true, editData: row });
//   const closeModal = () => setModalState({ open: false, editData: null });

//   const handleSubmit = async (payload) => {
//     const success = modalState.editData
//       ? await updateCategory(modalState.editData.id, payload)
//       : await createCategory(payload);

//     if (success) closeModal();
//   };

//   // CORRECTED: The ugly window.confirm is gone!
//   // The custom modal in CategoriesGrid now handles confirmation.
//   const handleDelete = async (id) => {
//     await deleteCategory(id);
//   };

//   return (
//     <div style={{ padding: 24 }}>
//       <CategoriesGrid
//         gridRef={gridRef} // Pass the ref down to the grid
//         onEdit={openEdit}
//         onDelete={handleDelete}
//         onAddNew={openCreate}
//       />

//       {modalState.open && (
//         <CategoryFormModal
//           editData={modalState.editData}
//           submitting={submitting}
//           onSubmit={handleSubmit}
//           onClose={closeModal}
//         />
//       )}
//     </div>
//   );
// }

// v2 - with initial data load fix and status toggle handler added but action missing 

// import { useState, useEffect } from "react";
// import { useCategories } from "./hooks/useCategories";
// import CategoriesGrid from "./components/CategoriesGrid";
// import CategoryFormModal from "./components/CategoryFormModal";

// export default function AdminCategoriesPage() {
//   const [modalState, setModalState] = useState({ open: false, editData: null });

//   const {
//     gridRef,
//     submitting,
//     loading,
//     categories,
//     loadCategories,
//     createCategory,
//     updateCategory,
//     deleteCategory,
//     toggleCategoryStatus,
//   } = useCategories();

//   // This useEffect is the critical fix for the initial data load.
//   useEffect(() => {
//     loadCategories({ pageNumber: 1, pageSize: 10 });
//   }, [loadCategories]);

//   const openCreate = () => setModalState({ open: true, editData: null });
//   const openEdit = (row) => setModalState({ open: true, editData: row });
//   const closeModal = () => setModalState({ open: false, editData: null });

//   const handleSubmit = async (payload) => {
//     const success = modalState.editData
//       ? await updateCategory(modalState.editData.id, payload)
//       : await createCategory(payload);
//     if (success) closeModal();
//   };

//   const handleDelete = async (id) => {
//     await deleteCategory(id);
//   };

//   return (
//     <div style={{ padding: 24 }}>
//       <CategoriesGrid
//         gridRef={gridRef}
//         categories={categories}
//         loading={loading}
//         loadCategories={loadCategories}
//         onEdit={openEdit}
//         onDelete={handleDelete}
//         onAddNew={openCreate}
//         onToggleStatus={toggleCategoryStatus}
//       />

//       {modalState.open && (
//         <CategoryFormModal
//           editData={modalState.editData}
//           submitting={submitting}
//           onSubmit={handleSubmit}
//           onClose={closeModal}
//         />
//       )}
//     </div>
//   );
// }


// import { useState } from "react";
// import { useCategories } from "./hooks/useCategories";
// import CategoriesGrid from "./components/CategoriesGrid";
// import CategoryFormModal from "./components/CategoryFormModal";

// export default function AdminCategoriesPage() {
//   const [modalState, setModalState] = useState({
//     open: false,
//     editData: null,
//   });

//   const {
//     gridRef,
//     submitting,
//     createCategory,
//     updateCategory,
//     deleteCategory,
//     toggleCategoryStatus, // Get the new handler from the hook
//   } = useCategories();

//   const openCreate = () => setModalState({ open: true, editData: null });
//   const openEdit = (row) => setModalState({ open: true, editData: row });
//   const closeModal = () => setModalState({ open: false, editData: null });

//   const handleSubmit = async (payload) => {
//     const success = modalState.editData
//       ? await updateCategory(modalState.editData.id, payload)
//       : await createCategory(payload);

//     if (success) closeModal();
//   };

//   const handleDelete = async (id) => {
//     await deleteCategory(id);
//   };
  
//   // No changes needed for the handleToggle function, just pass it down.

//   return (
//     <div style={{ padding: 24 }}>
//       <CategoriesGrid
//         gridRef={gridRef}
//         onEdit={openEdit}
//         onDelete={handleDelete}
//         onAddNew={openCreate}
//         onToggleStatus={toggleCategoryStatus} // Pass it as a prop
//       />

//       {modalState.open && (
//         <CategoryFormModal
//           editData={modalState.editData}
//           submitting={submitting}
//           onSubmit={handleSubmit}
//           onClose={closeModal}
//         />
//       )}
//     </div>
//   );
// }


import { useState } from "react";
import { useCategories } from "./hooks/useCategories";
import CategoriesGrid from "./components/CategoriesGrid";
import CategoryFormModal from "./components/CategoryFormModal";

export default function AdminCategoriesPage() {
  const [modalState, setModalState] = useState({ open: false, editData: null });

  const {
    gridRef,
    submitting,
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