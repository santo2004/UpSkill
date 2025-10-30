import { Link } from "react-router-dom";

export default function Forbidden() {
  return (
    <div className="p-8 text-center">
      <h2 className="text-3xl font-bold text-red-600 mb-4">403 — Forbidden</h2>
      <p className="mb-6">You do not have permission to access this page.</p>
      <Link to="/dashboard" className="bg-blue-600 text-white px-4 py-2 rounded">
        Back to Dashboard
      </Link>
    </div>
  );
}
