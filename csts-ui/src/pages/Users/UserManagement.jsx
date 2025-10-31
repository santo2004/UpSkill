import { useEffect, useState } from "react";
import { userService } from "../../services/userService";
import Loader from "../../components/Loader";
import Navbar from "../../components/Navbar";
import { toast } from "react-toastify";

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    userService.getAll()
      .then(res => setUsers(res.data.data || res.data))
      .catch(err => {
        console.error(err);
        toast.error("Failed to load users");
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => load(), []);

  const toggleActive = async (u) => {
    try {
      await userService.updateStatus(u.userId, !u.isActive);
      toast.success("User status updated");
      load();
    } catch (err) {
      console.error(err);
      toast.error("Failed to update status");
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="p-6 min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-5xl mx-auto mt-6 bg-white p-6 rounded shadow">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">User Management</h2>

        <div className="overflow-x-auto">
          <table className="min-w-full table-auto">
            <thead>
              <tr className="text-left">
                <th className="px-4 py-2">Name</th>
                <th className="px-4 py-2">Email</th>
                <th className="px-4 py-2">Role</th>
                <th className="px-4 py-2">Status</th>
                <th className="px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u.userId} className="border-t">
                  <td className="px-4 py-3">{u.name}</td>
                  <td className="px-4 py-3">{u.email}</td>
                  <td className="px-4 py-3">{u.role}</td>
                  <td className="px-4 py-3">{u.isActive ? "Active" : "Inactive"}</td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => toggleActive(u)}
                      className={`px-3 py-1 rounded ${u.isActive ? 'bg-yellow-500' : 'bg-green-600'} text-white`}
                    >
                      {u.isActive ? 'Deactivate' : 'Activate'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}