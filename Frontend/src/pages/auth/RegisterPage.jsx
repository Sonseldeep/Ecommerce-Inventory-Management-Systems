import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerApi } from "../../api/authApi";
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

const GROUP = "registerForm";

export default function RegisterPage() {
  const [form, setForm] = useState({ fullName: "", email: "", password: "" });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const submit = async (e) => {
    e?.preventDefault?.();
    const result = validationEngine.validateGroup(GROUP);
    if (!result?.isValid) return;

    setLoading(true);
    try {
      await registerApi(form);
      toast.success("Registered successfully. OTP sent to email.");
      navigate(`/verify-email?email=${encodeURIComponent(form.email)}`);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Register failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="form-header">
          <h1 className="form-title-plain">Create Account</h1>
          <p className="form-desc">Fill in the details below to get started.</p>
        </div>

        <ValidationGroup name={GROUP}>
          <form onSubmit={submit} className="fields">
            <div className="field-block">
              <label className="field-label">Full Name</label>
              <TextBox
                value={form.fullName}
                onValueChanged={(e) =>
                  setForm((s) => ({ ...s, fullName: e.value }))
                }
                placeholder="John Doe"
                stylingMode="outlined"
                width="100%"
              >
                <Validator validationGroup={GROUP}>
                  <RequiredRule message="Full name is required" />
                </Validator>
              </TextBox>
            </div>

            <div className="field-block">
              <label className="field-label">Email</label>
              <TextBox
                value={form.email}
                onValueChanged={(e) =>
                  setForm((s) => ({ ...s, email: e.value }))
                }
                placeholder="you@example.com"
                stylingMode="outlined"
                width="100%"
              >
                <Validator validationGroup={GROUP}>
                  <RequiredRule message="Email is required" />
                  <EmailRule message="Invalid email format" />
                </Validator>
              </TextBox>
            </div>

            <div className="field-block">
              <label className="field-label">Password</label>
              <div className="password-wrap">
                <TextBox
                  value={form.password}
                  onValueChanged={(e) =>
                    setForm((s) => ({ ...s, password: e.value }))
                  }
                  placeholder="••••••••"
                  mode={showPass ? "text" : "password"}
                  stylingMode="outlined"
                  width="100%"
                >
                  <Validator validationGroup={GROUP}>
                    <RequiredRule message="Password is required" />
                    <StringLengthRule min={6} message="At least 6 characters" />
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

            <div className="btn-block-plain">
              <Button
                text={loading ? "Creating account…" : "Create account"}
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

        <p className="auth-center-note" style={{ marginTop: "1.2rem" }}>
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
}

// import { useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { registerApi } from "../../api/authApi";
// import toast from "react-hot-toast";

// export default function RegisterPage() {
//   const [form, setForm] = useState({
//     fullName: "",
//     email: "",
//     password: "",
//   });

//   const [loading, setLoading] = useState(false);
//   const [showPassword, setShowPassword] = useState(false);

//   const navigate = useNavigate();

//   const submit = async (e) => {
//     e.preventDefault();

//     if (form.password.length < 6) {
//       return toast.error("Password must be at least 6 characters");
//     }

//     setLoading(true);
//     try {
//       await registerApi(form);
//       toast.success("Registered successfully. OTP sent to email.");

//       navigate(`/verify-email?email=${encodeURIComponent(form.email)}`);
//     } catch (e) {
//       toast.error(e?.response?.data?.message || "Register failed");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen grid place-items-center bg-gradient-to-br from-slate-100 to-gray-200 p-4">

//       <form
//         onSubmit={submit}
//         className="w-full max-w-md bg-white p-6 rounded-2xl shadow-xl space-y-5"
//       >
//         <h1 className="text-2xl font-bold text-center">Create Account</h1>

//         {/* FULL NAME */}
//         <input
//           className="w-full border p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
//           placeholder="Full Name"
//           value={form.fullName}
//           onChange={(e) =>
//             setForm((s) => ({ ...s, fullName: e.target.value }))
//           }
//           required
//         />

//         {/* EMAIL */}
//         <input
//           className="w-full border p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
//           placeholder="Email"
//           value={form.email}
//           onChange={(e) =>
//             setForm((s) => ({ ...s, email: e.target.value }))
//           }
//           required
//         />

//         {/* PASSWORD WITH TOGGLE */}
//         <div className="relative">
//           <input
//             type={showPassword ? "text" : "password"}
//             className="w-full border p-2 rounded-lg pr-10 focus:outline-none focus:ring-2 focus:ring-black"
//             placeholder="Password"
//             value={form.password}
//             onChange={(e) =>
//               setForm((s) => ({ ...s, password: e.target.value }))
//             }
//             required
//           />

//           <button
//             type="button"
//             onClick={() => setShowPassword(!showPassword)}
//             className="absolute right-3 top-2 text-gray-500"
//           >
//             {showPassword ? "🙈" : "👁️"}
//           </button>
//         </div>

//         {/* SUBMIT */}
//         <button
//           disabled={loading}
//           className="w-full bg-black text-white py-2 rounded-lg hover:bg-gray-900 transition disabled:opacity-60"
//         >
//           {loading ? "Creating account..." : "Create account"}
//         </button>

//         {/* LOGIN LINK */}
//         <p className="text-sm text-center">
//           Already have an account?{" "}
//           <Link className="text-blue-600 hover:underline" to="/login">
//             Login
//           </Link>
//         </p>
//       </form>
//     </div>
//   );
// }
