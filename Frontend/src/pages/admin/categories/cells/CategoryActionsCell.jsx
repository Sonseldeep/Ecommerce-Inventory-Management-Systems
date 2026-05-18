export default function CategoryActionsCell({
  data,
  onEdit,
  onRequestDelete,
}) {
  return (
    <div className="action-group flex gap-2">
      <button
        className=" bg-slate-200 rounded-sm px-3 py-1 text-sm font-medium text-slate-700 hover:bg-slate-300 transition-colors"
        onClick={(e) => {
          e.stopPropagation();
          onEdit(data);
        }}
      >
        Edit
      </button>

      <button
        className=" bg-red-100 text-red-500 rounded-sm px-3 py-1 text-sm font-medium hover:bg-red-200 transition-colors"
        onClick={(e) => {
          e.stopPropagation();
          onRequestDelete(data.id);
        }}
      >
        Delete
      </button>
    </div>
  );
}