import { ORDER_STATUS } from "../constants/orderStatusConfig";

export default function StatusBadge({ status }) {
  if (!status) return null;

  const config = ORDER_STATUS[status.toUpperCase()];
  if (!config) return null;

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        padding: "4px 10px",
        borderRadius: 999,
        fontSize: 12,
        fontWeight: 600,
        background: config.bgColor,
        color: config.color,
        border: `1px solid ${config.borderColor}`,
        whiteSpace: "nowrap",
      }}
    >
      <span>{config.icon}</span>
      {config.label}
    </span>
  );
}
