


import axiosClient from "./axiosClient";

// ✅ paged + filters
export const getAllOrdersApi = (params = {}) =>
  axiosClient.get("/admin/orders", { params });

export const updateOrderStatusApi = (orderId, statusNumber) =>
  axiosClient.put(`/admin/orders/${orderId}/status`, { status: statusNumber });

export const getInventoryAnalyticsApi = () =>
  axiosClient.get("/admin/analytics/inventory");

export const getUserAnalyticsSummaryApi = (days = 30) =>
  axiosClient.get(`/admin/user-analytics/summary?days=${days}`);

export const getUserPurchaseDetailsApi = (userId, days = 30) =>
  axiosClient.get(`/admin/user-analytics/${userId}/products?days=${days}`);

// fallback demo stats if no backend endpoint
export const getAdminDashboardApi = async () => ({
  data: { data: { totalUsers: 0, totalProducts: 0, totalOrders: 0, pendingOrders: 0, totalRevenue: 0 } },
});


