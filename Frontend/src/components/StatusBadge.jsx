// import { getStatusConfig } from "../constants/orderStatusConfig";

// export default function StatusBadge({ status, size = "md", onClick = null, clickable = true }) {
//   const config = getStatusConfig(status);

//   if (!config) {
//     return <span>Unknown Status</span>;
//   }

//   const sizes = {
//     sm: { padding: "4px 8px", fontSize: 11, minWidth: 60 },
//     md: { padding: "6px 12px", fontSize: 12, minWidth: 80 },
//     lg: { padding: "8px 14px", fontSize: 13, minWidth: 100 },
//   };

//   return (
//     <div
//       onClick={onClick && clickable ? onClick : undefined}
//       style={{
//         display: "inline-flex",
//         alignItems: "center",
//         justifyContent: "center",
//         ...sizes[size],
//         background: config.bgColor,
//         border: `1.5px solid ${config.borderColor}`,
//         borderRadius: 8,
//         cursor: onClick && clickable ? "pointer" : "default",
//         transition: "all 0.2s ease",
//         fontWeight: 600,
//         color: config.textColor,
//         userSelect: "none",
//         whiteSpace: "nowrap",
//         ...(onClick && clickable ? { 
//           boxShadow: "0 1px 2px rgba(0,0,0,0.05)" 
//         } : {}),
//       }}
//       onMouseEnter={(e) => {
//         if (onClick && clickable) {
//           e.currentTarget.style.borderColor = config.color;
//           e.currentTarget.style.boxShadow = `0 0 0 2px ${config.bgColor}, 0 2px 4px rgba(0,0,0,0.1)`;
//         }
//       }}
//       onMouseLeave={(e) => {
//         if (onClick && clickable) {
//           e.currentTarget.style.borderColor = config.borderColor;
//           e.currentTarget.style.boxShadow = "0 1px 2px rgba(0,0,0,0.05)";
//         }
//       }}
//     >
//       {config.label}
//     </div>
//   );
// }




import { getStatusConfig } from "../constants/orderStatusConfig";

export default function StatusBadge({ status, size = "md", onClick = null }) {
  const config = getStatusConfig(status);

  if (!config) {
    return <span>Unknown</span>;
  }

  const sizes = {
    sm: { padding: "4px 8px", fontSize: 11 },
    md: { padding: "6px 12px", fontSize: 12 },
    lg: { padding: "8px 14px", fontSize: 13 },
  };

  return (
    <div
      onClick={onClick}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 5,
        ...sizes[size],
        background: config.bgColor,
        border: `1.5px solid ${config.borderColor}`,
        borderRadius: 8,
        cursor: onClick ? "pointer" : "default",
        transition: "all 0.2s",
        fontWeight: 600,
        color: config.textColor,
        userSelect: "none",
        ...(!onClick ? {} : { 
          ":hover": { 
            borderColor: config.color, 
            boxShadow: `0 0 0 2px ${config.bgColor}` 
          } 
        })
      }}
    >
      <span>{config.emoji}</span>
      <span>{config.label}</span>
    </div>
  );
}