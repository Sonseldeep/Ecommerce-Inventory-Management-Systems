import { useState } from "react";
import { EMPTY_FORM } from "../../categories/constant";

const inputStyle = {
  width: "100%",
  border: "1.5px solid #e5e7eb",
  borderRadius: 9,
  padding: "9px 12px",
  fontSize: 13,
  outline: "none",
  boxSizing: "border-box",
  color: "#111",
  background: "#fff",
};

const labelStyle = {
  display: "block",
  fontSize: 12,
  fontWeight: 600,
  color: "#374151",
  marginBottom: 5,
};

export default function ProductFormModal({ editData, categories, submitting, onSubmit, onClose }) {
  const isEdit = !!editData;
  const [form, setForm] = useState(isEdit ? { ...editData } : { ...EMPTY_FORM });
  const [files, setFiles] = useState([]);

  const set = (field) => (e) =>
    setForm((s) => ({ ...s, [field]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      ...form,
      price: Number(form.price),
      discountPrice: form.discountPrice === "" ? null : Number(form.discountPrice),
      quantityInStock: Number(form.quantityInStock),
      reorderLevel: Number(form.reorderLevel),
    };
    onSubmit(payload, files);
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,.45)",
        zIndex: 1000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        style={{
          background: "#fff",
          borderRadius: 18,
          padding: 28,
          width: "100%",
          maxWidth: 500,
          maxHeight: "90vh",
          overflowY: "auto",
          boxShadow: "0 20px 60px rgba(0,0,0,.2)",
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 22,
          }}
        >
          <h2 style={{ fontSize: 18, fontWeight: 700, margin: 0 }}>
            {isEdit ? "✏️ Edit Product" : "➕ New Product"}
          </h2>
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              fontSize: 20,
              cursor: "pointer",
              color: "#6b7280",
            }}
          >
            ✕
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>

            {/* Name */}
            <div>
              <label style={labelStyle}>Product Name *</label>
              <input
                style={inputStyle}
                value={form.name}
                onChange={set("name")}
                required
                placeholder="e.g. Wireless Headphones"
              />
            </div>

            {/* SKU */}
            <div>
              <label style={labelStyle}>SKU *</label>
              <input
                style={{ ...inputStyle, background: isEdit ? "#f9fafb" : "#fff" }}
                value={form.sku}
                onChange={set("sku")}
                required
                disabled={isEdit}
                placeholder="e.g. SKU-001"
              />
              {isEdit && (
                <p style={{ fontSize: 11, color: "#9ca3af", marginTop: 3 }}>
                  SKU cannot be changed after creation
                </p>
              )}
            </div>

            {/* Description */}
            <div>
              <label style={labelStyle}>Description</label>
              <textarea
                style={{ ...inputStyle, resize: "vertical", minHeight: 72 }}
                value={form.description}
                onChange={set("description")}
                placeholder="Product description…"
              />
            </div>

            {/* Price + Discount */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <div>
                <label style={labelStyle}>Price (Rs.) *</label>
                <input
                  style={inputStyle}
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.price}
                  onChange={set("price")}
                  required
                  placeholder="0.00"
                />
              </div>
              <div>
                <label style={labelStyle}>Discount Price (Rs.)</label>
                <input
                  style={inputStyle}
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.discountPrice}
                  onChange={set("discountPrice")}
                  placeholder="Optional"
                />
              </div>
            </div>

            {/* Stock + Reorder */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <div>
                <label style={labelStyle}>Stock Qty</label>
                <input
                  style={inputStyle}
                  type="number"
                  min="0"
                  value={form.quantityInStock}
                  onChange={set("quantityInStock")}
                />
              </div>
              <div>
                <label style={labelStyle}>Reorder Level</label>
                <input
                  style={inputStyle}
                  type="number"
                  min="0"
                  value={form.reorderLevel}
                  onChange={set("reorderLevel")}
                />
              </div>
            </div>

            {/* Category */}
            <div>
              <label style={labelStyle}>Category *</label>
              <select
                style={inputStyle}
                value={form.categoryId}
                onChange={set("categoryId")}
                required
              >
                <option value="">— Select Category —</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Status */}
            <div>
              <label style={labelStyle}>Status</label>
              <select
                style={inputStyle}
                value={String(form.isActive)}
                onChange={(e) =>
                  setForm((s) => ({ ...s, isActive: e.target.value === "true" }))
                }
              >
                <option value="true">Active</option>
                <option value="false">Inactive</option>
              </select>
            </div>

            {/* Images */}
            <div
              style={{
                border: "1.5px dashed #d1d5db",
                borderRadius: 10,
                padding: "12px 14px",
                background: "#f9fafb",
              }}
            >
              <label style={labelStyle}>Product Images</label>
              <input
                type="file"
                multiple
                onChange={(e) => setFiles(Array.from(e.target.files || []))}
                style={{ fontSize: 12 }}
              />
              {files.length > 0 && (
                <p style={{ fontSize: 11, color: "#6b7280", marginTop: 4 }}>
                  {files.length} file(s) selected
                </p>
              )}
            </div>

            {/* Actions */}
            <div style={{ display: "flex", gap: 10, paddingTop: 6 }}>
              <button
                type="submit"
                disabled={submitting}
                style={{
                  flex: 1,
                  padding: "10px 18px",
                  borderRadius: 9,
                  border: "none",
                  cursor: submitting ? "not-allowed" : "pointer",
                  fontSize: 13,
                  fontWeight: 600,
                  background: "#111",
                  color: "#fff",
                  opacity: submitting ? 0.65 : 1,
                  transition: "opacity .15s",
                }}
              >
                {submitting ? "Saving…" : isEdit ? "Update Product" : "Create Product"}
              </button>
              <button
                type="button"
                onClick={onClose}
                style={{
                  padding: "10px 18px",
                  borderRadius: 9,
                  border: "none",
                  cursor: "pointer",
                  fontSize: 13,
                  fontWeight: 600,
                  background: "#f3f4f6",
                  color: "#374151",
                }}
              >
                Cancel
              </button>
            </div>

          </div>
        </form>
      </div>
    </div>
  );
}