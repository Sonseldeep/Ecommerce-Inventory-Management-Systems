/* eslint-disable no-unused-vars */
// import DataGrid, {
//   Column,
//   ColumnChooser,
//   Export,
//   Pager,
//   Paging,
//   SearchPanel,
//   Summary,
//   Toolbar,
//   TotalItem,
//   Item,
// } from "devextreme-react/data-grid";

// import { useState } from "react";
// import CustomStore from "devextreme/data/custom_store";
// import DataSource from "devextreme/data/data_source";
// import { getCategoriesApi } from "../../../../api/categoryApi";
// // eslint-disable-next-line no-unused-vars
// import { handleGridExport } from "../utils/exportHelper";
// import { ALLOWED_PAGE_SIZES } from "../constant";

// export default function CategoriesGrid({ gridRef, onEdit, onDelete, onAddNew }) {
//   // ── Delete confirmation state ─────────────────────────────────
//   const [deleteConfirm, setDeleteConfirm] = useState({ open: false, categoryId: null });

//   // ✅ SERVER-SIDE DATA SOURCE
//   const dataSource = new DataSource({
//     store: new CustomStore({
//       key: "id",

//       load: async (loadOptions) => {
//         const pageSize = loadOptions.take || 10;
//         const skip = loadOptions.skip || 0;
//         const pageNumber = skip / pageSize + 1;

//         const sort = loadOptions.sort?.[0];
//         const sortBy = sort?.selector || "name";
//         const sortOrder = sort?.desc ? "desc" : "asc";

//         const searchValue = loadOptions.searchValue || "";

//         const res = await getCategoriesApi({
//           pageNumber,
//           pageSize,
//           sortBy,
//           sortOrder,
//           search: searchValue,
//         });

//         const data = res.data?.data;

//         return {
//           data: data.items,
//           totalCount: data.totalCount,
//         };
//       },
//     }),

//     paginate: true,
//     remoteOperations: true,
//   });

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
//         ref={gridRef} // Attach the ref here
//         dataSource={dataSource}
//         keyExpr="id"
//         showBorders={false}
//         rowAlternationEnabled
//         columnAutoWidth
//         allowColumnReordering
//         allowColumnResizing
//         remoteOperations={true} // ✅ REQUIRED
//       >
//         {/* Toolbar */}
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
//               }}
//             >
//               + Add Category
//             </button>
//           </Item>

//           <Item name="searchPanel" />
//           <Item name="columnChooserButton" showText="inMenu" />
//           <Item name="exportButton" />
//         </Toolbar>

//         {/* Search */}
//         <SearchPanel visible width={220} placeholder="Search categories…" />

//         {/* Column chooser */}
//         <ColumnChooser enabled mode="select" />

//         {/* Pagination (IMPORTANT) */}
//         <Paging defaultPageSize={10} />
//         <Pager
//           visible={true}
//           showPageSizeSelector={true}
//           allowedPageSizes={ALLOWED_PAGE_SIZES}
//           showInfo={true}
//           showNavigationButtons={true}
//           displayMode="full"
//         />

//         {/* Export */}
//         <Export enabled formats={["xlsx", "pdf"]} />

//         {/* Columns */}
//         <Column dataField="name" caption="Category Name" />
//         <Column
//           dataField="productCount"
//           caption="Product Items"
//           width={120}
//           dataType="number"
//           cellRender={({ value }) => (
//             <span style={{ fontWeight: 600, color: "#374151" }}>
//               {value || 0}
//             </span>
//           )}
//         />

//         <Column dataField="description" caption="Description" />

//         {/* Actions */}
//         <Column
//           caption="Actions"
//           width={130}
//           allowFiltering={false}
//           allowSorting={false}
//           cellRender={({ data }) => (
//             <div style={{ display: "flex", gap: 6 }}>
//               <button
//                 onClick={() => onEdit(data)}
//                 style={{
//                   padding: "4px 10px",
//                   borderRadius: 6,
//                   border: "1px solid #d1d5db",
//                   background: "#f9fafb",
//                   color: "#374151",
//                   fontSize: 12,
//                   fontWeight: 600,
//                   cursor: "pointer",
//                 }}
//               >
//                 Edit
//               </button>

//               <button
//                 onClick={() => setDeleteConfirm({ open: true, categoryId: data.id })}
//                 style={{
//                   padding: "4px 10px",
//                   borderRadius: 6,
//                   border: "1px solid #fecaca",
//                   background: "#fee2e2",
//                   color: "#b91c1c",
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

//         {/* Summary */}
//         <Summary>
//           <TotalItem
//             column="name"
//             summaryType="count"
//             displayFormat="{0} categories"
//           />
//         </Summary>
//       </DataGrid>

//       {/* ── Delete Confirmation Modal ────────────────────────────── */}
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
//               Delete Category?
//             </h3>
//             <p style={{ margin: "0 0 24px 0", fontSize: 14, color: "#6b7280", lineHeight: 1.5 }}>
//               Are you sure you want to delete this category? This action cannot be undone.
//             </p>
//             <div style={{ display: "flex", gap: 12, justifyContent: "flex-end" }}>
//               <button
//                 onClick={() => setDeleteConfirm({ open: false, categoryId: null })}
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
//                   onDelete(deleteConfirm.categoryId);
//                   setDeleteConfirm({ open: false, categoryId: null });
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

// import DataGrid, {
//   Column,
//   ColumnChooser,
//   Export,
//   Pager,
//   Paging,
//   SearchPanel,
//   Summary,
//   Toolbar,
//   TotalItem,
//   Item,
// } from "devextreme-react/data-grid";

// import { useState } from "react";
// import CustomStore from "devextreme/data/custom_store";
// import DataSource from "devextreme/data/data_source";
// import { getCategoriesApi } from "../../../../api/categoryApi";
// import StatusToggle from "../../../../components/StatusToggle";
// import { ALLOWED_PAGE_SIZES } from "../constant";

// export default function CategoriesGrid({ gridRef, onEdit, onDelete, onAddNew, onToggleStatus }) {
//   const [deleteConfirm, setDeleteConfirm] = useState({ open: false, categoryId: null });

//   const dataSource = new DataSource({
//     store: new CustomStore({
//       key: "id",
//       load: async (loadOptions) => {
//         const pageSize = loadOptions.take || 10;
//         const skip = loadOptions.skip || 0;
//         const pageNumber = skip / pageSize + 1;
//         const sort = loadOptions.sort?.[0];
//         const sortBy = sort?.selector || "name";
//         const sortOrder = sort?.desc ? "desc" : "asc";
//         const searchValue = loadOptions.searchValue || "";
//         const res = await getCategoriesApi({ pageNumber, pageSize, sortBy, sortOrder, search: searchValue });
//         const data = res.data?.data;
//         return { data: data.items, totalCount: data.totalCount };
//       },
//     }),
//     paginate: true,
//     remoteOperations: true,
//   });

//   return (
//     <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #e5e7eb", padding: 20 }}>
//       <DataGrid
//         ref={gridRef}
//         dataSource={dataSource}
//         keyExpr="id"
//         showBorders={false}
//         rowAlternationEnabled
//         columnAutoWidth
//         allowColumnReordering
//         allowColumnResizing
//         remoteOperations={true}
//       >
//         <Toolbar>
//           <Item location="before">
//             <button onClick={onAddNew} style={{ padding: "8px 16px", borderRadius: 8, border: "none", background: "#111", color: "#fff", fontSize: 12, fontWeight: 600 }}>
//               + Add Category
//             </button>
//           </Item>
//           <Item name="searchPanel" />
//           <Item name="columnChooserButton" showText="inMenu" />
//           <Item name="exportButton" />
//         </Toolbar>

//         <SearchPanel visible width={220} placeholder="Search categories…" />
//         <ColumnChooser enabled mode="select" />
//         <Paging defaultPageSize={10} />
//         <Pager visible={true} showPageSizeSelector={true} allowedPageSizes={ALLOWED_PAGE_SIZES} showInfo={true} showNavigationButtons={true} displayMode="full" />
//         <Export enabled formats={["xlsx", "pdf"]} />

//         {/* Columns */}
//         <Column dataField="name" caption="Category Name" minWidth={150} />
//         <Column dataField="productCount" caption="Products" width={100} dataType="number" cellRender={({ value }) => (<span style={{ fontWeight: 600, color: "#374151" }}>{value || 0}</span>)} />
//         <Column dataField="description" caption="Description" />

//         <Column
//           dataField="isActive"
//           caption="Status"
//           width={130}
//           allowSorting={false}
//           cellRender={({ data }) => (
//             <StatusToggle
//               isActive={data.isActive}
//               onClick={() => onToggleStatus(data)}
//             />
//           )}
//         />

//         <Column
//           caption="Actions"
//           width={130}
//           allowFiltering={false}
//           allowSorting={false}
//           cellRender={({ data }) => (
//             <div style={{ display: "flex", gap: 6 }}>
//               <button onClick={() => onEdit(data)} style={{ padding: "4px 10px", borderRadius: 6, border: "1px solid #d1d5db", background: "#f9fafb", color: "#374151", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>
//                 Edit
//               </button>
//               <button onClick={() => setDeleteConfirm({ open: true, categoryId: data.id })} style={{ padding: "4px 10px", borderRadius: 6, border: "1px solid #fecaca", background: "#fee2e2", color: "#b91c1c", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>
//                 Delete
//               </button>
//             </div>
//           )}
//         />

//         <Summary>
//           <TotalItem column="name" summaryType="count" displayFormat="{0} categories" />
//         </Summary>
//       </DataGrid>

//       {/* Delete Confirmation Modal */}
//       {deleteConfirm.open && (
//         <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0, 0, 0, 0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }}>
//           <div style={{ background: "#fff", borderRadius: 12, padding: 32, maxWidth: 400, boxShadow: "0 20px 25px rgba(0, 0, 0, 0.15)" }}>
//             <h3 style={{ margin: "0 0 12px 0", fontSize: 18, fontWeight: 700, color: "#1f2937" }}>Delete Category?</h3>
//             <p style={{ margin: "0 0 24px 0", fontSize: 14, color: "#6b7280", lineHeight: 1.5 }}>Are you sure you want to delete this category? This action cannot be undone.</p>
//             <div style={{ display: "flex", gap: 12, justifyContent: "flex-end" }}>
//               <button onClick={() => setDeleteConfirm({ open: false, categoryId: null })} style={{ padding: "8px 16px", borderRadius: 6, border: "1px solid #e5e7eb", background: "#f3f4f6", color: "#374151", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
//                 No, Cancel
//               </button>
//               <button onClick={() => { onDelete(deleteConfirm.categoryId); setDeleteConfirm({ open: false, categoryId: null }); }} style={{ padding: "8px 16px", borderRadius: 6, border: "none", background: "#dc2626", color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
//                 Yes, Delete
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// live action on active status category but missing action

// import DataGrid, {
//   Column,
//   ColumnChooser,
//   Export,
//   Pager,
//   Paging,
//   SearchPanel,
//   Summary,
//   Toolbar,
//   TotalItem,
//   Item,
// } from "devextreme-react/data-grid";
// import { useState } from "react";
// import CustomStore from "devextreme/data/custom_store";
// import DataSource from "devextreme/data/data_source";
// import { ALLOWED_PAGE_SIZES } from "../constant";
// import StatusToggle from "../../../../components/StatusToggle";

// export default function CategoriesGrid({
//   gridRef,
//   categories,
//   loading,
//   loadCategories,
//   onEdit,
//   onDelete,
//   onAddNew,
//   onToggleStatus,
// }) {
//   const [deleteConfirm, setDeleteConfirm] = useState({ open: false, categoryId: null });

//   const remoteDataSource = new DataSource({
//     store: new CustomStore({
//       key: "id",
//       load: (loadOptions) => {
//         const pageSize = loadOptions.take || 10;
//         const skip = loadOptions.skip || 0;
//         const pageNumber = skip / pageSize + 1;
//         const sort = loadOptions.sort?.[0];
//         const sortBy = sort?.selector || "name";
//         const sortOrder = sort?.desc ? "desc" : "asc";
//         const searchValue = loadOptions.searchValue || "";

//         return loadCategories({ pageNumber, pageSize, sortBy, sortOrder, search: searchValue });
//       },
//     }),
//     paginate: true,
//     remoteOperations: true,
//   });

//   return (
//     <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #e5e7eb", padding: 20 }}>
//       <DataGrid
//         ref={gridRef}
//         dataSource={categories}
//         remoteOperations={true}
//         keyExpr="id"
//         showBorders={false}
//         rowAlternationEnabled
//         columnAutoWidth
//         loading={loading}
//         allowColumnReordering
//         allowColumnResizing
//         hoverStateEnabled={true}
//       >
//         <Toolbar>
//           <Item location="before">
//             <button onClick={onAddNew} style={{ padding: "8px 16px", borderRadius: 8, border: "none", background: "#111", color: "#fff", fontSize: 12, fontWeight: 600 }}>
//               + Add Category
//             </button>
//           </Item>
//           <Item name="searchPanel" />
//           <Item name="columnChooserButton" showText="inMenu" />
//           <Item name="exportButton" />
//         </Toolbar>

//         <SearchPanel visible width={220} placeholder="Search categories…" />
//         <ColumnChooser enabled mode="select" />
//         <Paging defaultPageSize={10} />
//         <Pager visible={true} showPageSizeSelector={true} allowedPageSizes={ALLOWED_PAGE_SIZES} showInfo={true} showNavigationButtons={true} displayMode="full" />
//         <Export enabled formats={["xlsx", "pdf"]} />

//         <Column dataField="name" caption="Category Name" minWidth={150} />
//         <Column dataField="productCount" caption="Products" width={100} dataType="number" cellRender={({ value }) => (<span style={{ fontWeight: 600, color: "#374151" }}>{value || 0}</span>)} />
//         <Column dataField="description" caption="Description" />

//         <Column
//           dataField="isActive"
//           caption="Status"
//           width={130}
//           allowSorting={false}
//           cellRender={({ data }) => (
//             <StatusToggle
//               isActive={data.isActive}
//               onClick={() => onToggleStatus(data)}
//             />
//           )}
//         />

//         <Column caption="Actions" width={130} allowFiltering={false} allowSorting={false}>
//           {({ data }) => (
//             <div style={{ display: "flex", gap: 6 }}>
//               <button onClick={() => onEdit(data)} style={{ padding: "4px 10px", borderRadius: 6, border: "1px solid #d1d5db", background: "#f9fafb", color: "#374151", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>
//                 Edit
//               </button>
//               <button onClick={() => setDeleteConfirm({ open: true, categoryId: data.id })} style={{ padding: "4px 10px", borderRadius: 6, border: "1px solid #fecaca", background: "#fee2e2", color: "#b91c1c", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>
//                 Delete
//               </button>
//             </div>
//           )}
//         </Column>

//         <Summary>
//           <TotalItem column="name" summaryType="count" displayFormat="{0} categories" />
//         </Summary>
//       </DataGrid>

//       {deleteConfirm.open && (
//         <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0, 0, 0, 0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }}>
//           <div style={{ background: "#fff", borderRadius: 12, padding: 32, maxWidth: 400, boxShadow: "0 20px 25px rgba(0, 0, 0, 0.15)" }}>
//             <h3 style={{ margin: "0 0 12px 0", fontSize: 18, fontWeight: 700, color: "#1f2937" }}>Delete Category?</h3>
//             <p style={{ margin: "0 0 24px 0", fontSize: 14, color: "#6b7280", lineHeight: 1.5 }}>Are you sure you want to delete this category? This action cannot be undone.</p>
//             <div style={{ display: "flex", gap: 12, justifyContent: "flex-end" }}>
//               <button onClick={() => setDeleteConfirm({ open: false, categoryId: null })} style={{ padding: "8px 16px", borderRadius: 6, border: "1px solid #e5e7eb", background: "#f3f4f6", color: "#374151", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>No, Cancel</button>
//               <button onClick={() => { onDelete(deleteConfirm.categoryId); setDeleteConfirm({ open: false, categoryId: null }); }} style={{ padding: "8px 16px", borderRadius: 6, border: "none", background: "#dc2626", color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>Yes, Delete</button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

import { useState } from "react";
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
import CustomStore from "devextreme/data/custom_store";
import DataSource from "devextreme/data/data_source";
import { getCategoriesApi } from "../../../../api/categoryApi";
import { ALLOWED_PAGE_SIZES } from "../constant";
import StatusToggle from "../../../../components/StatusToggle";
import "./CategoriesGrid.css";
import { handleGridExport } from "../utils/exportHelper";

// ─── Remote data source ───────────────────────────────────────────────────────
function buildDataSource() {
  return new DataSource({
    store: new CustomStore({
      key: "id",
      load: async (loadOptions) => {
        const pageSize = loadOptions.take || 10;
        const skip = loadOptions.skip || 0;
        const pageNumber = Math.floor(skip / pageSize) + 1;
        const sort = loadOptions.sort?.[0];
        const sortBy = sort?.selector || "name";
        const sortOrder = sort?.desc ? "desc" : "asc";
        const searchValue = loadOptions.searchValue || "";

        try {
          const res = await getCategoriesApi({
            pageNumber,
            pageSize,
            sortBy,
            sortOrder,
            search: searchValue,
          });
          const data = res.data?.data;
          return {
            data: data?.items || [],
            totalCount: data?.totalCount || 0,
          };
        } catch {
          return { data: [], totalCount: 0 };
        }
      },
    }),
    paginate: true,
    remoteOperations: true,
  });
}

// Create once outside component so it isn't re-built on every render.
// If you need to refresh it externally, call gridRef.current.instance.refresh()
const remoteDataSource = buildDataSource();

// ─── Component ────────────────────────────────────────────────────────────────
export default function CategoriesGrid({
  gridRef,
  onEdit,
  onDelete,
  onAddNew,
  onToggleStatus,
  statusOverrides = {},   // ← id → boolean map for instant optimistic render
}) {
  const [deleteConfirm, setDeleteConfirm] = useState({
    open: false,
    categoryId: null,
  });

  const openDelete = (id) => setDeleteConfirm({ open: true, categoryId: id });
  const closeDelete = () => setDeleteConfirm({ open: false, categoryId: null });

  const confirmDelete = () => {
    onDelete(deleteConfirm.categoryId);
    closeDelete();
  };

  // ── Cell renderers ──────────────────────────────────────────────────────────

  const renderProducts = ({ value }) => (
    <span className="products-count">{value ?? 0}</span>
  );

  // KEY FIX 1 — instant optimistic render:
  // statusOverrides[data.id] is set before the API call completes,
  // so the toggle flips immediately without waiting for reloadGrid().
  // KEY FIX 2 — double-fire prevention:
  // stopPropagation on both mousedown and click blocks DevExtreme's
  // synthetic cell-click from reaching onToggleStatus a second time.
  const renderStatus = ({ data }) => {
    const isActive =
      statusOverrides[data.id] !== undefined
        ? statusOverrides[data.id]
        : data.isActive;

    return (
      <div
        onMouseDown={(e) => e.stopPropagation()}
        onClick={(e) => e.stopPropagation()}
        style={{ display: "inline-flex" }}
      >
        <StatusToggle
          isActive={isActive}
          onToggle={() => onToggleStatus(data)}
        />
      </div>
    );
  };

  const renderActions = ({ data }) => (
    <div className="action-cell">
      <button className="btn-edit" onClick={(e) => { e.stopPropagation(); onEdit(data); }}>
        Edit
      </button>
      <button className="btn-delete" onClick={(e) => { e.stopPropagation(); openDelete(data.id); }}>
        Delete
      </button>
    </div>
  );

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <div className="grid-wrapper">
      <DataGrid
        ref={gridRef}
        dataSource={remoteDataSource}
        remoteOperations={true}
        keyExpr="id"
        showBorders={false}
        rowAlternationEnabled
        columnAutoWidth
        allowColumnReordering
        allowColumnResizing
        hoverStateEnabled
        onExporting={handleGridExport}
        onCellClick={(e) => {
          // Block DevExtreme's own synthetic cell-click for the status column.
          // Without this, DevExtreme dispatches a second internal click after
          // the DOM event — calling onToggleStatus twice and producing a
          // duplicate toast even with the time-based debounce.
          if (e.column?.dataField === "isActive") {
            e.event?.stopPropagation();
            e.event?.preventDefault();
          }
        }}
      >
        {/* ── Toolbar ── */}
        <Toolbar>
          <Item location="before">
            <button className="grid-add-btn" onClick={onAddNew}>
              + Add Category
            </button>
          </Item>
          <Item name="searchPanel" />
          <Item name="columnChooserButton" showText="inMenu" />
          <Item name="exportButton" />
        </Toolbar>

        {/* ── Features ── */}
        <SearchPanel visible width={220} placeholder="Search categories…" />
        <ColumnChooser enabled mode="select" />
        <Paging defaultPageSize={10} />
        <Pager
          visible
          showPageSizeSelector
          allowedPageSizes={ALLOWED_PAGE_SIZES}
          showInfo
          showNavigationButtons
          displayMode="full"
        />
        <Export enabled formats={["xlsx", "pdf"]} />

        {/* ── Columns ── */}
        <Column dataField="name" caption="Category Name" minWidth={150} />
        <Column
          dataField="productCount"
          caption="Products"
          width={100}
          dataType="number"
          cellRender={renderProducts}
        />
        <Column dataField="description" caption="Description" />
        <Column
          dataField="isActive"
          caption="Status"
          width={140}
          allowSorting={false}
          cellRender={renderStatus}
        />
        <Column
          caption="Actions"
          width={140}
          allowFiltering={false}
          allowSorting={false}
          cellRender={renderActions}
        />

        <Summary>
          <TotalItem
            column="name"
            summaryType="count"
            displayFormat="{0} categories"
          />
        </Summary>
      </DataGrid>

      {/* ── Delete confirm dialog ── */}
      {deleteConfirm.open && (
        <div className="delete-overlay" onClick={closeDelete}>
          <div
            className="delete-dialog"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="delete-dialog__title">Delete Category?</h3>
            <p className="delete-dialog__body">
              Are you sure you want to delete this category? This action cannot
              be undone and may affect associated products.
            </p>
            <div className="delete-dialog__actions">
              <button className="btn-cancel" onClick={closeDelete}>
                No, Cancel
              </button>
              <button className="btn-confirm-delete" onClick={confirmDelete}>
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
// aajo ko 
// import DataGrid, {
//   Column,
//   ColumnChooser,
//   Export,
//   Pager,
//   Paging,
//   SearchPanel,
//   Summary,
//   Toolbar,
//   TotalItem,
//   Item,
// } from "devextreme-react/data-grid";
// import { useState } from "react";
// import CustomStore from "devextreme/data/custom_store";
// import DataSource from "devextreme/data/data_source";
// import { getCategoriesApi } from "../../../../api/categoryApi";
// import { ALLOWED_PAGE_SIZES } from "../constant";
// import StatusToggle from "../../../../components/StatusToggle";

// export default function CategoriesGrid({
//   gridRef,
//   onEdit,
//   onDelete,
//   onAddNew,
//   onToggleStatus,
// }) {
//   const [deleteConfirm, setDeleteConfirm] = useState({
//     open: false,
//     categoryId: null,
//   });

//   // This remote data source is essential for pagination, sorting, and searching.
//   const remoteDataSource = new DataSource({
//     store: new CustomStore({
//       key: "id",
//       load: async (loadOptions) => {
//         const pageSize = loadOptions.take || 10;
//         const skip = loadOptions.skip || 0;
//         const pageNumber = skip / pageSize + 1;
//         const sort = loadOptions.sort?.[0];
//         const sortBy = sort?.selector || "name";
//         const sortOrder = sort?.desc ? "desc" : "asc";
//         const searchValue = loadOptions.searchValue || "";

//         try {
//           const res = await getCategoriesApi({
//             pageNumber,
//             pageSize,
//             sortBy,
//             sortOrder,
//             search: searchValue,
//           });
//           const data = res.data?.data;
//           return {
//             data: data?.items || [],
//             totalCount: data?.totalCount || 0,
//           };
//         } catch (error) {
//           return { data: [], totalCount: 0 };
//         }
//       },
//     }),
//     paginate: true,
//     remoteOperations: true,
//   });

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
//         dataSource={remoteDataSource}
//         remoteOperations={true}
//         keyExpr="id"
//         showBorders={false}
//         rowAlternationEnabled
//         columnAutoWidth
//         allowColumnReordering
//         allowColumnResizing
//         hoverStateEnabled={true}
//       >
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
//               }}
//             >
//               + Add Category
//             </button>
//           </Item>
//           <Item name="searchPanel" />
//           <Item name="columnChooserButton" showText="inMenu" />
//           <Item name="exportButton" />
//         </Toolbar>

//         <SearchPanel visible width={220} placeholder="Search categories…" />
//         <ColumnChooser enabled mode="select" />
//         <Paging defaultPageSize={10} />
//         <Pager
//           visible={true}
//           showPageSizeSelector={true}
//           allowedPageSizes={ALLOWED_PAGE_SIZES}
//           showInfo={true}
//           showNavigationButtons={true}
//           displayMode="full"
//         />
//         <Export enabled formats={["xlsx", "pdf"]} />

//         <Column dataField="name" caption="Category Name" minWidth={150} />
//         <Column
//           dataField="productCount"
//           caption="Products"
//           width={100}
//           dataType="number"
//           cellRender={({ value }) => (
//             <span style={{ fontWeight: 600, color: "#374151" }}>
//               {value || 0}
//             </span>
//           )}
//         />
//         <Column dataField="description" caption="Description" />

//         <Column
//           dataField="isActive"
//           caption="Status"
//           width={130}
//           allowSorting={false}
//           cellRender={({ data }) => (
//             <StatusToggle
//               isActive={data.isActive}
//               onToggle={(e) => {
//                 e.stopPropagation(); // 🔥 this is the fix
//                 onToggleStatus(data);
//               }}
//             />
//           )}
//         />

//         <Column
//           caption="Actions"
//           width={130}
//           allowFiltering={false}
//           allowSorting={false}
//           cellRender={({ data }) => (
//             <div style={{ display: "flex", gap: 6 }}>
//               <button
//                 onClick={() => onEdit(data)}
//                 style={{
//                   padding: "4px 10px",
//                   borderRadius: 6,
//                   border: "1px solid #d1d5db",
//                   background: "#f9fafb",
//                   color: "#374151",
//                   fontSize: 12,
//                   fontWeight: 600,
//                   cursor: "pointer",
//                 }}
//               >
//                 Edit
//               </button>
//               <button
//                 onClick={() =>
//                   setDeleteConfirm({ open: true, categoryId: data.id })
//                 }
//                 style={{
//                   padding: "4px 10px",
//                   borderRadius: 6,
//                   border: "1px solid #fecaca",
//                   background: "#fee2e2",
//                   color: "#b91c1c",
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

//         <Summary>
//           <TotalItem
//             column="name"
//             summaryType="count"
//             displayFormat="{0} categories"
//           />
//         </Summary>
//       </DataGrid>

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
//             <h3
//               style={{
//                 margin: "0 0 12px 0",
//                 fontSize: 18,
//                 fontWeight: 700,
//                 color: "#1f2937",
//               }}
//             >
//               Delete Category?
//             </h3>
//             <p
//               style={{
//                 margin: "0 0 24px 0",
//                 fontSize: 14,
//                 color: "#6b7280",
//                 lineHeight: 1.5,
//               }}
//             >
//               Are you sure you want to delete this category? This action cannot
//               be undone.
//             </p>
//             <div
//               style={{ display: "flex", gap: 12, justifyContent: "flex-end" }}
//             >
//               <button
//                 onClick={() =>
//                   setDeleteConfirm({ open: false, categoryId: null })
//                 }
//                 style={{
//                   padding: "8px 16px",
//                   borderRadius: 6,
//                   border: "1px solid #e5e7eb",
//                   background: "#f3f4f6",
//                   color: "#374151",
//                   fontSize: 13,
//                   fontWeight: 600,
//                   cursor: "pointer",
//                 }}
//               >
//                 No, Cancel
//               </button>
//               <button
//                 onClick={() => {
//                   onDelete(deleteConfirm.categoryId);
//                   setDeleteConfirm({ open: false, categoryId: null });
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
