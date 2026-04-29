



// import { useEffect, useState } from "react";
// import toast from "react-hot-toast";
// import { getMyProfileApi } from "../../api/userApi";
// import { changePasswordApi } from "../../api/authApi";

// export default function UserProfilePage() {
//   const [profile, setProfile] = useState(null);
//   const [loading, setLoading] = useState(true);

//   const [currentPassword, setCurrentPassword] = useState("");
//   const [newPassword, setNewPassword] = useState("");
//   const [confirmPassword, setConfirmPassword] = useState("");

//   useEffect(() => {
//     (async () => {
//       try {
//         const res = await getMyProfileApi();
//         setProfile(res.data?.data);
//       // eslint-disable-next-line no-unused-vars
//       } catch (e) {
//         toast.error("Failed to load profile");
//       } finally {
//         setLoading(false);
//       }
//     })();
//   }, []);

//   const changePassword = async (e) => {
//     e.preventDefault();
//     if (newPassword !== confirmPassword) return toast.error("Passwords do not match");
//     try {
//       await changePasswordApi({ currentPassword, newPassword, confirmPassword });
//       toast.success("Password changed");
//       setCurrentPassword("");
//       setNewPassword("");
//       setConfirmPassword("");
//     } catch (e) {
//       toast.error(e?.response?.data?.message || "Change password failed");
//     }
//   };

//   if (loading) return <div className="p-6">Loading...</div>;

//   return (
//     <div className="p-6 max-w-4xl mx-auto space-y-6">
//       <h1 className="text-3xl font-bold">My Profile</h1>

//       <div className="bg-white rounded-2xl shadow p-6 flex flex-col md:flex-row gap-6">
//         <div className="flex-1 space-y-2">
//           <p className="text-sm text-gray-500">Full Name</p>
//           <p className="text-lg font-semibold">{profile?.fullName}</p>

//           <p className="text-sm text-gray-500 mt-4">Email</p>
//           <p className="text-lg font-semibold">{profile?.email}</p>

//           <p className="text-sm text-gray-500 mt-4">Role</p>
//           <p className="text-lg font-semibold">{profile?.role}</p>
//         </div>

//         <div className="flex-1 bg-gray-50 p-4 rounded-xl">
//           <p className="text-sm text-gray-500">Email Status</p>
//           <p className={`text-lg font-semibold ${profile?.isEmailVerified ? "text-green-600" : "text-red-600"}`}>
//             {profile?.isEmailVerified ? "Verified" : "Not Verified"}
//           </p>
//         </div>
//       </div>

//       <form onSubmit={changePassword} className="bg-white rounded-2xl shadow p-6 space-y-3">
//         <h2 className="text-xl font-semibold">Change Password</h2>
//         <input type="password" className="w-full border p-2 rounded" placeholder="Current password"
//           value={currentPassword} onChange={(e)=>setCurrentPassword(e.target.value)} required />
//         <input type="password" className="w-full border p-2 rounded" placeholder="New password"
//           value={newPassword} onChange={(e)=>setNewPassword(e.target.value)} required />
//         <input type="password" className="w-full border p-2 rounded" placeholder="Confirm new password"
//           value={confirmPassword} onChange={(e)=>setConfirmPassword(e.target.value)} required />

//         <button className="bg-black text-white px-4 py-2 rounded-lg">Update Password</button>
//       </form>
//     </div>
//   );
// }

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { getMyProfileApi } from "../../api/userApi";
import { changePasswordApi } from "../../api/authApi";

export default function UserProfilePage() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // 👁️ password visibility states
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const res = await getMyProfileApi();
        setProfile(res.data?.data);
      } catch {
        toast.error("Failed to load profile");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const changePassword = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword)
      return toast.error("Passwords do not match");

    if (newPassword.length < 6)
      return toast.error("Password must be at least 6 characters");

    try {
      await changePasswordApi({
        currentPassword,
        newPassword,
        confirmPassword,
      });

      toast.success("Password changed successfully");

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (e) {
      toast.error(e?.response?.data?.message || "Change password failed");
    }
  };

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">

      {/* TITLE */}
      <h1 className="text-3xl font-bold">My Profile</h1>

      {/* PROFILE CARD */}
      <div className="bg-white rounded-2xl shadow-sm border p-6 grid md:grid-cols-2 gap-6">

        {/* LEFT INFO */}
        <div className="space-y-4">
          <div>
            <p className="text-sm text-gray-500">Full Name</p>
            <p className="text-lg font-semibold">{profile?.fullName}</p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Email</p>
            <p className="text-lg font-semibold">{profile?.email}</p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Role</p>
            <p className="text-lg font-semibold">{profile?.role}</p>
          </div>
        </div>

        {/* RIGHT STATUS */}
        <div className="bg-gray-50 border rounded-xl p-4">
          <p className="text-sm text-gray-500">Email Status</p>
          <p
            className={`text-lg font-semibold ${
              profile?.isEmailVerified ? "text-green-600" : "text-red-600"
            }`}
          >
            {profile?.isEmailVerified ? "Verified" : "Not Verified"}
          </p>
        </div>
      </div>

      {/* CHANGE PASSWORD */}
      <form
        onSubmit={changePassword}
        className="bg-white rounded-2xl shadow-sm border p-6 space-y-4"
      >
        <h2 className="text-xl font-semibold">Change Password</h2>

        {/* Current Password */}
        <div className="relative">
          <input
            type={showCurrent ? "text" : "password"}
            className="w-full border p-2 rounded pr-10"
            placeholder="Current password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            required
          />
          <button
            type="button"
            onClick={() => setShowCurrent(!showCurrent)}
            className="absolute right-3 top-2 text-gray-500"
          >
            {showCurrent ? "🙈" : "👁️"}
          </button>
        </div>

        {/* New Password */}
        <div className="relative">
          <input
            type={showNew ? "text" : "password"}
            className="w-full border p-2 rounded pr-10"
            placeholder="New password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
          <button
            type="button"
            onClick={() => setShowNew(!showNew)}
            className="absolute right-3 top-2 text-gray-500"
          >
            {showNew ? "🙈" : "👁️"}
          </button>
        </div>

        {/* Confirm Password */}
        <div className="relative">
          <input
            type={showConfirm ? "text" : "password"}
            className="w-full border p-2 rounded pr-10"
            placeholder="Confirm new password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          <button
            type="button"
            onClick={() => setShowConfirm(!showConfirm)}
            className="absolute right-3 top-2 text-gray-500"
          >
            {showConfirm ? "🙈" : "👁️"}
          </button>
        </div>

        {/* BUTTON */}
        <button className="w-full bg-black text-white py-2 rounded-lg hover:bg-gray-900 transition">
          Update Password
        </button>
      </form>
    </div>
  );
}