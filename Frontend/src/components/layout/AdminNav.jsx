// import { Link } from "react-router-dom";

// export default function AdminNav() {
//   return (
//     <nav className="bg-white border-b px-6 py-3 flex gap-4">
//       <Link to="/admin" className="text-sm font-medium">Dashboard</Link>
//       <Link to="/admin/categories" className="text-sm font-medium">Categories</Link>
//       <Link to="/admin/products" className="text-sm font-medium">Products</Link>
//       <Link to="/admin/orders" className="text-sm font-medium">Orders</Link>
//     </nav>
//   );
// }


import { NavLink } from "react-router-dom";

export default function AdminNav() {
  const baseStyle = {
    fontSize: "13px",
    fontWeight: 600,
    padding: "8px 12px",
    borderRadius: 10,
    textDecoration: "none",
    transition: "all 0.2s ease",
    border: "1px solid transparent",
  };

  return (
    <nav className="bg-white border-b px-6 py-3 flex gap-2">
      <NavLink
        to="/admin/dashboard"
        style={({ isActive }) => ({
          ...baseStyle,
          color: isActive ? "#111" : "#6b7280",
          background: isActive ? "#f3f4f6" : "transparent",
          border: isActive ? "1px solid #d1d5db" : "1px solid transparent",
        })}
      >
        Dashboard
      </NavLink>

      <NavLink
        to="/admin/categories"
        style={({ isActive }) => ({
          ...baseStyle,
          color: isActive ? "#111" : "#6b7280",
          background: isActive ? "#f3f4f6" : "transparent",
          border: isActive ? "1px solid #d1d5db" : "1px solid transparent",
        })}
      >
        Categories
      </NavLink>

      <NavLink
        to="/admin/products"
        style={({ isActive }) => ({
          ...baseStyle,
          color: isActive ? "#111" : "#6b7280",
          background: isActive ? "#f3f4f6" : "transparent",
          border: isActive ? "1px solid #d1d5db" : "1px solid transparent",
        })}
      >
        Products
      </NavLink>

      <NavLink
        to="/admin/orders"
        style={({ isActive }) => ({
          ...baseStyle,
          color: isActive ? "#111" : "#6b7280",
          background: isActive ? "#f3f4f6" : "transparent",
          border: isActive ? "1px solid #d1d5db" : "1px solid transparent",
        })}
      >
        Orders
      </NavLink>
    </nav>
  );
}