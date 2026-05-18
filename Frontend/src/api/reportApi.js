// import axiosClient from "./axiosClient";

// export async function downloadReport(endpoint, payload, filename) {
//   const res = await axiosClient.post(endpoint, payload, { responseType: "blob" });
//   const url = window.URL.createObjectURL(res.data);

//   const a = document.createElement("a");
//   a.href = url;
//   a.download = filename;
//   a.click();

//   window.URL.revokeObjectURL(url);
// }

// export const exportTopBuyers = (payload) =>
//   downloadReport("/admin/reports/top-buyers", payload, "top-buyers.xlsx");

// export const exportSalesSummary = (payload) =>
//   downloadReport("/admin/reports/sales-summary", payload, "sales-summary.xlsx");


//  const exportCategoryInventorySheets = (payload) =>
//   downloadReport("/admin/reports/category-inventory", payload, "category-inventory.xlsx");



import axiosClient from "./axiosClient";


export async function downloadReport(endpoint, payload, filename) {
  const res = await axiosClient.post(endpoint, payload, {
    responseType: "blob",
  });

  const url = window.URL.createObjectURL(res.data);

  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();

  window.URL.revokeObjectURL(url);
}

/**
 * Report registry (single source of truth)
 */
const REPORTS = {
  "top-buyers": {
    endpoint: "/admin/reports/top-buyers",
    filename: "top-buyers.xlsx",
  },
  "sales-summary": {
    endpoint: "/admin/reports/sales-summary",
    filename: "sales-summary.xlsx",
  },
  "category-inventory": {
    endpoint: "/admin/reports/category-inventory",
    filename: "category-inventory.xlsx",
  },
};

/**
 * Clean export API
 */
export function exportReport(type, payload) {
  const report = REPORTS[type];

  if (!report) {
    console.warn("Unknown report type:", type);
    return;
  }

  return downloadReport(
    report.endpoint,
    payload,
    report.filename
  );
}