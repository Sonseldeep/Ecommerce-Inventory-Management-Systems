import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";

import TextBox from "devextreme-react/text-box";
import Button from "devextreme-react/button";
import ValidationGroup from "devextreme-react/validation-group";
import Validator, {
  RequiredRule,
  EmailRule,
  StringLengthRule,
} from "devextreme-react/validator";
import validationEngine from "devextreme/ui/validation_engine";

import "./auth.css";

// ─── Eye icons ───────────────────────────────────────────────────────────────
const EyeIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const EyeOffIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
    <line x1="1" y1="1" x2="23" y2="23" />
  </svg>
);

const GROUP = "loginForm";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const submit = async (e) => {
    e?.preventDefault?.();
    const result = validationEngine.validateGroup(GROUP);
    if (!result?.isValid) return;

    setLoading(true);
    try {
      const user = await login({ email, password });
      toast.success("Welcome back");
      navigate(
        (user?.role || "").toLowerCase() === "admin"
          ? "/admin/dashboard"
          : "/products",
      );
    } catch (err) {
      const msg =
        err?.response?.data?.detail ||
        err?.response?.data?.message ||
        "Login failed";
      toast.error(msg);
      if (msg.toLowerCase().includes("verify"))
        navigate(`/verify-email?email=${encodeURIComponent(email)}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-root">
      {/* ── Left branding panel ── */}
      <div className="login-left">
        <div className="grid-bg" />
        <div className="left-content">
          <div className="brand-box">
            <span>A</span>
          </div>
          <h2 className="left-headline">
            Your work,
            <br />
            <em>beautifully</em>
            <br />
            managed.
          </h2>
          <p className="left-sub">
            Sign in to access your dashboard, manage products, and stay in sync
            with your team.
          </p>
        </div>
        <div className="left-footer">
          <div className="left-footer-rule" />
          <p>© {new Date().getFullYear()} · All rights reserved</p>
        </div>
      </div>

      {/* ── Right form panel ── */}
      <div className="login-right">
        <div className="form-inner">
          <div className="form-header">
            <p className="form-eyebrow">Welcome back</p>
            <h1 className="form-title">Sign in</h1>
            <p className="form-desc">Enter your credentials to continue.</p>
          </div>

          <ValidationGroup name={GROUP}>
            <form onSubmit={submit} className="fields">
              <div className="field-block">
                <label className="field-label">Email address</label>
                <TextBox
                  value={email}
                  onValueChanged={(e) => setEmail(e.value)}
                  placeholder="you@example.com"
                  stylingMode="outlined"
                  width="100%"
                >
                  <Validator validationGroup={GROUP}>
                    <RequiredRule message="Email is required" />
                    <EmailRule message="Enter a valid email" />
                  </Validator>
                </TextBox>
              </div>

              <div className="field-block">
                <label className="field-label">Password</label>
                <div className="password-wrap">
                  <TextBox
                    value={password}
                    onValueChanged={(e) => setPassword(e.value)}
                    placeholder="••••••••"
                    mode={showPass ? "text" : "password"}
                    stylingMode="outlined"
                    width="100%"
                  >
                    <Validator validationGroup={GROUP}>
                      <RequiredRule message="Password is required" />
                      <StringLengthRule
                        min={6}
                        message="At least 6 characters"
                      />
                    </Validator>
                  </TextBox>
                  <button
                    type="button"
                    className="eye-toggle"
                    onClick={() => setShowPass((v) => !v)}
                    tabIndex={-1}
                    aria-label={showPass ? "Hide password" : "Show password"}
                  >
                    {showPass ? <EyeOffIcon /> : <EyeIcon />}
                  </button>
                </div>
              </div>

              <div className="btn-block">
                <Button
                  text={loading ? "Signing in…" : "Sign in"}
                  type="default"
                  stylingMode="contained"
                  width="100%"
                  height={44}
                  useSubmitBehavior={true}
                  disabled={loading}
                  validationGroup={GROUP}
                />
              </div>
            </form>
          </ValidationGroup>

          <div className="form-footer">
            <Link to="/register">Create account</Link>
            <div className="footer-sep" />
            <Link to="/forgot-password">Forgot password?</Link>
          </div>

          <p className="otp-note">
            Didn't receive OTP?{" "}
            <Link to={`/verify-email?email=${encodeURIComponent(email || "")}`}>
              Verify email
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

// import { useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { useAuth } from "../../context/AuthContext";
// import toast from "react-hot-toast";

// export default function LoginPage() {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [showPassword, setShowPassword] = useState(false);

//   const { login } = useAuth();
//   const navigate = useNavigate();

//   const submit = async (e) => {
//     e.preventDefault();

//     // basic validation
//     if (!email || !password) {
//       toast.error("Email and password are required");
//       return;
//     }

//     try {
//       const user = await login({ email, password });

//       toast.success("Login successful");

//       // role-based redirect (frontend only for UX)
//       const role = (user?.role || "").toLowerCase();

//       if (role === "admin") {
//         navigate("/admin/dashboard");
//       } else {
//         navigate("/products"); // fixed (was /dashboard)
//       }
//     } catch (e) {
//       const msg =
//         e?.response?.data?.detail ||
//         e?.response?.data?.message ||
//         "Login failed";

//       toast.error(msg);

//       // redirect to email verification if needed
//       if (msg.toLowerCase().includes("verify")) {
//         navigate(`/verify-email?email=${encodeURIComponent(email)}`);
//       }
//     }
//   };

//   return (
//     <div className="min-h-screen grid place-items-center bg-gradient-to-br from-slate-100 to-gray-200">
//       <form
//         onSubmit={submit}
//         className="w-full max-w-md bg-white p-6 rounded-2xl shadow-xl space-y-4"
//       >
//         <h1 className="text-2xl font-bold">Login</h1>

//         {/* Email */}
//         <input
//           className="w-full border p-2 rounded-lg"
//           placeholder="Email"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//         />

//         {/* Password */}
//         <div className="relative">
//           <input
//             type={showPassword ? "text" : "password"}
//             className="w-full border p-2 rounded-lg pr-10"
//             placeholder="Password"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//           />

//           <button
//             type="button"
//             onClick={() => setShowPassword((prev) => !prev)}
//             className="absolute right-3 top-2.5 text-gray-500"
//           >
//             {showPassword ? "🙈" : "👁️"}
//           </button>
//         </div>

//         {/* Submit */}
//         <button className="w-full bg-black text-white py-2 rounded-lg">
//           Sign in
//         </button>

//         {/* Links */}
//         <div className="flex items-center justify-between text-sm">
//           <Link className="text-blue-600" to="/register">
//             Sign up
//           </Link>
//           <Link className="text-blue-600" to="/forgot-password">
//             Forgot password?
//           </Link>
//         </div>

//         {/* OTP hint */}
//         <p className="text-xs text-gray-500">
//           Didn’t receive OTP?{" "}
//           <Link
//             className="text-blue-600"
//             to={`/verify-email?email=${encodeURIComponent(email || "")}`}
//           >
//             Verify email
//           </Link>
//         </p>
//       </form>
//     </div>
//   );
// }
