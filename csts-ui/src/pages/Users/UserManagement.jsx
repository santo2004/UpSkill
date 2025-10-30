import { useEffect, useState } from "react";
import { userService } from "../../services/userService";
import Loader from "../../components/Loader";
import Navbar from "../../components/Navbar";

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    userService.getAll()
      .then(res => setUsers(res.data.data || res.data))
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
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="p-6">
      <Navbar />
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">User Management</h2>
      <div className="space-y-3">
        {users.map(u => (
          <div key={u.userId} className="p-3 bg-white rounded shadow flex justify-between items-center">
            <div>
              <div className="font-semibold">
                {u.name} <span className="text-sm text-gray-500">({u.role})</span>
              </div>
              <div className="text-sm text-gray-500">{u.email}</div>
            </div>
            <div>
              <button
                onClick={() => toggleActive(u)}
                className={`px-3 py-1 rounded ${u.isActive ? 'bg-yellow-500' : 'bg-green-600'}`}
              >
                {u.isActive ? 'Deactivate' : 'Activate'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
