
import { Workbook } from "exceljs";
import { saveAs } from "file-saver";

const EXPORT_COLUMNS = [
  { header: "Product Name", key: "name",             width: 30 },
  { header: "SKU",          key: "sku",              width: 18 },
  { header: "Category",     key: "categoryName",     width: 18 },
  { header: "Price (Rs)",   key: "price",            width: 14 },
  { header: "Discount (Rs)",key: "discountPrice",    width: 16 },
  { header: "Stock",        key: "quantityInStock",  width: 10 },
  { header: "Reorder",      key: "reorderLevel",     width: 10 },
];

/**
 * Enriches raw product rows with their category name.
 */
function buildRows(products, categories) {
  const catMap = Object.fromEntries(categories.map((c) => [c.id, c.name]));
  return products.map((p) => ({
    name:             p.name             ?? "",
    sku:              p.sku              ?? "",
    categoryName:     catMap[p.categoryId] ?? "—",
    price:            p.price            ?? 0,
    discountPrice:    p.discountPrice    ?? "—",
    quantityInStock:  p.quantityInStock  ?? 0,
    reorderLevel:     p.reorderLevel     ?? 0,
  }));
}

/**
 * Export ALL products to XLSX.
 *
 * @param {object[]} products  - Full product list (all pages).
 * @param {object[]} categories - Categories for name resolution.
 */
export async function exportAllToXlsx(products, categories) {
  const rows = buildRows(products, categories);

  const workbook = new Workbook();
  const sheet = workbook.addWorksheet("Products");

  sheet.columns = EXPORT_COLUMNS;

  // Header styling
  const headerRow = sheet.getRow(1);
  headerRow.font = { bold: true };
  headerRow.fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "FF111111" },
  };
  headerRow.font = { bold: true, color: { argb: "FFFFFFFF" } };

  rows.forEach((row) => sheet.addRow(row));
  sheet.autoFilter = {
    from: { row: 1, column: 1 },
    to:   { row: 1, column: EXPORT_COLUMNS.length },
  };

  const buffer = await workbook.xlsx.writeBuffer();
  saveAs(
    new Blob([buffer], { type: "application/octet-stream" }),
    "Products.xlsx"
  );
}

