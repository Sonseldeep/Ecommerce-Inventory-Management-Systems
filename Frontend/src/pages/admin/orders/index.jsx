// import OrderCard from './componets/OrderCard';
// import OrdersToolbar from './componets/OrdersToolbar';
// import { useOrders } from './hooks/useOrders';

// export default function AdminOrdersPage() {
//   const { orders, loading, filters, pagination, actions } = useOrders();

//   return (
//     <div className="p-4 md:p-6 bg-gray-50 min-h-screen">
//       <header className="mb-6">
//         <h1 className="text-3xl font-bold text-gray-900">Orders Management</h1>
//       </header>
      
//       <OrdersToolbar filters={filters} actions={actions} />
      
//       {loading ? (
//         <div className="text-center p-10">Loading orders...</div>
//       ) : (
//         <>
//           <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-4 mt-6">
//             {orders.map(order => (
//               <OrderCard key={order.id} order={order} onStatusUpdate={actions.updateStatus} />
//             ))}
//           </div>
          
//           {!orders.length && (
//             <div className="bg-white rounded-xl shadow p-10 text-center text-gray-500 mt-6">
//               <h2>No orders found</h2>
//               <p>Try adjusting your search or filter criteria.</p>
//             </div>
//           )}
          
//           <Pagination
//             currentPage={pagination.pageNumber}
//             totalPages={pagination.totalPages}
//             onPageChange={actions.setPageNumber}
//           />
//         </>
//       )}
//     </div>
//   );
// }

// function Pagination({ currentPage, totalPages, onPageChange }) {
//     if (totalPages <= 1) return null;
//     return (
//         <div className="flex justify-center items-center gap-2 mt-8">
//             <button disabled={currentPage === 1} onClick={() => onPageChange(p => p - 1)} className="px-4 py-2 border rounded-md bg-white disabled:opacity-50">Prev</button>
//             <span className="text-gray-700">Page {currentPage} of {totalPages}</span>
//             <button disabled={currentPage === totalPages} onClick={() => onPageChange(p => p + 1)} className="px-4 py-2 border rounded-md bg-white disabled:opacity-50">Next</button>
//         </div>
//     );
// }



/**
 * AdminOrdersPage — redesigned with:
 *  • Stats summary bar
 *  • Clean toolbar
 *  • Responsive grid
 *  • Pagination with proper controls
 */
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

// import OrderCard from "./componets/OrderCard";
// import OrdersToolbar from "./componets/OrdersToolbar";
// import { useOrders } from "./hooks/useOrders";

// export default function AdminOrdersPage() {
//   const { orders, loading, actions, filters, pagination } = useOrders();

//   return (
//     <div style={{ padding: 20 }}>
//       <h1>Orders Management</h1>

//       <OrdersToolbar filters={filters} actions={actions} />

//       {loading ? (
//         <p>Loading...</p>
//       ) : (
//         <div
//           style={{
//             display: "grid",
//             gridTemplateColumns: "repeat(auto-fill, minmax(300px,1fr))",
//             gap: 16,
//           }}
//         >
//           {orders.map((o) => (
//             <OrderCard
//               key={o.id}
//               order={o}
//               onStatusUpdate={actions.updateStatus}
//             />
//           ))}
//         </div>
//       )}

//       <div style={{ marginTop: 20 }}>
//         Page {pagination.pageNumber} / {pagination.totalPages}
//       </div>
//     </div>
//   );
// }