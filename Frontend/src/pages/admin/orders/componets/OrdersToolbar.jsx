// import { ORDER_STATUS_ARRAY } from '../constants';

// export default function OrdersToolbar({ filters, actions }) {
//   const { search, status, paymentStatus, sortBy, sortOrder } = filters;
//   const { setSearch, setStatus, setPaymentStatus, setSortBy, setSortOrder, setPageNumber } = actions;
  
//   // Reset page number to 1 whenever a filter changes
//   const handleFilterChange = (setter) => (e) => {
//     setter(e.target.value);
//     setPageNumber(1);
//   };

//   return (
//     <div className="bg-white p-4 rounded-xl shadow grid md:grid-cols-2 lg:grid-cols-3 gap-4">
//       <input
//         className="border rounded p-2 w-full"
//         placeholder="Search by Order # or Customer"
//         value={search}
//         onChange={handleFilterChange(setSearch)}
//       />
//       <select
//         className="border rounded p-2 w-full"
//         value={status}
//         onChange={handleFilterChange(setStatus)}
//       >
//         <option value="">All Statuses</option>
//         {ORDER_STATUS_ARRAY.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
//       </select>
//       <select
//         className="border rounded p-2 w-full"
//         value={paymentStatus}
//         onChange={handleFilterChange(setPaymentStatus)}
//       >
//         <option value="">All Payments</option>
//         <option value="1">Pending</option>
//         <option value="2">Paid</option>
//         <option value="3">Failed</option>
//       </select>
//       <div className="flex gap-2">
//         <select className="border rounded p-2 w-full" value={sortBy} onChange={handleFilterChange(setSortBy)}>
//           <option value="createdAt">Sort by Date</option>
//           <option value="totalAmount">Sort by Total</option>
//         </select>
//         <select className="border rounded p-2 w-full" value={sortOrder} onChange={handleFilterChange(setSortOrder)}>
//           <option value="desc">Descending</option>
//           <option value="asc">Ascending</option>
//         </select>
//       </div>
//     </div>
//   );
// }



import { ORDER_STATUS_ARRAY } from "../../../../constants/orderStatusConfig";

export default function OrdersToolbar({ filters, actions }) {
  const { search, status, paymentStatus, sortBy, sortOrder } = filters;
  const { setSearch, setStatus, setPaymentStatus, setSortBy, setSortOrder, setPageNumber } = actions;

  const onChange = (setter) => (e) => {
    setter(e.target.value);
    setPageNumber(1);
  };

  return (
    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex flex-wrap gap-3">
      <input
        className="border border-gray-200 rounded-lg px-3 py-2 text-sm flex-1 min-w-48"
        placeholder="Search by Order # or Customer"
        value={search}
        onChange={onChange(setSearch)}
      />
      <select
        className="border border-gray-200 rounded-lg px-3 py-2 text-sm"
        value={status}
        onChange={onChange(setStatus)}
      >
        <option value="">All Statuses</option>
        {ORDER_STATUS_ARRAY.map((s) => (
          <option key={s.id} value={s.id}>{s.name}</option>
        ))}
      </select>
      <select
        className="border border-gray-200 rounded-lg px-3 py-2 text-sm"
        value={paymentStatus}
        onChange={onChange(setPaymentStatus)}
      >
        <option value="">All Payments</option>
        <option value="1">Pending</option>
        <option value="2">Paid</option>
        <option value="3">Failed</option>
      </select>
      <select
        className="border border-gray-200 rounded-lg px-3 py-2 text-sm"
        value={sortBy}
        onChange={onChange(setSortBy)}
      >
        <option value="createdAt">Sort by Date</option>
        <option value="totalAmount">Sort by Amount</option>
      </select>
      <select
        className="border border-gray-200 rounded-lg px-3 py-2 text-sm"
        value={sortOrder}
        onChange={onChange(setSortOrder)}
      >
        <option value="desc">Descending</option>
        <option value="asc">Ascending</option>
      </select>
    </div>
  );
}