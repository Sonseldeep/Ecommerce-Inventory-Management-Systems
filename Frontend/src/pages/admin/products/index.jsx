import { useEffect, useState } from "react";
import { useProducts } from "./hooks/useProducts";
import ProductsGrid from "./components/ProductsGrid";
import ProductFormModal from "./components/ProductFormModal";
import "./AdminProductsPage.css";
import ImportPreviewModal from "./components/Importpreviewmodal";


export default function AdminProductsPage() {
  const [modalState, setModalState] = useState({ open: false, editData: null });
  const [showImport, setShowImport] = useState(false); // ← ADD

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

  const openCreate = () => setModalState({ open: true, editData: null });
  const openEdit   = (row) => setModalState({ open: true, editData: row });
  const closeModal = () => setModalState({ open: false, editData: null });

  const handleSubmit = async (payload, files) => {
    const success = modalState.editData
      ? await updateProduct(modalState.editData.id, payload, files)
      : await createProduct(payload, files);

    if (success) closeModal();
  };

  const handleDelete = async (id) => {
    await deleteProduct(id);
  };

  return (
    <div className="products-page">
      {/* Header */}
      <div className="products-page-header">
        <div>
          <h1 className="products-page-title">Products</h1>
      
        </div>
        <button className="products-new-btn" onClick={openCreate}>
          + New Product
        </button>
      </div>

      {/* Loading */}
      {loadingData && (
        <p className="products-loading">Loading…</p>
      )}

      {!loadingData && (
        <ProductsGrid
          gridRef={gridRef}
          categories={categories}
          onEdit={openEdit}
          onDelete={handleDelete}
          onExportAll={fetchAllProductsForExport}
          onImport={() => setShowImport(true)} 
        />
      )}

      {modalState.open && (
        <ProductFormModal
          editData={modalState.editData}
          categories={categories}
          submitting={submitting}
          onSubmit={handleSubmit}
          onClose={closeModal}
        />
      )}

      {showImport && (
        <ImportPreviewModal
          onClose={() => setShowImport(false)}
          onImportSuccess={() => {
            setShowImport(false);
            const grid = gridRef.current?.instance;
            if (typeof grid === "function") grid().refresh();
            else if (grid?.refresh) grid.refresh();
          }}
        />
      )}
    </div>
  );
}