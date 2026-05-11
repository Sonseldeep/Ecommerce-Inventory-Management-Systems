import SelectBox from "devextreme-react/select-box";
import { ORDER_STATUS_ARRAY } from "../constants/orderStatusConfig";

export default function OrderStatusCell(cellInfo) {
  return (
    <SelectBox
      dataSource={ORDER_STATUS_ARRAY}
      valueExpr="id"          // ✅ MUST BE ID (NUMBER)
      displayExpr="name"
      value={cellInfo.value}
      onValueChange={(val) => {
        const nextStatus = Number(val);

        cellInfo.setValue(nextStatus); // IMPORTANT for DevExtreme

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


// import SelectBox from "devextreme-react/select-box";
// import { ORDER_STATUS_ARRAY } from "../constants";

// /**
//  * Renders a SelectBox for changing the order status in an editable grid cell.
//  * @param {object} cellInfo - The cell data provided by DevExtreme DataGrid.
//  */
// export default function OrderStatusCell(cellInfo) {
//   const onStatusChange = (newStatus) => {
//     // Calling setValue triggers the CustomStore's update method
//     cellInfo.setValue(newStatus);
//   };

//   return (
//     <SelectBox
//       dataSource={ORDER_STATUS_ARRAY}
//       valueExpr="id"
//       displayExpr="name"
//       value={cellInfo.value}
//       onValueChange={onStatusChange}
//       searchEnabled={true}
//     />
//   );
// }