/* eslint-disable react-hooks/refs */
/* eslint-disable react-hooks/preserve-manual-memoization */
/* eslint-disable no-undef */
/* eslint-disable react-hooks/immutability */



// import { useState, useMemo } from "react";
// import CustomStore from "devextreme/data/custom_store";
// import DataSource from "devextreme/data/data_source";
// import DataGrid, {
//   Column,
//   ColumnChooser,
//   Export,
//   GroupPanel,
//   Grouping,

//   Item,
//   Pager,
//   Paging,
//   SearchPanel,

//   Summary,
//   Toolbar,
//   TotalItem,
// } from "devextreme-react/data-grid";

// import { getProductsApi } from "../../../../api/productApi";
// import { ALLOWED_PAGE_SIZES } from "../constant";
// import { handleGridExport } from "../utils/exportHelper";


// export default function ProductsGrid({
//   gridRef,
//   categories,
//   onEdit,
//   onDelete,
// }) {
//   //  Delete confirmation state 
//   const [deleteConfirm, setDeleteConfirm] = useState({ open: false, productId: null });

//   const getCategoryName = (row) =>
//     categories.find((c) => c.id === row.categoryId)?.name || "—";

//   const dataSource = useMemo(() => {
  
//     let debounceTimer   = null;
//     let currentPromise  = null;
//     let currentResolve  = null;
//     let currentReject   = null;

//     return new DataSource({
//       store: new CustomStore({
//         key: "id",

//         load: (latestOptions) => {
//           // Reset the timer — drop any pending stale call
//           if (debounceTimer) clearTimeout(debounceTimer);

//           // Reuse the existing promise so all callers within the debounce
//           // window share one promise and get the same final result.
//           if (!currentPromise) {
//             currentPromise = new Promise((resolve, reject) => {
//               currentResolve = resolve;
//               currentReject  = reject;
//             });
//           }

//           debounceTimer = setTimeout(async () => {
//             // Capture and clear shared state before the async call
//             // so a new page-change during the API call starts fresh.
//             const resolve = currentResolve;
//             const reject  = currentReject;
//             debounceTimer  = null;
//             currentPromise = null;
//             currentResolve = null;
//             currentReject  = null;

//             // latestOptions is captured from the LAST load() call before
//             // the timer fired — always the most up-to-date skip/take.
//             const pageSize   = latestOptions.take || 10;
//             const skip       = latestOptions.skip  || 0;
//             const pageNumber = Math.floor(skip / pageSize) + 1;

//             try {
//               const res  = await getProductsApi({
//                 pageNumber,
//                 pageSize,
//                 sortBy:    "name",
//                 sortOrder: "asc",
//               });
//               const data = res.data?.data;
//               resolve({
//                 data:       data?.items     ?? [],
//                 totalCount: data?.totalCount ?? 0,
//               });
//             } catch (err) {
//               reject(err);
//             }
//           }, 80); // 80 ms is enough to collapse DevExtreme's rapid double-fire

//           return currentPromise;
//         },
//       }),

//       paginate:       true,
//       reshapeOnPush:  true,
//     });
//   }, []); // created once — stable across renders

//   // ── Render ─────────────────────────────────────────────────────────────────
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
//         ref={gridRef}
//         dataSource={dataSource}
//         remoteOperations={true}
//         keyExpr="id"
//         showBorders={false}
//         rowAlternationEnabled
//         columnAutoWidth
//         allowColumnReordering
//         allowColumnResizing
//         wordWrapEnabled={false}
//         onExporting={handleGridExport}
//         style={{ fontSize: 13 }}
//       >
//         {/* ── Toolbar ──────────────────────────────────────────────── */}
//         <Toolbar>
//           <Item name="groupPanel" />
      
//           <Item name="searchPanel" />
//           <Item name="columnChooserButton" showText="inMenu" />
//           <Item name="exportButton" />
//         </Toolbar>

//         <SearchPanel visible width={220} placeholder="Search products…" />
       
//         <GroupPanel visible />
//         <Grouping autoExpandAll={false} />
//         <ColumnChooser enabled mode="select" />

//         {/* Pagination */}
//         <Paging defaultPageSize={10} />
//         <Pager
//           visible={true}
//           displayMode="full"
//           showPageSizeSelector={true}
//           allowedPageSizes={ALLOWED_PAGE_SIZES}
//           showInfo={true}
//           showNavigationButtons={true}
//         />

//         {/*  Export */}
//         <Export
//           enabled
//           formats={["xlsx", "pdf"]}
//           allowExportSelectedData
//           texts={{
//             exportAll:          "Export all",
//             exportSelectedRows: "Export selected",
//             exportTo:           "Export",
//           }}
//         />

//         {/*  Columns  */}
//         <Column dataField="name"  caption="Product Name" minWidth={180} />
//         <Column dataField="sku"   caption="SKU"          width={130} />

//         <Column
//           caption="Category"
//           width={150}
//           calculateCellValue={getCategoryName}
//           calculateFilterExpression={(value, operation) => [
//             getCategoryName,
//             operation || "contains",
//             value,
//           ]}
//         />

//         <Column
//           dataField="price"
//           caption="Price (Rs)"
//           dataType="number"
//           width={120}
//           cellRender={({ value }) => (
//             <span style={{ fontWeight: 600 }}>
//               Rs {Number(value).toLocaleString("en-IN")}
//             </span>
//           )}
//         />

//         <Column
//           dataField="discountPrice"
//           caption="Discount (Rs)"
//           dataType="number"
//           width={130}
//           cellRender={({ value }) =>
//             value ? (
//               <span style={{ color: "#16a34a", fontWeight: 600 }}>
//                 Rs {Number(value).toLocaleString("en-IN")}
//               </span>
//             ) : (
//               <span style={{ color: "#d1d5db" }}>—</span>
//             )
//           }
//         />

//         <Column
//           dataField="quantityInStock"
//           caption="Stock"
//           dataType="number"
//           width={90}
//           cellRender={({ value, data }) => {
//             const isLow = value <= (data.reorderLevel || 5);
//             return (
//               <span
//                 style={{
//                   background: isLow ? "#fee2e2" : "#dcfce7",
//                   color:      isLow ? "#dc2626" : "#16a34a",
//                   borderRadius: 6,
//                   padding: "2px 8px",
//                   fontWeight: 600,
//                   fontSize: 12,
//                 }}
//               >
//                 {value}
//               </span>
//             );
//           }}
//         />

//         <Column dataField="reorderLevel" caption="Reorder" dataType="number" width={100} />

//         <Column
//           dataField="isActive"
//           caption="Status"
//           dataType="boolean"
//           width={100}
//           cellRender={({ value }) => (
//             <span
//               style={{
//                 background: value ? "#dcfce7" : "#f3f4f6",
//                 color:      value ? "#16a34a" : "#6b7280",
//                 borderRadius: 6,
//                 padding: "2px 10px",
//                 fontSize: 12,
//                 fontWeight: 600,
//               }}
//             >
//               {value ? "Active" : "Inactive"}
//             </span>
//           )}
//         />
//         <Column
//   caption="Actions"
//   width={140}
//   allowFiltering={false}
//   allowSorting={false}
//   allowExporting={false}
//   cellRender={({ data }) => (
//     <div style={{ display: "flex", gap: 6 }}>
//       <button
//         onClick={() => onEdit(data)}
//         style={{
//           padding: "4px 10px",
//           borderRadius: 6,
//           border: "none",
//           background: "#f3f4f6",
//           color: "#374151",
//           fontSize: 12,
//           fontWeight: 600,
//           cursor: "pointer",
//         }}
//       >
//         Edit
//       </button>
//       <button
//         onClick={() => setDeleteConfirm({ open: true, productId: data.id })}
//         style={{
//           padding: "4px 10px",
//           borderRadius: 6,
//           border: "none",
//           background: "#fee2e2",
//           color: "#dc2626",
//           fontSize: 12,
//           fontWeight: 600,
//           cursor: "pointer",
//         }}
//       >
//         Delete
//       </button>
//     </div>
//   )}
// />

 


//         {/* ── Summary ──────────────────────────────────────────────── */}
//         <Summary>
//           <TotalItem column="name"            summaryType="count" displayFormat="{0} products" />
//           <TotalItem column="price"           summaryType="avg"   valueFormat={{ type: "fixedPoint", precision: 2 }} displayFormat="Avg: Rs {0}" />
//           <TotalItem column="quantityInStock" summaryType="sum"   displayFormat="Total: {0}" />
//         </Summary>
//       </DataGrid>

//       {/*  Delete Confirmation Modal  */}
//       {deleteConfirm.open && (
//         <div
//           style={{
//             position: "fixed",
//             top: 0,
//             left: 0,
//             right: 0,
//             bottom: 0,
//             background: "rgba(0, 0, 0, 0.5)",
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "center",
//             zIndex: 1000,
//           }}
//         >
//           <div
//             style={{
//               background: "#fff",
//               borderRadius: 12,
//               padding: 32,
//               maxWidth: 400,
//               boxShadow: "0 20px 25px rgba(0, 0, 0, 0.15)",
//             }}
//           >
//             <h3 style={{ margin: "0 0 12px 0", fontSize: 18, fontWeight: 700, color: "#1f2937" }}>
//               Delete Product?
//             </h3>
//             <p style={{ margin: "0 0 24px 0", fontSize: 14, color: "#6b7280", lineHeight: 1.5 }}>
//               Are you sure you want to delete this product? This action cannot be undone.
//             </p>
//             <div style={{ display: "flex", gap: 12, justifyContent: "flex-end" }}>
//               <button
//                 onClick={() => setDeleteConfirm({ open: false, productId: null })}
//                 style={{
//                   padding: "8px 16px",
//                   borderRadius: 6,
//                   border: "1px solid #e5e7eb",
//                   background: "#f3f4f6",
//                   color: "#374151",
//                   fontSize: 13,
//                   fontWeight: 600,
//                   cursor: "pointer",
//                   transition: "all 0.2s",
//                 }}
//               >
//                 No, Cancel
//               </button>
//               <button
//                 onClick={() => {
//                   onDelete(deleteConfirm.productId);
//                   setDeleteConfirm({ open: false, productId: null });
//                 }}
//                 style={{
//                   padding: "8px 16px",
//                   borderRadius: 6,
//                   border: "none",
//                   background: "#dc2626",
//                   color: "#fff",
//                   fontSize: 13,
//                   fontWeight: 600,
//                   cursor: "pointer",
//                   transition: "all 0.2s",
//                 }}
//               >
//                 Yes, Delete
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }



import { useState, useMemo, useCallback, useRef } from "react";
import CustomStore from "devextreme/data/custom_store";
import DataSource from "devextreme/data/data_source";
import DataGrid, {
  Column,
  Export,
  GroupPanel,
  Grouping,
  Item,
  Pager,
  Paging,
  SearchPanel,
  Toolbar,
} from "devextreme-react/data-grid";

import { getProductsApi } from "../../../../api/productApi";
import { ALLOWED_PAGE_SIZES } from "../constant";
import { exportAllToXlsx } from "../utils/exportHelper";
import ConfirmDialog from "./ConfirmDialog";

// ── Inline styles for action buttons ─────────────────────────────
// DevExtreme cell renderers run inside a shadow-like DOM context that
// frequently ignores external stylesheet classes. Inline styles are
// the only 100%-reliable approach for button styling inside DX cells.
const BTN_BASE = {
  padding: "4px 10px",
  borderRadius: 6,
  border: "none",
  fontSize: 12,
  fontWeight: 600,
  cursor: "pointer",
  lineHeight: 1.4,
};

const BTN_EDIT = {
  ...BTN_BASE,
  background: "#f3f4f6",
  color: "#374151",
};

const BTN_DELETE = {
  ...BTN_BASE,
  background: "#fee2e2",
  color: "#dc2626",
};

export default function ProductsGrid({
  gridRef,
  categories,
  onEdit,
  onDelete,
  onExportAll,
}) {
  const [deleteTarget, setDeleteTarget] = useState(null);

  // Holds the latest search term so the CustomStore load() can read it.
  // Using a ref avoids recreating the dataSource when search changes.
  const searchTermRef = useRef("");

  const getCategoryName = useCallback(
    (row) => categories.find((c) => c.id === row.categoryId)?.name ?? "—",
    [categories]
  );

  // ── Debounced remote data source ──────────────────────────────
  // The dataSource is created once. Search is forwarded to the API
  // via searchTermRef so the closure stays stable.
  const dataSource = useMemo(() => {
    let debounceTimer  = null;
    let currentPromise = null;
    let currentResolve = null;
    let currentReject  = null;

    return new DataSource({
      store: new CustomStore({
        key: "id",
        load: (latestOptions) => {
          if (debounceTimer) clearTimeout(debounceTimer);

          if (!currentPromise) {
            currentPromise = new Promise((resolve, reject) => {
              currentResolve = resolve;
              currentReject  = reject;
            });
          }

          debounceTimer = setTimeout(async () => {
            const resolve  = currentResolve;
            const reject   = currentReject;
            debounceTimer  = null;
            currentPromise = null;
            currentResolve = null;
            currentReject  = null;

            const pageSize   = latestOptions.take || 10;
            const skip       = latestOptions.skip  || 0;
            const pageNumber = Math.floor(skip / pageSize) + 1;

            // Read the latest search term from the ref
            const search = searchTermRef.current?.trim() || undefined;

            try {
              const res  = await getProductsApi({
                pageNumber,
                pageSize,
                sortBy:    "name",
                sortOrder: "asc",
                // Pass search to backend — your API must support a
                // `search` (or `keyword` / `q`) query param.
                ...(search ? { search } : {}),
              });
              const data = res.data?.data;
              resolve({
                data:       data?.items     ?? [],
                totalCount: data?.totalCount ?? 0,
              });
            } catch (err) {
              reject(err);
            }
          }, 300); // 300 ms debounce for search typing

          return currentPromise;
        },
      }),
      paginate:      true,
      reshapeOnPush: true,
    });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Handle search panel input ─────────────────────────────────
  // DevExtreme fires onOptionChanged when the search text changes.
  const handleOptionChanged = useCallback(
    (e) => {
      if (e.fullName === "searchPanel.text") {
        searchTermRef.current = e.value ?? "";
        // Reset to page 1 and reload
        dataSource.pageIndex(0);
        dataSource.reload();
      }
    },
    [dataSource]
  );

  // ── Export ────────────────────────────────────────────────────
  const handleExporting = useCallback(
    async (e) => {
      e.cancel = true; // always cancel DX built-in (only sees current page)

      const allProducts = await onExportAll();
      if (!allProducts?.length) return;

      if (e.format === "xlsx") {
        await exportAllToXlsx(allProducts, categories);
      }
    },
    [onExportAll, categories]
  );

  // ── Confirm delete ────────────────────────────────────────────
  const handleConfirmDelete = useCallback(() => {
    if (deleteTarget) onDelete(deleteTarget);
    setDeleteTarget(null);
  }, [deleteTarget, onDelete]);

  // ── Render ────────────────────────────────────────────────────
  return (
    <div className="grid-wrapper">
      <DataGrid
        ref={gridRef}
        dataSource={dataSource}
        remoteOperations={true}
        keyExpr="id"
        showBorders={false}
        rowAlternationEnabled
        columnAutoWidth
        allowColumnReordering
        allowColumnResizing
        wordWrapEnabled={false}
        onExporting={handleExporting}
        onOptionChanged={handleOptionChanged}
        style={{ fontSize: 13 }}
      >
        {/* Toolbar — column chooser removed */}
        <Toolbar>
          <Item name="groupPanel" />
          <Item name="searchPanel" />
          <Item name="exportButton" />
        </Toolbar>

        <SearchPanel visible width={220} placeholder="Search products…" />
        <GroupPanel visible />
        <Grouping autoExpandAll={false} />

        {/* Pagination */}
        <Paging defaultPageSize={10} />
        <Pager
          visible
          displayMode="full"
          showPageSizeSelector
          allowedPageSizes={ALLOWED_PAGE_SIZES}
          showInfo
          showNavigationButtons
        />

        {/* Export */}
        <Export
          enabled
          formats={["xlsx"]}
          texts={{
            exportAll: "Export all",
            exportTo:  "Export",
          }}
        />

        {/* Columns */}
        <Column dataField="name" caption="Product Name" minWidth={180} />
        <Column dataField="sku"  caption="SKU"          width={130} />

        <Column
          caption="Category"
          width={150}
          calculateCellValue={getCategoryName}
        />

        <Column
          dataField="price"
          caption="Price (Rs)"
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
          caption="Discount (Rs)"
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
                  background:   isLow ? "#fee2e2" : "#dcfce7",
                  color:        isLow ? "#dc2626" : "#16a34a",
                  borderRadius: 6,
                  padding:      "2px 8px",
                  fontWeight:   600,
                  fontSize:     12,
                  display:      "inline-block",
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

        {/* Actions — inline styles used intentionally (DX cell renderer) */}
        <Column
          caption="Actions"
          width={150}
          allowFiltering={false}
          allowSorting={false}
          allowExporting={false}
          cellRender={({ data }) => (
            <div style={{ display: "flex", gap: 6 }}>
              <button style={BTN_EDIT}   onClick={() => onEdit(data)}>
                Edit
              </button>
              <button style={BTN_DELETE} onClick={() => setDeleteTarget(data.id)}>
                Delete
              </button>
            </div>
          )}
        />
      </DataGrid>

      {deleteTarget && (
        <ConfirmDialog
          title="Delete Product?"
          message="Are you sure you want to delete this product? This action cannot be undone."
          confirmLabel="Yes, Delete"
          cancelLabel="No, Cancel"
          onConfirm={handleConfirmDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </div>
  );
}

// aaja ko working saturday 
// import { useState, useMemo, useCallback } from "react";
// import CustomStore from "devextreme/data/custom_store";
// import DataSource from "devextreme/data/data_source";
// import DataGrid, {
//   Column,
//   ColumnChooser,
//   Export,
//   GroupPanel,
//   Grouping,
//   Item,
//   Pager,
//   Paging,
//   SearchPanel,
//   Toolbar,
// } from "devextreme-react/data-grid";

// import { getProductsApi } from "../../../../api/productApi";
// import { ALLOWED_PAGE_SIZES } from "../constant";
// import { exportAllToXlsx, exportAllToPdf } from "../utils/exportHelper";
// import ConfirmDialog from "./ConfirmDialog";

// export default function ProductsGrid({
//   gridRef,
//   categories,
//   onEdit,
//   onDelete,
//   onExportAll,
// }) {
//   const [deleteTarget, setDeleteTarget] = useState(null); // productId | null

//   const getCategoryName = useCallback(
//     (row) => categories.find((c) => c.id === row.categoryId)?.name ?? "—",
//     [categories]
//   );

//   // ── Debounced remote data source ──────────────────────────────
//   const dataSource = useMemo(() => {
//     let debounceTimer   = null;
//     let currentPromise  = null;
//     let currentResolve  = null;
//     let currentReject   = null;

//     return new DataSource({
//       store: new CustomStore({
//         key: "id",
//         load: (latestOptions) => {
//           if (debounceTimer) clearTimeout(debounceTimer);

//           if (!currentPromise) {
//             currentPromise = new Promise((resolve, reject) => {
//               currentResolve = resolve;
//               currentReject  = reject;
//             });
//           }

//           debounceTimer = setTimeout(async () => {
//             const resolve = currentResolve;
//             const reject  = currentReject;
//             debounceTimer  = null;
//             currentPromise = null;
//             currentResolve = null;
//             currentReject  = null;

//             const pageSize   = latestOptions.take || 10;
//             const skip       = latestOptions.skip  || 0;
//             const pageNumber = Math.floor(skip / pageSize) + 1;

//             try {
//               const res  = await getProductsApi({
//                 pageNumber,
//                 pageSize,
//                 sortBy:    "name",
//                 sortOrder: "asc",
//               });
//               const data = res.data?.data;
//               resolve({
//                 data:       data?.items     ?? [],
//                 totalCount: data?.totalCount ?? 0,
//               });
//             } catch (err) {
//               reject(err);
//             }
//           }, 80);

//           return currentPromise;
//         },
//       }),
//       paginate:      true,
//       reshapeOnPush: true,
//     });
//   }, []);

//   // ── Export handler: fetches ALL records before exporting ──────
//   const handleExporting = useCallback(
//     async (e) => {
//       // Always cancel DevExtreme's built-in export — it only sees the
//       // current page because remoteOperations is enabled.
//       e.cancel = true;

//       const allProducts = await onExportAll();
//       if (!allProducts?.length) return;

//       if (e.format === "xlsx") {
//         await exportAllToXlsx(allProducts, categories);
//       } else if (e.format === "pdf") {
//         exportAllToPdf(allProducts, categories);
//       }
//     },
//     [onExportAll, categories]
//   );

//   // ── Confirm delete ────────────────────────────────────────────
//   const handleConfirmDelete = useCallback(() => {
//     if (deleteTarget) onDelete(deleteTarget);
//     setDeleteTarget(null);
//   }, [deleteTarget, onDelete]);

//   // ── Render ────────────────────────────────────────────────────
//   return (
//     <div className="grid-wrapper">
//       <DataGrid
//         ref={gridRef}
//         dataSource={dataSource}
//         remoteOperations={true}
//         keyExpr="id"
//         showBorders={false}
//         rowAlternationEnabled
//         columnAutoWidth
//         allowColumnReordering
//         allowColumnResizing
//         wordWrapEnabled={false}
//         onExporting={handleExporting}
//         style={{ fontSize: 13 }}
//       >
//         {/* Toolbar */}
//         <Toolbar>
//           <Item name="groupPanel" />
//           <Item name="searchPanel" />
//           <Item name="columnChooserButton" showText="inMenu" />
//           <Item name="exportButton" />
//         </Toolbar>

//         <SearchPanel visible width={220} placeholder="Search products…" />
//         <GroupPanel visible />
//         <Grouping autoExpandAll={false} />
//         <ColumnChooser enabled mode="select" />

//         {/* Pagination */}
//         <Paging defaultPageSize={10} />
//         <Pager
//           visible
//           displayMode="full"
//           showPageSizeSelector
//           allowedPageSizes={ALLOWED_PAGE_SIZES}
//           showInfo
//           showNavigationButtons
//         />

//         {/* Export */}
//         <Export
//           enabled
//           formats={["xlsx", "pdf"]}
//           allowExportSelectedData
//           texts={{
//             exportAll:          "Export all",
//             exportSelectedRows: "Export selected",
//             exportTo:           "Export",
//           }}
//         />

//         {/* Columns */}
//         <Column dataField="name"  caption="Product Name" minWidth={180} />
//         <Column dataField="sku"   caption="SKU"          width={130} />

//         <Column
//           caption="Category"
//           width={150}
//           calculateCellValue={getCategoryName}
//           calculateFilterExpression={(value, operation) => [
//             getCategoryName,
//             operation || "contains",
//             value,
//           ]}
//         />

//         <Column
//           dataField="price"
//           caption="Price (Rs)"
//           dataType="number"
//           width={120}
//           cellRender={({ value }) => (
//             <span className="grid-price">
//               Rs {Number(value).toLocaleString("en-IN")}
//             </span>
//           )}
//         />

//         <Column
//           dataField="discountPrice"
//           caption="Discount (Rs)"
//           dataType="number"
//           width={130}
//           cellRender={({ value }) =>
//             value ? (
//               <span className="grid-discount">
//                 Rs {Number(value).toLocaleString("en-IN")}
//               </span>
//             ) : (
//               <span className="grid-empty">—</span>
//             )
//           }
//         />

//         <Column
//           dataField="quantityInStock"
//           caption="Stock"
//           dataType="number"
//           width={90}
//           cellRender={({ value, data }) => {
//             const isLow = value <= (data.reorderLevel || 5);
//             return (
//               <span className={`grid-stock-badge ${isLow ? "grid-stock-badge--low" : "grid-stock-badge--ok"}`}>
//                 {value}
//               </span>
//             );
//           }}
//         />

//         <Column
//           dataField="reorderLevel"
//           caption="Reorder"
//           dataType="number"
//           width={100}
//         />

//         <Column
//           caption="Actions"
//           width={140}
//           allowFiltering={false}
//           allowSorting={false}
//           allowExporting={false}
//           cellRender={({ data }) => (
//             <div className="grid-actions">
//               <button
//                 className="grid-action-btn grid-action-btn--edit"
//                 onClick={() => onEdit(data)}
//               >
//                 Edit
//               </button>
//               <button
//                 className="grid-action-btn grid-action-btn--delete"
//                 onClick={() => setDeleteTarget(data.id)}
//               >
//                 Delete
//               </button>
//             </div>
//           )}
//         />
//       </DataGrid>

//       {/* Delete confirmation */}
//       {deleteTarget && (
//         <ConfirmDialog
//           title="Delete Product?"
//           message="Are you sure you want to delete this product? This action cannot be undone."
//           confirmLabel="Yes, Delete"
//           cancelLabel="No, Cancel"
//           onConfirm={handleConfirmDelete}
//           onCancel={() => setDeleteTarget(null)}
//         />
//       )}
//     </div>
//   );
// }