


// import { useContext, useState } from "react";
// import toast from "react-hot-toast";
// import { changePasswordApi } from "../../api/authApi";
// // import { useAuth } from "../../context/AuthContext";
// import { AuthProvider } from "../../context/AuthContext";
// import { useNavigate } from "react-router-dom";
// export default function ChangePasswordPage() {
//   const { logout } = useContext(AuthProvider); // get logout from context to trigger cross-tab logout on password change
//   const [currentPassword, setCurrentPassword] = useState("");
//   const [newPassword, setNewPassword] = useState("");
//   const [confirmPassword, setConfirmPassword] = useState("");
//   const [loading, setLoading] = useState(false);
//   const navigate = useNavigate();
  
//   const submit = async (e) => {
//     e.preventDefault();
//     if (newPassword !== confirmPassword) return toast.error("Passwords do not match");

//     setLoading(true);
//     try {
//       await changePasswordApi({ currentPassword, newPassword, confirmPassword });
//       toast.success("Password changed successfully");
//       logout(); // ✅ instant logout — clears state + notifies all tabs
//       navigate("/login", { replace: true }); // ✅ navigate to login, ensures no stale state issues
//     } catch (err) {
//       toast.error(err?.response?.data?.message || "Change password failed");
//       setLoading(false); // only reset if failed, logout handles the rest on success
//     }
//   };

//   return (
//     <div className="p-6 max-w-xl space-y-4">
//       <h1 className="text-3xl font-bold">Change Password</h1>

//       <form onSubmit={submit} className="bg-white rounded-2xl shadow p-4 space-y-3">
//         <input
//           type="password"
//           className="w-full border p-2 rounded-lg"
//           placeholder="Current password"
//           value={currentPassword}
//           onChange={(e) => setCurrentPassword(e.target.value)}
//           required
//         />
//         <input
//           type="password"
//           className="w-full border p-2 rounded-lg"
//           placeholder="New password"
//           value={newPassword}
//           onChange={(e) => setNewPassword(e.target.value)}
//           required
//         />
//         <input
//           type="password"
//           className="w-full border p-2 rounded-lg"
//           placeholder="Confirm new password"
//           value={confirmPassword}
//           onChange={(e) => setConfirmPassword(e.target.value)}
//           required
//         />

//         <button
//           disabled={loading}
//           className="bg-black text-white px-4 py-2 rounded-lg disabled:opacity-60"
//         >
//           {loading ? "Saving..." : "Change password"}
//         </button>
//       </form>
//     </div>
//   );
// }


import { useState } from "react";
import toast from "react-hot-toast";
import { changePasswordApi } from "../../api/authApi";
import { useAuth } from "../../context/AuthContext";

export default function ChangePasswordPage() {
  // Use the hook you exported at the bottom of AuthContext.js
  const { logout } = useAuth();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      return toast.error("Passwords do not match");
    }

    setLoading(true);
    try {
      await changePasswordApi({ currentPassword, newPassword, confirmPassword });
      
      toast.success("Password changed successfully");


      logout(); 

    } catch (err) {
      toast.error(err?.response?.data?.message || "Change password failed");
      setLoading(false); 
    }
  };

  return (
    <div className="p-6 max-w-xl space-y-4">
      <h1 className="text-3xl font-bold">Change Password</h1>

      <form onSubmit={submit} className="bg-white rounded-2xl shadow p-4 space-y-3">
        <input
          type="password"
          className="w-full border p-2 rounded-lg"
          placeholder="Current password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          required
        />
        <input
          type="password"
          className="w-full border p-2 rounded-lg"
          placeholder="New password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
        />
        <input
          type="password"
          className="w-full border p-2 rounded-lg"
          placeholder="Confirm new password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />

        <button
          disabled={loading}
          className="w-full bg-black text-white px-4 py-2 rounded-lg disabled:opacity-60"
        >
          {loading ? "Saving..." : "Change password"}
        </button>
      </form>
    </div>
  );
}

