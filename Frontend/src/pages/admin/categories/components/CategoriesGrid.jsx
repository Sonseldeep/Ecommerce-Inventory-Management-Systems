// import DataGrid, {
//   Column,
//   ColumnChooser,
//   Export,
//   FilterRow,
//   HeaderFilter,
//   Item,
//   Pager,
//   Paging,
//   SearchPanel,
//   Summary,
//   Toolbar,
//   TotalItem,
// } from "devextreme-react/data-grid";
// import { handleGridExport } from "../utils/exportHelper";
// import { ALLOWED_PAGE_SIZES } from "../constant";

// export default function CategoriesGrid({ categories, onEdit, onDelete, onAddNew }) {
//   return (
//     <div
//       style={{
//         background: "#fff",
//         borderRadius: 16,
//         border: "1px solid #e5e7eb",
//         padding: 20,
//       }}
//     >
//       <DataGrid
//         dataSource={categories}
//         keyExpr="id"
//         showBorders={false}
//         rowAlternationEnabled
//         columnAutoWidth
//         allowColumnReordering
//         allowColumnResizing
//         onExporting={handleGridExport}
//         style={{ fontSize: 13 }}
//       >
//         {/* ── Toolbar ──────────────────────────────────────────────────────── */}
//         <Toolbar>
//           <Item location="before">
//             <button
//               onClick={onAddNew}
//               style={{
//                 padding: "8px 16px",
//                 borderRadius: 8,
//                 border: "none",
//                 background: "#111",
//                 color: "#fff",
//                 fontSize: 12,
//                 fontWeight: 600,
//                 cursor: "pointer",
//               }}
//             >
//               + Add Category
//             </button>
//           </Item>
//           <Item name="searchPanel" />
//           <Item name="columnChooserButton" showText="inMenu" />
//           <Item name="exportButton" />
//         </Toolbar>

//         {/* ── Search ───────────────────────────────────────────────────────── */}
//         <SearchPanel visible width={220} placeholder="Search categories…" />

//         {/* ── Filters ──────────────────────────────────────────────────────── */}
//         <FilterRow visible />
//         <HeaderFilter visible />

//         {/* ── Column Chooser ───────────────────────────────────────────────── */}
//         <ColumnChooser enabled mode="select" />

//         {/* ── Pagination ───────────────────────────────────────────────────── */}
//         <Paging defaultPageSize={10} />
//         <Pager
//           showPageSizeSelector
//           allowedPageSizes={ALLOWED_PAGE_SIZES}
//           showInfo
//           showNavigationButtons
//           infoText="Page {0} of {1} ({2} categories)"
//         />

//         {/* ── Export ───────────────────────────────────────────────────────── */}
//         <Export
//           enabled
//           formats={["xlsx", "pdf"]}
//           texts={{
//             exportAll: "Export all",
//             exportTo: "Export",
//           }}
//         />

//         {/* ── Columns ──────────────────────────────────────────────────────── */}
//         <Column
//           dataField="name"
//           caption="Category Name"
//           minWidth={200}
//           sortOrder="asc"
//         />

//         <Column
//           dataField="description"
//           caption="Description"
//           minWidth={300}
//           cellRender={({ value }) => (
//             <span style={{ color: value ? "#374151" : "#9ca3af" }}>
//               {value || "—"}
//             </span>
//           )}
//         />

//         <Column
//           caption="Actions"
//           width={130}
//           allowFiltering={false}
//           allowSorting={false}
//           allowExporting={false}
//           cellRender={({ data }) => (
//             <div style={{ display: "flex", gap: 6 }}>
//               <button
//                 onClick={() => onEdit(data)}
//                 style={{
//                   padding: "4px 10px",
//                   borderRadius: 6,
//                   border: "none",
//                   background: "#f3f4f6",
//                   color: "#374151",
//                   fontSize: 12,
//                   fontWeight: 600,
//                   cursor: "pointer",
//                 }}
//               >
//                  Edit
//               </button>
//               <button
//                 onClick={() => onDelete(data.id)}
//                 style={{
//                   padding: "4px 10px",
//                   borderRadius: 6,
//                   border: "none",
//                   background: "#fee2e2",
//                   color: "#dc2626",
//                   fontSize: 12,
//                   fontWeight: 600,
//                   cursor: "pointer",
//                 }}
//               >
//                 Delete
//               </button>
//             </div>
//           )}
//         />

//         {/* ── Summary Row ──────────────────────────────────────────────────── */}
//         <Summary>
//           <TotalItem
//             column="name"
//             summaryType="count"
//             displayFormat="{0} categories"
//           />
//         </Summary>
//       </DataGrid>
//     </div>
//   );
// }

import DataGrid, {
  Column,
  ColumnChooser,
  Export,

  Pager,
  Paging,
  SearchPanel,
  Summary,
  Toolbar,
  TotalItem,
  Item,
} from "devextreme-react/data-grid";

import { useState } from "react";
import CustomStore from "devextreme/data/custom_store";
import DataSource from "devextreme/data/data_source";
import { getCategoriesApi } from "../../../../api/categoryApi";
// eslint-disable-next-line no-unused-vars
import { handleGridExport } from "../utils/exportHelper";
import { ALLOWED_PAGE_SIZES } from "../constant";

export default function CategoriesGrid({ onEdit, onDelete, onAddNew }) {
  // ── Delete confirmation state ─────────────────────────────────
  const [deleteConfirm, setDeleteConfirm] = useState({ open: false, categoryId: null });

  // ✅ SERVER-SIDE DATA SOURCE
  const dataSource = new DataSource({
    store: new CustomStore({
      key: "id",

      load: async (loadOptions) => {
        const pageSize = loadOptions.take || 10;
        const skip = loadOptions.skip || 0;
        const pageNumber = skip / pageSize + 1;

        const sort = loadOptions.sort?.[0];
        const sortBy = sort?.selector || "name";
        const sortOrder = sort?.desc ? "desc" : "asc";

        const searchValue = loadOptions.searchValue || "";

        const res = await getCategoriesApi({
          pageNumber,
          pageSize,
          sortBy,
          sortOrder,
          search: searchValue,
        });

        const data = res.data?.data;

        return {
          data: data.items,
          totalCount: data.totalCount,
        };
      },
    }),

    paginate: true,
    remoteOperations: true,
  });

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
        dataSource={dataSource}
        keyExpr="id"
        showBorders={false}
        rowAlternationEnabled
        columnAutoWidth
        allowColumnReordering
        allowColumnResizing
        remoteOperations={true} // ✅ REQUIRED
      >
        {/* Toolbar */}
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
              }}
            >
              + Add Category
            </button>
          </Item>

          <Item name="searchPanel" />
          <Item name="columnChooserButton" showText="inMenu" />
          <Item name="exportButton" />
        </Toolbar>

        {/* Search */}
        <SearchPanel visible width={220} placeholder="Search categories…" />

        {/* Filters */}
        {/* <FilterRow visible />
        <HeaderFilter visible /> */}

        {/* Column chooser */}
        <ColumnChooser enabled mode="select" />

        {/* Pagination (IMPORTANT) */}
        <Paging defaultPageSize={10} />
        <Pager
          visible={true}
          showPageSizeSelector={true}
          allowedPageSizes={ALLOWED_PAGE_SIZES}
          showInfo={true}
          showNavigationButtons={true}
          displayMode="full"
        />

        {/* Export */}
        <Export enabled formats={["xlsx", "pdf"]} />

        {/* Columns */}
        <Column dataField="name" caption="Category Name" />
        <Column 
          dataField="productCount" 
          caption="Product Items" 
          width={120}
          dataType="number"
          cellRender={({ value }) => (
            <span style={{ fontWeight: 600, color: "#374151" }}>
              {value || 0}
            </span>
          )}
        />

        <Column dataField="description" caption="Description" />

        {/* Actions */}
        <Column
          caption="Actions"
          width={130}
          allowFiltering={false}
          allowSorting={false}
          cellRender={({ data }) => (
            <div style={{ display: "flex", gap: 6 }}>
              <button
                onClick={() => onEdit(data)}
                style={{
                  padding: "4px 10px",
                  borderRadius: 6,
                  border: "1px solid #d1d5db",
                  background: "#f9fafb",
                  color: "#374151",
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                Edit
              </button>

              <button
                onClick={() => setDeleteConfirm({ open: true, categoryId: data.id })}
                style={{
                  padding: "4px 10px",
                  borderRadius: 6,
                  border: "1px solid #fecaca",
                  background: "#fee2e2",
                  color: "#b91c1c",
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                Delete
              </button>
            </div>
          )}
        />

        {/* Summary */}
        <Summary>
          <TotalItem
            column="name"
            summaryType="count"
            displayFormat="{0} categories"
          />
        </Summary>
      </DataGrid>

      {/* ── Delete Confirmation Modal ────────────────────────────── */}
      {deleteConfirm.open && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              background: "#fff",
              borderRadius: 12,
              padding: 32,
              maxWidth: 400,
              boxShadow: "0 20px 25px rgba(0, 0, 0, 0.15)",
            }}
          >
            <h3 style={{ margin: "0 0 12px 0", fontSize: 18, fontWeight: 700, color: "#1f2937" }}>
              Delete Category?
            </h3>
            <p style={{ margin: "0 0 24px 0", fontSize: 14, color: "#6b7280", lineHeight: 1.5 }}>
              Are you sure you want to delete this category? This action cannot be undone.
            </p>
            <div style={{ display: "flex", gap: 12, justifyContent: "flex-end" }}>
              <button
                onClick={() => setDeleteConfirm({ open: false, categoryId: null })}
                style={{
                  padding: "8px 16px",
                  borderRadius: 6,
                  border: "1px solid #e5e7eb",
                  background: "#f3f4f6",
                  color: "#374151",
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: "pointer",
                  transition: "all 0.2s",
                }}
              >
                No, Cancel
              </button>
              <button
                onClick={() => {
                  onDelete(deleteConfirm.categoryId);
                  setDeleteConfirm({ open: false, categoryId: null });
                }}
                style={{
                  padding: "8px 16px",
                  borderRadius: 6,
                  border: "none",
                  background: "#dc2626",
                  color: "#fff",
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: "pointer",
                  transition: "all 0.2s",
                }}
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
