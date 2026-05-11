

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