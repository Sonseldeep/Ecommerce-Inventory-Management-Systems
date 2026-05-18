import DataGrid, {
  Column,
  Editing,
  Export,
  FilterRow,
  Grouping,
  GroupPanel,
  HeaderFilter,
  Lookup,
  Pager,
  Paging,
  SearchPanel,
  StateStoring,
} from 'devextreme-react/data-grid';
import { ALLOWED_PAGE_SIZES, ORDER_STATUS_ARRAY } from '../constants';
import { onExporting } from '../utils/exportHelpers';
import OrderStatusCell from './OrderStatusCell';

export default function OrdersGrid({ dataSource }) {
  return (
    <DataGrid
      dataSource={dataSource}
      keyExpr="id"
      showBorders={true}
      remoteOperations={true}
      onExporting={onExporting}
      allowColumnReordering={true}
      allowColumnResizing={true}
      columnAutoWidth={true}
    >
      <StateStoring enabled={true} type="localStorage" storageKey="datagrid_orders_state" />
      <GroupPanel visible={true} />
      <Grouping autoExpandAll={false} />
      <FilterRow visible={true} />
      <HeaderFilter visible={true} />
      <SearchPanel visible={true} width={240} placeholder="Search Orders..." />
      <Editing mode="cell" allowUpdating={true} />

      <Column dataField="orderNumber" caption="Order #" allowEditing={false} />
      <Column dataField="customerName" allowEditing={false} />
      <Column dataField="totalAmount" dataType="number" format="currency" currency="INR" allowEditing={false} />
      
      <Column dataField="orderStatus" caption="Status" editCellComponent={OrderStatusCell}>
        <Lookup dataSource={ORDER_STATUS_ARRAY} valueExpr="id" displayExpr="name" />
      </Column>
      
      <Column dataField="paymentStatus" caption="Payment" allowEditing={false} >
        <Lookup dataSource={[{id: 1, name: 'Pending'}, {id: 2, name: 'Paid'}, {id: 3, name: 'Failed'}]} valueExpr="id" displayExpr="name" />
      </Column>

      <Column dataField="createdAt" dataType="date" allowEditing={false} />

      <Paging defaultPageSize={10} />
      <Pager showPageSizeSelector={true} allowedPageSizes={ALLOWED_PAGE_SIZES} showInfo={true} />
      <Export enabled={true} formats={['pdf', 'xlsx']} allowExportSelectedData={true} />
    </DataGrid>
  );
}