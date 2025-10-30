// src/pages/Dashboard.jsx
import Navbar from "../components/Navbar";

export default function Dashboard() {
  const user = JSON.parse(localStorage.getItem("user"));
  return (
    <div>
      <Navbar />
      <div className="p-6">
        <h2 className="text-2xl font-semibold mb-2">Welcome, {user?.email}</h2>
        <p>Your role: <b>{user?.role || "Customer"}</b></p>
      </div>
    </div>
  );
}
