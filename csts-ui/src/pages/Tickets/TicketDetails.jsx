// src/pages/Tickets/TicketDetails.jsx
import { useEffect, useState } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Loader from "../../components/Loader";
import { ticketService } from "../../services/ticketService";
import { toast } from "react-toastify";
import useAuth from "../../hooks/useAuth";
import CommentSection from "../Comments/CommentSectionInLine";

export default function TicketDetails() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ status: "", description: "", priority: "" });
  const editMode = searchParams.get("edit") === "true";

  useEffect(() => {
    async function loadTicket() {
      try {
  const res = await ticketService.getById(id);
  const data = res.data.data || res.data;
  setTicket(data);
  setForm({
    status: data.status,
    description: data.description,
    priority: data.priority,
  });
} catch (err) {
  if (err.response?.status === 403) {
    toast.error("You are not authorized to view this ticket");
    navigate("/tickets");
  } else {
    toast.error("Failed to load ticket");
  }
  console.error(err);
} finally {
  setLoading(false);
}
    }
    loadTicket();
  }, [id]);

  const handleUpdate = async (e) => {
    e.preventDefault();

    const normalize = (value) => (value ? value.replace(/\s+/g, "") : "");

    const payload = {
      title: ticket.title,
      description: form.description,
      priority: normalize(form.priority || ticket.priority),
      status: normalize(form.status || ticket.status)
    };

    try {
      await ticketService.update(id, payload);
      toast.success("Ticket updated successfully");
      navigate("/tickets");
    } catch (err) {
      console.error("Update failed", err);
      toast.error("Failed to update ticket — check required fields or enums");
    }
  };

  if (loading) return <Loader />;
  if (!ticket) return <p className="text-center mt-20">Ticket not found.</p>;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="p-8 max-w-3xl mx-auto">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-2xl font-semibold mb-4 text-gray-800">
            Ticket Details
          </h3>

          {!editMode ? (
            <>
              <p><b>Title:</b> {ticket.title}</p>
              <p><b>Description:</b> {ticket.description}</p>
              <p><b>Status:</b> {ticket.status}</p>
              <p><b>Priority:</b> {ticket.priority}</p>

              <div className="flex gap-3 mt-6">
                {(user.role === "Admin" || user.role === "Agent") && (
                  <button
                    onClick={() =>
                      navigate(`/tickets/${ticket.ticketId}?edit=true`)
                    }
                    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                  >
                    Edit
                  </button>
                )}
                <button
                  onClick={() => navigate("/tickets")}
                  className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
                >
                  ← Back to Tickets
                </button>
              </div>
            </>
          ) : (
            <form onSubmit={handleUpdate}>
              <label className="block mb-2 text-gray-700 font-medium">
                Status
              </label>
              <select
                name="status"
                value={form.status}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, status: e.target.value }))
                }
                className="w-full border p-2 rounded mb-4"
              >
                <option value="New">New</option>
                <option value="Assigned">Assigned</option>
                <option value="InProgress">InProgress</option>
                <option value="Resolved">Resolved</option>
                <option value="Closed">Closed</option>
              </select>

              <label className="block mb-2 text-gray-700 font-medium">
                Description
              </label>
              <textarea
                name="description"
                rows="4"
                value={form.description}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, description: e.target.value }))
                }
                className="w-full border p-2 rounded mb-4"
              />

              <div className="flex gap-3">
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  Save Changes
                </button>
                <button
                  type="button"
                  onClick={() => navigate("/tickets")}
                  className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Comments */}
        <div className="mt-6">
          <CommentSection ticketId={ticket.ticketId} hideNavbar />
        </div>
      </div>
    </div>
  );
}
