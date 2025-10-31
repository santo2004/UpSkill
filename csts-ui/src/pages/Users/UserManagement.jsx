// src/pages/Users/UserManagement.jsx
import { useEffect, useState } from "react";
import { userService } from "../../services/userService";
import Loader from "../../components/Loader";
import Navbar from "../../components/Navbar";

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    userService.getAll()
      .then(res => setUsers(res.data.data || res.data || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => load(), []);

  const toggleActive = async (u) => {
    try {
      await userService.updateStatus(u.userId, !u.isActive);
      load();
    } catch (err) {
      console.error(err);
      alert("Failed to update user status");
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="p-6">
      <Navbar />
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">User Management</h2>

      <div className="bg-white shadow rounded overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map((u) => (
              <tr key={u.userId}>
                <td className="px-6 py-4 whitespace-nowrap">{u.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{u.email}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{u.role}</td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
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
  );
}