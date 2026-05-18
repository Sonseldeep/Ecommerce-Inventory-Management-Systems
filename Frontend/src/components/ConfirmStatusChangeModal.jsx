/* eslint-disable no-unused-vars */


export default function ConfirmStatusChangeModal({
  currentStatus,
  newStatus,
  onConfirm,
  onCancel,
  isLoading,
}) {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999,
      }}
    >
      <div
        style={{
          background: "#fff",
          padding: 20,
          borderRadius: 12,
          width: 400,
        }}
      >
        <h3 style={{ fontWeight: 700, marginBottom: 10 }}>
          Confirm Status Change
        </h3>

        <p style={{ fontSize: 14, marginBottom: 20 }}>
          Change <b>{currentStatus}</b> → <b>{newStatus}</b> ?
        </p>

        <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
          <button onClick={onCancel}>Cancel</button>

          <button
            onClick={onConfirm}
            disabled={isLoading}
            style={{
              background: "red",
              color: "#fff",
              padding: "6px 12px",
              borderRadius: 6,
            }}
          >
            {isLoading ? "Updating..." : "Confirm"}
          </button>
        </div>
      </div>
    </div>
  );
}

