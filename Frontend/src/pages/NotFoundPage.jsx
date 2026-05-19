import { Link } from "react-router-dom";
import "./NotFoundPage.css";

export default function NotFoundPage() {
  return (
    <div className="notfound-container">
      <div className="notfound-content">
        <h1 className="notfound-code">404</h1>

        <div className="notfound-divider"></div>

        <h2 className="notfound-title">Page Not Found</h2>

        <p className="notfound-description">
          The page you’re looking for doesn’t exist or may have been moved.
          Let’s get you back to something useful.
        </p>

        <div className="notfound-actions">
          <Link to="/" className="btn btn-primary">
            Go Home
          </Link>

          <Link to="/products" className="btn btn-secondary">
            Browse Products
          </Link>
        </div>

        <p className="notfound-footer">
          Error Code: 404 — Resource unavailable
        </p>
      </div>
    </div>
  );
}