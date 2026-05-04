import SelectBox from "devextreme-react/select-box";
import { ORDER_STATUS_ARRAY } from "../constants";

/**
 * Renders a SelectBox for changing the order status in an editable grid cell.
 * @param {object} cellInfo - The cell data provided by DevExtreme DataGrid.
 */
export default function OrderStatusCell(cellInfo) {
  const onStatusChange = (newStatus) => {
    // Calling setValue triggers the CustomStore's update method
    cellInfo.setValue(newStatus);
  };

  return (
    <SelectBox
      dataSource={ORDER_STATUS_ARRAY}
      valueExpr="id"
      displayExpr="name"
      value={cellInfo.value}
      onValueChange={onStatusChange}
      searchEnabled={true}
    />
  );
}