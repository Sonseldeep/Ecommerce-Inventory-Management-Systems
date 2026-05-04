import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { sendVerificationOtpApi, verifyEmailOtpApi } from "../../api/authApi";
import toast from "react-hot-toast";

import TextBox from "devextreme-react/text-box";
import Button from "devextreme-react/button";
import ValidationGroup from "devextreme-react/validation-group";
import Validator, { RequiredRule, EmailRule, StringLengthRule } from "devextreme-react/validator";
import validationEngine from "devextreme/ui/validation_engine";

import "./auth.css";

const GROUP = "verifyForm";

export default function VerifyEmailOtpPage() {
  const [sp] = useSearchParams();
  const navigate = useNavigate();

  const [email, setEmail]               = useState(sp.get("email") || "");
  const [otp, setOtp]                   = useState("");
  const [loading, setLoading]           = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [cooldown, setCooldown]         = useState(0);

  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setInterval(() => setCooldown((s) => s - 1), 1000);
    return () => clearInterval(t);
  }, [cooldown]);

  const canResend = useMemo(() => cooldown <= 0 && !!email, [cooldown, email]);

  const resend = async () => {
    if (!email) return toast.error("Enter email first");
    setResendLoading(true);
    try {
      await sendVerificationOtpApi(email);
      toast.success("OTP sent (check inbox/spam).");
      setCooldown(60);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to send OTP");
    } finally {
      setResendLoading(false);
    }
  };

  const verify = async (e) => {
    e?.preventDefault?.();
    const result = validationEngine.validateGroup(GROUP);
    if (!result?.isValid) return;

    setLoading(true);
    try {
      await verifyEmailOtpApi(email, otp);
      toast.success("Email verified. Please login.");
      navigate("/login");
    } catch (err) {
      toast.error(err?.response?.data?.message || "OTP verify failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">

        <div className="form-header">
          <h1 className="form-title-plain">Verify Email</h1>
          <p className="form-desc">Enter the OTP sent to your inbox.</p>
        </div>

        <ValidationGroup name={GROUP}>
          <form onSubmit={verify} className="fields">

            <div className="field-block">
              <label className="field-label">Email</label>
              <TextBox
                value={email}
                onValueChanged={(e) => setEmail(e.value)}
                placeholder="you@example.com"
                stylingMode="outlined"
                width="100%"
              >
                <Validator validationGroup={GROUP}>
                  <RequiredRule message="Email is required" />
                  <EmailRule   message="Invalid email format" />
                </Validator>
              </TextBox>
            </div>

            <div className="field-block">
              <label className="field-label">OTP Code</label>
              <TextBox
                value={otp}
                onValueChanged={(e) => setOtp(e.value)}
                placeholder="Enter OTP"
                stylingMode="outlined"
                width="100%"
              >
                <Validator validationGroup={GROUP}>
                  <RequiredRule     message="OTP is required" />
                  <StringLengthRule min={4} message="OTP must be at least 4 characters" />
                </Validator>
              </TextBox>
            </div>

            <div className="btn-block-plain">
              <Button
                text={loading ? "Verifying…" : "Verify OTP"}
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

        {/* Resend is intentionally outside the form — clicking it must NOT trigger form validation */}
        <div style={{ marginTop: "0.75rem" }}>
          <Button
            text={resendLoading ? "Sending…" : canResend ? "Resend OTP" : `Resend in ${cooldown}s`}
            type="normal"
            stylingMode="outlined"
            width="100%"
            height={44}
            onClick={resend}
            disabled={!canResend || resendLoading}
          />
        </div>

        <div className="auth-links-row">
          <Link className="auth-link" to="/login">Back to login</Link>
          <Link className="auth-link" to="/register">Create account</Link>
        </div>

      </div>
    </div>
  );
}








// import { useEffect, useMemo, useState } from "react";
// import { Link, useNavigate, useSearchParams } from "react-router-dom";
// import toast from "react-hot-toast";
// import { sendVerificationOtpApi, verifyEmailOtpApi } from "../../api/authApi";

// export default function VerifyEmailOtpPage() {
//   const [sp] = useSearchParams();
//   const navigate = useNavigate();

//   const initialEmail = sp.get("email") || "";
//   const [email, setEmail] = useState(initialEmail);
//   const [otp, setOtp] = useState("");

//   const [loading, setLoading] = useState(false);
//   const [resendLoading, setResendLoading] = useState(false);

//   const [cooldown, setCooldown] = useState(0);

//   useEffect(() => {
//     if (cooldown <= 0) return;
//     const t = setInterval(() => setCooldown((s) => s - 1), 1000);
//     return () => clearInterval(t);
//   }, [cooldown]);

//   const canResend = useMemo(() => cooldown <= 0 && !!email, [cooldown, email]);

//   const resend = async () => {
//     if (!email) return toast.error("Enter email");
//     setResendLoading(true);
//     try {
//       await sendVerificationOtpApi(email);
//       toast.success("OTP sent (check inbox/spam).");
//       setCooldown(60);
//     } catch (e) {
//       toast.error(e?.response?.data?.message || "Failed to send OTP");
//     } finally {
//       setResendLoading(false);
//     }
//   };

//   const verify = async (e) => {
//     e.preventDefault();
//     if (!email) return toast.error("Enter email");
//     if (!otp || otp.length < 4) return toast.error("Enter OTP");

//     setLoading(true);
//     try {
//       await verifyEmailOtpApi(email, otp);
//       toast.success("Email verified. Please login.");
//       navigate("/login");
//     } catch (e) {
//       toast.error(e?.response?.data?.message || "OTP verify failed");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen grid place-items-center bg-gradient-to-br from-slate-100 to-gray-200 px-4">
//       <form onSubmit={verify} className="w-full max-w-md bg-white p-6 rounded-2xl shadow-xl space-y-4">
//         <h1 className="text-2xl font-bold">Verify Email</h1>

//         <input
//           className="w-full border p-2 rounded-lg"
//           placeholder="Email"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//         />

//         <input
//           className="w-full border p-2 rounded-lg tracking-widest text-center"
//           placeholder="Enter OTP"
//           value={otp}
//           onChange={(e) => setOtp(e.target.value)}
//         />

//         <button disabled={loading} className="w-full bg-black text-white py-2 rounded-lg disabled:opacity-60">
//           {loading ? "Verifying..." : "Verify OTP"}
//         </button>

//         <button
//           type="button"
//           disabled={!canResend || resendLoading}
//           onClick={resend}
//           className="w-full border py-2 rounded-lg disabled:opacity-60"
//         >
//           {resendLoading ? "Sending..." : canResend ? "Resend OTP" : `Resend in ${cooldown}s`}
//         </button>

//         <div className="flex items-center justify-between text-sm">
//           <Link className="text-blue-600" to="/login">Back to login</Link>
//           <Link className="text-blue-600" to="/register">Create account</Link>
//         </div>
//       </form>
//     </div>
//   );
// }