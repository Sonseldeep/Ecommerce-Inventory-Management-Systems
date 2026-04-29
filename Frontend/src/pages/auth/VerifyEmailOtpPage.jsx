import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import { sendVerificationOtpApi, verifyEmailOtpApi } from "../../api/authApi";

export default function VerifyEmailOtpPage() {
  const [sp] = useSearchParams();
  const navigate = useNavigate();

  const initialEmail = sp.get("email") || "";
  const [email, setEmail] = useState(initialEmail);
  const [otp, setOtp] = useState("");

  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);

  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setInterval(() => setCooldown((s) => s - 1), 1000);
    return () => clearInterval(t);
  }, [cooldown]);

  const canResend = useMemo(() => cooldown <= 0 && !!email, [cooldown, email]);

  const resend = async () => {
    if (!email) return toast.error("Enter email");
    setResendLoading(true);
    try {
      await sendVerificationOtpApi(email);
      toast.success("OTP sent (check inbox/spam).");
      setCooldown(60);
    } catch (e) {
      toast.error(e?.response?.data?.message || "Failed to send OTP");
    } finally {
      setResendLoading(false);
    }
  };

  const verify = async (e) => {
    e.preventDefault();
    if (!email) return toast.error("Enter email");
    if (!otp || otp.length < 4) return toast.error("Enter OTP");

    setLoading(true);
    try {
      await verifyEmailOtpApi(email, otp);
      toast.success("Email verified. Please login.");
      navigate("/login");
    } catch (e) {
      toast.error(e?.response?.data?.message || "OTP verify failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid place-items-center bg-gradient-to-br from-slate-100 to-gray-200 px-4">
      <form onSubmit={verify} className="w-full max-w-md bg-white p-6 rounded-2xl shadow-xl space-y-4">
        <h1 className="text-2xl font-bold">Verify Email</h1>

        <input
          className="w-full border p-2 rounded-lg"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          className="w-full border p-2 rounded-lg tracking-widest text-center"
          placeholder="Enter OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
        />

        <button disabled={loading} className="w-full bg-black text-white py-2 rounded-lg disabled:opacity-60">
          {loading ? "Verifying..." : "Verify OTP"}
        </button>

        <button
          type="button"
          disabled={!canResend || resendLoading}
          onClick={resend}
          className="w-full border py-2 rounded-lg disabled:opacity-60"
        >
          {resendLoading ? "Sending..." : canResend ? "Resend OTP" : `Resend in ${cooldown}s`}
        </button>

        <div className="flex items-center justify-between text-sm">
          <Link className="text-blue-600" to="/login">Back to login</Link>
          <Link className="text-blue-600" to="/register">Create account</Link>
        </div>
      </form>
    </div>
  );
}