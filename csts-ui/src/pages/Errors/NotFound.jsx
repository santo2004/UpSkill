import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="p-8 text-center">
      <h2 className="text-3xl font-bold text-gray-700 mb-4">404 — Page Not Found</h2>
      <p className="mb-6">The page you’re looking for doesn’t exist.</p>
      <Link to="/dashboard" className="bg-blue-600 text-white px-4 py-2 rounded">
        Back to Dashboard
      </Link>
    </div>
  );
}
