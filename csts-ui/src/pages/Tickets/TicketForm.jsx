import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Loader from "../../components/Loader";
import { ticketService } from "../../services/ticketService";
import { userService } from "../../services/userService";
import useAuth from "../../hooks/useAuth";
import { toast } from "react-toastify";

export default function TicketForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [form, setForm] = useState({
    title: "",
    description: "",
    priority: "Medium",
    assignedTo: "",
  });
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user?.role === "Admin") {
      userService.getAll().then((res) => {
        const all = res.data.data || res.data;
        setAgents(all.filter((u) => u.role === "Agent" && u.isActive));
      });
    }
  }, [user]);

  useEffect(() => {
    if (id) {
      setLoading(true);
      ticketService
        .getById(id)
        .then((res) => {
          const data = res.data.data || res.data;
          setForm({
            title: data.title,
            description: data.description,
            priority: data.priority,
            assignedTo: data.assignedToId || "",
          });
        })
        .finally(() => setLoading(false));
    }
  }, [id]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        title: form.title,
        description: form.description,
        priority: form.priority,
        assignedTo: form.assignedTo || null,
      };

      if (id) await ticketService.update(id, payload);
      else await ticketService.create(payload);

      toast.success(`Ticket ${id ? "updated" : "created"} successfully!`);
      navigate("/tickets");
    } catch (err) {
      toast.error("Failed to save ticket");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex justify-center py-12">
        <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
          <h3 className="text-2xl font-semibold mb-6 text-center text-gray-800">
            {id ? "Edit Ticket" : "Create Ticket"}
          </h3>
          <form onSubmit={handleSubmit}>
            <label className="block mb-2 font-medium text-gray-700">Title</label>
            <input
              required
              name="title"
              value={form.title}
              onChange={handleChange}
              className="w-full p-2 mb-4 border rounded focus:ring focus:ring-blue-200"
            />

            <label className="block mb-2 font-medium text-gray-700">Description</label>
            <textarea
              required
              name="description"
              value={form.description}
              onChange={handleChange}
              className="w-full p-2 mb-4 border rounded focus:ring focus:ring-blue-200"
            />

            <label className="block mb-2 font-medium text-gray-700">Priority</label>
            <select
              name="priority"
              value={form.priority}
              onChange={handleChange}
              className="w-full p-2 mb-6 border rounded"
            >
              <option>Low</option>
              <option>Medium</option>
              <option>High</option>
            </select>

            {user?.role === "Admin" && (
              <>
                <label className="block mb-2 font-medium text-gray-700">Assign To Agent</label>
                <select
                  name="assignedTo"
                  value={form.assignedTo}
                  onChange={handleChange}
                  className="w-full p-2 mb-6 border rounded"
                >
                  <option value="">Unassigned</option>
                  {agents.map((a) => (
                    <option key={a.userId} value={a.userId}>
                      {a.name}
                    </option>
                  ))}
                </select>
              </>
            )}

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
            >
              {id ? "Update Ticket" : "Create Ticket"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}