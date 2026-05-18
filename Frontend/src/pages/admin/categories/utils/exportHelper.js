import { Workbook } from "exceljs";
import { saveAs } from "file-saver";
import { jsPDF } from "jspdf";
import { getCategoriesApi } from "../../../../api/categoryApi";

export async function handleGridExport(e) {
  try {
    const res = await getCategoriesApi({
      pageNumber: 1,
      pageSize: 50000, 
      sortBy: "name",
      sortOrder: "asc",
      search: "",
    });

    const allCategories = res.data?.data?.items || [];

    if (e.format === "xlsx") {
      const workbook = new Workbook();
      const sheet = workbook.addWorksheet("Categories");

      sheet.columns = [
        { header: "Category Name", key: "name", width: 30 },
        { header: "Description", key: "description", width: 60 },
      ];

      const headerRow = sheet.getRow(1);
      headerRow.font = { bold: true, color: { argb: "FFFFFFFF" } };
      headerRow.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FF000000" },
      };

      allCategories.forEach((category) => {
        sheet.addRow({
          name: category.name,
          description: category.description || "",
        });
      });

      sheet.autoFilter = {
        from: { row: 1, column: 1 },
        to: { row: allCategories.length + 1, column: 2 },
      };

      const buffer = await workbook.xlsx.writeBuffer();
      saveAs(
        new Blob([buffer], { type: "application/octet-stream" }),
        `Categories_${new Date().toISOString().split("T")[0]}.xlsx`
      );
      e.cancel = true;
    }

    if (e.format === "pdf") {
      const doc = new jsPDF({ orientation: "portrait" });

      // Add title
      doc.setFontSize(16);
      doc.text("Categories Report", 14, 15);
      doc.setFontSize(10);
      doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 22);
      doc.text(`Total Categories: ${allCategories.length}`, 14, 28);

      // Create table
      const columns = ["Category Name", "Description"];
      const data = allCategories.map((category) => [
        category.name?.substring(0, 40),
        category.description?.substring(0, 60) || "",
      ]);

      const pageHeight = doc.internal.pageSize.getHeight();
      let yPosition = 35;
      const rowHeight = 8;
      const colWidths = [60, 90];

      // Print headers
      doc.setFontSize(11);
      doc.setFont(undefined, "bold");
      let xPosition = 10;
      columns.forEach((col, idx) => {
        doc.text(col, xPosition, yPosition);
        xPosition += colWidths[idx];
      });

      yPosition += rowHeight;
      doc.setFont(undefined, "normal");
      doc.setFontSize(9);

      data.forEach((row) => {
        if (yPosition + rowHeight > pageHeight - 10) {
          doc.addPage();
          yPosition = 10;
        }

        xPosition = 10;
        row.forEach((cell, idx) => {
          const cellText = String(cell || "").substring(0, 40);
          doc.text(cellText, xPosition, yPosition);
          xPosition += colWidths[idx];
        });
        yPosition += rowHeight;
      });

      doc.save(`Categories_${new Date().toISOString().split("T")[0]}.pdf`);
      e.cancel = true;
    }
  } catch (err) {
    console.error("Export error:", err);
    alert("Export failed. Check console for details.");
    e.cancel = true;
  }
}