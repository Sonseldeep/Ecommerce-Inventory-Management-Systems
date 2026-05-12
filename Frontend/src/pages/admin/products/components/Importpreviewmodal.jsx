import { useState, useRef, useCallback } from "react";
import toast from "react-hot-toast";
import { importProductsApi } from "../../../../api/productApi";
import "./ImportPreviewModal.css";

// ── Lazy-load xlsx so a missing package gives a clear error ───────
async function loadXlsx() {
  try {
    const XLSX = await import("xlsx");
    return XLSX;
  } catch {
    throw new Error(
      'The "xlsx" package is not installed. Run: npm install xlsx',
    );
  }
}

// ── Column header aliases ──────────────────────────────────────────
const HEADER_MAP = {
  name: "name",
  "product name": "name",
  productname: "name",
  sku: "sku",
  description: "description",
  desc: "description",
  price: "price",
  "price (rs)": "price",
  "price(rs)": "price",
  "price (rs.)": "price",
  discountprice: "discountPrice",
  "discount price": "discountPrice",
  "discount price (rs)": "discountPrice",
  "discount (rs)": "discountPrice",
  "discount(rs)": "discountPrice",
  quantityinstock: "quantityInStock",
  "quantity in stock": "quantityInStock",
  stock: "quantityInStock",
  "stock qty": "quantityInStock",
  qty: "quantityInStock",
  reorderlevel: "reorderLevel",
  "reorder level": "reorderLevel",
  reorder: "reorderLevel",
  categoryname: "categoryName",
  "category name": "categoryName",
  category: "categoryName",
};

const PREVIEW_COLS = [
  { field: "name", label: "Product Name" },
  { field: "sku", label: "SKU" },
  { field: "description", label: "Description" },
  { field: "price", label: "Price (Rs)" },
  { field: "discountPrice", label: "Discount (Rs)" },
  { field: "quantityInStock", label: "Stock" },
  { field: "reorderLevel", label: "Reorder" },
  { field: "categoryName", label: "Category" },
];

const ACCEPTED_EXTS = ["xlsx", "xls"];

// ── Per-row validation ─────────────────────────────────────────────
function validateRow(row) {
  const errors = [];

  if (!row.name?.toString().trim()) errors.push("Name is required");

  if (!row.sku?.toString().trim()) errors.push("SKU is required");

  const price = row.price;
  if (price === undefined || price === null || price === "") {
    errors.push("Price is required");
  } else if (isNaN(Number(price)) || Number(price) < 0) {
    errors.push("Price must be a positive number");
  }

  if (
    row.discountPrice !== undefined &&
    row.discountPrice !== null &&
    row.discountPrice !== ""
  ) {
    if (isNaN(Number(row.discountPrice)) || Number(row.discountPrice) < 0)
      errors.push("Discount price must be ≥ 0");
  }

  if (row.quantityInStock !== undefined && row.quantityInStock !== "") {
    const qty = Number(row.quantityInStock);
    if (isNaN(qty) || qty < 0 || !Number.isInteger(qty))
      errors.push("Stock qty must be a non-negative integer");
  }

  if (row.reorderLevel !== undefined && row.reorderLevel !== "") {
    const rl = Number(row.reorderLevel);
    if (isNaN(rl) || rl < 0 || !Number.isInteger(rl))
      errors.push("Reorder level must be a non-negative integer");
  }

  return errors;
}

// ── Excel parser ───────────────────────────────────────────────────
async function parseExcel(file) {
  // Step 1 — load xlsx (throws with install hint if missing)
  const XLSX = await loadXlsx();

  // Step 2 — read file bytes
  const bytes = await file.arrayBuffer().catch(() => {
    throw new Error("Could not read the file — it may be corrupted or locked.");
  });

  // Step 3 — parse workbook
  let wb;
  try {
    wb = XLSX.read(new Uint8Array(bytes), { type: "array" });
  } catch (err) {
    throw new Error(
      `Excel parsing failed: ${err?.message ?? "unknown XLSX error"}`,
      { cause: err },
    );
  }

  if (!wb.SheetNames.length)
    throw new Error("The workbook contains no sheets.");

  const sheet = wb.Sheets[wb.SheetNames[0]];
  const rawRows = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: "" });

  if (rawRows.length === 0)
    throw new Error("The sheet is empty — no data found.");

  // Step 4 — normalise headers
  const rawHeaders = rawRows[0];
  const mappedHeaders = rawHeaders.map((h) => {
    const key = h.toString().trim().toLowerCase();
    return HEADER_MAP[key] ?? h.toString().trim();
  });

  const unmappedHeaders = rawHeaders
    .map((h) => h.toString().trim())
    .filter((h) => {
      const key = h.toLowerCase();
      return h && !HEADER_MAP[key];
    });

  // Step 5 — build row objects + validate
  const rows = rawRows
    .slice(1)
    .map((rawRow, idx) => {
      const row = { _excelRow: idx + 2 };
      mappedHeaders.forEach((header, ci) => {
        row[header] = rawRow[ci];
      });
      const errors = validateRow(row);
      return { ...row, _errors: errors, _hasError: errors.length > 0 };
    })
    .filter((row) =>
      PREVIEW_COLS.some(({ field }) => {
        const v = row[field];
        return v !== undefined && v !== null && v !== "";
      }),
    );

  if (rows.length === 0)
    throw new Error("No data rows found after the header row.");

  return { rows, unmappedHeaders };
}

// ══════════════════════════════════════════════════════════════════
export default function ImportPreviewModal({ onClose, onImportSuccess }) {
  const [file, setFile] = useState(null);
  const [fileError, setFileError] = useState("");
  const [preview, setPreview] = useState(null);
  const [parsing, setParsing] = useState(false);
  const [importing, setImporting] = useState(false);

  const inputRef = useRef(null);

  // ── File selection ───────────────────────────────────────────────
  const handleFileChange = useCallback(async (e) => {
    const selected = e.target.files?.[0];
    if (!selected) return;

    const ext = selected.name.split(".").pop().toLowerCase();

    if (!ACCEPTED_EXTS.includes(ext)) {
      setFileError(
        `Invalid file type ".${ext}". Only .xlsx or .xls files are allowed.`,
      );
      setFile(null);
      setPreview(null);
      if (inputRef.current) inputRef.current.value = "";
      return;
    }

    setFileError("");
    setFile(selected);
    setPreview(null);
    setParsing(true);

    const parseToastId = toast.loading("Parsing Excel file…");

    try {
      const result = await parseExcel(selected);
      setPreview(result);
      toast.success(
        `Parsed ${result.rows.length} row(s) — ${result.rows.filter((r) => r._hasError).length} error(s)`,
        { id: parseToastId },
      );
    } catch (err) {
      // Show the REAL error so the cause is immediately visible
      const message = err?.message ?? "Unknown parse error";
      console.error("[ImportPreviewModal] parse error:", err);
      toast.error(`❌ ${message}`, { id: parseToastId, duration: 6000 });

      setFile(null);
      setPreview(null);
      if (inputRef.current) inputRef.current.value = "";
    } finally {
      setParsing(false);
    }
  }, []);

  // ── Clear ────────────────────────────────────────────────────────
  const handleClear = useCallback(() => {
    setFile(null);
    setFileError("");
    setPreview(null);
    if (inputRef.current) inputRef.current.value = "";
  }, []);

  // ── Import (POST to API) ─────────────────────────────────────────
  const handleImport = useCallback(async () => {
    if (!file || !preview) return;

    const errorCount = preview.rows.filter((r) => r._hasError).length;
    if (errorCount > 0) {
      toast.error(
        `Fix ${errorCount} row error(s) in the file before importing.`,
      );
      return;
    }

    setImporting(true);
    const toastId = toast.loading("Importing products…");

    try {
      await importProductsApi(file);
      toast.success("Products imported successfully!", { id: toastId });
      onImportSuccess?.();
      onClose();
    } catch (err) {
      const msg =
        err?.response?.data?.message ??
        err?.response?.data?.error ??
        err?.message ??
        "Import failed — please try again.";
      console.error("[ImportPreviewModal] import error:", err);
      toast.error(`❌ ${msg}`, { id: toastId, duration: 6000 });
    } finally {
      setImporting(false);
    }
  }, [file, preview, onImportSuccess, onClose]);

  // ── Derived ──────────────────────────────────────────────────────
  const totalRows = preview?.rows.length ?? 0;
  const errorCount = preview?.rows.filter((r) => r._hasError).length ?? 0;
  const validCount = totalRows - errorCount;

  return (
    <div
      className="imp-backdrop"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="imp-container">
        {/* Header */}
        <div className="imp-header">
          <div>
            <h2 className="imp-title">Import Products</h2>
            <p className="imp-subtitle">
              Upload an Excel file to preview and import products in bulk.
            </p>
          </div>
          <button className="imp-close-btn" onClick={onClose}>
            ✕
          </button>
        </div>

        {/* Upload Zone */}
        <div className="imp-upload-zone">
          <div className="imp-upload-header">
            <label className="imp-label">Excel File *</label>
            {file && (
              <button
                type="button"
                className="imp-clear-btn"
                onClick={handleClear}
              >
                Clear
              </button>
            )}
          </div>

          <input
            ref={inputRef}
            type="file"
            accept=".xlsx,.xls,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel"
            onChange={handleFileChange}
            className="imp-file-input"
            disabled={parsing || importing}
          />
          <p className="imp-upload-hint">
            Only .xlsx or .xls files • Max 10 MB
          </p>

          {fileError && (
            <div className="imp-file-error-box">
              <span className="imp-file-error-icon">⚠</span>
              {fileError}
            </div>
          )}

          {file && !fileError && (
            <div className="imp-file-info">
              <span className="imp-file-icon">📄</span>
              <span className="imp-file-name">{file.name}</span>
              <span className="imp-file-size">
                ({(file.size / 1024).toFixed(1)} KB)
              </span>
            </div>
          )}
        </div>

        {/* Parsing */}
        {parsing && (
          <div className="imp-state-box">
            <span className="imp-spinner" />
            Parsing file…
          </div>
        )}

        {/* Preview */}
        {preview && !parsing && (
          <>
            <div className="imp-summary">
              <span className="imp-badge imp-badge--valid">
                ✓ {validCount} valid
              </span>
              {errorCount > 0 && (
                <span className="imp-badge imp-badge--error">
                  ✕ {errorCount} with errors
                </span>
              )}
              <span className="imp-badge imp-badge--total">
                {totalRows} rows total
              </span>
              {preview.unmappedHeaders?.length > 0 && (
                <span
                  className="imp-badge imp-badge--warn"
                  title={`Unrecognised: ${preview.unmappedHeaders.join(", ")}`}
                >
                  ⚠ {preview.unmappedHeaders.length} unknown column(s)
                </span>
              )}
            </div>

            {errorCount > 0 && (
              <div className="imp-error-hint">
                <strong>⚠ {errorCount} row(s) have errors</strong> — fix them in
                the Excel file and re-upload. Error rows are highlighted in red.
              </div>
            )}

            <div className="imp-table-wrapper">
              <table className="imp-table">
                <thead>
                  <tr>
                    <th className="imp-th imp-th--row">#</th>
                    {PREVIEW_COLS.map((col) => (
                      <th key={col.field} className="imp-th">
                        {col.label}
                      </th>
                    ))}
                    <th className="imp-th imp-th--errors">Errors</th>
                  </tr>
                </thead>
                <tbody>
                  {preview.rows.map((row, i) => (
                    <tr
                      key={i}
                      className={`imp-row ${row._hasError ? "imp-row--error" : "imp-row--valid"}`}
                    >
                      <td className="imp-td imp-td--row">{row._excelRow}</td>
                      {PREVIEW_COLS.map(({ field }) => (
                        <td key={field} className="imp-td">
                          {row[field] !== undefined && row[field] !== "" ? (
                            String(row[field])
                          ) : (
                            <span className="imp-empty">—</span>
                          )}
                        </td>
                      ))}
                      <td className="imp-td imp-td--errors">
                        {row._hasError ? (
                          <ul className="imp-error-list">
                            {row._errors.map((err, ei) => (
                              <li key={ei}>{err}</li>
                            ))}
                          </ul>
                        ) : (
                          <span className="imp-empty">—</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {/* Actions */}
        <div className="imp-actions">
          {preview && !parsing && errorCount === 0 && totalRows > 0 && (
            <button
              className="imp-btn imp-btn--import"
              onClick={handleImport}
              disabled={importing}
            >
              {importing
                ? "Importing…"
                : `Import ${totalRows} Product${totalRows !== 1 ? "s" : ""}`}
            </button>
          )}
          <button
            className="imp-btn imp-btn--cancel"
            onClick={onClose}
            disabled={importing}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
