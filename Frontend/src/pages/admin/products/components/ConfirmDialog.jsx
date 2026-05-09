import "./ConfirmDialog.css";

/**
 * Generic confirmation dialog.
 *
 * Props:
 *  title       string
 *  message     string
 *  confirmLabel string  (default "Confirm")
 *  cancelLabel  string  (default "Cancel")
 *  onConfirm   () => void
 *  onCancel    () => void
 */
export default function ConfirmDialog({
  title = "Are you sure?",
  message,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  onConfirm,
  onCancel,
}) {
  return (
    <div className="confirm-backdrop">
      <div className="confirm-card">
        <h3 className="confirm-title">{title}</h3>
        {message && <p className="confirm-message">{message}</p>}
        <div className="confirm-actions">
          <button className="confirm-btn confirm-btn--cancel" onClick={onCancel}>
            {cancelLabel}
          </button>
          <button className="confirm-btn confirm-btn--danger" onClick={onConfirm}>
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}