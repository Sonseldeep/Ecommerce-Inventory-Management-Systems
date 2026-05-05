import useInventoryAnalytics from "./hooks/useInventoryAnalytics";
import useUserAnalytics from "./hooks/useUserAnalytics";

import KpiCard from "./components/KpiCard";
import StockBarChart from "./components/StockBarChart";
import CategoryPieChart from "./components/CategoryPieChart";
import BestSellersGrid from "./components/BestSellersGrid";
import TopBuyersGrid from "./components/TopBuyersGrid";
import UserPurchasesGrid from "./components/UserPurchasesGrid";

import "./AdminDashboardPage.css";

export default function AdminDashboardPage() {
  const { data, stockBar, bestSellers, notSelling, categoryStock } = useInventoryAnalytics();
  const { userDays, setUserDays, userSummary, selectedUser, userProducts, openUser } = useUserAnalytics();

  if (!data) return <div className="page-loading">Loading...</div>;

  return (
    <div className="dashboard-page">
      <h1 className="dashboard-title">Admin Inventory Analytics</h1>

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