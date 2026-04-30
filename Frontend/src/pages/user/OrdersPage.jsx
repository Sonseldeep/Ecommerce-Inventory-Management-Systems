
import { useEffect, useState } from "react";
import { getMyOrdersApi } from "../../api/orderApi";

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);

  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");

  const load = async () => {
    const res = await getMyOrdersApi({
      search,
      status: status || undefined,
      sortBy,
      sortOrder,
      pageNumber,
      pageSize,
    });

    const payload = res.data?.data;
    setOrders(payload?.items || []);
    setTotalPages(payload?.totalPages || 1);
  };

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { load(); }, [search, status, sortBy, sortOrder, pageNumber, pageSize]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">My Orders</h1>

      <div className="bg-white p-4 rounded-xl shadow flex flex-col md:flex-row gap-3 mb-4">
        <input
          className="border rounded p-2 w-full md:max-w-sm"
          placeholder="Search order number"
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPageNumber(1); }}
        />
        <select
          className="border rounded p-2"
          value={status}
          onChange={(e) => { setStatus(e.target.value); setPageNumber(1); }}
        >
          <option value="">All Statuses</option>
          <option value="1">Pending</option>
          <option value="2">Confirmed</option>
          <option value="3">Paid</option>
          <option value="4">Shipped</option>
          <option value="5">Delivered</option>
          <option value="6">Cancelled</option>
        </select>

        <select
          className="border rounded p-2"
          value={sortBy}
          onChange={(e) => { setSortBy(e.target.value); setPageNumber(1); }}
        >
          <option value="createdAt">Created</option>
          <option value="total">Total</option>
        </select>

        <select
          className="border rounded p-2"
          value={sortOrder}
          onChange={(e) => { setSortOrder(e.target.value); setPageNumber(1); }}
        >
          <option value="desc">Desc</option>
          <option value="asc">Asc</option>
        </select>
      </div>

      <div className="space-y-4">
        {orders.map((o) => (
          <div key={o.id} className="bg-white rounded-xl shadow p-4">
            <div className="flex justify-between">
              <p className="font-semibold">Order #{o.orderNumber}</p>
              <p className="text-sm">{o.orderStatus}</p>
            </div>
            <p className="text-sm text-gray-500">Total: ₹ {o.totalAmount}</p>
            <div className="mt-3 space-y-1">
              {(o.items || []).map((it) => (
                <div key={it.id} className="text-sm">
                  {it.productName} × {it.quantity}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {!orders.length && (
        <div className="text-center text-gray-400 py-6">No orders found</div>
      )}

      <div className="flex justify-center items-center gap-2 mt-6">
        <button disabled={pageNumber === 1} onClick={() => setPageNumber((p) => p - 1)}
          className="px-3 py-1 border rounded disabled:opacity-40">Prev</button>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
          <button key={p} onClick={() => setPageNumber(p)}
            className={`px-3 py-1 border rounded ${p === pageNumber ? "bg-black text-white" : ""}`}>{p}</button>
        ))}
        <button disabled={pageNumber === totalPages} onClick={() => setPageNumber((p) => p + 1)}
          className="px-3 py-1 border rounded disabled:opacity-40">Next</button>
      </div>
    </div>
  );
}