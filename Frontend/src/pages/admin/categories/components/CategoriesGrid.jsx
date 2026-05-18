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

import { ALLOWED_PAGE_SIZES } from "../constant";
import { handleGridExport } from "../utils/exportHelper";

import { categoryDataSource } from "../services/categoryDataSource";

import CategoryProductsCell from "../cells/CategoryProductsCell";
import CategoryStatusCell from "../cells/CategoryStatusCell";
import CategoryActionsCell from "../cells/CategoryActionsCell";

import CategoryDeleteDialog from "../components/CategoryDeleteDialog";
import useCategoryDelete from "../hooks/useCategoryDelete";

export default function CategoriesGrid({
  gridRef,
  onEdit,
  onDelete,
  onAddNew,
  onToggleStatus,
  statusOverrides = {},
}) {
  const {
    deleteState,
    requestDelete,
    cancelDelete,
    confirmDelete,
  } = useCategoryDelete(onDelete);

  return (
    <div className="grid-wrapper">
      <DataGrid
        ref={gridRef}
        dataSource={categoryDataSource}
        remoteOperations
        keyExpr="id"
        rowAlternationEnabled
        columnAutoWidth
        hoverStateEnabled
        allowColumnReordering
        allowColumnResizing
        onExporting={handleGridExport}
      >
        <Toolbar>
          <Item location="before">
            <button className=" bg-black p-2 rounded-xl text-white" onClick={onAddNew}>
               + Add Category
            </button>
          </Item>

          <Item name="searchPanel" />
          <Item name="columnChooserButton" />
          <Item name="exportButton" />
        </Toolbar>

       
        <SearchPanel visible placeholder="Search categories..." />
        <ColumnChooser enabled />
        <Export enabled formats={["xlsx", "pdf"]} />

        <Paging defaultPageSize={10} />
        <Pager
          visible
          showPageSizeSelector
          allowedPageSizes={ALLOWED_PAGE_SIZES}
        />

        <Column dataField="name" caption="Category Name" minWidth={150} />

        <Column
          dataField="productCount"
          caption="Products"
          width={100}
          cellRender={CategoryProductsCell}
        />

        <Column dataField="description" caption="Description" />

        <Column
          dataField="isActive"
          caption="Status"
          width={140}
          allowSorting={false}
          cellRender={(props) => (
            <CategoryStatusCell
              {...props}
              statusOverrides={statusOverrides}
              onToggleStatus={onToggleStatus}
            />
          )}
        />

        <Column
          caption="Actions"
          width={140}
          allowFiltering={false}
          allowSorting={false}
          cellRender={(props) => (
            <CategoryActionsCell
              {...props}
              onEdit={onEdit}
              onRequestDelete={requestDelete}
            />
          )}
        />

        <Summary>
          <TotalItem
            column="name"
            summaryType="count"
            displayFormat="{0} categories"
          />
        </Summary>
      </DataGrid>

   
      <CategoryDeleteDialog
        isOpen={deleteState.isOpen}
        onCancel={cancelDelete}
        onConfirm={confirmDelete}
      />
    </div>
  );
}