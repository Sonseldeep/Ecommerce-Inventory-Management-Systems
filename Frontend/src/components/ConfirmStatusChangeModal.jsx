/* eslint-disable no-unused-vars */

// import toast from "react-hot-toast";
// import { getStatusConfig } from "../constants/orderStatusConfig";

// export default function ConfirmStatusChangeModal({
//   currentStatus,
//   newStatus,
//   onConfirm,
//   onCancel,
//   isLoading = false,
// }) {
//   const currentConfig = getStatusConfig(currentStatus);
//   const newConfig = getStatusConfig(newStatus);

//   const handleConfirm = async () => {
//     try {
//       await onConfirm();
//     } catch (err) {
//       toast.error(err?.message || "Failed to update status");
//     }
//   };

//   return (
//     <div
//       style={{
//         position: "fixed",
//         inset: 0,
//         background: "rgba(0,0,0,.5)",
//         zIndex: 2000,
//         display: "flex",
//         alignItems: "center",
//         justifyContent: "center",
//         animation: "fadeIn 0.2s ease",
//       }}
//     >
//       <div
//         style={{
//           background: "#fff",
//           borderRadius: 16,
//           padding: 32,
//           width: "100%",
//           maxWidth: 420,
//           boxShadow: "0 20px 60px rgba(0,0,0,.3)",
//           animation: "slideUp 0.3s ease",
//         }}
//       >
//         {/* Header */}
//         <div style={{ marginBottom: 24 }}>
//           <h3 style={{ fontSize: 18, fontWeight: 700, margin: "0 0 8px 0" }}>
//             Confirm Status Change
//           </h3>
//           <p style={{ fontSize: 13, color: "#6b7280", margin: 0 }}>
//             Are you sure you want to proceed?
//           </p>
//         </div>

//         {/* Status Transition Visualization */}
//         <div
//           style={{
//             display: "flex",
//             alignItems: "center",
//             gap: 12,
//             padding: "16px",
//             background: "#f9fafb",
//             borderRadius: 12,
//             marginBottom: 24,
//           }}
//         >
//           {/* Current Status */}
//           <div
//             style={{
//               flex: 1,
//               padding: "12px",
//               background: currentConfig.bgColor,
//               border: `2px solid ${currentConfig.borderColor}`,
//               borderRadius: 10,
//               textAlign: "center",
//             }}
//           >
//             <div style={{ fontSize: 20, marginBottom: 4 }}>
//               {currentConfig.emoji}
//             </div>
//             <p style={{ fontSize: 12, fontWeight: 600, color: currentConfig.textColor, margin: 0 }}>
//               {currentConfig.label}
//             </p>
//           </div>

//           {/* Arrow */}
//           <div style={{ fontSize: 20, color: "#d1d5db" }}>→</div>

//           {/* New Status */}
//           <div
//             style={{
//               flex: 1,
//               padding: "12px",
//               background: newConfig.bgColor,
//               border: `2px solid ${newConfig.borderColor}`,
//               borderRadius: 10,
//               textAlign: "center",
//             }}
//           >
//             <div style={{ fontSize: 20, marginBottom: 4 }}>
//               {newConfig.emoji}
//             </div>
//             <p style={{ fontSize: 12, fontWeight: 600, color: newConfig.textColor, margin: 0 }}>
//               {newConfig.label}
//             </p>
//           </div>
//         </div>

//         {/* Description */}
//         <div
//           style={{
//             padding: "12px",
//             background: "#f3f4f6",
//             borderRadius: 10,
//             marginBottom: 24,
//             borderLeft: `4px solid ${newConfig.color}`,
//           }}
//         >
//           <p style={{ fontSize: 12, color: "#374151", margin: 0, fontWeight: 500 }}>
//             💡 {newConfig.description}
//           </p>
//         </div>

//         {/* Actions */}
//         <div style={{ display: "flex", gap: 12 }}>
//           <button
//             onClick={onCancel}
//             disabled={isLoading}
//             style={{
//               flex: 1,
//               padding: "11px 16px",
//               borderRadius: 9,
//               border: "1.5px solid #e5e7eb",
//               background: "#fff",
//               cursor: isLoading ? "not-allowed" : "pointer",
//               fontSize: 13,
//               fontWeight: 600,
//               color: "#374151",
//               transition: "all 0.2s",
//               opacity: isLoading ? 0.6 : 1,
//             }}
//           >
//             Cancel
//           </button>
//           <button
//             onClick={handleConfirm}
//             disabled={isLoading}
//             style={{
//               flex: 1,
//               padding: "11px 16px",
//               borderRadius: 9,
//               border: "none",
//               background: newConfig.color,
//               cursor: isLoading ? "not-allowed" : "pointer",
//               fontSize: 13,
//               fontWeight: 600,
//               color: "#fff",
//               transition: "all 0.2s",
//               opacity: isLoading ? 0.7 : 1,
//             }}
//           >
//             {isLoading ? "Updating…" : "Yes, Confirm"}
//           </button>
//         </div>
//       </div>

//       <style>{`
//         @keyframes fadeIn {
//           from { opacity: 0; }
//           to { opacity: 1; }
//         }
//         @keyframes slideUp {
//           from { transform: translateY(20px); opacity: 0; }
//           to { transform: translateY(0); opacity: 1; }
//         }
//       `}</style>
//     </div>
//   );
// }

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





// v2


// import { getStatusConfig } from "../constants/orderStatusConfig";

// export default function ConfirmStatusChangeModal({
//   currentStatus,
//   newStatus,
//   onConfirm,
//   onCancel,
//   isLoading = false,
// }) {
//   const currentConfig = getStatusConfig(currentStatus);
//   const newConfig = getStatusConfig(newStatus);

//   const handleConfirm = async () => {
//     try {
//       await onConfirm();
//     } catch (err) {
//       // Error handled by parent
//     }
//   };

//   return (
//     <div
//       style={{
//         position: "fixed",
//         inset: 0,
//         background: "rgba(0,0,0,.5)",
//         zIndex: 2000,
//         display: "flex",
//         alignItems: "center",
//         justifyContent: "center",
//         animation: "fadeIn 0.2s ease",
//       }}
//     >
//       <div
//         style={{
//           background: "#fff",
//           borderRadius: 16,
//           padding: 32,
//           width: "100%",
//           maxWidth: 420,
//           boxShadow: "0 20px 60px rgba(0,0,0,.3)",
//           animation: "slideUp 0.3s ease",
//         }}
//       >
//         {/* Header */}
//         <div style={{ marginBottom: 24 }}>
//           <h3 style={{ fontSize: 18, fontWeight: 700, margin: "0 0 8px 0", color: "#111" }}>
//             Confirm Status Change
//           </h3>
//           <p style={{ fontSize: 13, color: "#6b7280", margin: 0 }}>
//             Are you sure you want to proceed with this change?
//           </p>
//         </div>

//         {/* Status Transition Visualization */}
//         <div
//           style={{
//             display: "flex",
//             alignItems: "center",
//             gap: 12,
//             padding: "16px",
//             background: "#f9fafb",
//             borderRadius: 12,
//             marginBottom: 24,
//           }}
//         >
//           {/* Current Status */}
//           <div
//             style={{
//               flex: 1,
//               padding: "14px",
//               background: currentConfig.bgColor,
//               border: `2px solid ${currentConfig.borderColor}`,
//               borderRadius: 10,
//               textAlign: "center",
//             }}
//           >
//             <p style={{ 
//               fontSize: 11, 
//               fontWeight: 600, 
//               color: "#9ca3af", 
//               margin: "0 0 6px 0",
//               textTransform: "uppercase",
//               letterSpacing: "0.5px"
//             }}>
//               Current
//             </p>
//             <p style={{ 
//               fontSize: 13, 
//               fontWeight: 700, 
//               color: currentConfig.textColor, 
//               margin: 0 
//             }}>
//               {currentConfig.label}
//             </p>
//           </div>

//           {/* Arrow */}
//           <div style={{ fontSize: 18, color: "#d1d5db", fontWeight: 700 }}>→</div>

//           {/* New Status */}
//           <div
//             style={{
//               flex: 1,
//               padding: "14px",
//               background: newConfig.bgColor,
//               border: `2px solid ${newConfig.borderColor}`,
//               borderRadius: 10,
//               textAlign: "center",
//             }}
//           >
//             <p style={{ 
//               fontSize: 11, 
//               fontWeight: 600, 
//               color: "#9ca3af", 
//               margin: "0 0 6px 0",
//               textTransform: "uppercase",
//               letterSpacing: "0.5px"
//             }}>
//               New
//             </p>
//             <p style={{ 
//               fontSize: 13, 
//               fontWeight: 700, 
//               color: newConfig.textColor, 
//               margin: 0 
//             }}>
//               {newConfig.label}
//             </p>
//           </div>
//         </div>

//         {/* Description */}
//         <div
//           style={{
//             padding: "12px 14px",
//             background: "#f3f4f6",
//             borderRadius: 10,
//             marginBottom: 24,
//             borderLeft: `4px solid ${newConfig.color}`,
//           }}
//         >
//           <p style={{ fontSize: 12, color: "#374151", margin: 0, fontWeight: 500 }}>
//             {newConfig.description}
//           </p>
//         </div>

//         {/* Actions */}
//         <div style={{ display: "flex", gap: 12 }}>
//           <button
//             onClick={onCancel}
//             disabled={isLoading}
//             style={{
//               flex: 1,
//               padding: "11px 16px",
//               borderRadius: 9,
//               border: "1.5px solid #e5e7eb",
//               background: "#fff",
//               cursor: isLoading ? "not-allowed" : "pointer",
//               fontSize: 13,
//               fontWeight: 600,
//               color: "#374151",
//               transition: "all 0.2s",
//               opacity: isLoading ? 0.6 : 1,
//             }}
//             onMouseEnter={(e) => {
//               if (!isLoading) {
//                 e.currentTarget.style.background = "#f9fafb";
//                 e.currentTarget.style.borderColor = "#d1d5db";
//               }
//             }}
//             onMouseLeave={(e) => {
//               if (!isLoading) {
//                 e.currentTarget.style.background = "#fff";
//                 e.currentTarget.style.borderColor = "#e5e7eb";
//               }
//             }}
//           >
//             Cancel
//           </button>
//           <button
//             onClick={handleConfirm}
//             disabled={isLoading}
//             style={{
//               flex: 1,
//               padding: "11px 16px",
//               borderRadius: 9,
//               border: "none",
//               background: newConfig.color,
//               cursor: isLoading ? "not-allowed" : "pointer",
//               fontSize: 13,
//               fontWeight: 600,
//               color: "#fff",
//               transition: "all 0.2s",
//               opacity: isLoading ? 0.7 : 1,
//             }}
//             onMouseEnter={(e) => {
//               if (!isLoading) {
//                 e.currentTarget.style.filter = "brightness(1.1)";
//               }
//             }}
//             onMouseLeave={(e) => {
//               if (!isLoading) {
//                 e.currentTarget.style.filter = "brightness(1)";
//               }
//             }}
//           >
//             {isLoading ? "Updating..." : "Yes, Confirm"}
//           </button>
//         </div>
//       </div>

//       <style>{`
//         @keyframes fadeIn {
//           from { opacity: 0; }
//           to { opacity: 1; }
//         }
//         @keyframes slideUp {
//           from { transform: translateY(20px); opacity: 0; }
//           to { transform: translateY(0); opacity: 1; }
//         }
//       `}</style>
//     </div>
//   );
// }
