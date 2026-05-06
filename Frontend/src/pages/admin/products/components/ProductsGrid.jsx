/* eslint-disable react-hooks/immutability */
// v2

// import { useMemo } from "react";
// import CustomStore from "devextreme/data/custom_store";
// import DataGrid, {
//   Column,
//   ColumnChooser,
//   Export,
//   FilterRow,
//   GroupPanel,
//   Grouping,
//   HeaderFilter,
//   Item,
//   Pager,
//   Paging,
//   SearchPanel,
//   Selection,
//   Summary,
//   Toolbar,
//   TotalItem,
// } from "devextreme-react/data-grid";

// import { getProductsApi } from "../../../../api/productApi";
// import { ALLOWED_PAGE_SIZES } from "../constant";
// import { handleGridExport } from "../utils/exportHelper";

// // ─────────────────────────────────────────────────────────────────────────────
// // ProductsGrid
// //
// // Key changes vs the old version:
// //   1. `dataSource` is now a CustomStore, not a plain `products` array.
// //      DevExtreme calls store.load({ skip, take }) on every page turn,
// //      which maps to your backend's pageNumber / pageSize.
// //   2. `remoteOperations={{ paging: true }}` tells DevExtreme that the
// //      server controls paging — it will NOT slice the data client-side.
// //   3. `gridRef` is forwarded from the parent so that after a create /
// //      update / delete the hook can call gridRef.current.instance.refresh()
// //      and DevExtreme will re-fetch the current page automatically.
// // ─────────────────────────────────────────────────────────────────────────────

// export default function ProductsGrid({
//   gridRef, // from useProducts — lets the hook call .refresh()
//   categories,
//   onEdit,
//   onDelete,
//   onAddNew,
// }) {
//   const getCategoryName = (row) =>
//     categories.find((c) => c.id === row.categoryId)?.name || "—";

//   // ── CustomStore ────────────────────────────────────────────────────────────
//   // Created once (empty dep-array). DevExtreme passes { skip, take } to load()
//   // whenever the user changes page or page-size. We convert those to the
//   // pageNumber / pageSize your backend expects, call getProductsApi, and return
//   // { data, totalCount } so DevExtreme knows the full record count and can
//   // render the correct number of pages in the pager.
//   const dataSource = useMemo(
//     () =>
//       new CustomStore({
//         key: "id",
//         load: async (loadOptions) => {
//           const pageSize = loadOptions.take || 10;
//           const pageNumber =
//             loadOptions.skip != null
//               ? Math.floor(loadOptions.skip / pageSize) + 1
//               : 1;

//           const res = await getProductsApi({
//             pageNumber,
//             pageSize,
//             sortBy: "name",
//             sortOrder: "asc",
//           });

//           const data = res.data?.data;

//           // DevExtreme requires { data: [...], totalCount: N }
//           return {
//             data: data?.items || [],
//             totalCount: data?.totalCount || 0,
//           };
//         },
//       }),
//     [], // stable — never recreated across renders
//   );

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
//         ref={gridRef} // forwarded ref
//         dataSource={dataSource} // CustomStore, NOT a plain array
//         remoteOperations={{ paging: true }} // backend owns pagination
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
//         {/* ── Toolbar ──────────────────────────────────────────────────── */}
//         <Toolbar>
//           <Item name="groupPanel" />
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
//               + Add Product
//             </button>
//           </Item>
//           <Item name="searchPanel" />
//           <Item name="columnChooserButton" showText="inMenu" />
//           <Item name="exportButton" />
//         </Toolbar>

//         {/* ── Search ───────────────────────────────────────────────────── */}
//         <SearchPanel visible width={220} placeholder="Search products…" />

//         {/* ── Filters ──────────────────────────────────────────────────── */}
//         <FilterRow visible />
//         <HeaderFilter visible />

//         {/* ── Grouping ─────────────────────────────────────────────────── */}
//         <GroupPanel visible />
//         <Grouping autoExpandAll={false} />

//         {/* ── Column Chooser ───────────────────────────────────────────── */}
//         <ColumnChooser enabled mode="select" />

//         {/* ── Selection ────────────────────────────────────────────────── */}
//         <Selection mode="multiple" showCheckBoxesMode="always" />

//         {/* ── Pagination ───────────────────────────────────────────────── */}
//         {/* DevExtreme translates these page numbers into skip/take and
//             passes them into CustomStore.load() — your backend gets called
//             with the correct pageNumber every time the user turns a page. */}
//         <Paging defaultPageSize={10} />
//         <Pager
//           visible={true} 
//           displayMode="full" 
//           showPageSizeSelector={true}
//           allowedPageSizes={ALLOWED_PAGE_SIZES}
//           showInfo={true}
//           showNavigationButtons={true}
//           infoText="Page {0} of {1} ({2} products)"
//         />

//         {/* ── Export ───────────────────────────────────────────────────── */}
//         <Export
//           enabled
//           formats={["xlsx", "pdf"]}
//           allowExportSelectedData
//           texts={{
//             exportAll: "Export all",
//             exportSelectedRows: "Export selected",
//             exportTo: "Export",
//           }}
//         />

//         {/* ── Columns ──────────────────────────────────────────────────── */}
//         <Column dataField="name" caption="Product Name" minWidth={180} />

//         <Column dataField="sku" caption="SKU" width={130} />

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
//                   color: isLow ? "#dc2626" : "#16a34a",
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

//         <Column
//           dataField="reorderLevel"
//           caption="Reorder"
//           dataType="number"
//           width={100}
//         />

//         <Column
//           dataField="isActive"
//           caption="Status"
//           dataType="boolean"
//           width={100}
//           cellRender={({ value }) => (
//             <span
//               style={{
//                 background: value ? "#dcfce7" : "#f3f4f6",
//                 color: value ? "#16a34a" : "#6b7280",
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
//           caption="Actions"
//           width={140}
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
//                 ✏️ Edit
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
//                 🗑️
//               </button>
//             </div>
//           )}
//         />

//         {/* ── Summary Row ──────────────────────────────────────────────── */}
//         <Summary>
//           <TotalItem
//             column="name"
//             summaryType="count"
//             displayFormat="{0} products"
//           />
//           <TotalItem
//             column="price"
//             summaryType="avg"
//             valueFormat={{ type: "fixedPoint", precision: 2 }}
//             displayFormat="Avg: Rs {0}"
//           />
//           <TotalItem
//             column="quantityInStock"
//             summaryType="sum"
//             displayFormat="Total: {0}"
//           />
//         </Summary>
//       </DataGrid>
//     </div>
//   );
// }


// v1

// import { useRef } from "react";
// import DataGrid, {
//   Column,
//   ColumnChooser,
//   Export,
//   FilterRow,
//   GroupPanel,
//   Grouping,
//   HeaderFilter,
//   Item,
//   Pager,
//   Paging,
//   SearchPanel,
//   Selection,
//   Summary,
//   Toolbar,
//   TotalItem,
// } from "devextreme-react/data-grid";

// import { ALLOWED_PAGE_SIZES } from "../constant";
// import { handleGridExport } from "../utils/exportHelper";

// export default function ProductsGrid({ products, categories, onEdit, onDelete, onAddNew }) {
//   const gridRef = useRef(null);

//   const getCategoryName = (row) =>
//     categories.find((c) => c.id === row.categoryId)?.name || "—";

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
//         dataSource={products}
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
//         {/* ── Toolbar ──────────────────────────────────────────────────────── */}
//         <Toolbar>
//           <Item name="groupPanel" />
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
//               + Add Product
//             </button>
//           </Item>
//           <Item name="searchPanel" />
//           <Item name="columnChooserButton" showText="inMenu" />
//           <Item name="exportButton" />
//         </Toolbar>

//         {/* ── Search ───────────────────────────────────────────────────────── */}
//         <SearchPanel visible width={220} placeholder="Search products…" />

//         {/* ── Filters ──────────────────────────────────────────────────────── */}
//         <FilterRow visible />
//         <HeaderFilter visible />

//         {/* ── Grouping ─────────────────────────────────────────────────────── */}
//         <GroupPanel visible />
//         <Grouping autoExpandAll={false} />

//         {/* ── Column Chooser ───────────────────────────────────────────────── */}
//         <ColumnChooser enabled mode="select" />

//         {/* ── Selection ────────────────────────────────────────────────────── */}
//         <Selection mode="multiple" showCheckBoxesMode="always" />

//         {/* ── Pagination ───────────────────────────────────────────────────── */}
//         <Paging defaultPageSize={10} />
//         <Pager
//           showPageSizeSelector
//           allowedPageSizes={ALLOWED_PAGE_SIZES}
//           showInfo
//           showNavigationButtons
//           infoText="Page {0} of {1} ({2} products)"
//         />

//         {/* ── Export ───────────────────────────────────────────────────────── */}
//         <Export
//           enabled
//           formats={["xlsx", "pdf"]}
//           allowExportSelectedData
//           texts={{
//             exportAll: "Export all",
//             exportSelectedRows: "Export selected",
//             exportTo: "Export",
//           }}
//         />

//         {/* ── Columns ──────────────────────────────────────────────────────── */}
//         <Column dataField="name" caption="Product Name" minWidth={180} />

//         <Column dataField="sku" caption="SKU" width={130} />

//         <Column
//           caption="Category"
//           width={150}
//           calculateCellValue={getCategoryName}
//           calculateFilterExpression={(value, operation) => [getCategoryName, operation || "contains", value]}
//         />

//         <Column
//           dataField="price"
//           caption="Price (Rs )"
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
//           caption="Discount (Rs )"
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
//                   color: isLow ? "#dc2626" : "#16a34a",
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

//         <Column
//           dataField="reorderLevel"
//           caption="Reorder"
//           dataType="number"
//           width={100}
//         />

//         <Column
//           dataField="isActive"
//           caption="Status"
//           dataType="boolean"
//           width={100}
//           cellRender={({ value }) => (
//             <span
//               style={{
//                 background: value ? "#dcfce7" : "#f3f4f6",
//                 color: value ? "#16a34a" : "#6b7280",
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
//           caption="Actions"
//           width={140}
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
//                 ✏️ Edit
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
//                 🗑️
//               </button>
//             </div>
//           )}
//         />

//         {/* ── Summary Row ──────────────────────────────────────────────────── */}
//         <Summary>
//           <TotalItem
//             column="name"
//             summaryType="count"
//             displayFormat="{0} products"
//           />
//           <TotalItem
//             column="price"
//             summaryType="avg"
//             valueFormat={{ type: "fixedPoint", precision: 2 }}
//             displayFormat="Avg: Rs {0}"
//           />
//           <TotalItem
//             column="quantityInStock"
//             summaryType="sum"
//             displayFormat="Total: {0}"
//           />
//         </Summary>
//       </DataGrid>
//     </div>
//   );
// }


// v3
// import { useMemo } from "react";
// import CustomStore from "devextreme/data/custom_store";
// import DataSource from "devextreme/data/data_source";
// import DataGrid, {
//   Column,
//   ColumnChooser,
//   Export,
//   FilterRow,
//   GroupPanel,
//   Grouping,
//   HeaderFilter,
//   Item,
//   Pager,
//   Paging,
//   SearchPanel,
//   Selection,
//   Summary,
//   Toolbar,
//   TotalItem,
// } from "devextreme-react/data-grid";

// import { getProductsApi } from "../../../../api/productApi";
// import { ALLOWED_PAGE_SIZES } from "../constant";
// import { handleGridExport } from "../utils/exportHelper";

// // ─────────────────────────────────────────────────────────────────────────────
// // Root cause of page-click not calling API:
// //
// //   remoteOperations={{ paging: true }}  ← DevExtreme caches the first batch
// //                                          and re-slices it client-side.
// //
// //   remoteOperations={true}             ← DevExtreme calls load() fresh on
// //                                          EVERY page / sort / filter change.
// //
// // Also: wrapping CustomStore in DataSource gives DevExtreme the full contract
// // it needs to manage skip/take correctly.
// // ─────────────────────────────────────────────────────────────────────────────

// export default function ProductsGrid({
//   gridRef,
//   categories,
//   onEdit,
//   onDelete,
//   onAddNew,
// }) {
//   const getCategoryName = (row) =>
//     categories.find((c) => c.id === row.categoryId)?.name || "—";

//   // ── DataSource (CustomStore wrapped) ──────────────────────────────────────
//   const dataSource = useMemo(
//     () =>
//       new DataSource({
//         store: new CustomStore({
//           key: "id",

//           // DevExtreme calls load() with { skip, take } on every page change.
//           // We convert those to pageNumber / pageSize for your backend.
//           load: async (loadOptions) => {
//             const pageSize = loadOptions.take || 10;
//             const skip = loadOptions.skip || 0;
//             const pageNumber = Math.floor(skip / pageSize) + 1;

//             console.log("→ API call | page:", pageNumber, "| size:", pageSize); // confirm it fires

//             const res = await getProductsApi({
//               pageNumber,
//               pageSize,
//               sortBy: "name",
//               sortOrder: "asc",
//             });

//             const data = res.data?.data;

//             // Must return { data, totalCount } so DevExtreme knows the full
//             // record count and renders the correct number of page buttons.
//             return {
//               data: data?.items ?? [],
//               totalCount: data?.totalCount ?? 0,
//             };
//           },
//         }),

//         // Disable any client-side post-processing so DevExtreme never
//         // re-slices or re-sorts the data it receives from load().
//         paginate: true,
//         reshapeOnPush: true,
//       }),
//     [] // created once — stable reference across renders
//   );

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
//         remoteOperations={true}   // ← KEY FIX: fires load() on every page change
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
//               + Add Product
//             </button>
//           </Item>
//           <Item name="searchPanel" />
//           <Item name="columnChooserButton" showText="inMenu" />
//           <Item name="exportButton" />
//         </Toolbar>

//         <SearchPanel visible width={220} placeholder="Search products…" />
//         <FilterRow visible />
//         <HeaderFilter visible />
//         <GroupPanel visible />
//         <Grouping autoExpandAll={false} />
//         <ColumnChooser enabled mode="select" />
//         <Selection mode="multiple" showCheckBoxesMode="always" />

//         {/* ── Pagination ───────────────────────────────────────────── */}
//         <Paging defaultPageSize={10} />
//         <Pager
//           visible={true}
//           displayMode="full"
//           showPageSizeSelector={true}
//           allowedPageSizes={ALLOWED_PAGE_SIZES}
//           showInfo={true}
//           showNavigationButtons={true}
//           infoText="Page {0} of {1} ({2} products)"
//         />

//         {/* ── Export ───────────────────────────────────────────────── */}
//         <Export
//           enabled
//           formats={["xlsx", "pdf"]}
//           allowExportSelectedData
//           texts={{
//             exportAll: "Export all",
//             exportSelectedRows: "Export selected",
//             exportTo: "Export",
//           }}
//         />

//         {/* ── Columns ──────────────────────────────────────────────── */}
//         <Column dataField="name" caption="Product Name" minWidth={180} />

//         <Column dataField="sku" caption="SKU" width={130} />

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
//                   color: isLow ? "#dc2626" : "#16a34a",
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

//         <Column
//           dataField="reorderLevel"
//           caption="Reorder"
//           dataType="number"
//           width={100}
//         />

//         <Column
//           dataField="isActive"
//           caption="Status"
//           dataType="boolean"
//           width={100}
//           cellRender={({ value }) => (
//             <span
//               style={{
//                 background: value ? "#dcfce7" : "#f3f4f6",
//                 color: value ? "#16a34a" : "#6b7280",
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
//           caption="Actions"
//           width={140}
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
//                 ✏️ Edit
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
//                 🗑️
//               </button>
//             </div>
//           )}
//         />

//         {/* ── Summary ──────────────────────────────────────────────── */}
//         <Summary>
//           <TotalItem
//             column="name"
//             summaryType="count"
//             displayFormat="{0} products"
//           />
//           <TotalItem
//             column="price"
//             summaryType="avg"
//             valueFormat={{ type: "fixedPoint", precision: 2 }}
//             displayFormat="Avg: Rs {0}"
//           />
//           <TotalItem
//             column="quantityInStock"
//             summaryType="sum"
//             displayFormat="Total: {0}"
//           />
//         </Summary>
//       </DataGrid>
//     </div>
//   );
// }



// v4

import { useMemo } from "react";
import CustomStore from "devextreme/data/custom_store";
import DataSource from "devextreme/data/data_source";
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

import { getProductsApi } from "../../../../api/productApi";
import { ALLOWED_PAGE_SIZES } from "../constant";
import { handleGridExport } from "../utils/exportHelper";

// ─────────────────────────────────────────────────────────────────────────────
// WHY THE DEBOUNCE IS NEEDED
//
// When the user changes the page-size dropdown (e.g. 10 → 20), DevExtreme
// fires load() TWICE in quick succession:
//
//   Call 1 (stale):   { skip: 10, take: 10 }  → pageNumber 2, pageSize 10  ← wrong
//   Call 2 (correct): { skip:  0, take: 20 }  → pageNumber 1, pageSize 20  ← right
//
// Without debouncing both calls hit your backend. The UI ends up correct
// because call 2 wins, but call 1 is a wasted / misleading backend hit.
//
// The debounce (80 ms) collapses the two calls into one: the timer resets on
// every call, so only the last set of loadOptions reaches getProductsApi.
//
// HOW THE PROMISE REUSE WORKS
//
// DevExtreme expects load() to return a Promise. Both call 1 and call 2
// receive the SAME promise object. When the debounce timer fires it resolves
// that shared promise with the data from call 2's (correct) loadOptions.
// DevExtreme sees one resolved promise → one clean render.
// ─────────────────────────────────────────────────────────────────────────────

export default function ProductsGrid({
  gridRef,
  categories,
  onEdit,
  onDelete,
  onAddNew,
}) {
  const getCategoryName = (row) =>
    categories.find((c) => c.id === row.categoryId)?.name || "—";

  const dataSource = useMemo(() => {
    // ── Debounce state (closure variables, live inside useMemo) ────────────
    let debounceTimer   = null;
    let currentPromise  = null;
    let currentResolve  = null;
    let currentReject   = null;

    return new DataSource({
      store: new CustomStore({
        key: "id",

        load: (latestOptions) => {
          // Reset the timer — drop any pending stale call
          if (debounceTimer) clearTimeout(debounceTimer);

          // Reuse the existing promise so all callers within the debounce
          // window share one promise and get the same final result.
          if (!currentPromise) {
            currentPromise = new Promise((resolve, reject) => {
              currentResolve = resolve;
              currentReject  = reject;
            });
          }

          debounceTimer = setTimeout(async () => {
            // Capture and clear shared state before the async call
            // so a new page-change during the API call starts fresh.
            const resolve = currentResolve;
            const reject  = currentReject;
            debounceTimer  = null;
            currentPromise = null;
            currentResolve = null;
            currentReject  = null;

            // latestOptions is captured from the LAST load() call before
            // the timer fired — always the most up-to-date skip/take.
            const pageSize   = latestOptions.take || 10;
            const skip       = latestOptions.skip  || 0;
            const pageNumber = Math.floor(skip / pageSize) + 1;

            try {
              const res  = await getProductsApi({
                pageNumber,
                pageSize,
                sortBy:    "name",
                sortOrder: "asc",
              });
              const data = res.data?.data;
              resolve({
                data:       data?.items     ?? [],
                totalCount: data?.totalCount ?? 0,
              });
            } catch (err) {
              reject(err);
            }
          }, 80); // 80 ms is enough to collapse DevExtreme's rapid double-fire

          return currentPromise;
        },
      }),

      paginate:       true,
      reshapeOnPush:  true,
    });
  }, []); // created once — stable across renders

  // ── Render ─────────────────────────────────────────────────────────────────
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
        dataSource={dataSource}
        remoteOperations={true}
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
        {/* ── Toolbar ──────────────────────────────────────────────── */}
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

        <SearchPanel visible width={220} placeholder="Search products…" />
        <FilterRow visible />
        <HeaderFilter visible />
        <GroupPanel visible />
        <Grouping autoExpandAll={false} />
        <ColumnChooser enabled mode="select" />
        <Selection mode="multiple" showCheckBoxesMode="always" />

        {/* ── Pagination ───────────────────────────────────────────── */}
        <Paging defaultPageSize={10} />
        <Pager
          visible={true}
          displayMode="full"
          showPageSizeSelector={true}
          allowedPageSizes={ALLOWED_PAGE_SIZES}
          showInfo={true}
          showNavigationButtons={true}
          // infoText="Page {0} of {1} ({2} products)"
        />

        {/* ── Export ───────────────────────────────────────────────── */}
        <Export
          enabled
          formats={["xlsx", "pdf"]}
          allowExportSelectedData
          texts={{
            exportAll:          "Export all",
            exportSelectedRows: "Export selected",
            exportTo:           "Export",
          }}
        />

        {/* ── Columns ──────────────────────────────────────────────── */}
        <Column dataField="name"  caption="Product Name" minWidth={180} />
        <Column dataField="sku"   caption="SKU"          width={130} />

        <Column
          caption="Category"
          width={150}
          calculateCellValue={getCategoryName}
          calculateFilterExpression={(value, operation) => [
            getCategoryName,
            operation || "contains",
            value,
          ]}
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
                  background: isLow ? "#fee2e2" : "#dcfce7",
                  color:      isLow ? "#dc2626" : "#16a34a",
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

        <Column dataField="reorderLevel" caption="Reorder" dataType="number" width={100} />

        <Column
          dataField="isActive"
          caption="Status"
          dataType="boolean"
          width={100}
          cellRender={({ value }) => (
            <span
              style={{
                background: value ? "#dcfce7" : "#f3f4f6",
                color:      value ? "#16a34a" : "#6b7280",
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

        {/* ── Summary ──────────────────────────────────────────────── */}
        <Summary>
          <TotalItem column="name"            summaryType="count" displayFormat="{0} products" />
          <TotalItem column="price"           summaryType="avg"   valueFormat={{ type: "fixedPoint", precision: 2 }} displayFormat="Avg: Rs {0}" />
          <TotalItem column="quantityInStock" summaryType="sum"   displayFormat="Total: {0}" />
        </Summary>
      </DataGrid>
    </div>
  );
}