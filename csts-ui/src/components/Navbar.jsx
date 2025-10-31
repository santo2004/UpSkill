// src/components/Navbar.jsx
import { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const role = user?.role;

  return (
    <nav className="bg-blue-700 text-white px-8 py-3 flex justify-between items-center shadow-md">
      {/* Left side - App name */}
      <div className="font-bold text-xl tracking-wide">
        Customer Support Ticketing System
      </div>

      {/* Right side - Navigation links and user info */}
      <div className="flex items-center gap-6">
        {/* Admin can see Users menu */}
        {role === "Admin" && (
          <Link
            to="/users"
            className="hover:text-gray-200 font-medium transition"
          >
            Users
          </Link>
        )}

        {/* All roles see Tickets */}
        <Link
          to="/tickets"
          className="hover:text-gray-200 font-medium transition"
        >
          Tickets
        </Link>

        {/* User details */}
        {user && (
          <span className="text-sm italic text-gray-100">
            {user.name || user.email}
          </span>
        )}

        {/* Logout button */}
        <button
          onClick={logout}
          className="bg-red-500 px-4 py-1.5 rounded-md hover:bg-red-600 transition text-sm font-medium"
        >
          Logout
        </button>
      </div>
    </nav>
  );
}
