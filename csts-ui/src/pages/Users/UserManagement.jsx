import { useEffect, useState } from "react";
import { userService } from "../../services/userService";
import Loader from "../../components/Loader";
import Navbar from "../../components/Navbar";
import useAuth from "../../hooks/useAuth";
import { toast } from "react-toastify";

export default function UserManagement() {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    userService
      .getAll()
      .then((res) => setUsers(res.data.data || res.data))
      .catch((err) => toast.error("Failed to fetch users"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (user?.role === "Admin") load();
  }, [user]);

  const toggleActive = async (u) => {
    try {
      await userService.updateStatus(u.userId, !u.isActive);
      toast.success(`${u.isActive ? "Deactivated" : "Activated"} successfully`);
      load();
    } catch {
      toast.error("Failed to update status");
    }
  };

  if (loading) return <Loader />;
  if (user?.role !== "Admin")
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <Navbar />
        <h2 className="text-xl text-center text-red-500 mt-20">
          Access Denied: Admins only
        </h2>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <Navbar />
      <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
        User Management
      </h2>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
          <thead className="bg-blue-600 text-white text-sm uppercase">
            <tr>
              <th className="py-3 px-4 text-left">Name</th>
              <th className="py-3 px-4 text-left">Email</th>
              <th className="py-3 px-4 text-left">Role</th>
              <th className="py-3 px-4 text-center">Status</th>
              <th className="py-3 px-4 text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.userId} className="border-t hover:bg-gray-50">
                <td className="py-2 px-4">{u.name}</td>
                <td className="py-2 px-4">{u.email}</td>
                <td className="py-2 px-4">{u.role}</td>
                <td className="py-2 px-4 text-center">
                  <span
                    className={`px-2 py-1 rounded text-xs font-medium ${
                      u.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                    }`}
                  >
                    {u.isActive ? "Active" : "Inactive"}
                  </span>
                </td>
                <td className="py-2 px-4 text-center">
                  <button
                    onClick={() => toggleActive(u)}
                    className={`px-3 py-1 rounded ${
                      u.isActive
                        ? "bg-yellow-500 hover:bg-yellow-600"
                        : "bg-green-600 hover:bg-green-700"
                    } text-white`}
                  >
                    {u.isActive ? "Deactivate" : "Activate"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
