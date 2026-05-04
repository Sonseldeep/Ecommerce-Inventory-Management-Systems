import DataGrid, {
  Column,
  ColumnChooser,
  Export,
  FilterRow,
  HeaderFilter,
  Item,
  Pager,
  Paging,
  SearchPanel,
  Summary,
  Toolbar,
  TotalItem,
} from "devextreme-react/data-grid";
import { handleGridExport } from "../utils/exportHelper";
import { ALLOWED_PAGE_SIZES } from "../constant";


export default function CategoriesGrid({ categories, onEdit, onDelete, onAddNew }) {
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
        dataSource={categories}
        keyExpr="id"
        showBorders={false}
        rowAlternationEnabled
        columnAutoWidth
        allowColumnReordering
        allowColumnResizing
        onExporting={handleGridExport}
        style={{ fontSize: 13 }}
      >
        {/* ── Toolbar ──────────────────────────────────────────────────────── */}
        <Toolbar>
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
              + Add Category
            </button>
          </Item>
          <Item name="searchPanel" />
          <Item name="columnChooserButton" showText="inMenu" />
          <Item name="exportButton" />
        </Toolbar>

        {/* ── Search ───────────────────────────────────────────────────────── */}
        <SearchPanel visible width={220} placeholder="Search categories…" />

        {/* ── Filters ──────────────────────────────────────────────────────── */}
        <FilterRow visible />
        <HeaderFilter visible />

        {/* ── Column Chooser ───────────────────────────────────────────────── */}
        <ColumnChooser enabled mode="select" />

        {/* ── Pagination ───────────────────────────────────────────────────── */}
        <Paging defaultPageSize={10} />
        <Pager
          showPageSizeSelector
          allowedPageSizes={ALLOWED_PAGE_SIZES}
          showInfo
          showNavigationButtons
          infoText="Page {0} of {1} ({2} categories)"
        />

        {/* ── Export ───────────────────────────────────────────────────────── */}
        <Export
          enabled
          formats={["xlsx", "pdf"]}
          texts={{
            exportAll: "Export all",
            exportTo: "Export",
          }}
        />

        {/* ── Columns ──────────────────────────────────────────────────────── */}
        <Column
          dataField="name"
          caption="Category Name"
          minWidth={200}
          sortOrder="asc"
        />

        <Column
          dataField="description"
          caption="Description"
          minWidth={300}
          cellRender={({ value }) => (
            <span style={{ color: value ? "#374151" : "#9ca3af" }}>
              {value || "—"}
            </span>
          )}
        />

        <Column
          caption="Actions"
          width={130}
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
            displayFormat="{0} categories"
          />
        </Summary>
      </DataGrid>
    </div>
  );
}