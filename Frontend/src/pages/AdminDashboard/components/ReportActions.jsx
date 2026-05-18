

export default function ReportActions({
  fromDate,
  toDate,
  onChangeFrom,
  onChangeTo,
  onExport
}) {
  return (
    <div className="report-actions card">
      <div className="report-actions__header">
        <div>
          <h3 className="card-title">Reports</h3>
          <p className="text-muted">Export professional Excel reports with date filters.</p>
        </div>

        <div className="report-actions__controls">
          <div className="date-field">
            <label>From</label>
            <input type="date" value={fromDate} onChange={(e) => onChangeFrom(e.target.value)} />
          </div>
          <div className="date-field">
            <label>To</label>
            <input type="date" value={toDate} onChange={(e) => onChangeTo(e.target.value)} />
          </div>

          <button className="btn-primary" onClick={() => onExport("inventory-pack")}>
            Export Inventory Pack
          </button>
        </div>
      </div>

      <div className="report-actions__grid">
        <button className="btn-outline" onClick={() => onExport("inventory-summary")}>Inventory Summary</button>
        <button className="btn-outline" onClick={() => onExport("low-stock")}>Low Stock</button>
        <button className="btn-outline" onClick={() => onExport("out-of-stock")}>Out Of Stock</button>
        <button className="btn-outline" onClick={() => onExport("best-selling")}>Best Selling</button>
        <button className="btn-outline" onClick={() => onExport("non-selling")}>Non Selling</button>
        <button className="btn-outline" onClick={() => onExport("category-stock")}>Category Stock</button>
        <button className="btn-outline" onClick={() => onExport("top-buyers")}>Top Buyers</button>
        <button className="btn-outline" onClick={() => onExport("sales-summary")}>Sales Summary</button>
        <button className="btn-outline" onClick={() => onExport("category-inventory")}>
          Category Wise
        </button>
      </div>
    </div>
  );
}




// const REPORT_BUTTONS = [
//   { key: "inventory-summary", label: "Inventory Summary" },
//   { key: "low-stock", label: "Low Stock" },
//   { key: "out-of-stock", label: "Out Of Stock" },
//   { key: "best-selling", label: "Best Selling" },
//   { key: "non-selling", label: "Non Selling" },
//   { key: "category-stock", label: "Category Stock" },
//   { key: "top-buyers", label: "Top Buyers" },
//   { key: "sales-summary", label: "Sales Summary" },
//   { key: "category-inventory", label: "Category Wise" },
// ];

// export default function ReportActions({
//   fromDate,
//   toDate,
//   onChangeFrom,
//   onChangeTo,
//   onExport,
// }) {
//   return (
//     <div className="report-actions card">
//       {/* HEADER */}
//       <div className="report-actions__header">
//         <div>
//           <h3 className="card-title">Reports</h3>
//           <p className="text-muted">
//             Export professional Excel reports with date filters.
//           </p>
//         </div>

//         {/* DATE CONTROLS */}
//         <div className="report-actions__controls">
//           <div className="date-field">
//             <label>From</label>
//             <input
//               type="date"
//               value={fromDate}
//               onChange={(e) => onChangeFrom(e.target.value)}
//             />
//           </div>

//           <div className="date-field">
//             <label>To</label>
//             <input
//               type="date"
//               value={toDate}
//               onChange={(e) => onChangeTo(e.target.value)}
//             />
//           </div>

//           <button
//             className="btn-primary"
//             onClick={() => onExport("inventory-pack")}
//           >
//             Export Inventory Pack
//           </button>
//         </div>
//       </div>

//       {/* REPORT BUTTON GRID */}
//       <div className="report-actions__grid">
//         {REPORT_BUTTONS.map((report) => (
//           <button
//             key={report.key}
//             className="btn-outline"
//             onClick={() => onExport(report.key)}
//           >
//             {report.label}
//           </button>
//         ))}
//       </div>
//     </div>
//   );
// }