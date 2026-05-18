/* eslint-disable react-hooks/set-state-in-effect */

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
      await updateOrderStatusApi(orderId, newStatusId); 
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