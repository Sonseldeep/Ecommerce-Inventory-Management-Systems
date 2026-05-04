import DataGrid, { Column, Selection } from "devextreme-react/data-grid";
import SelectBox from "devextreme-react/select-box";

export default function TopBuyersGrid({ userSummary, userDays, setUserDays, onSelect }) {
  return (
    <div className="card">
      <div className="flex-between">
        <h3 className="card-title">Top Buyers</h3>
        <SelectBox
          items={[
            { id: 7, name: "Last 7 days" },
            { id: 30, name: "Last 30 days" }
          ]}
          value={userDays}
          valueExpr="id"
          displayExpr="name"
          onValueChanged={(e) => setUserDays(e.value)}
          width={140}
        />
      </div>
      <p className="text-muted">Total Users: {userSummary?.totalUsers || 0}</p>

      <DataGrid
        dataSource={userSummary?.topBuyers || []}
        showBorders={false}
        hoverStateEnabled={true}
        onRowClick={(e) => onSelect(e.data)}
      >
        <Selection mode="single" />
        <Column dataField="fullName" caption="User" />
        <Column dataField="ordersCount" caption="Orders" alignment="right" />
        <Column
          dataField="totalSpent"
          caption="Spent"
          alignment="right"
          format="currency"
        />
      </DataGrid>
    </div>
  );
}