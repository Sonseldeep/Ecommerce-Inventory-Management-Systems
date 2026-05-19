import { ORDER_STATUS } from "../constants/orderStatusConfig";
import "./StatusBadge.css";

export default function StatusBadge({ status }) {
  if (!status) return null;

  const config = ORDER_STATUS[status.toUpperCase()];
  if (!config) return null;

  return (
    <span
      className="status-badge"
      style={{
        background: config.bgColor,
        color: config.color,
        border: `1px solid ${config.borderColor}`,
      }}
    >
      <span className="status-badge__icon">{config.icon}</span>
      {config.label}
    </span>
  );
}