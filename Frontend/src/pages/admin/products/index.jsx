// import { useEffect, useState } from "react";
// import { useProducts } from "./hooks/useProducts";
// import ProductsGrid from "./components/ProductsGrid";
// import ProductFormModal from "./components/ProductFormModal";

// const TAB_ITEMS = [
//   { id: "grid", label: "📦 Products Grid" },
// ];

// export default function AdminProductsPage() {
//   const [activeTab, setActiveTab] = useState("grid");
//   const [modalState, setModalState] = useState({ open: false, editData: null });

//   const {
//     gridRef,
//     categories,
//     loadingData,
//     submitting,
//     loadCategories,
//     createProduct,
//     updateProduct,
//     deleteProduct,
//   } = useProducts();

//   useEffect(() => {
//     loadCategories();
//   }, [loadCategories]);

//   // ── Modal helpers ─────────────────────────────────────────────
//   const openCreate = () => setModalState({ open: true, editData: null });

//   const openEdit = (row) =>
//     setModalState({ open: true, editData: row });

//   const closeModal = () =>
//     setModalState({ open: false, editData: null });

//   // ── Submit ────────────────────────────────────────────────────
//   const handleSubmit = async (payload, files) => {
//     const success = modalState.editData
//       ? await updateProduct(modalState.editData.id, payload, files)
//       : await createProduct(payload, files);

//     if (success) closeModal();
//   };

//   // ── Delete ────────────────────────────────────────────────────
// const handleDelete = async (id) => {
//   try {
//     await deleteProduct(id);
//   } catch (err) {
//     console.error(err);
//   }
// };

//   return (
//     <div
//       style={{
//         padding: 24,
//         maxWidth: 1400,
//         margin: "0 auto",
//         fontFamily: "'Segoe UI', sans-serif",
//       }}
//     >
//       {/* ── Header ─────────────────────────────────────────────── */}
//       <div
//         style={{
//           display: "flex",
//           justifyContent: "space-between",
//           alignItems: "center",
//           marginBottom: 20,
//         }}
//       >
//         <div>
//           <h1 style={{ fontSize: 22, fontWeight: 700, margin: 0 }}>
//             Products
//           </h1>
//           <p style={{ fontSize: 13, color: "#6b7280", marginTop: 3 }}>
//             Manage inventory · Export · Analyse
//           </p>
//         </div>

//         {activeTab === "grid" && (
//           <button
//             onClick={openCreate}
//             style={{
//               padding: "9px 18px",
//               borderRadius: 9,
//               border: "none",
//               background: "#111",
//               color: "#fff",
//               fontSize: 13,
//               fontWeight: 600,
//               cursor: "pointer",
//             }}
//           >
//             + New Product
//           </button>
//         )}
//       </div>

//       {/* ── Tabs ──────────────────────────────────────────────── */}
//       <div
//         style={{
//           display: "flex",
//           gap: 4,
//           background: "#f3f4f6",
//           borderRadius: 10,
//           padding: 4,
//           width: "fit-content",
//           marginBottom: 20,
//         }}
//       >
//         {TAB_ITEMS.map((tab) => (
//           <button
//             key={tab.id}
//             onClick={() => setActiveTab(tab.id)}
//             style={{
//               padding: "7px 20px",
//               borderRadius: 8,
//               border: "none",
//               cursor: "pointer",
//               fontSize: 13,
//               fontWeight: 600,
//               background: activeTab === tab.id ? "#fff" : "transparent",
//               color: activeTab === tab.id ? "#111" : "#6b7280",
//               boxShadow:
//                 activeTab === tab.id
//                   ? "0 1px 4px rgba(0,0,0,.1)"
//                   : "none",
//             }}
//           >
//             {tab.label}
//           </button>
//         ))}
//       </div>

//       {/* ── Loading ───────────────────────────────────────────── */}
//       {loadingData && (
//         <div
//           style={{
//             textAlign: "center",
//             padding: 40,
//             color: "#6b7280",
//             fontSize: 14,
//           }}
//         >
//           Loading…
//         </div>
//       )}

//       {/* ── Content ───────────────────────────────────────────── */}
//       {!loadingData && (
//         <>
//           {activeTab === "grid" && (
//             <ProductsGrid
//               gridRef={gridRef}
//               categories={categories}
//               onEdit={openEdit}
//               onDelete={handleDelete}
//               onAddNew={openCreate}
//             />
//           )}
//         </>
//       )}

//       {/* ── Modal ─────────────────────────────────────────────── */}
//       {modalState.open && (
//         <ProductFormModal
//           editData={modalState.editData}
//           categories={categories}
//           submitting={submitting}
//           onSubmit={handleSubmit}
//           onClose={closeModal}
//         />
//       )}
//     </div>
//   );
// }



import { useEffect, useState } from "react";
import { useProducts } from "./hooks/useProducts";
import ProductsGrid from "./components/ProductsGrid";
import ProductFormModal from "./components/ProductFormModal";
import "./AdminProductsPage.css";

export default function AdminProductsPage() {
  const [modalState, setModalState] = useState({ open: false, editData: null });

  const {
    gridRef,
    categories,
    loadingData,
    submitting,
    loadCategories,
    createProduct,
    updateProduct,
    deleteProduct,
    fetchAllProductsForExport,
  } = useProducts();

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  // ── Modal helpers ──────────────────────────────────────────────
  const openCreate = () => setModalState({ open: true, editData: null });
  const openEdit   = (row) => setModalState({ open: true, editData: row });
  const closeModal = () => setModalState({ open: false, editData: null });

  // ── Submit ─────────────────────────────────────────────────────
  const handleSubmit = async (payload, files) => {
    const success = modalState.editData
      ? await updateProduct(modalState.editData.id, payload, files)
      : await createProduct(payload, files);

    if (success) closeModal();
  };

  // ── Delete ─────────────────────────────────────────────────────
  const handleDelete = async (id) => {
    await deleteProduct(id);
  };

  // ── Render ─────────────────────────────────────────────────────
  return (
    <div className="products-page">
      {/* Header */}
      <div className="products-page-header">
        <div>
          <h1 className="products-page-title">Products</h1>
          <p className="products-page-subtitle">
            Manage inventory · Export · Analyse
          </p>
        </div>
        <button className="products-new-btn" onClick={openCreate}>
          + New Product
        </button>
      </div>

      {/* Loading */}
      {loadingData && (
        <p className="products-loading">Loading…</p>
      )}

      {/* Grid */}
      {!loadingData && (
        <ProductsGrid
          gridRef={gridRef}
          categories={categories}
          onEdit={openEdit}
          onDelete={handleDelete}
          onExportAll={fetchAllProductsForExport}
        />
      )}

      {/* Modal */}
      {modalState.open && (
        <ProductFormModal
          editData={modalState.editData}
          categories={categories}
          submitting={submitting}
          onSubmit={handleSubmit}
          onClose={closeModal}
        />
      )}
    </div>
  );
}