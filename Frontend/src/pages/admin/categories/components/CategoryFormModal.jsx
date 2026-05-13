import { useState } from "react";
import { EMPTY_FORM } from "../constant";
import "./CategoryFormModal.css";

export default function CategoryFormModal({
  editData,
  submitting,
  onSubmit,
  onClose,
}) {
  const isEdit = !!editData;

  const [form, setForm] = useState(
    isEdit
      ? {
          name: editData.name || "",
          description: editData.description || "",
         
          isActive: editData.isActive ?? true,
        }
      : { ...EMPTY_FORM }
  );

  const handleChange = (field) => (e) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <div
      className="modal-overlay"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="modal-card">
        {/*  Header  */}
        <div className="modal-header">
          <h2 className="modal-title">
            {isEdit ? "Edit Category" : "New Category"}
          </h2>
          <button
            type="button"
            className="modal-close-btn"
            onClick={onClose}
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        {/*  Form  */}
        <form className="modal-form" onSubmit={handleSubmit}>
          {/* Category Name */}
          <div className="form-field">
            <label className="form-label">Category Name *</label>
            <input
              className="form-input"
              value={form.name}
              onChange={handleChange("name")}
              required
              placeholder="e.g. Electronics"
            />
          </div>

          {/* Description */}
          <div className="form-field">
            <label className="form-label">Description</label>
            <textarea
              className="form-textarea"
              value={form.description}
              onChange={handleChange("description")}
              placeholder="Optional description…"
            />
          </div>

     

          {/* Actions */}
          <div className="modal-actions">
            <button type="submit" className="btn-submit" disabled={submitting}>
              {submitting
                ? "Saving…"
                : isEdit
                ? "Update Category"
                : "Create Category"}
            </button>
            <button
              type="button"
              className="btn-secondary"
              onClick={onClose}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}


