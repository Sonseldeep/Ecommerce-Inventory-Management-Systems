import axiosClient from "./axiosClient";

export async function downloadReport(endpoint, payload, filename) {
  const res = await axiosClient.post(endpoint, payload, { responseType: "blob" });
  const url = window.URL.createObjectURL(res.data);

  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();

  window.URL.revokeObjectURL(url);
}

export const exportTopBuyers = (payload) =>
  downloadReport("/admin/reports/top-buyers", payload, "top-buyers.xlsx");

export const exportSalesSummary = (payload) =>
  downloadReport("/admin/reports/sales-summary", payload, "sales-summary.xlsx");


 const exportCategoryInventorySheets = (payload) =>
  downloadReport("/admin/reports/category-inventory", payload, "category-inventory.xlsx");