import DataGrid, { Column } from "devextreme-react/data-grid";

export default function BestSellersGrid({ title, items }) {
  return (
    <div className="card">
      <h3 className="card-title">{title}</h3>
      <DataGrid dataSource={items} showBorders={false}>
        <Column dataField="productName" caption="Product" />
        <Column dataField="quantity" caption="Qty" alignment="right" />
      </DataGrid>
    </div>
  );
}