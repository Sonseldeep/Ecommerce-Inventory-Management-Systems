import { useRef } from "react";
import DataGrid, {
  Column,
  ColumnChooser,
  Export,
  FilterRow,
  GroupPanel,
  Grouping,
  HeaderFilter,
  Item,
  Pager,
  Paging,
  SearchPanel,
  Selection,
  Summary,
  Toolbar,
  TotalItem,
} from "devextreme-react/data-grid";

import { ALLOWED_PAGE_SIZES } from "../constant";
import { handleGridExport } from "../utils/exportHelper";

export default function ProductsGrid({ products, categories, onEdit, onDelete, onAddNew }) {
  const gridRef = useRef(null);

  const getCategoryName = (row) =>
    categories.find((c) => c.id === row.categoryId)?.name || "—";

  return (
    <div
      style={{
        background: "#fff",
        borderRadius: 16,
        border: "1px solid #e5e7eb",
        padding: 20,
      }}
    >
      <DataGrid
        ref={gridRef}
        dataSource={products}
        keyExpr="id"
        showBorders={false}
        rowAlternationEnabled
        columnAutoWidth
        allowColumnReordering
        allowColumnResizing
        wordWrapEnabled={false}
        onExporting={handleGridExport}
        style={{ fontSize: 13 }}
      >
        {/* ── Toolbar ──────────────────────────────────────────────────────── */}
        <Toolbar>
          <Item name="groupPanel" />
          <Item location="before">
            <button
              onClick={onAddNew}
              style={{
                padding: "8px 16px",
                borderRadius: 8,
                border: "none",
                background: "#111",
                color: "#fff",
                fontSize: 12,
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              + Add Product
            </button>
          </Item>
          <Item name="searchPanel" />
          <Item name="columnChooserButton" showText="inMenu" />
          <Item name="exportButton" />
        </Toolbar>

        {/* ── Search ───────────────────────────────────────────────────────── */}
        <SearchPanel visible width={220} placeholder="Search products…" />

        {/* ── Filters ──────────────────────────────────────────────────────── */}
        <FilterRow visible />
        <HeaderFilter visible />

        {/* ── Grouping ─────────────────────────────────────────────────────── */}
        <GroupPanel visible />
        <Grouping autoExpandAll={false} />

        {/* ── Column Chooser ───────────────────────────────────────────────── */}
        <ColumnChooser enabled mode="select" />

        {/* ── Selection ────────────────────────────────────────────────────── */}
        <Selection mode="multiple" showCheckBoxesMode="always" />

        {/* ── Pagination ───────────────────────────────────────────────────── */}
        <Paging defaultPageSize={10} />
        <Pager
          showPageSizeSelector
          allowedPageSizes={ALLOWED_PAGE_SIZES}
          showInfo
          showNavigationButtons
          infoText="Page {0} of {1} ({2} products)"
        />

        {/* ── Export ───────────────────────────────────────────────────────── */}
        <Export
          enabled
          formats={["xlsx", "pdf"]}
          allowExportSelectedData
          texts={{
            exportAll: "Export all",
            exportSelectedRows: "Export selected",
            exportTo: "Export",
          }}
        />

        {/* ── Columns ──────────────────────────────────────────────────────── */}
        <Column dataField="name" caption="Product Name" minWidth={180} />

        <Column dataField="sku" caption="SKU" width={130} />

        <Column
          caption="Category"
          width={150}
          calculateCellValue={getCategoryName}
          calculateFilterExpression={(value, operation) => [getCategoryName, operation || "contains", value]}
        />

        <Column
          dataField="price"
          caption="Price (Rs )"
          dataType="number"
          width={120}
          cellRender={({ value }) => (
            <span style={{ fontWeight: 600 }}>
              Rs {Number(value).toLocaleString("en-IN")}
            </span>
          )}
        />

        <Column
          dataField="discountPrice"
          caption="Discount (Rs )"
          dataType="number"
          width={130}
          cellRender={({ value }) =>
            value ? (
              <span style={{ color: "#16a34a", fontWeight: 600 }}>
                Rs {Number(value).toLocaleString("en-IN")}
              </span>
            ) : (
              <span style={{ color: "#d1d5db" }}>—</span>
            )
          }
        />

        <Column
          dataField="quantityInStock"
          caption="Stock"
          dataType="number"
          width={90}
          cellRender={({ value, data }) => {
            const isLow = value <= (data.reorderLevel || 5);
            return (
              <span
                style={{
                  background: isLow ? "#fee2e2" : "#dcfce7",
                  color: isLow ? "#dc2626" : "#16a34a",
                  borderRadius: 6,
                  padding: "2px 8px",
                  fontWeight: 600,
                  fontSize: 12,
                }}
              >
                {value}
              </span>
            );
          }}
        />

        <Column
          dataField="reorderLevel"
          caption="Reorder"
          dataType="number"
          width={100}
        />

        <Column
          dataField="isActive"
          caption="Status"
          dataType="boolean"
          width={100}
          cellRender={({ value }) => (
            <span
              style={{
                background: value ? "#dcfce7" : "#f3f4f6",
                color: value ? "#16a34a" : "#6b7280",
                borderRadius: 6,
                padding: "2px 10px",
                fontSize: 12,
                fontWeight: 600,
              }}
            >
              {value ? "Active" : "Inactive"}
            </span>
          )}
        />

        <Column
          caption="Actions"
          width={140}
          allowFiltering={false}
          allowSorting={false}
          allowExporting={false}
          cellRender={({ data }) => (
            <div style={{ display: "flex", gap: 6 }}>
              <button
                onClick={() => onEdit(data)}
                style={{
                  padding: "4px 10px",
                  borderRadius: 6,
                  border: "none",
                  background: "#f3f4f6",
                  color: "#374151",
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                ✏️ Edit
              </button>
              <button
                onClick={() => onDelete(data.id)}
                style={{
                  padding: "4px 10px",
                  borderRadius: 6,
                  border: "none",
                  background: "#fee2e2",
                  color: "#dc2626",
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                🗑️
              </button>
            </div>
          )}
        />

        {/* ── Summary Row ──────────────────────────────────────────────────── */}
        <Summary>
          <TotalItem
            column="name"
            summaryType="count"
            displayFormat="{0} products"
          />
          <TotalItem
            column="price"
            summaryType="avg"
            valueFormat={{ type: "fixedPoint", precision: 2 }}
            displayFormat="Avg: Rs {0}"
          />
          <TotalItem
            column="quantityInStock"
            summaryType="sum"
            displayFormat="Total: {0}"
          />
        </Summary>
      </DataGrid>
    </div>
  );
}