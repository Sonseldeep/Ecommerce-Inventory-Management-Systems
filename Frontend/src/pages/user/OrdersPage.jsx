import { useEffect, useState } from "react";
import { getMyOrdersApi } from "../../api/orderApi";

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    (async () => {
      const res = await getMyOrdersApi();
      setOrders(res.data?.data || []);
    })();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">My Orders</h1>
      <div className="space-y-4">
        {orders.map((o) => (
          <div key={o.id} className="bg-white rounded-xl shadow p-4">
            <div className="flex justify-between">
              <p className="font-semibold">Order #{o.orderNumber}</p>
              <p className="text-sm">{o.status}</p>
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
    </div>
  );
}