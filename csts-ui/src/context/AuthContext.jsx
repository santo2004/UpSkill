import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const navigate = useNavigate();

  // normalize keys: userId, name, email, role
  const [user, setUser] = useState(() => {
    try {
      const raw = localStorage.getItem("user");
      if (!raw) return null;
      const u = JSON.parse(raw);
      // normalize various shapes that might exist
      return {
        userId: u.userId ?? u.UserId ?? u.id ?? null,
        name: u.name ?? u.Name ?? u.fullName ?? u.email?.split?.("@")?.[0] ?? "",
        email: u.email ?? u.Email ?? "",
        role: (u.role ?? u.Role ?? "Customer"),
      };
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState(() => localStorage.getItem("token") || null);

  useEffect(() => {
    if (token && !user) {
      try {
        const raw = localStorage.getItem("user");
        if (raw) {
          const u = JSON.parse(raw);
          setUser({
            userId: u.userId ?? u.UserId ?? u.id ?? null,
            name: u.name ?? u.Name ?? u.fullName ?? u.email?.split?.("@")?.[0] ?? "",
            email: u.email ?? u.Email ?? "",
            role: (u.role ?? u.Role ?? "Customer"),
          });
        }
      } catch {}
    }
  }, [token]);

  const login = (tokenValue, userData) => {
    const normalized = {
      userId: userData.userId ?? userData.UserId ?? userData.id ?? null,
      name: userData.name ?? userData.Name ?? userData.fullName ?? userData.email?.split?.("@")?.[0] ?? "",
      email: userData.email ?? userData.Email ?? "",
      role: userData.role ?? userData.Role ?? "Customer"
    };

    localStorage.setItem("token", tokenValue);
    localStorage.setItem("user", JSON.stringify(normalized));
    setToken(tokenValue);
    setUser(normalized);
    navigate("/dashboard");
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
    navigate("/login");
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
