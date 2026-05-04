export default function StatCard({ label, value, sub, accent = "#111" }) {
  return (
    <div
      style={{
        background: "#fff",
        borderRadius: 14,
        border: "1px solid #e5e7eb",
        padding: "18px 22px",
        flex: "1 1 160px",
        minWidth: 160,
      }}
    >
      <p style={{ fontSize: 12, color: "#6b7280", marginBottom: 4 }}>{label}</p>
      <p style={{ fontSize: 28, fontWeight: 700, color: accent, lineHeight: 1 }}>
        {value}
      </p>
      {sub && (
        <p style={{ fontSize: 11, color: "#9ca3af", marginTop: 4 }}>{sub}</p>
      )}
    </div>
  );
}