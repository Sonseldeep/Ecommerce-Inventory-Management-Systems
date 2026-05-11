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

// v2

// import { getStatusConfig } from "../constants/orderStatusConfig";

// export default function StatusBadge({ status, size = "md", onClick = null }) {
//   const config = getStatusConfig(status);

//   if (!config) {
//     return <span>Unknown</span>;
//   }

//   const sizes = {
//     sm: { padding: "4px 8px", fontSize: 11 },
//     md: { padding: "6px 12px", fontSize: 12 },
//     lg: { padding: "8px 14px", fontSize: 13 },
//   };

//   return (
//     <div
//       onClick={onClick}
//       style={{
//         display: "inline-flex",
//         alignItems: "center",
//         gap: 5,
//         ...sizes[size],
//         background: config.bgColor,
//         border: `1.5px solid ${config.borderColor}`,
//         borderRadius: 8,
//         cursor: onClick ? "pointer" : "default",
//         transition: "all 0.2s",
//         fontWeight: 600,
//         color: config.textColor,
//         userSelect: "none",
//         ...(!onClick ? {} : { 
//           ":hover": { 
//             borderColor: config.color, 
//             boxShadow: `0 0 0 2px ${config.bgColor}` 
//           } 
//         })
//       }}
//     >
//       <span>{config.emoji}</span>
//       <span>{config.label}</span>
//     </div>
//   );
// }