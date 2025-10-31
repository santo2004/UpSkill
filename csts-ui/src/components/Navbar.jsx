import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-blue-700 text-white px-6 py-3 flex items-center justify-between shadow-md">
      <div className="flex items-center gap-6">
        <div className="text-lg font-bold">Customer Support Ticketing System</div>
      </div>

      <div className="flex items-center gap-6">
        <Link to="/users" className="hover:text-gray-200">User</Link>
        <Link to="/tickets" className="hover:text-gray-200">Ticket</Link>

        <div className="hidden sm:block text-sm text-white/90">
          {user?.name || user?.email || ""}
        </div>

        <button onClick={logout} className="bg-red-500 px-3 py-1 rounded hover:bg-red-600 ml-2">
          Logout
        </button>
      </div>
    </nav>
  );
}
