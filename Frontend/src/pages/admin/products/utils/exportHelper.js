import { exportDataGrid } from "devextreme/excel_exporter";
import { exportDataGrid as exportPDF } from "devextreme/pdf_exporter";
import { Workbook } from "exceljs";
import { saveAs } from "file-saver";
import { jsPDF } from "jspdf";

export function handleGridExport(e) {
  if (e.format === "xlsx") {
    const workbook = new Workbook();
    const sheet = workbook.addWorksheet("Products");
    exportDataGrid({
      component: e.component,
      worksheet: sheet,
      autoFilterEnabled: true,
    }).then(() => {
      workbook.xlsx.writeBuffer().then((buffer) => {
        saveAs(
          new Blob([buffer], { type: "application/octet-stream" }),
          "Products.xlsx"
        );
      });
    });
    e.cancel = true;
  }

  if (e.format === "pdf") {
    const doc = new jsPDF({ orientation: "landscape" });
    exportPDF({ jsPDFDocument: doc, component: e.component }).then(() => {
      doc.save("Products.pdf");
    });
    e.cancel = true;
  }
}