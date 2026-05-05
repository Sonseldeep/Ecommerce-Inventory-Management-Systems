import DataGrid, { Column } from "devextreme-react/data-grid";

export default function UserPurchasesGrid({ selectedUser, userProducts, onClose }) {
  return (
    <div className="card">
      {selectedUser ? (
        <>
          <div className="flex-between">
            <h3 className="card-title">Purchases by {selectedUser.fullName}</h3>
            <button className="text-btn" onClick={onClose}>✕ Close</button>
          </div>

          <DataGrid dataSource={userProducts} showBorders={false}>
            <Column dataField="productName" caption="Product" />
            <Column dataField="quantity" caption="Qty" alignment="right" />
            <Column dataField="totalSpent" caption="Spent" alignment="right" format="currency" />
          </DataGrid>
        </>
      ) : (
        <div className="empty-state">Click a buyer to see purchases</div>
      )}
    </div>
  );
}