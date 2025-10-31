// src/pages/Auth/Login.jsx
import { useState, useContext } from "react";
import api from "../../api/axiosConfig";
import { AuthContext } from "../../context/AuthContext";

export default function Login() {
  const { login } = useContext(AuthContext);
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await api.post("/Auth/login", form);
      if (res?.data?.token) {
        // backend returns res.data.user
        const userData = res.data.user || { email: form.email };
        login(res.data.token, userData);
      } else {
        setError("Login failed: invalid server response");
      }
    } catch (err) {
      setError(err?.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 to-blue-200">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-[350px]">
        <h2 className="text-3xl font-bold mb-6 text-center text-blue-700">Login</h2>
        <form onSubmit={handleSubmit}>
          <label className="text-sm block text-left mb-1">Email</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
            className="w-full mb-3 p-2 border rounded focus:outline-blue-500"
          />
          <label className="text-sm block text-left mb-1">Password</label>
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            required
            className="w-full mb-4 p-2 border rounded focus:outline-blue-500"
          />
          <button
            disabled={loading}
            className={`w-full text-white py-2 rounded-lg transition ${loading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"}`}
          >
            {loading ? "Logging in..." : "Login"}
          </button>

          {error && <p className="text-red-500 text-sm mt-3 text-center">{error}</p>}
        </form>

        <p className="mt-4 text-center text-sm">
          Don’t have an account? <a href="/register" className="text-blue-600 hover:underline">Register</a>
        </p>
      </div>
    </div>
  );
}