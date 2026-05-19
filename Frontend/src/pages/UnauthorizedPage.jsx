import { ShieldAlert, Home } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function UnauthorizedPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-gray-50 to-indigo-50 px-4">
      <div className="bg-white border border-gray-200 rounded-2xl shadow-lg p-10 max-w-md w-full text-center">

        {/* Icon */}
        <div className="flex justify-center text-red-500 mb-4">
          <ShieldAlert size={48} />
        </div>

        {/* Title */}
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Access Denied
        </h1>

        {/* Message */}
        <p className="text-sm text-gray-500 mb-6 leading-relaxed">
          You don’t have permission to view this page.
        </p>

        {/* Buttons */}
        <div className="flex flex-col gap-3">
          
          {/* Go Home */}
          <button
            onClick={() => navigate("/")}
            className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2.5 rounded-lg transition"
          >
            <Home size={18} />
            Go to Home
          </button>

      

        </div>
      </div>
    </div>
  );
}