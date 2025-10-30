import { Link } from "react-router-dom";

export default function ServerError() {
  return (
    <div className="p-8 text-center">
      <h2 className="text-3xl font-bold text-red-600 mb-4">500 — Server Error</h2>
      <p className="mb-6">Something went wrong on the server. Please try again later.</p>
      <Link to="/dashboard" className="bg-blue-600 text-white px-4 py-2 rounded">
        Back to Dashboard
      </Link>
    </div>
  );
}
