/* eslint-disable react-hooks/set-state-in-effect */
// /* eslint-disable react-hooks/set-state-in-effect */
// /**
//  * @fileoverview Custom hook for managing order data with manual state control.
//  * This approach provides full control over the API request format, resolving 400 errors.
//  */
// import { useState, useEffect, useCallback } from "react";
// import toast from "react-hot-toast";
// import { getAllOrdersApi, updateOrderStatusApi } from "../../../../api/adminApi";
// import { ORDER_STATUS_MAP } from "../../../../constants/orderStatusConfig";

// export function useOrders() {
//   const [orders, setOrders] = useState([]);
//   const [loading, setLoading] = useState(true);

//   // State for filters, sorting, and pagination
//   const [search, setSearch] = useState("");
//   const [status, setStatus] = useState("");
//   const [paymentStatus, setPaymentStatus] = useState("");
//   const [sortBy, setSortBy] = useState("createdAt");
//   const [sortOrder, setSortOrder] = useState("desc");
//   const [pageNumber, setPageNumber] = useState(1);
//   const [pageSize] = useState(10);
//   const [totalPages, setTotalPages] = useState(1);

//   // Data fetching function
//   const loadOrders = useCallback(async () => {
//     setLoading(true);
//     try {
//       // Build params object, ensuring undefined values are not sent
//       const params = {
//         search: search || undefined,
//         status: status || undefined,
//         paymentStatus: paymentStatus || undefined,
//         sortBy,
//         sortOrder,
//         pageNumber,
//         pageSize,
//       };

//       const res = await getAllOrdersApi(params);
//       const payload = res.data?.data;
//       setOrders(payload?.items || []);
//       setTotalPages(payload?.totalPages || 1);
//     } catch (e) {
//       toast.error(e?.response?.data?.message || "Failed to load orders");
//       // This is often a 400 error if params are wrong
//       console.error("API Error:", e.response); 
//     } finally {
//       setLoading(false);
//     }
//   }, [search, status, paymentStatus, sortBy, sortOrder, pageNumber, pageSize]);
  
//   // Effect to reload data when any dependency changes
//   useEffect(() => {
//     loadOrders();
//   }, [loadOrders]);

//   // Function to update order status
//   const updateStatus = async (orderId, statusText) => {
//     try {
//       const statusNumber = ORDER_STATUS_MAP[statusText];
//       await updateOrderStatusApi(orderId, statusNumber);
//       toast.success("Order status updated");
//       loadOrders(); // Refresh data after update
//     } catch (e) {
//       toast.error(e?.response?.data?.message || "Status update failed");
//     }
//   };
  
//   // Return everything the UI needs
//   return {
//     orders,
//     loading,
//     filters: { search, status, paymentStatus, sortBy, sortOrder },
//     pagination: { pageNumber, totalPages },
//     actions: {
//       setSearch,
//       setStatus,
//       setPaymentStatus,
//       setSortBy,
//       setSortOrder,
//       setPageNumber,
//       updateStatus,
//     },
//   };
// }

import { useState, useEffect, useCallback } from "react";
import toast from "react-hot-toast";
import { getAllOrdersApi, updateOrderStatusApi } from "../../../../api/adminApi";
import { canTransitionTo, isStatusLocked } from "../../../../constants/orderStatusConfig";

export function useOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [paymentStatus, setPaymentStatus] = useState("");
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  const loadOrders = useCallback(async () => {
    setLoading(true);
    try {
      const params = {
        search: search || undefined,
        status: status || undefined,
        paymentStatus: paymentStatus || undefined,
        sortBy,
        sortOrder,
        pageNumber,
        pageSize,
      };
      const res = await getAllOrdersApi(params);
      const payload = res.data?.data;
      setOrders(payload?.items || []);
      setTotalPages(payload?.totalPages || 1);
    } catch (e) {
      toast.error(e?.response?.data?.message || "Failed to load orders");
    } finally {
      setLoading(false);
    }
  }, [search, status, paymentStatus, sortBy, sortOrder, pageNumber, pageSize]);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  // Fixed: accepts (orderId, currentStatusId, newStatusId) — all numeric
  const updateStatus = async (orderId, currentStatusId, newStatusId) => {
    if (isStatusLocked(currentStatusId)) {
      toast.error("This order is locked and cannot be changed.");
      return false;
    }
    if (!canTransitionTo(currentStatusId, newStatusId)) {
      toast.error("That status transition is not allowed.");
      return false;
    }
    try {
      await updateOrderStatusApi(orderId, newStatusId); // sends numeric value
      toast.success("Order status updated");
      loadOrders();
      return true;
    } catch (e) {
      toast.error(e?.response?.data?.message || "Status update failed");
      return false;
    }
  };

  return {
    orders,
    loading,
    filters: { search, status, paymentStatus, sortBy, sortOrder },
    pagination: { pageNumber, totalPages },
    actions: {
      setSearch, setStatus, setPaymentStatus,
      setSortBy, setSortOrder, setPageNumber,
      updateStatus,
    },
  };
}