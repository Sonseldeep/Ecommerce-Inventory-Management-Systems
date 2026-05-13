// import useInventoryAnalytics from "./hooks/useInventoryAnalytics";
// import useUserAnalytics from "./hooks/useUserAnalytics";


// import { useState } from "react";
// import useInventoryAnalytics from "./hooks/useInventoryAnalytics";
// import useUserAnalytics from "./hooks/useUserAnalytics";

// import KpiCard from "./components/KpiCard";
// import StockBarChart from "./components/StockBarChart";
// import CategoryPieChart from "./components/CategoryPieChart";
// import BestSellersGrid from "./components/BestSellersGrid";
// import TopBuyersGrid from "./components/TopBuyersGrid";
// import UserPurchasesGrid from "./components/UserPurchasesGrid";
// import ReportActions from "./components/ReportActions";


// import "./AdminDashboardPage.css";
// import { downloadReport } from "../../api/reportApi";

// export default function AdminDashboardPage() {
//   const { data, stockBar, bestSellers, notSelling, categoryStock } = useInventoryAnalytics();
//   const { userDays, setUserDays, userSummary, selectedUser, userProducts, openUser } = useUserAnalytics();

//   const [fromDate, setFromDate] = useState("2026-05-01");
//   const [toDate, setToDate] = useState("2026-05-31");

//   if (!data) return <div className="page-loading">Loading...</div>;

//   const handleExport = (type) => {
//     const endpoint =
//       type === "inventory-pack"
//         ? "/admin/reports/inventory-pack"
//         : `/admin/reports/${type}`;

//     downloadReport(
//       endpoint,
//       {
//         format: "xlsx",
//         filters: {
//           fromUtc: `${fromDate}T00:00:00Z`,
//           toUtc: `${toDate}T23:59:59Z`,
//           top: 50
//         }
//       },
//       `${type}.xlsx`
//     );
//   };

//   return (
//     <div className="dashboard-page">
//       <div className="dashboard-header">
//         <div>
//           <h1 className="dashboard-title">Admin Inventory Analytics</h1>
//           <p className="dashboard-subtitle">Real-time insights and report exports</p>
//         </div>
//       </div>

//       <ReportActions
//         fromDate={fromDate}
//         toDate={toDate}
//         onChangeFrom={setFromDate}
//         onChangeTo={setToDate}
//         onExport={handleExport}
//       />

//       <div className="kpi-grid">
//         <KpiCard title="Total Products" value={data.totalProducts} />
//         <KpiCard title="Low Stock" value={data.lowStockCount} />
//         <KpiCard title="Out of Stock" value={data.outOfStockCount} />
//       </div>

//       <div className="grid-2">
//         <StockBarChart data={stockBar} />
//         <CategoryPieChart data={categoryStock} />
//       </div>

//       <div className="grid-2">
//         <BestSellersGrid title="Best Sellers (Last 30 Days)" items={bestSellers} />
//         <BestSellersGrid title="Not Selling (Last 30 Days)" items={notSelling} />
//       </div>

//       <div className="grid-2">
//         <TopBuyersGrid
//           userSummary={userSummary}
//           userDays={userDays}
//           setUserDays={setUserDays}
//           onSelect={openUser}
//         />
//         <UserPurchasesGrid
//           selectedUser={selectedUser}
//           userProducts={userProducts}
//           onClose={() => openUser(null)}
//         />
//       </div>
//     </div>
//   );
// }




import { useState } from "react";
import useInventoryAnalytics from "./hooks/useInventoryAnalytics";
import useUserAnalytics from "./hooks/useUserAnalytics";

import KpiCard from "./components/KpiCard";
import StockBarChart from "./components/StockBarChart";
import CategoryPieChart from "./components/CategoryPieChart";
import BestSellersGrid from "./components/BestSellersGrid";
import TopBuyersGrid from "./components/TopBuyersGrid";
import UserPurchasesGrid from "./components/UserPurchasesGrid";
import ReportActions from "./components/ReportActions";

import "./AdminDashboardPage.css";
import { downloadReport } from "../../api/reportApi";

export default function AdminDashboardPage() {
  const { data, stockBar, bestSellers, notSelling, categoryStock } = useInventoryAnalytics();
  const { userDays, setUserDays, userSummary, selectedUser, userProducts, openUser } = useUserAnalytics();

  const [fromDate, setFromDate] = useState("2026-05-01");
  const [toDate, setToDate] = useState("2026-05-31");

  if (!data) return <div className="page-loading">Loading...</div>;

  const handleExport = (type) => {
    const endpoint =
      type === "inventory-pack"
        ? "/admin/reports/inventory-pack"
        : `/admin/reports/${type}`;

    downloadReport(
      endpoint,
      {
        format: "xlsx",
        filters: {
          fromUtc: `${fromDate}T00:00:00Z`,
          toUtc: `${toDate}T23:59:59Z`,
          top: 50
        }
      },
      `${type}.xlsx`
    );
  };

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <div>
          <h1 className="dashboard-title">Admin Inventory Analytics</h1>
          <p className="dashboard-subtitle">Real-time insights and report exports</p>
        </div>
      </div>

      <ReportActions
        fromDate={fromDate}
        toDate={toDate}
        onChangeFrom={setFromDate}
        onChangeTo={setToDate}
        onExport={handleExport}
      />

      <div className="kpi-grid">
        <KpiCard title="Total Products" value={data.totalProducts} />
        <KpiCard title="Low Stock" value={data.lowStockCount} />
        <KpiCard title="Out of Stock" value={data.outOfStockCount} />
      </div>

      <div className="grid-2">
        <StockBarChart data={stockBar} />
        <CategoryPieChart data={categoryStock} />
      </div>

      <div className="grid-2">
        <BestSellersGrid title="Best Sellers (Last 30 Days)" items={bestSellers} />
        <BestSellersGrid title="Not Selling (Last 30 Days)" items={notSelling} />
      </div>

      <div className="grid-2">
        <TopBuyersGrid
          userSummary={userSummary}
          userDays={userDays}
          setUserDays={setUserDays}
          onSelect={openUser}
        />
        <UserPurchasesGrid
          selectedUser={selectedUser}
          userProducts={userProducts}
          onClose={() => openUser(null)}
        />
      </div>
    </div>
  );
}