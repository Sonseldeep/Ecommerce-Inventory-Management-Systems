// import { useEffect, useState } from "react";
// import { useCategories } from "./hooks/useCategories";
// import CategoriesGrid from "./components/CategoriesGrid";
// import CategoryFormModal from "./components/CategoryFormModal";

// export default function AdminCategoriesPage() {
//   const [modalState, setModalState] = useState({ open: false, editData: null });

//   const {
//     categories,
//     loadingData,
//     submitting,
//     loadAll,
//     createCategory,
//     updateCategory,
//     deleteCategory,
//   } = useCategories();

//   useEffect(() => { loadAll(); }, [loadAll]);

//   // ── Modal helpers ──────────────────────────────────────────────────────────
//   const openCreate = () => setModalState({ open: true, editData: null });
//   const openEdit = (row) => setModalState({ open: true, editData: row });
//   const closeModal = () => setModalState({ open: false, editData: null });

//   // ── Form submit ────────────────────────────────────────────────────────────
//   const handleSubmit = async (payload) => {
//     const success = modalState.editData
//       ? await updateCategory(modalState.editData.id, payload)
//       : await createCategory(payload);
//     if (success) closeModal();
//   };

//   // ── Delete with confirm ────────────────────────────────────────────────────
//   const handleDelete = (id) => {
//     if (window.confirm("Delete this category? This action cannot be undone.")) {
//       deleteCategory(id);
//     }
//   };

//   return (
//     <div
//       style={{
//         padding: 24,
//         maxWidth: 1100,
//         margin: "0 auto",
//         fontFamily: "'Segoe UI', sans-serif",
//       }}
//     >
//       {/* ── Page Header ────────────────────────────────────────────────────── */}
//       <div
//         style={{
//           display: "flex",
//           justifyContent: "space-between",
//           alignItems: "center",
//           marginBottom: 24,
//         }}
//       >
//         <div>
//           <h1 style={{ fontSize: 22, fontWeight: 700, color: "#111", margin: 0 }}>
//             Categories
//           </h1>
//           <p style={{ fontSize: 13, color: "#6b7280", marginTop: 3 }}>
//             Manage product categories · Export
//           </p>
//         </div>

//         {/* <button
//           onClick={openCreate}
//           style={{
//             padding: "9px 18px",
//             borderRadius: 9,
//             border: "none",
//             background: "#111",
//             color: "#fff",
//             fontSize: 13,
//             fontWeight: 600,
//             cursor: "pointer",
//           }}
//         >
//           + New Category
//         </button> */}
//       </div>

//       {/* ── Loading ────────────────────────────────────────────────────────── */}
//       {loadingData && (
//         <div
//           style={{
//             textAlign: "center",
//             padding: 40,
//             color: "#6b7280",
//             fontSize: 14,
//           }}
//         >
//           Loading categories…
//         </div>
//       )}

//       {/* ── Grid ───────────────────────────────────────────────────────────── */}
//       {!loadingData && (
//         <CategoriesGrid
//           categories={categories}
//           onEdit={openEdit}
//           onDelete={handleDelete}
//           onAddNew={openCreate}
//         />
//       )}

//       {/* ── Create / Edit Modal ─────────────────────────────────────────────── */}
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
  const [modalState, setModalState] = useState({
    open: false,
    editData: null,
  });

  const {
    gridRef, // Get the ref from the hook
    submitting,
    createCategory,
    updateCategory,
    deleteCategory,
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

  // CORRECTED: The ugly window.confirm is gone!
  // The custom modal in CategoriesGrid now handles confirmation.
  const handleDelete = async (id) => {
    await deleteCategory(id);
  };

  return (
    <div style={{ padding: 24 }}>
      <CategoriesGrid
        gridRef={gridRef} // Pass the ref down to the grid
        onEdit={openEdit}
        onDelete={handleDelete}
        onAddNew={openCreate}
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

//   const handleDelete = async (id) => {
//     if (window.confirm("Delete this category?")) {
//       await deleteCategory(id);
//     }
//   };

//   return (
//     <div style={{ padding: 24 }}>
//       <CategoriesGrid
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