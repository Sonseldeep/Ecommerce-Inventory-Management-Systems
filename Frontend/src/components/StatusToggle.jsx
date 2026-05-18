import "./StatusToggle.css";

export default function StatusToggle({ isActive, onToggle }) {
  return (
    <button
      type="button"
      className="status-toggle-btn"
      onClick={onToggle}
      aria-label={isActive ? "Deactivate" : "Activate"}
    >
      <div className={`toggle-track ${isActive ? "toggle-track--active" : "toggle-track--inactive"}`}>
        <div className={`toggle-knob ${isActive ? "toggle-knob--active" : "toggle-knob--inactive"}`} />
      </div>
      <span className={`toggle-label ${isActive ? "toggle-label--active" : "toggle-label--inactive"}`}>
        {isActive ? "Active" : "Inactive"}
      </span>
    </button>
  );
}
