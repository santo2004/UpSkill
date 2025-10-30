import { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const role = user?.role;

  return (
    <nav className="bg-blue-700 text-white px-8 py-3 flex justify-between items-center shadow-md">
      <div className="flex gap-6 items-center">
        <Link to="/dashboard" className="font-bold text-lg hover:text-gray-200">CSTS</Link>
        <Link to="/tickets" className="hover:text-gray-200">Tickets</Link>
        {role === "Admin" && <Link to="/users" className="hover:text-gray-200">Users</Link>}
        <Link to="/comments" className="hover:text-gray-200">Comments</Link>
      </div>
      <div className="flex items-center gap-4">
        <span className="text-sm">{user?.email}</span>
        <button
          onClick={logout}
          className="bg-red-500 px-3 py-1 rounded hover:bg-red-600 transition"
        >
          Logout
        </button>
      </div>
    </nav>
  );
}
