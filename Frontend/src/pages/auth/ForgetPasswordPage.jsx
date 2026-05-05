import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { forgotPasswordApi } from "../../api/authApi";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await forgotPasswordApi(email);
      toast.success("If account exists, reset token sent to email.");
      navigate(`/reset-password?email=${encodeURIComponent(email)}`);
    } catch (e) {
      toast.error(e?.response?.data?.message || "Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid place-items-center bg-gradient-to-br from-slate-100 to-gray-200 px-4">
      <form
        onSubmit={submit}
        className="w-full max-w-md bg-white p-6 rounded-2xl shadow-xl space-y-4"
      >
        <h1 className="text-2xl font-bold">Forgot Password</h1>
        <p className="text-sm text-gray-600">
          Enter your email. We’ll send a reset token to your mailbox.
        </p>

        <input
          className="w-full border p-2 rounded-lg"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <button
          disabled={loading}
          className="w-full bg-black text-white py-2 rounded-lg disabled:opacity-60"
        >
          {loading ? "Sending..." : "Send reset token"}
        </button>

        <div className="flex items-center justify-between text-sm">
          <Link className="text-blue-600" to="/login">
            Back to login
          </Link>
          <Link className="text-blue-600" to="/reset-password">
            Already have token?
          </Link>
        </div>
      </form>
    </div>
  );
}
