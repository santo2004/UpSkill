import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Loader from "../../components/Loader";
import { ticketService } from "../../services/ticketService";
import { toast } from "react-toastify";

export default function TicketEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await ticketService.getById(id);
        setTicket(res.data.data || res.data);
      } catch (err) {
        toast.error("Failed to fetch ticket details");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const handleChange = (e) => {
    setTicket({ ...ticket, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await ticketService.update(id, ticket);
      toast.success("Ticket updated successfully!");
      navigate("/tickets");
    } catch (err) {
      toast.error("Update failed");
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <Navbar />
      <div className="max-w-2xl mx-auto bg-white shadow-md rounded-lg p-6 mt-10">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">Edit Ticket</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">Title</label>
            <input
              type="text"
              name="title"
              value={ticket.title}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded focus:outline-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">Description</label>
            <textarea
              name="description"
              value={ticket.description}
              onChange={handleChange}
              rows="4"
              className="w-full p-2 border rounded focus:outline-blue-500"
            ></textarea>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">Priority</label>
              <select
                name="priority"
                value={ticket.priority}
                onChange={handleChange}
                className="w-full p-2 border rounded focus:outline-blue-500"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">Status</label>
              <select
                name="status"
                value={ticket.status}
                onChange={handleChange}
                className="w-full p-2 border rounded focus:outline-blue-500"
              >
                <option value="New">New</option>
                <option value="Assigned">Assigned</option>
                <option value="In Progress">In Progress</option>
                <option value="Resolved">Resolved</option>
                <option value="Closed">Closed</option>
              </select>
            </div>
          </div>

          <div className="flex justify-between mt-6">
            <button
              type="button"
              onClick={() => navigate("/tickets")}
              className="px-4 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500"
            >
              ← Back to Tickets
            </button>
            <button
              type="submit"
              disabled={saving}
              className={`px-4 py-2 text-white rounded-lg transition ${
                saving ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
