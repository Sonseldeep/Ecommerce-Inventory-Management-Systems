// import { useCallback, useEffect, useMemo, useState } from "react";
// import {
//   ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip,
//   PieChart, Pie, Cell, CartesianGrid
// } from "recharts";
// import { getInventoryAnalyticsApi } from "../../api/adminApi";
// import useAdminAnalyticsRealtime from "../../hooks/useAdminAnalyticsRealtime";

// const COLORS = ["#111827", "#2563eb", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];

// export default function AdminDashboardPage() {
//   const [data, setData] = useState(null);

//   // ── Fetch analytics data ──────────────────────────────────────────────────
//   const fetchData = useCallback(async () => {
//     const res = await getInventoryAnalyticsApi();
//     setData(res.data?.data);
//   }, []);

//   useEffect(() => {
//     // eslint-disable-next-line react-hooks/set-state-in-effect
//     fetchData();
//   }, [fetchData]);

//   // ✅ Realtime: re-fetch whenever OrderPlaced / ProductUpdated / ProductCreated fires
//   useAdminAnalyticsRealtime(fetchData);

//   // ── Derived data (all hooks before early return) ──────────────────────────
//   const stockBar      = useMemo(() => data?.topStockProducts      || [], [data]);
//   const bestSellers   = useMemo(() => data?.bestSellersLast30Days  || [], [data]);
//   const notSelling    = useMemo(() => data?.notSellingLast30Days   || [], [data]);
//   const categoryStock = useMemo(() => data?.categoryStock          || [], [data]);

//   if (!data) return <div className="p-6">Loading...</div>;

//   return (
//     <div className="p-6 space-y-6">
//       <h1 className="text-3xl font-bold">Admin Inventory Analytics</h1>

//       {/* KPI Cards */}
//       <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
//         <Card title="Total Products" value={data.totalProducts} />
//         <Card title="Low Stock"      value={data.lowStockCount} />
//         <Card title="Out of Stock"   value={data.outOfStockCount} />
//       </div>

//       {/* Charts */}
//       <div className="grid lg:grid-cols-2 gap-6">
//         <div className="bg-white rounded-2xl shadow p-4 h-[360px]">
//           <h2 className="font-semibold mb-3">Top Stock Products</h2>
//           <ResponsiveContainer width="100%" height="100%">
//             <BarChart data={stockBar}>
//               <CartesianGrid strokeDasharray="3 3" />
//               <XAxis dataKey="productName" hide />
//               <YAxis />
//               <Tooltip />
//               <Bar dataKey="quantity" fill="#111827" radius={[8, 8, 0, 0]} />
//             </BarChart>
//           </ResponsiveContainer>
//         </div>

//         <div className="bg-white rounded-2xl shadow p-4 h-[360px]">
//           <h2 className="font-semibold mb-3">Category Stock</h2>
//           <ResponsiveContainer width="100%" height="100%">
//             <PieChart>
//               <Pie
//                 data={categoryStock}
//                 dataKey="totalStock"
//                 nameKey="categoryName"
//                 outerRadius={110}
//                 label
//               >
//                 {categoryStock.map((_, i) => (
//                   <Cell key={i} fill={COLORS[i % COLORS.length]} />
//                 ))}
//               </Pie>
//               <Tooltip />
//             </PieChart>
//           </ResponsiveContainer>
//         </div>
//       </div>

//       {/* Best Sellers + Not Selling */}
//       <div className="grid lg:grid-cols-2 gap-6">
//         <TableBlock title="Best Sellers (Last 30 Days)" items={bestSellers} />
//         <TableBlock title="Not Selling (Last 30 Days)"  items={notSelling} />
//       </div>
//     </div>
//   );
// }

// function Card({ title, value }) {
//   return (
//     <div className="bg-white rounded-2xl shadow p-4">
//       <p className="text-sm text-gray-500">{title}</p>
//       <p className="text-2xl font-bold mt-2">{value}</p>
//     </div>
//   );
// }

// function TableBlock({ title, items }) {
//   return (
//     <div className="bg-white rounded-2xl shadow p-4">
//       <h2 className="font-semibold mb-3">{title}</h2>
//       <table className="w-full text-sm">
//         <thead className="border-b">
//           <tr>
//             <th className="text-left py-2">Product</th>
//             <th className="text-right">Qty</th>
//           </tr>
//         </thead>
//         <tbody>
//           {items.map((x) => (
//             <tr key={x.productId} className="border-b">
//               <td className="py-2">{x.productName}</td>
//               <td className="text-right">{x.quantity}</td>
//             </tr>
//           ))}
//           {!items.length && (
//             <tr>
//               <td colSpan="2" className="text-center py-6 text-gray-400">
//                 No data
//               </td>
//             </tr>
//           )}
//         </tbody>
//       </table>
//     </div>
//   );
// }


import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip,
  PieChart, Pie, Cell, CartesianGrid
} from "recharts";
import { getInventoryAnalyticsApi, getUserAnalyticsSummaryApi, getUserPurchaseDetailsApi } from "../../api/adminApi";
import useAdminAnalyticsRealtime from "../../hooks/useAdminAnalyticsRealtime";

const COLORS = ["#111827", "#2563eb", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];

export default function AdminDashboardPage() {
  // ── Inventory analytics ───────────────────────────────────────────────────
  const [data, setData] = useState(null);

  const fetchData = useCallback(async () => {
    const res = await getInventoryAnalyticsApi();
    setData(res.data?.data);
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchData();
  }, [fetchData]);

  useAdminAnalyticsRealtime(fetchData);

  // ── All hooks before early return ─────────────────────────────────────────
  const stockBar      = useMemo(() => data?.topStockProducts      || [], [data]);
  const bestSellers   = useMemo(() => data?.bestSellersLast30Days  || [], [data]);
  const notSelling    = useMemo(() => data?.notSellingLast30Days   || [], [data]);
  const categoryStock = useMemo(() => data?.categoryStock          || [], [data]);

  // ── User analytics ────────────────────────────────────────────────────────
  const [userDays, setUserDays]       = useState(30);
  const [userSummary, setUserSummary] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userProducts, setUserProducts] = useState([]);

  useEffect(() => {
    (async () => {
      const res = await getUserAnalyticsSummaryApi(userDays);
      setUserSummary(res.data?.data);
      setSelectedUser(null); // reset drill-down when period changes
      setUserProducts([]);
    })();
  }, [userDays]);

  const openUser = async (user) => {
    setSelectedUser(user);
    const res = await getUserPurchaseDetailsApi(user.userId, userDays);
    setUserProducts(res.data?.data || []);
  };

  // ── Early return after ALL hooks ──────────────────────────────────────────
  if (!data) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">Admin Inventory Analytics</h1>

      {/* KPI Cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card title="Total Products" value={data.totalProducts} />
        <Card title="Low Stock"      value={data.lowStockCount} />
        <Card title="Out of Stock"   value={data.outOfStockCount} />
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl shadow p-4 h-[360px]">
          <h2 className="font-semibold mb-3">Top Stock Products</h2>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={stockBar}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="productName" hide />
              <YAxis />
              <Tooltip />
              <Bar dataKey="quantity" fill="#111827" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-2xl shadow p-4 h-[360px]">
          <h2 className="font-semibold mb-3">Category Stock</h2>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={categoryStock}
                dataKey="totalStock"
                nameKey="categoryName"
                outerRadius={110}
                label
              >
                {categoryStock.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Best Sellers + Not Selling */}
      <div className="grid lg:grid-cols-2 gap-6">
        <TableBlock title="Best Sellers (Last 30 Days)" items={bestSellers} />
        <TableBlock title="Not Selling (Last 30 Days)"  items={notSelling} />
      </div>

      {/* ── User Analytics ─────────────────────────────────────────────────── */}
      <div className="grid lg:grid-cols-2 gap-6">

        {/* Top Buyers */}
        <div className="bg-white rounded-2xl shadow p-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold">Top Buyers</h2>
            <select
              value={userDays}
              onChange={(e) => setUserDays(Number(e.target.value))}
              className="border rounded px-2 py-1 text-sm"
            >
              <option value={7}>Last 7 days</option>
              <option value={30}>Last 30 days</option>
            </select>
          </div>

          <p className="text-sm text-gray-500 mb-3">
            Total Users: {userSummary?.totalUsers || 0}
          </p>

          <table className="w-full text-sm">
            <thead className="border-b">
              <tr>
                <th className="text-left py-2">User</th>
                <th className="text-right">Orders</th>
                <th className="text-right">Spent</th>
              </tr>
            </thead>
            <tbody>
              {(userSummary?.topBuyers || []).map((u) => (
                <tr
                  key={u.userId}
                  onClick={() => openUser(u)}
                  className={`border-b cursor-pointer hover:bg-gray-50 transition-colors ${
                    selectedUser?.userId === u.userId ? "bg-blue-50" : ""
                  }`}
                >
                  <td className="py-2">
                    <p className="font-medium">{u.fullName}</p>
                    <p className="text-xs text-gray-500">{u.email}</p>
                  </td>
                  <td className="text-right">{u.ordersCount}</td>
                  <td className="text-right">₹ {u.totalSpent.toFixed(2)}</td>
                </tr>
              ))}
              {!userSummary?.topBuyers?.length && (
                <tr>
                  <td colSpan="3" className="py-6 text-center text-gray-400">
                    No data
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* User Purchase Drill-down */}
        <div className="bg-white rounded-2xl shadow p-4">
          {selectedUser ? (
            <>
              <div className="flex items-center justify-between mb-3">
                <h2 className="font-semibold">
                  Purchases by {selectedUser.fullName}
                </h2>
                <button
                  onClick={() => { setSelectedUser(null); setUserProducts([]); }}
                  className="text-xs text-gray-400 hover:text-gray-600"
                >
                  ✕ Close
                </button>
              </div>
              <table className="w-full text-sm">
                <thead className="border-b">
                  <tr>
                    <th className="text-left py-2">Product</th>
                    <th className="text-right">Qty</th>
                    <th className="text-right">Spent</th>
                  </tr>
                </thead>
                <tbody>
                  {userProducts.map((p) => (
                    <tr key={p.productId} className="border-b">
                      <td className="py-2">{p.productName}</td>
                      <td className="text-right">{p.quantity}</td>
                      <td className="text-right">₹ {p.totalSpent.toFixed(2)}</td>
                    </tr>
                  ))}
                  {!userProducts.length && (
                    <tr>
                      <td colSpan="3" className="py-6 text-center text-gray-400">
                        No purchases
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </>
          ) : (
            <div className="flex items-center justify-center h-full min-h-[160px] text-gray-400 text-sm">
              Click a buyer to see their purchases
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

function Card({ title, value }) {
  return (
    <div className="bg-white rounded-2xl shadow p-4">
      <p className="text-sm text-gray-500">{title}</p>
      <p className="text-2xl font-bold mt-2">{value}</p>
    </div>
  );
}

function TableBlock({ title, items }) {
  return (
    <div className="bg-white rounded-2xl shadow p-4">
      <h2 className="font-semibold mb-3">{title}</h2>
      <table className="w-full text-sm">
        <thead className="border-b">
          <tr>
            <th className="text-left py-2">Product</th>
            <th className="text-right">Qty</th>
          </tr>
        </thead>
        <tbody>
          {items.map((x) => (
            <tr key={x.productId} className="border-b">
              <td className="py-2">{x.productName}</td>
              <td className="text-right">{x.quantity}</td>
            </tr>
          ))}
          {!items.length && (
            <tr>
              <td colSpan="2" className="text-center py-6 text-gray-400">
                No data
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}