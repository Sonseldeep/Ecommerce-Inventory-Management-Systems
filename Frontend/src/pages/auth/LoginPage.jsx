

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  // for show/hide password
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    try {
      const user = await login({ email, password });
      toast.success("Login successful");
      if ((user.role || "").toLowerCase() === "admin") navigate("/admin/dashboard");
      else navigate("/dashboard");
    } catch (e) {
      const msg = e?.response?.data?.message || "Login failed";
      toast.error(msg);

      // helpful redirects
      if (String(msg).toLowerCase().includes("verify")) {
        navigate(`/verify-email?email=${encodeURIComponent(email)}`);
      }
    }
  };

  return (
    <div className="min-h-screen grid place-items-center bg-gradient-to-br from-slate-100 to-gray-200">
      <form onSubmit={submit} className="w-full max-w-md bg-white p-6 rounded-2xl shadow-xl space-y-4">
        <h1 className="text-2xl font-bold">Login</h1>

        <input className="w-full border p-2 rounded-lg" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
       
        <div className="relative">
  <input
    type={showPassword ? "text" : "password"}
    className="w-full border p-2 rounded-lg pr-10"
    placeholder="Password"
    value={password}
    onChange={(e) => setPassword(e.target.value)}
  />

  <button
    type="button"
    onClick={() => setShowPassword(!showPassword)}
    className="absolute right-3 top-2.5 text-gray-500"
  >
    {showPassword ? "🙈" : "👁️"}
  </button>
</div>

        <button className="w-full bg-black text-white py-2 rounded-lg">Sign in</button>

        <div className="flex items-center justify-between text-sm">
          <Link className="text-blue-600" to="/register">Sign up</Link>
          <Link className="text-blue-600" to="/forgot-password">Forgot password?</Link>
        </div>

        <p className="text-xs text-gray-500">
          Didn’t receive OTP?{" "}
          <Link className="text-blue-600" to={`/verify-email?email=${encodeURIComponent(email || "")}`}>
            Verify email
          </Link>
        </p>
      </form>
    </div>
  );
}