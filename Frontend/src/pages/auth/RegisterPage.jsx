import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerApi } from "../../api/authApi";
import toast from "react-hot-toast";

export default function RegisterPage() {
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();

    if (form.password.length < 6) {
      return toast.error("Password must be at least 6 characters");
    }

    setLoading(true);
    try {
      await registerApi(form);
      toast.success("Registered successfully. OTP sent to email.");

      navigate(`/verify-email?email=${encodeURIComponent(form.email)}`);
    } catch (e) {
      toast.error(e?.response?.data?.message || "Register failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid place-items-center bg-gradient-to-br from-slate-100 to-gray-200 p-4">

      <form
        onSubmit={submit}
        className="w-full max-w-md bg-white p-6 rounded-2xl shadow-xl space-y-5"
      >
        <h1 className="text-2xl font-bold text-center">Create Account</h1>

        {/* FULL NAME */}
        <input
          className="w-full border p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
          placeholder="Full Name"
          value={form.fullName}
          onChange={(e) =>
            setForm((s) => ({ ...s, fullName: e.target.value }))
          }
          required
        />

        {/* EMAIL */}
        <input
          className="w-full border p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
          placeholder="Email"
          value={form.email}
          onChange={(e) =>
            setForm((s) => ({ ...s, email: e.target.value }))
          }
          required
        />

        {/* PASSWORD WITH TOGGLE */}
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            className="w-full border p-2 rounded-lg pr-10 focus:outline-none focus:ring-2 focus:ring-black"
            placeholder="Password"
            value={form.password}
            onChange={(e) =>
              setForm((s) => ({ ...s, password: e.target.value }))
            }
            required
          />

          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-2 text-gray-500"
          >
            {showPassword ? "🙈" : "👁️"}
          </button>
        </div>

        {/* SUBMIT */}
        <button
          disabled={loading}
          className="w-full bg-black text-white py-2 rounded-lg hover:bg-gray-900 transition disabled:opacity-60"
        >
          {loading ? "Creating account..." : "Create account"}
        </button>

        {/* LOGIN LINK */}
        <p className="text-sm text-center">
          Already have an account?{" "}
          <Link className="text-blue-600 hover:underline" to="/login">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
}