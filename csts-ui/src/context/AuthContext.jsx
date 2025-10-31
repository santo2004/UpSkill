// src/context/AuthContext.jsx
import { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem("user");
    return raw ? JSON.parse(raw) : null;
  });
  const [token, setToken] = useState(localStorage.getItem("token") || null);

  useEffect(() => {
    if (token && !user) {
      const raw = localStorage.getItem("user");
      if (raw) setUser(JSON.parse(raw));
    }
  }, [token, user]);

  const login = (tokenValue, userData) => {
    // normalize backend user
    const normalized = {
      userId: userData.UserId ?? userData.userId,
      name: userData.Name ?? userData.name,
      email: userData.Email ?? userData.email,
      role: userData.role ?? userData.role ?? userData.Role ?? userData.Role?.toString?.() ?? userData.role
    };
    localStorage.setItem("token", tokenValue);
    localStorage.setItem("user", JSON.stringify(normalized));
    setToken(tokenValue);
    setUser(normalized);
    navigate("/dashboard");
  };

  const logout = () => {
    localStorage.clear();
    setUser(null);
    setToken(null);
    navigate("/login");
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};