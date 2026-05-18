import StatusToggle from "../../../../components/StatusToggle";

export default function CategoryStatusCell({
  data,
  statusOverrides,
  onToggleStatus,
}) {
  const isActive =
    statusOverrides[data.id] ?? data.isActive;

  return (
    <div
      onMouseDown={(e) => e.stopPropagation()}
      onClick={(e) => e.stopPropagation()}
      style={{ display: "inline-flex" }}
    >
      <StatusToggle
        isActive={isActive}
        onToggle={() => onToggleStatus(data)}
      />
    </div>
  );
}