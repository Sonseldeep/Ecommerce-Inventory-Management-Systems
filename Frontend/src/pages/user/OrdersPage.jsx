/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState, useCallback } from "react";
import TextBox from "devextreme-react/text-box";
import SelectBox from "devextreme-react/select-box";
import Button from "devextreme-react/button";
import { getMyOrdersApi } from "../../api/orderApi";

/* ─── Inline styles / font injection ─── */
const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=DM+Sans:wght@300;400;500;600&display=swap');

    *, *::before, *::after { box-sizing: border-box; }

    .orders-root {
      font-family: 'DM Sans', sans-serif;
      min-height: 100vh;
      background: #f4f3ef;
      color: #1a1a1a;
    }

    /* ── Header ── */
    .orders-header {
      background: linear-gradient(135deg, #1c1c2e 0%, #2d2d44 60%, #1a2740 100%);
      padding: 48px 40px 36px;
      position: relative;
      overflow: hidden;
    }
    .orders-header::before {
      content: '';
      position: absolute;
      top: -60px; right: -60px;
      width: 240px; height: 240px;
      border-radius: 50%;
      background: rgba(255,255,255,0.03);
    }
    .orders-header::after {
      content: '';
      position: absolute;
      bottom: -80px; left: 30%;
      width: 300px; height: 300px;
      border-radius: 50%;
      background: rgba(255,193,100,0.05);
    }
    .orders-title {
      font-family: 'Playfair Display', serif;
      font-size: 2.4rem;
      font-weight: 700;
      color: #fff;
      margin: 0 0 6px;
      letter-spacing: -0.5px;
    }
    .orders-subtitle {
      color: rgba(255,255,255,0.45);
      font-size: 0.9rem;
      font-weight: 300;
    }
    .orders-badge-count {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      background: #f5c542;
      color: #1a1a1a;
      font-size: 0.75rem;
      font-weight: 600;
      border-radius: 20px;
      padding: 2px 10px;
      margin-left: 10px;
      vertical-align: middle;
    }

    /* ── Filter Bar ── */
    .filters-bar {
      background: #fff;
      border-bottom: 1px solid #e8e6e0;
      padding: 18px 40px;
      display: flex;
      flex-wrap: wrap;
      gap: 12px;
      align-items: center;
      position: sticky;
      top: 0;
      z-index: 10;
      box-shadow: 0 2px 12px rgba(0,0,0,0.06);
    }
    .filter-group {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .filter-label {
      font-size: 0.75rem;
      font-weight: 600;
      color: #888;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      white-space: nowrap;
    }
    .filter-divider {
      width: 1px;
      height: 28px;
      background: #e8e6e0;
      margin: 0 4px;
    }
    .filters-bar .dx-textbox,
    .filters-bar .dx-selectbox {
      border-radius: 8px !important;
    }

    /* ── Body ── */
    .orders-body {
      padding: 32px 40px;
      max-width: 1100px;
      margin: 0 auto;
    }

    /* ── Order Card ── */
    .order-card {
      background: #fff;
      border-radius: 16px;
      border: 1px solid #eae8e3;
      margin-bottom: 16px;
      overflow: hidden;
      transition: transform 0.18s ease, box-shadow 0.18s ease;
      cursor: default;
    }
    .order-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 32px rgba(0,0,0,0.09);
    }
    .order-card-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 18px 24px 14px;
      border-bottom: 1px solid #f0eeea;
      gap: 12px;
      flex-wrap: wrap;
    }
    .order-number {
      font-family: 'Playfair Display', serif;
      font-size: 1.05rem;
      font-weight: 600;
      color: #1c1c2e;
      letter-spacing: -0.2px;
    }
    .order-number span {
      color: #999;
      font-family: 'DM Sans', sans-serif;
      font-weight: 400;
      font-size: 0.85rem;
    }
    .order-meta {
      display: flex;
      align-items: center;
      gap: 12px;
      flex-wrap: wrap;
    }
    .order-total {
      font-size: 1rem;
      font-weight: 600;
      color: #1c1c2e;
    }
    .order-total-label {
      font-size: 0.78rem;
      color: #aaa;
      font-weight: 400;
    }
    .order-date {
      font-size: 0.8rem;
      color: #bbb;
    }

    /* ── Status Badge ── */
    .status-badge {
      display: inline-flex;
      align-items: center;
      gap: 5px;
      padding: 4px 12px;
      border-radius: 20px;
      font-size: 0.75rem;
      font-weight: 600;
      letter-spacing: 0.03em;
      text-transform: capitalize;
    }
    .status-badge::before {
      content: '';
      width: 6px; height: 6px;
      border-radius: 50%;
      background: currentColor;
      opacity: 0.7;
    }
    .status-1 { background: #fff8e1; color: #d48800; }   /* Pending */
    .status-2 { background: #e3f2fd; color: #1565c0; }   /* Confirmed */
    .status-3 { background: #e8f5e9; color: #2e7d32; }   /* Paid */
    .status-4 { background: #ede7f6; color: #4527a0; }   /* Shipped */
    .status-5 { background: #e0f2f1; color: #00695c; }   /* Delivered */
    .status-6 { background: #fce4ec; color: #c62828; }   /* Cancelled */

    /* ── Items ── */
    .order-items {
      padding: 14px 24px 18px;
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }
    .order-item-chip {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      background: #f7f6f2;
      border: 1px solid #eae8e3;
      border-radius: 8px;
      padding: 5px 12px;
      font-size: 0.82rem;
      color: #444;
    }
    .order-item-chip .qty {
      background: #1c1c2e;
      color: #fff;
      border-radius: 4px;
      padding: 1px 6px;
      font-size: 0.7rem;
      font-weight: 600;
    }

    /* ── Empty State ── */
    .empty-state {
      text-align: center;
      padding: 80px 20px;
    }
    .empty-icon {
      font-size: 3.5rem;
      margin-bottom: 16px;
      opacity: 0.25;
    }
    .empty-text {
      font-size: 1rem;
      color: #bbb;
      font-weight: 300;
    }

    /* ── Pagination ── */
    .pagination {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 6px;
      padding: 24px 0 8px;
      flex-wrap: wrap;
    }
    .page-btn {
      min-width: 36px;
      height: 36px;
      border-radius: 8px;
      border: 1px solid #ddd;
      background: #fff;
      color: #444;
      font-family: 'DM Sans', sans-serif;
      font-size: 0.85rem;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.15s;
      padding: 0 10px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .page-btn:hover:not(:disabled):not(.active) {
      border-color: #1c1c2e;
      color: #1c1c2e;
    }
    .page-btn.active {
      background: #1c1c2e;
      border-color: #1c1c2e;
      color: #fff;
      font-weight: 600;
    }
    .page-btn:disabled {
      opacity: 0.35;
      cursor: not-allowed;
    }
    .page-ellipsis {
      color: #ccc;
      font-size: 0.85rem;
      padding: 0 4px;
    }

    /* ── Loading ── */
    .loading-shimmer {
      background: linear-gradient(90deg, #f0eeea 25%, #e8e6e0 50%, #f0eeea 75%);
      background-size: 200% 100%;
      animation: shimmer 1.4s infinite;
      border-radius: 12px;
      height: 100px;
      margin-bottom: 16px;
    }
    @keyframes shimmer {
      0% { background-position: 200% 0; }
      100% { background-position: -200% 0; }
    }

    /* ── DevExtreme overrides ── */
    .dx-texteditor {
      border-radius: 8px !important;
    }
    .dx-texteditor.dx-editor-outlined {
      border-color: #e0ddd6 !important;
      background: #faf9f7 !important;
    }
    .dx-texteditor.dx-editor-outlined.dx-state-focused {
      border-color: #1c1c2e !important;
    }

    @media (max-width: 700px) {
      .orders-header { padding: 32px 20px 24px; }
      .orders-title { font-size: 1.8rem; }
      .orders-body { padding: 20px 16px; }
      .filters-bar { padding: 14px 16px; }
      .order-card-header { flex-direction: column; align-items: flex-start; }
    }
  `}</style>
);

/* ─── Constants ─── */
const STATUS_OPTIONS = [
  { value: "", label: "All Statuses" },
  { value: "1", label: "Pending" },
  { value: "2", label: "Confirmed" },
  { value: "3", label: "Paid" },
  { value: "4", label: "Shipped" },
  { value: "5", label: "Delivered" },
  { value: "6", label: "Cancelled" },
];

const SORT_BY_OPTIONS = [
  { value: "createdAt", label: "Date Created" },
  { value: "total", label: "Total Amount" },
];

const SORT_ORDER_OPTIONS = [
  { value: "desc", label: "Newest First" },
  { value: "asc", label: "Oldest First" },
];

const STATUS_LABELS = {
  1: "Pending",
  2: "Confirmed",
  3: "Paid",
  4: "Shipped",
  5: "Delivered",
  6: "Cancelled",
};

/* ─── Helper: paginate page numbers ─── */
function getPageNumbers(current, total) {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const pages = [1];
  if (current > 3) pages.push("...");
  for (
    let i = Math.max(2, current - 1);
    i <= Math.min(total - 1, current + 1);
    i++
  )
    pages.push(i);
  if (current < total - 2) pages.push("...");
  pages.push(total);
  return pages;
}

/* ─── Order Card ─── */
function OrderCard({ order }) {
  const statusNum =
    typeof order.orderStatus === "number"
      ? order.orderStatus
      : parseInt(order.orderStatus, 10);
  const statusLabel = STATUS_LABELS[statusNum] || order.orderStatus;

  return (
    <div className="order-card">
      <div className="order-card-header">
        <div>
          <div className="order-number">
            <span>Order </span>#{order.orderNumber}
          </div>
          {order.createdAt && (
            <div className="order-date">
              {new Date(order.createdAt).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </div>
          )}
        </div>

        <div className="order-meta">
          <div>
            <div className="order-total-label">Total</div>
            <div className="order-total">
              Rs  {Number(order.totalAmount).toLocaleString("en-IN")}
            </div>
          </div>
          <span className={`status-badge status-${statusNum}`}>
            {statusLabel}
          </span>
        </div>
      </div>

      {(order.items || []).length > 0 && (
        <div className="order-items">
          {order.items.map((it) => (
            <span key={it.id} className="order-item-chip">
              {it.productName}
              <span className="qty">×{it.quantity}</span>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

/* ─── Main Page ─── */
export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");

  const load = useCallback(async () => {
    setLoading(true);
    try {
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
      setTotalItems(payload?.totalCount ?? payload?.items?.length ?? 0);
    } finally {
      setLoading(false);
    }
  }, [search, status, sortBy, sortOrder, pageNumber, pageSize]);

  useEffect(() => {
    load();
  }, [load]);

  const handleSearch = (v) => {
    setSearch(v);
    setPageNumber(1);
  };
  const handleStatus = (v) => {
    setStatus(v);
    setPageNumber(1);
  };
  const handleSortBy = (v) => {
    setSortBy(v);
    setPageNumber(1);
  };
  const handleSortOrder = (v) => {
    setSortOrder(v);
    setPageNumber(1);
  };
  const handleReset = () => {
    setSearch("");
    setStatus("");
    setSortBy("createdAt");
    setSortOrder("desc");
    setPageNumber(1);
  };

  const pageNums = getPageNumbers(pageNumber, totalPages);

  return (
    <div className="orders-root">
      <GlobalStyles />

      {/* ── Header ── */}
      <div className="orders-header">
        <div style={{ position: "relative", zIndex: 1 }}>
          <h1 className="orders-title">
            My Orders
            {totalItems > 0 && (
              <span className="orders-badge-count">{totalItems}</span>
            )}
          </h1>
          <p className="orders-subtitle">
            Track and manage your purchase history
          </p>
        </div>
      </div>

      {/* ── Filters Bar ── */}
      <div className="filters-bar">
        <div className="filter-group">
          <TextBox
            value={search}
            onValueChanged={(e) => handleSearch(e.value)}
            placeholder="Search order number…"
            showClearButton
            stylingMode="outlined"
            width={220}
          />
        </div>

        <div className="filter-divider" />

        <div className="filter-group">
          <span className="filter-label">Status</span>
          <SelectBox
            items={STATUS_OPTIONS}
            displayExpr="label"
            valueExpr="value"
            value={status}
            onValueChanged={(e) => handleStatus(e.value)}
            stylingMode="outlined"
            width={150}
          />
        </div>

        <div className="filter-divider" />

        <div className="filter-group">
          <span className="filter-label">Sort</span>
          <SelectBox
            items={SORT_BY_OPTIONS}
            displayExpr="label"
            valueExpr="value"
            value={sortBy}
            onValueChanged={(e) => handleSortBy(e.value)}
            stylingMode="outlined"
            width={150}
          />
          <SelectBox
            items={SORT_ORDER_OPTIONS}
            displayExpr="label"
            valueExpr="value"
            value={sortOrder}
            onValueChanged={(e) => handleSortOrder(e.value)}
            stylingMode="outlined"
            width={140}
          />
        </div>

        <div className="filter-divider" />

        <Button
          text="Reset"
          type="normal"
          stylingMode="outlined"
          onClick={handleReset}
          icon="revert"
        />
      </div>

      {/* ── Body ── */}
      <div className="orders-body">
        {loading ? (
          <>
            {[1, 2, 3].map((k) => (
              <div key={k} className="loading-shimmer" />
            ))}
          </>
        ) : orders.length ? (
          <>
            {orders.map((o) => (
              <OrderCard key={o.id} order={o} />
            ))}

            {/* ── Pagination ── */}
            {totalPages > 1 && (
              <div className="pagination">
                <button
                  className="page-btn"
                  disabled={pageNumber === 1}
                  onClick={() => setPageNumber(1)}
                  title="First page"
                >
                  «
                </button>
                <button
                  className="page-btn"
                  disabled={pageNumber === 1}
                  onClick={() => setPageNumber((p) => p - 1)}
                >
                  ‹ Prev
                </button>

                {pageNums.map((p, idx) =>
                  p === "..." ? (
                    <span key={`e${idx}`} className="page-ellipsis">
                      …
                    </span>
                  ) : (
                    <button
                      key={p}
                      className={`page-btn ${p === pageNumber ? "active" : ""}`}
                      onClick={() => setPageNumber(p)}
                    >
                      {p}
                    </button>
                  ),
                )}

                <button
                  className="page-btn"
                  disabled={pageNumber === totalPages}
                  onClick={() => setPageNumber((p) => p + 1)}
                >
                  Next ›
                </button>
                <button
                  className="page-btn"
                  disabled={pageNumber === totalPages}
                  onClick={() => setPageNumber(totalPages)}
                  title="Last page"
                >
                  »
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="empty-state">
            <div className="empty-icon">📦</div>
            <p className="empty-text">
              No orders found matching your criteria.
            </p>
            <Button
              text="Clear Filters"
              type="default"
              stylingMode="outlined"
              onClick={handleReset}
              style={{ marginTop: 16 }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
