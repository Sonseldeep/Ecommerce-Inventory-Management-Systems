

import { useEffect, useMemo, useState } from "react";
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
  const [statusFilter, setStatusFilter] = useState("All");
  const [search, setSearch] = useState("");

  const load = async () => {
    try {
      const res = await getAllOrdersApi();
      setOrders(res.data?.data || []);
    } catch (e) {
      toast.error(e?.response?.data?.message || "Failed to load orders");
    }
  };

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { load(); }, []);

  const filtered = useMemo(() => {
    return orders.filter((o) => {
      const statusName = ORDER_STATUS_LABELS[o.orderStatus] || "Pending";
      const okStatus = statusFilter === "All" ? true : statusName === statusFilter;
      const term = search.trim().toLowerCase();
      const okSearch =
        !term ||
        (o.orderNumber || "").toLowerCase().includes(term) ||
        (o.customerName || "").toLowerCase().includes(term) ||
        (o.customerEmail || "").toLowerCase().includes(term);

      return okStatus && okSearch;
    });
  }, [orders, statusFilter, search]);

  const updateStatus = async (orderId, statusText) => {
    try {
      const statusNumber = ORDER_STATUS_MAP[statusText];
      await updateOrderStatusApi(orderId, statusNumber);

      toast.success("Order status updated");
      setOrders((prev) =>
        prev.map((o) =>
          o.id === orderId ? { ...o, orderStatus: statusNumber } : o
        )
      );
    } catch (e) {
      toast.error(e?.response?.data?.message || "Status update failed");
    }
  };

  return (
    <div className="p-6 space-y-5">
      <h1 className="text-2xl font-bold">Admin - Orders</h1>

      <div className="bg-white p-4 rounded-xl shadow flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
        <input
          className="border rounded p-2 w-full md:max-w-sm"
          placeholder="Search by order no / customer name / email"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          className="border rounded p-2 w-full md:w-56"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="All">All Statuses</option>
          {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      <div className="space-y-4">
        {filtered.map((o) => {
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

              {o.shippingAddress && (
                <div className="mt-3 border-t pt-3">
                  <p className="text-sm font-medium mb-1">Shipping Address</p>
                  <p className="text-sm text-gray-700">
                    {o.shippingAddress.fullName}, {o.shippingAddress.addressLine1}, {o.shippingAddress.city},{" "}
                    {o.shippingAddress.state}, {o.shippingAddress.postalCode}
                  </p>
                </div>
              )}
            </div>
          );
        })}

        {!filtered.length && (
          <div className="bg-white rounded-xl shadow p-6 text-center text-gray-500">
            No orders found
          </div>
        )}
      </div>
    </div>
  );
}