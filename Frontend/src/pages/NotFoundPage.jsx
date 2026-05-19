import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-linear-to-br from-slate-950 via-slate-900 to-slate-800 flex items-center justify-center px-6">
      <div className="max-w-xl text-center">
        {/* 404 Number */}
        <h1 className="text-8xl md:text-9xl font-extrabold text-white tracking-tight">
          404
        </h1>

        {/* Divider */}
        <div className="w-24 h-1 bg-indigo-500 mx-auto my-6 rounded-full" />

        {/* Message */}
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
          Page Not Found
        </h2>

        <p className="text-slate-300 text-lg leading-relaxed mb-8">
          The page you’re looking for doesn’t exist or may have been moved.
          Let’s get you back to something useful.
        </p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/"
            className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium transition-all duration-300 shadow-lg shadow-indigo-500/20"
          >
            Go Home
          </Link>

          <Link
            to="/products"
            className="px-6 py-3 rounded-xl border border-slate-600 hover:border-slate-400 text-slate-200 hover:text-white transition-all duration-300"
          >
            Browse Products
          </Link>
        </div>

        {/* Small Footer Text */}
        <p className="mt-10 text-sm text-slate-500">
          Error Code: 404 — Resource unavailable
        </p>
      </div>
    </div>
  );
}