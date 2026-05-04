import { PieChart, Series, Label, Tooltip } from "devextreme-react/pie-chart";
import { CHART_COLORS } from "../utils/colors";

export default function CategoryPieChart({ data }) {
  return (
    <div className="card">
      <h3 className="card-title">Category Stock</h3>
      <PieChart dataSource={data} height={300} palette={CHART_COLORS}>
        <Series argumentField="categoryName" valueField="totalStock" />
        <Label visible={true} />
        <Tooltip enabled />
      </PieChart>
    </div>
  );
}