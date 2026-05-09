
// const toggleContainer = {
//   display: 'flex',
//   alignItems: 'center',
//   cursor: 'pointer',
//   userSelect: 'none',
// };

// const toggleSwitch = {
//   position: 'relative',
//   width: '40px',
//   height: '22px',
//   borderRadius: '11px',
//   transition: 'background-color 0.2s ease-in-out',
// };

// const toggleKnob = {
//   position: 'absolute',
//   top: '2px',
//   width: '18px',
//   height: '18px',
//   borderRadius: '50%',
//   background: '#fff',
//   boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
//   transition: 'transform 0.2s ease-in-out',
// };

// export default function StatusToggle({ isActive, onClick }) {
//   const switchStyle = {
//     ...toggleSwitch,
//     backgroundColor: isActive ? '#16a34a' : '#d1d5db',
//   };

//   const knobStyle = {
//     ...toggleKnob,
//     transform: isActive ? 'translateX(18px)' : 'translateX(2px)',
//   };

//   const statusTextStyle = {
//     marginLeft: '8px',
//     fontSize: '12px',
//     fontWeight: '600',
//     color: isActive ? '#166534' : '#6b7280',
//   };

//   return (
//     <div style={toggleContainer} onClick={onClick}>
//       <div style={switchStyle}>
//         <div style={knobStyle}></div>
//       </div>
//       <span style={statusTextStyle}>
//         {isActive ? 'Active' : 'Inactive'}
//       </span>
//     </div>
//   );
// }

export default function StatusToggle({ isActive, onToggle }) {
  const switchStyle = {
    position: "relative",
    width: "40px",
    height: "22px",
    borderRadius: "11px",
    background: isActive ? "#16a34a" : "#d1d5db",
    transition: "background-color 0.2s ease",
  };

  const knobStyle = {
    position: "absolute",
    top: "2px",
    width: "18px",
    height: "18px",
    borderRadius: "50%",
    background: "#fff",
    boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
    transition: "transform 0.2s ease",
    transform: isActive ? "translateX(18px)" : "translateX(2px)",
  };

  return (
    <button
      type="button"
      onClick={onToggle}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        cursor: "pointer",
        border: "none",
        background: "transparent",
        padding: 0,
      }}
    >
      <div style={switchStyle}>
        <div style={knobStyle} />
      </div>
      <span style={{ fontSize: 12, fontWeight: 600, color: isActive ? "#166534" : "#6b7280" }}>
        {isActive ? "Active" : "Inactive"}
      </span>
    </button>
  );
}