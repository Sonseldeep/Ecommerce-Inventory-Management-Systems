import SelectBox from "devextreme-react/select-box";
import { ORDER_STATUS_ARRAY } from "../constants/orderStatusConfig";

export default function OrderStatusCell(cellInfo) {
  return (
    <SelectBox
      dataSource={ORDER_STATUS_ARRAY}
      valueExpr="id"          
      displayExpr="name"
      value={cellInfo.value}
      onValueChange={(val) => {
        const nextStatus = Number(val);

        cellInfo.setValue(nextStatus); 

        if (cellInfo.data?.onStatusRequest) {
          cellInfo.data.onStatusRequest({
            orderId: cellInfo.data.id,
            current: cellInfo.value,
            next: nextStatus,
          });
        }
      }}
    />
  );
}


