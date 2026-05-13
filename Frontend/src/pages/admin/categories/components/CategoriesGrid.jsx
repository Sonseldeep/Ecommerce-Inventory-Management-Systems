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

// ─── Search helper ────────────────────────────────────────────────────────────
// When remoteOperations={true}, DevExtreme sends search via loadOptions.filter:
//   single field → ["name", "contains", "foo"]
//   multi field  → [["name","contains","foo"], "or", ["description","contains","foo"]]
function extractSearchValue(filter) {
  if (!filter) return "";
  if (typeof filter[0] === "string") return filter[2] ?? "";
  return extractSearchValue(filter[0]);
}

// ─── Remote data source ───────────────────────────────────────────────────────
function buildDataSource() {
  return new DataSource({
    store: new CustomStore({
      key: "id",
      load: async (loadOptions) => {
        const pageSize   = loadOptions.take || 10;
        const skip       = loadOptions.skip || 0;
        const pageNumber = Math.floor(skip / pageSize) + 1;

        const sort      = loadOptions.sort?.[0];
        const sortBy    = sort?.selector || "name";
        const sortOrder = sort?.desc ? "desc" : "asc";

        // read from filter, not searchValue
        const searchValue = extractSearchValue(loadOptions.filter);

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
            data:       data?.items      || [],
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

const remoteDataSource = buildDataSource();

//  Component 
export default function CategoriesGrid({
  gridRef,
  onEdit,
  onDelete,
  onAddNew,
  onToggleStatus,
  statusOverrides = {},
}) {
  const [deleteConfirm, setDeleteConfirm] = useState({
    open: false,
    categoryId: null,
  });

  const openDelete    = (id) => setDeleteConfirm({ open: true, categoryId: id });
  const closeDelete   = ()   => setDeleteConfirm({ open: false, categoryId: null });
  const confirmDelete = ()   => { onDelete(deleteConfirm.categoryId); closeDelete(); };

  //  Cell renderers 
  const renderProducts = ({ value }) => (
    <span className="products-count">{value ?? 0}</span>
  );

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
      <button className="btn-edit"   onClick={(e) => { e.stopPropagation(); onEdit(data); }}>Edit</button>
      <button className="btn-delete" onClick={(e) => { e.stopPropagation(); openDelete(data.id); }}>Delete</button>
    </div>
  );

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
          if (e.column?.dataField === "isActive") {
            e.event?.stopPropagation();
            e.event?.preventDefault();
          }
        }}
      >
        {/*  Toolbar  */}
        <Toolbar>
          <Item location="before">
            <button className="grid-add-btn" onClick={onAddNew}>+ Add Category</button>
          </Item>
          <Item name="searchPanel" />
          <Item name="columnChooserButton" showText="inMenu" />
          <Item name="exportButton" />
        </Toolbar>

        {/*  Features  */}
        <SearchPanel
          visible
          width={220}
          placeholder="Search categories…"
          searchVisibleColumnsOnly={false}  
        />
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

        {/*  Columns  */}
        {/*  searchEnabled tells DevExtreme to include these in the filter */}
        <Column dataField="name"         caption="Category Name" minWidth={150} searchEnabled />
        <Column dataField="productCount" caption="Products"      width={100} dataType="number" cellRender={renderProducts} />
        <Column dataField="description"  caption="Description"   searchEnabled />
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
          <TotalItem column="name" summaryType="count" displayFormat="{0} categories" />
        </Summary>
      </DataGrid>

      {/*  Delete confirm dialog  */}
      {deleteConfirm.open && (
        <div className="delete-overlay" onClick={closeDelete}>
          <div className="delete-dialog" onClick={(e) => e.stopPropagation()}>
            <h3 className="delete-dialog__title">Delete Category?</h3>
            <p className="delete-dialog__body">
              Are you sure you want to delete this category? This action cannot
              be undone and may affect associated products.
            </p>
            <div className="delete-dialog__actions">
              <button className="btn-cancel"         onClick={closeDelete}>Cancel</button>
              <button className="btn-confirm-delete" onClick={confirmDelete}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}