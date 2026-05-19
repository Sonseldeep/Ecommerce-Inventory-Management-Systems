import { ShieldAlert, Home } from "lucide-react";
import { useNavigate } from "react-router-dom";
import "./UnauthorizedPage.css";

export default function UnauthorizedPage() {
  const navigate = useNavigate();

  return (
    <div className="unauthorized-container">
      <div className="unauthorized-card">

       
        <div className="unauthorized-icon">
          <ShieldAlert size={48} />
        </div>

        <h1 className="unauthorized-title">
          Access Denied
        </h1>

       
        <p className="unauthorized-message">
          You don’t have permission to view this page.
        </p>

        <div className="unauthorized-actions">
          <button
            onClick={() => navigate("/")}
            className="unauthorized-btn"
          >
            <Home size={18} />
            Go to Home
          </button>
        </div>
      </div>
    </div>
  );
}