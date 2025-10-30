// src/components/Navbar.jsx
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  return (
    <div className="bg-blue-700 text-white flex justify-between px-6 py-3">
      <h1 className="font-bold text-lg">CSTS Dashboard</h1>
      <div className="flex items-center gap-3">
        <span>{user?.email}</span>
        <button
          onClick={logout}
          className="bg-red-500 px-3 py-1 rounded hover:bg-red-600"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
