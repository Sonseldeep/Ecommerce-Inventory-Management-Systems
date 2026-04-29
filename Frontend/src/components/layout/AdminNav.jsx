import { Link } from "react-router-dom";

export default function AdminNav() {
  return (
    <nav className="bg-white border-b px-6 py-3 flex gap-4">
      <Link to="/admin" className="text-sm font-medium">Dashboard</Link>
      <Link to="/admin/categories" className="text-sm font-medium">Categories</Link>
      <Link to="/admin/products" className="text-sm font-medium">Products</Link>
      <Link to="/admin/orders" className="text-sm font-medium">Orders</Link>
    </nav>
  );
}