import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";
import toast from "react-hot-toast";

import AdminNotificationBell from "../../pages/admin/AdminNotificationBell";
import { navLinkClass } from "../../utils/navLinkClass";
import CartNavLink from "./CartNavLink";
import AdminNav from "./AdminNav";

export default function MainLayout() {
  const { user, logout, isAuthenticated } = useAuth();
  const { count } = useCart();
  const navigate = useNavigate();

  const onLogout = async () => {
    await logout();
    toast.success("Logged out");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-slate-100">
      {/* HEADER */}
      <header className="bg-white/90 backdrop-blur border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">

          {/* LOGO */}
          <Link
            to={isAuthenticated ? "/products" : "/login"}
            className="font-extrabold text-xl"
          >
            Ecomm
          </Link>

          {/* NAVIGATION */}
          <nav className="flex items-center gap-2 text-sm">

            {isAuthenticated ? (
              <>
                {/* USER LINKS */}
                {user?.role !== "Admin" && (
                  <>
                    <NavLink to="/products" className={navLinkClass}>
                      Products
                    </NavLink>

                    <NavLink to="/addresses" className={navLinkClass}>
                      Addresses
                    </NavLink>

                    <NavLink to="/orders" className={navLinkClass}>
                      Orders
                    </NavLink>

                    <CartNavLink count={count} />
                  </>
                )}

                {/* PROFILE */}
                <NavLink to="/profile" className={navLinkClass}>
                  Profile
                </NavLink>

                {/* ADMIN LINKS */}
                {user?.role === "Admin" && <AdminNav />}
              </>
            ) : (
              <>
                <NavLink to="/login" className={navLinkClass}>
                  Login
                </NavLink>

                <NavLink to="/register" className={navLinkClass}>
                  Signup
                </NavLink>
              </>
            )}
          </nav>

          {/* RIGHT SIDE */}
          {isAuthenticated && (
            <div className="flex items-center gap-4">

              {user?.role === "Admin" && (
                <AdminNotificationBell />
              )}

              <span className="text-sm hidden md:inline">
                {user?.email}
              </span>

              <button
                onClick={onLogout}
                className="bg-black text-white px-3 py-1.5 rounded-md text-sm font-medium hover:opacity-90 transition"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </header>

      {/* CONTENT */}
      <main className="max-w-7xl mx-auto py-4">
        <Outlet />
      </main>
    </div>
  );
}