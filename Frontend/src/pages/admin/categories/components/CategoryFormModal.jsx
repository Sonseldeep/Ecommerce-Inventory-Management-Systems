import { useState } from "react";
import { EMPTY_FORM } from "../constant";

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

export default function CategoryFormModal({ editData, submitting, onSubmit, onClose }) {
  const isEdit = !!editData;
  const [form, setForm] = useState(
    isEdit
      ? { name: editData.name || "", description: editData.description || "" }
      : { ...EMPTY_FORM }
  );

  const set = (field) => (e) =>
    setForm((s) => ({ ...s, [field]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
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
          maxWidth: 440,
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
            {isEdit ? "✏️ Edit Category" : "➕ New Category"}
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

            <div>
              <label style={labelStyle}>Category Name *</label>
              <input
                style={inputStyle}
                value={form.name}
                onChange={set("name")}
                required
                placeholder="e.g. Electronics"
              />
            </div>

            <div>
              <label style={labelStyle}>Description</label>
              <textarea
                style={{ ...inputStyle, resize: "vertical", minHeight: 88 }}
                value={form.description}
                onChange={set("description")}
                placeholder="Optional description…"
              />
            </div>

            {/* Actions */}
            <div style={{ display: "flex", gap: 10, paddingTop: 4 }}>
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
                {submitting ? "Saving…" : isEdit ? "Update Category" : "Create Category"}
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