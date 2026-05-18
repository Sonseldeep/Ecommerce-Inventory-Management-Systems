export default function CategoryDeleteDialog({ isOpen, onCancel, onConfirm }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <h3 className="modal-title py-3">Delete Category?</h3>

        <p className="form-label">
          This action cannot be undone and may affect related products.
        </p>

        <div className="modal-actions m-4 flex gap-3">
          <button className="flex-1 btn-secondary rounded-2xl" onClick={onCancel}>
            Cancel
          </button>

          <button className="flex-1  bg-red-600 text-white rounded-2xl" onClick={onConfirm}>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
