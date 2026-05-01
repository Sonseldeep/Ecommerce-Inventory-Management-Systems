

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { getAllOrdersApi, updateOrderStatusApi } from "../../api/adminApi";

const ORDER_STATUS_MAP = {
  Pending: 1,
  Confirmed: 2,
  Paid: 3,
  Shipped: 4,
  Delivered: 5,
  Cancelled: 6,
};

const ORDER_STATUS_LABELS = {
  1: "Pending",
  2: "Confirmed",
  3: "Paid",
  4: "Shipped",
  5: "Delivered",
  6: "Cancelled",
};

const STATUS_OPTIONS = Object.keys(ORDER_STATUS_MAP);

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);

  // filters
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [paymentStatus, setPaymentStatus] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");

  // pagination
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const load = async () => {
  try {
    const res = await getAllOrdersApi({
      search,          // only this
      status: status || undefined,
      paymentStatus: paymentStatus || undefined,
      dateFrom: dateFrom || undefined,
      dateTo: dateTo || undefined,
      sortBy,
      sortOrder,
      pageNumber,
      pageSize,
    });

    const payload = res.data?.data;
    setOrders(payload?.items || []);
    setTotalPages(payload?.totalPages || 1);
  } catch (e) {
    toast.error(e?.response?.data?.message || "Failed to load orders");
  }
};

  // const load = async () => {
  //   try {
  //     const res = await getAllOrdersApi({
  //       search,
  //       status: status || undefined,
  //       paymentStatus: paymentStatus || undefined,
  //       dateFrom: dateFrom || undefined,
  //       dateTo: dateTo || undefined,
  //       sortBy,
  //       sortOrder,
  //       pageNumber,
  //       pageSize,
  //       customerName: search,
  //       customerEmail: search,
  //     });

  //     const payload = res.data?.data;
  //     setOrders(payload?.items || []);
  //     setTotalPages(payload?.totalPages || 1);
  //   } catch (e) {
  //     toast.error(e?.response?.data?.message || "Failed to load orders");
  //   }
  // };

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { load(); }, [search, status, paymentStatus, dateFrom, dateTo, sortBy, sortOrder, pageNumber, pageSize]);

  const updateStatus = async (orderId, statusText) => {
    try {
      const statusNumber = ORDER_STATUS_MAP[statusText];
      await updateOrderStatusApi(orderId, statusNumber);
      toast.success("Order status updated");
      load();
    } catch (e) {
      toast.error(e?.response?.data?.message || "Status update failed");
    }
  };

  return (
    <div className="p-6 space-y-5">
      <h1 className="text-2xl font-bold">Admin - Orders</h1>

      <div className="bg-white p-4 rounded-xl shadow grid md:grid-cols-2 lg:grid-cols-3 gap-3">
        <input
          className="border rounded p-2"
          placeholder="Search order by id"
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPageNumber(1); }}
        />

        <select
          className="border rounded p-2"
          value={status}
          onChange={(e) => { setStatus(e.target.value); setPageNumber(1); }}
        >
          <option value="">All Statuses</option>
          {STATUS_OPTIONS.map((s) => <option key={s} value={ORDER_STATUS_MAP[s]}>{s}</option>)}
        </select>

        <select
          className="border rounded p-2"
          value={paymentStatus}
          onChange={(e) => { setPaymentStatus(e.target.value); setPageNumber(1); }}
        >
          <option value="">All Payments</option>
          <option value="1">Pending</option>
          <option value="2">Paid</option>
          <option value="3">Failed</option>
        </select>

        <input type="date" className="border rounded p-2" value={dateFrom}
          onChange={(e) => { setDateFrom(e.target.value); setPageNumber(1); }} />
        <input type="date" className="border rounded p-2" value={dateTo}
          onChange={(e) => { setDateTo(e.target.value); setPageNumber(1); }} />

        <div className="flex gap-2">
          <select className="border rounded p-2 w-full" value={sortBy}
            onChange={(e) => { setSortBy(e.target.value); setPageNumber(1); }}>
            <option value="createdAt">Created</option>
            <option value="total">Total</option>
          </select>
          <select className="border rounded p-2 w-full" value={sortOrder}
            onChange={(e) => { setSortOrder(e.target.value); setPageNumber(1); }}>
            <option value="desc">Desc</option>
            <option value="asc">Asc</option>
          </select>
        </div>
      </div>

      <div className="space-y-4">
        {orders.map((o) => {
          const statusName = ORDER_STATUS_LABELS[o.orderStatus] || "Pending";

          return (
            <div key={o.id} className="bg-white rounded-xl shadow p-4">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                <div>
                  <p className="font-semibold">Order #{o.orderNumber}</p>
                  <p className="text-sm text-gray-500">
                    {o.customerName} ({o.customerEmail})
                  </p>
                  <p className="text-sm text-gray-500">
                    Total: ₹ {Number(o.totalAmount || 0).toFixed(2)}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500">Status:</span>
                  <select
                    className="border rounded p-2"
                    value={statusName}
                    onChange={(e) => updateStatus(o.id, e.target.value)}
                  >
                    {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>

              <div className="mt-3 border-t pt-3">
                <p className="text-sm font-medium mb-1">Items</p>
                <div className="space-y-1">
                  {(o.items || []).map((it) => (
                    <div key={it.id} className="text-sm text-gray-700">
                      {it.productName} × {it.quantity} — ₹ {Number(it.unitPrice || 0).toFixed(2)}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}

        {!orders.length && (
          <div className="bg-white rounded-xl shadow p-6 text-center text-gray-500">
            No orders found
          </div>
        )}
      </div>

      {/* Pagination */}
      <div className="flex justify-center items-center gap-2">
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