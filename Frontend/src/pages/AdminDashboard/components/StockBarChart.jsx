import { Chart, Series, ArgumentAxis, ValueAxis, Tooltip, CommonSeriesSettings } from "devextreme-react/chart";

export default function StockBarChart({ data }) {
  return (
    <div className="card">
      <h3 className="card-title">Top Stock Products</h3>
      <Chart dataSource={data} height={300}>
        <CommonSeriesSettings argumentField="productName" type="bar" />
        <Series valueField="quantity" color="#111827" />
        <ArgumentAxis visible={false} />
        <ValueAxis />
        <Tooltip enabled />
      </Chart>
    </div>
  );
}