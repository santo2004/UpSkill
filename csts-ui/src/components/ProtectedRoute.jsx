// src/components/ProtectedRoute.jsx
import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function ProtectedRoute({ children, roles }) {
  const { token, user } = useContext(AuthContext);

  if (!token) return <Navigate to="/login" replace />;

  if (roles && roles.length > 0) {
    const userRole = (user?.role || "").toLowerCase();
    const allowed = roles.map(r => r.toLowerCase()).includes(userRole);
    if (!allowed) return <Navigate to="/forbidden" replace />;
  }

  return children;
}
