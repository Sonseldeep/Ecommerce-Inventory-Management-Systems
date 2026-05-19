/* eslint-disable no-unused-vars */

import "./ConfirmStatusChangeModal.css";

export default function ConfirmStatusChangeModal({
  currentStatus,
  newStatus,
  onConfirm,
  onCancel,
  isLoading,
}) {
  return (
    <div className="confirm-modal-overlay">
      <div className="confirm-modal">
        <h3 className="confirm-modal__title">
          Confirm Status Change
        </h3>

        <p className="confirm-modal__text">
          Change <b>{currentStatus}</b> → <b>{newStatus}</b> ?
        </p>

        <div className="confirm-modal__actions">
          <button onClick={onCancel}>
            Cancel
          </button>

          <button
            onClick={onConfirm}
            disabled={isLoading}
            className="confirm-modal__confirm-btn"
          >
            {isLoading ? "Updating..." : "Confirm"}
          </button>
        </div>
      </div>
    </div>
  );
}
