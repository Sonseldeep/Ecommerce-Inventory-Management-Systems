import { ORDER_STATUS_LABELS, ORDER_STATUS_ARRAY } from '../constants';

export default function OrderCard({ order, onStatusUpdate }) {
  const statusName = ORDER_STATUS_LABELS[order.orderStatus] || "Pending";
  const statusOptions = ORDER_STATUS_ARRAY.map(s => s.name);

  return (
    <div className="bg-white rounded-xl shadow-md p-4 transition-shadow hover:shadow-lg">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        {/* Left Side: Order & Customer Details */}
        <div>
          <p className="font-semibold text-gray-800">Order #{order.orderNumber}</p>
          <p className="text-sm text-gray-600">{order.customerName} ({order.customerEmail})</p>
          <p className="text-lg font-bold text-gray-900 mt-1">
            ₹ {Number(order.totalAmount || 0).toFixed(2)}
          </p>
        </div>
        
        {/* Right Side: Status Update */}
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-500">Status:</span>
          <select
            className="border rounded p-2 bg-gray-50 focus:ring-2 focus:ring-blue-500"
            value={statusName}
            onChange={(e) => onStatusUpdate(order.id, e.target.value)}
          >
            {statusOptions.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      </div>
    </div>
  );
}