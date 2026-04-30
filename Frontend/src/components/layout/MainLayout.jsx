

// import { Link, Outlet, useNavigate } from "react-router-dom";
// import { useAuth } from "../../context/AuthContext";
// import { useCart } from "../../context/CartContext";
// import toast from "react-hot-toast";
// import AdminNotificationBell from "../../pages/admin/AdminNotificationBell";

// // 🔔 Admin notification bell

// export default function MainLayout() {
//   const { user, logout, isAuthenticated } = useAuth();
//   const { count } = useCart();
//   const navigate = useNavigate();

//   const onLogout = async () => {
//     await logout();
//     toast.success("Logged out");
//     navigate("/login");
//   };

//   return (
//     <div className="min-h-screen bg-slate-100">
//       {/* HEADER */}
//       <header className="bg-white/90 backdrop-blur border-b sticky top-0 z-50">
//         <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">

//           {/* LOGO */}
//           <Link
//             to={isAuthenticated ? "/dashboard" : "/login"}
//             className="font-extrabold text-xl"
//           >
//             Ecomm
//           </Link>

//           {/* NAVIGATION */}
//           <nav className="flex items-center gap-4 text-sm">
//             {isAuthenticated ? (
//               <>
//                 <Link to="/dashboard">Products</Link>
//                 <Link to="/addresses">Addresses</Link>
//                 <Link to="/orders">Orders</Link>

//                 {/* CART */}
//                 <Link to="/cart" className="relative">
//                   Cart
//                   {count > 0 && (
//                     <span className="absolute -top-2 -right-3 bg-red-500 text-white text-xs rounded-full px-1.5">
//                       {count}
//                     </span>
//                   )}
//                 </Link>

//                 <Link to="/profile">Profile</Link>

//                 {/* ADMIN LINKS */}
//                 {user?.role === "Admin" && (
//                   <>
//                     <span className="text-gray-300">|</span>
//                     <Link to="/admin/dashboard">Admin</Link>
//                     <Link to="/admin/categories">Categories</Link>
//                     <Link to="/admin/products">Products</Link>
//                     <Link to="/admin/orders">Orders</Link>
//                   </>
//                 )}
//               </>
//             ) : (
//               <>
//                 <Link to="/login">Login</Link>
//                 <Link to="/register">Signup</Link>
//               </>
//             )}
//           </nav>

//           {/* RIGHT SIDE (USER + NOTIFICATION + LOGOUT) */}
//           {isAuthenticated && (
//             <div className="flex items-center gap-4">

//               {/* 🔔 ADMIN NOTIFICATION BELL (ONLY ADMIN) */}
//               {user?.role === "Admin" && (
//                 <AdminNotificationBell />
//               )}

//               {/* USER EMAIL */}
//               <span className="text-sm hidden md:inline">
//                 {user?.email}
//               </span>

//               {/* LOGOUT */}
//               <button
//                 onClick={onLogout}
//                 className="bg-black text-white px-3 py-1.5 rounded"
//               >
//                 Logout
//               </button>
//             </div>
//           )}
//         </div>
//       </header>

//       {/* PAGE CONTENT */}
//       <main className="max-w-7xl mx-auto py-4">
//         <Outlet />
//       </main>
//     </div>
//   );
// }




import { Link, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";
import toast from "react-hot-toast";
import AdminNotificationBell from "../../pages/admin/AdminNotificationBell";

// 🔔 Admin notification bell

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
          <nav className="flex items-center gap-4 text-sm">
            {isAuthenticated ? (
              <>
                <Link to="/products">Products</Link>
                <Link to="/addresses">Addresses</Link>
                <Link to="/orders">Orders</Link>

                {/* CART */}
                <Link to="/cart" className="relative">
                  Cart
                  {count > 0 && (
                    <span className="absolute -top-2 -right-3 bg-red-500 text-white text-xs rounded-full px-1.5">
                      {count}
                    </span>
                  )}
                </Link>

                <Link to="/profile">Profile</Link>

                {/* ADMIN LINKS */}
                {user?.role === "Admin" && (
                  <>
                    <span className="text-gray-300">|</span>
                    <Link to="/admin/dashboard">Admin</Link>
                    <Link to="/admin/categories">Categories</Link>
                    <Link to="/admin/products">Products</Link>
                    <Link to="/admin/orders">Orders</Link>
                  </>
                )}
              </>
            ) : (
              <>
                <Link to="/login">Login</Link>
                <Link to="/register">Signup</Link>
              </>
            )}
          </nav>

          {/* RIGHT SIDE (USER + NOTIFICATION + LOGOUT) */}
          {isAuthenticated && (
            <div className="flex items-center gap-4">

              {/* 🔔 ADMIN NOTIFICATION BELL (ONLY ADMIN) */}
              {user?.role === "Admin" && (
                <AdminNotificationBell />
              )}

              {/* USER EMAIL */}
              <span className="text-sm hidden md:inline">
                {user?.email}
              </span>

              {/* LOGOUT */}
              <button
                onClick={onLogout}
                className="bg-black text-white px-3 py-1.5 rounded"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </header>

      {/* PAGE CONTENT */}
      <main className="max-w-7xl mx-auto py-4">
        <Outlet />
      </main>
    </div>
  );
}