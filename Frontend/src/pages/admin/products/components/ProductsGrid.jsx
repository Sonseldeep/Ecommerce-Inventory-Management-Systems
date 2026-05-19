/* eslint-disable react-hooks/refs */
/* eslint-disable react-hooks/preserve-manual-memoization */
/* eslint-disable no-undef */
/* eslint-disable react-hooks/immutability */





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

const BTN_IMPORT = {
  ...BTN_BASE,
  background: "#111",
  color: "#fff",
  padding: "5px 14px",
  fontSize: 13,
  display: "inline-flex",
  alignItems: "center",
  gap: 6,
};

export default function ProductsGrid({
  gridRef,
  categories,
  onEdit,
  onDelete,
  onExportAll,
  onImport,      
}) {
  const [deleteTarget, setDeleteTarget] = useState(null);

  
  const searchTermRef = useRef("");

  const getCategoryName = useCallback(
    (row) => categories.find((c) => c.id === row.categoryId)?.name ?? "—",
    [categories]
  );

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

            const search = searchTermRef.current?.trim() || undefined;

            try {
              const res  = await getProductsApi({
                pageNumber,
                pageSize,
                sortBy:    "name",
                sortOrder: "asc",
               
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
          }, 300); 

          return currentPromise;
        },
      }),
      paginate:      true,
      reshapeOnPush: true,
    });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

 
  const handleOptionChanged = useCallback(
    (e) => {
      if (e.fullName === "searchPanel.text") {
        searchTermRef.current = e.value ?? "";
        dataSource.pageIndex(0);
        dataSource.reload();
      }
    },
    [dataSource]
  );

  const handleExporting = useCallback(
    async (e) => {
      e.cancel = true; 

      const allProducts = await onExportAll();
      if (!allProducts?.length) return;

      if (e.format === "xlsx") {
        await exportAllToXlsx(allProducts, categories);
      }
    },
    [onExportAll, categories]
  );

  const handleConfirmDelete = useCallback(() => {
    if (deleteTarget) onDelete(deleteTarget);
    setDeleteTarget(null);
  }, [deleteTarget, onDelete]);

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
  
        <Toolbar>
          <Item name="groupPanel" />
          <Item name="searchPanel" />

          <Item
            location="after"
            locateInMenu="never"
            render={() => (
              <button style={BTN_IMPORT} onClick={onImport}>
                ↑ Import
              </button>
            )}
          />

          <Item name="exportButton" />
        </Toolbar>

        <SearchPanel visible width={220} placeholder="Search products…" />
        <GroupPanel visible />
        <Grouping autoExpandAll={false} />

       
        <Paging defaultPageSize={10} />
        <Pager
          visible
          displayMode="full"
          showPageSizeSelector
          allowedPageSizes={ALLOWED_PAGE_SIZES}
          showInfo
          showNavigationButtons
        />

    
        <Export
          enabled
          formats={["xlsx"]}
          texts={{
            exportAll: "Export all",
            exportTo:  "Export",
          }}
        />

    
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
          confirmLabel=" Delete"
          cancelLabel=" Cancel"
          onConfirm={handleConfirmDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </div>
  );
}