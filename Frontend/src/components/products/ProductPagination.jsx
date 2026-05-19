export default function ProductPagination({ pageNumber, totalPages, onPageChange }) {
  return (
    <div className="flex justify-center items-center gap-2 mt-8 flex-wrap">
      <button
        disabled={pageNumber === 1}
        onClick={() => onPageChange(pageNumber - 1)}
        className="px-3 py-1 border rounded-lg disabled:opacity-40"
      >
        Prev
      </button>

      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`px-3 py-1 border rounded-lg ${
            pageNumber === page ? "bg-black text-white" : ""
          }`}
        >
          {page}
        </button>
      ))}

      <button
        disabled={pageNumber === totalPages}
        onClick={() => onPageChange(pageNumber + 1)}
        className="px-3 py-1 border rounded-lg disabled:opacity-40"
      >
        Next
      </button>
    </div>
  );
}