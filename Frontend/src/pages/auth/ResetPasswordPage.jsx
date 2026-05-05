// import { useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { forgotPasswordApi } from "../../api/authApi";
// import toast from "react-hot-toast";

// import TextBox from "devextreme-react/text-box";
// import Button from "devextreme-react/button";
// import ValidationGroup from "devextreme-react/validation-group";
// import Validator, { RequiredRule, EmailRule } from "devextreme-react/validator";
// import validationEngine from "devextreme/ui/validation_engine";

// import "./auth.css";

// const GROUP = "forgotForm";

// export default function ForgotPasswordPage() {
//   const [email, setEmail]   = useState("");
//   const [loading, setLoading] = useState(false);
//   const navigate = useNavigate();

//   const submit = async (e) => {
//     e?.preventDefault?.();
//     const result = validationEngine.validateGroup(GROUP);
//     if (!result?.isValid) return;

//     setLoading(true);
//     try {
//       await forgotPasswordApi(email);
//       toast.success("If account exists, reset token sent to email.");
//       navigate(`/reset-password?email=${encodeURIComponent(email)}`);
//     } catch (err) {
//       toast.error(err?.response?.data?.message || "Failed");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="auth-page">
//       <div className="auth-card">

//         <div className="form-header">
//           <h1 className="form-title-plain">Forgot Password</h1>
//           <p className="form-desc">
//             Enter your email and we'll send a reset token to your mailbox.
//           </p>
//         </div>

//         <ValidationGroup name={GROUP}>
//           <form onSubmit={submit} className="fields">

//             <div className="field-block">
//               <label className="field-label">Email address</label>
//               <TextBox
//                 value={email}
//                 onValueChanged={(e) => setEmail(e.value)}
//                 placeholder="you@example.com"
//                 stylingMode="outlined"
//                 width="100%"
//               >
//                 <Validator validationGroup={GROUP}>
//                   <RequiredRule message="Email is required" />
//                   <EmailRule   message="Invalid email format" />
//                 </Validator>
//               </TextBox>
//             </div>

//             <div className="btn-block-plain">
//               <Button
//                 text={loading ? "Sending…" : "Send reset token"}
//                 type="default"
//                 stylingMode="contained"
//                 width="100%"
//                 height={44}
//                 useSubmitBehavior={true}
//                 disabled={loading}
//                 validationGroup={GROUP}
//               />
//             </div>

//           </form>
//         </ValidationGroup>

//         <div className="auth-links-row">
//           <Link className="auth-link" to="/login">Back to login</Link>
//           <Link className="auth-link" to="/reset-password">Already have token?</Link>
//         </div>

//       </div>
//     </div>
//   );
// }











import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import { resetPasswordApi } from "../../api/authApi";

export default function ResetPasswordPage() {
  const [sp] = useSearchParams();
  const navigate = useNavigate();

  const [email, setEmail] = useState(sp.get("email") || "");
  const [token, setToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword)
      return toast.error("Passwords do not match");

    if (newPassword.length < 6)
      return toast.error("Password must be at least 6 characters");

    setLoading(true);
    try {
      await resetPasswordApi({
        email,
        token,
        newPassword,
        confirmPassword,
      });

      toast.success("Password reset successfully");
      navigate("/login");
    } catch (e) {
      toast.error(e?.response?.data?.message || "Reset failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid place-items-center bg-gradient-to-br from-slate-100 to-gray-200 px-4">

      <form
        onSubmit={submit}
        className="w-full max-w-md bg-white p-6 rounded-2xl shadow-xl space-y-5"
      >
        <h1 className="text-2xl font-bold text-center">
          Reset Password
        </h1>

        {/* EMAIL */}
        <input
          className="w-full border p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        {/* TOKEN */}
        <textarea
          className="w-full border p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
          placeholder="Paste reset token from email"
          value={token}
          onChange={(e) => setToken(e.target.value)}
          rows={3}
          required
        />

        {/* NEW PASSWORD */}
        <div className="relative">
          <input
            type={showNew ? "text" : "password"}
            className="w-full border p-2 rounded-lg pr-10 focus:outline-none focus:ring-2 focus:ring-black"
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

        {/* CONFIRM PASSWORD */}
        <div className="relative">
          <input
            type={showConfirm ? "text" : "password"}
            className="w-full border p-2 rounded-lg pr-10 focus:outline-none focus:ring-2 focus:ring-black"
            placeholder="Confirm password"
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

        {/* SUBMIT */}
        <button
          disabled={loading}
          className="w-full bg-black text-white py-2 rounded-lg hover:bg-gray-900 transition disabled:opacity-60"
        >
          {loading ? "Resetting..." : "Reset password"}
        </button>

        {/* LINKS */}
        <div className="flex items-center justify-between text-sm">
          <Link className="text-blue-600 hover:underline" to="/forgot-password">
            Resend token
          </Link>
          <Link className="text-blue-600 hover:underline" to="/login">
            Back to login
          </Link>
        </div>
      </form>
    </div>
  );
}