/**
 * @fileoverview Helper functions for exporting DataGrid to PDF and Excel.
 */
import { jsPDF } from "jspdf";
import ExcelJS from 'exceljs';
import { exportDataGrid as exportDataGridToPdf } from "devextreme/pdf_exporter";
import { exportDataGrid as exportDataGridToXlsx } from 'devextreme/excel_exporter';
import { saveAs } from "file-saver";

/**
 * Handles the onExporting event of the DataGrid to generate PDF or XLSX files.
 * @param {object} e - The DevExtreme onExporting event object.
 */
export const onExporting = (e) => {
  if (e.format === "pdf") {
    const doc = new jsPDF();
    exportDataGridToPdf({
      jsPDFDocument: doc,
      component: e.component,
    }).then(() => {
      doc.save("Orders.pdf");
    });
  } else if (e.format === "xlsx") {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Orders");
    exportDataGridToXlsx({
      component: e.component,
      worksheet: worksheet,
    }).then(() => {
      workbook.xlsx.writeBuffer().then((buffer) => {
        saveAs(new Blob([buffer], { type: "application/octet-stream" }), "Orders.xlsx");
      });
    });
    e.cancel = true; // Prevent default DevExtreme export
  }
};