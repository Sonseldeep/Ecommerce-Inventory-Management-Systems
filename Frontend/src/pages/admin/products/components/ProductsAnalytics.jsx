import Chart, {
  CommonSeriesSettings,
  Export as ChartExport,
  Legend,
  Series,
  Title,
  Tooltip,
  ValueAxis,
} from "devextreme-react/chart";
import PieChart, {
  Connector,
  Label,
  Series as PieSeries,
  SmallValuesGrouping,
} from "devextreme-react/pie-chart";

import StatCard from "./StatCard";
import { buildCategoryChartData, buildInventoryValueData, buildPriceRangeData, buildStockChartData, computeKPIs } from "../utils/chartDataHelper";


const chartCard = {
  background: "#fff",
  border: "1px solid #e5e7eb",
  borderRadius: 16,
  padding: "22px 20px",
};

export default function ProductsAnalytics({ products, categories }) {
  const kpis = computeKPIs(products, categories);
  const stockData = buildStockChartData(products);
  const categoryData = buildCategoryChartData(products, categories);
  const priceData = buildPriceRangeData(products);
  const valueData = buildInventoryValueData(products);

  return (
    <div>
      {/* ── KPI Cards ──────────────────────────────────────────────────── */}
      <div style={{ display: "flex", gap: 14, flexWrap: "wrap", marginBottom: 24 }}>
        <StatCard label="Total Products" value={kpis.total} sub="in catalogue" />
        <StatCard
          label="Active"
          value={kpis.active}
          sub={`${kpis.inactive} inactive`}
          accent="#16a34a"
        />
        <StatCard
          label="Low Stock"
          value={kpis.lowStock}
          sub="need reorder"
          accent={kpis.lowStock > 0 ? "#dc2626" : "#111"}
        />
        <StatCard label="Categories" value={kpis.categoryCount} sub="distinct" />
        <StatCard
          label="Inventory Value"
          value={`Rs${(kpis.totalValue / 1000).toFixed(1)}K`}
          sub="stock × price"
        />
      </div>

      {/* ── Charts Grid ────────────────────────────────────────────────── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(440px, 1fr))",
          gap: 20,
        }}
      >
        {/* Stock Levels */}
        <div style={chartCard}>
          <p style={{ fontSize: 15, fontWeight: 700, marginBottom: 14 }}>
            📦 Stock Levels — Top 15 Products
          </p>
          <Chart dataSource={stockData} rotated height={320}>
            <CommonSeriesSettings argumentField="name" type="bar" />
            <Series valueField="stock" name="Stock" color="#1d4ed8" />
            <Series valueField="reorder" name="Reorder Level" color="#f97316" />
            <ValueAxis />
            <Legend visible position="outside" horizontalAlignment="center" />
            <Tooltip enabled shared />
            <ChartExport enabled fileName="StockLevels" />
          </Chart>
        </div>

        {/* Category Distribution */}
        <div style={chartCard}>
          <p style={{ fontSize: 15, fontWeight: 700, marginBottom: 14 }}>
            🏷️ Products by Category
          </p>
          <PieChart dataSource={categoryData} type="donut" height={320}>
            <PieSeries argumentField="category" valueField="count">
              <Label visible>
                <Connector visible />
              </Label>
              <SmallValuesGrouping threshold={1} mode="smallValueThreshold" />
            </PieSeries>
            <Legend visible position="outside" horizontalAlignment="center" />
            <Tooltip enabled />
            <ChartExport enabled fileName="CategoryDistribution" />
          </PieChart>
        </div>

        {/* Price Range Buckets */}
        <div style={chartCard}>
          <p style={{ fontSize: 15, fontWeight: 700, marginBottom: 14 }}>
            💰 Price Range Distribution
          </p>
          <Chart dataSource={priceData} height={280}>
            <CommonSeriesSettings argumentField="range" type="bar" />
            <Series valueField="count" name="Products" color="#7c3aed" cornerRadius={4} />
            <ValueAxis allowDecimals={false} />
            <Legend visible={false} />
            <Tooltip enabled />
            <Title text="Products per price bracket" font={{ size: 12 }} />
            <ChartExport enabled fileName="PriceRanges" />
          </Chart>
        </div>

        {/* Inventory Value */}
        <div style={chartCard}>
          <p style={{ fontSize: 15, fontWeight: 700, marginBottom: 14 }}>
            💎 Inventory Value — Top 10 Products
          </p>
          <Chart dataSource={valueData} rotated height={310}>
            <CommonSeriesSettings argumentField="name" type="bar" />
            <Series valueField="value" name="Value (Rs)" color="#0891b2" />
            <ValueAxis>
              <Title text="Rs" />
            </ValueAxis>
            <Tooltip enabled shared />
            <Legend visible={false} />
            <ChartExport enabled fileName="InventoryValue" />
          </Chart>
        </div>
      </div>
    </div>
  );
}