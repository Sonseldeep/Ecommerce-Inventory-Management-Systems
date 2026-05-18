import OrderCard from "./componets/OrderCard";
import OrdersToolbar from "./componets/OrdersToolbar";
import { useOrders } from "./hooks/useOrders";

function Pagination({ currentPage, totalPages, onPageChange }) {
  return (
    <div className="flex items-center justify-center gap-2 mt-6">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-4 py-2 text-sm border border-gray-200 rounded-lg bg-white disabled:opacity-40 hover:bg-gray-50"
      >
        ← Prev
      </button>

      <span className="text-sm text-gray-600">
        Page {currentPage} of {totalPages}
      </span>

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-4 py-2 text-sm border border-gray-200 rounded-lg bg-white disabled:opacity-40 hover:bg-gray-50"
      >
        Next →
      </button>
    </div>
  );
}

export default function AdminOrdersPage() {
  const { orders, loading, actions, filters, pagination } = useOrders();

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Orders Management</h1>

      <OrdersToolbar filters={filters} actions={actions} />

      {loading ? (
        <p className="text-center py-16 text-gray-400">Loading orders...</p>
      ) : orders.length === 0 ? (
        <p className="text-center py-16 text-gray-400">No orders found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mt-6">
          {orders.map((order) => (
            <OrderCard
              key={order.id}
              order={order}
              onStatusUpdate={actions.updateStatus}
            />
          ))}
        </div>
      )}

      <Pagination
        currentPage={pagination.pageNumber}
        totalPages={pagination.totalPages}
        onPageChange={actions.setPageNumber}
      />
    </div>
  );
}
