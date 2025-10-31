// src/pages/Tickets/TicketList.jsx
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Loader from "../../components/Loader";
import { ticketService } from "../../services/ticketService";
import { userService } from "../../services/userService";
import { toast } from "react-toastify";
import useAuth from "../../hooks/useAuth"; // ✅ Correct import

export default function TicketList() {
  const [tickets, setTickets] = useState([]);
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  // ✅ Load all tickets based on role
  const loadTickets = async () => {
    try {
      const res = await ticketService.getAll();
      const data = res.data.data || res.data;

      // Customers see only their tickets
      if (user.role === "Customer") {
        setTickets(data.filter((t) => t.createdBy === user.name));
      } else {
        setTickets(data);
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to load tickets");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Load all agents for admin to assign tickets
  const loadAgents = async () => {
    if (user.role === "Admin") {
      try {
        const res = await userService.getAll();
        const all = res.data.data || res.data;
        setAgents(all.filter((u) => u.role === "Agent"));
      } catch (err) {
        console.error(err);
        toast.error("Failed to load agents");
      }
    }
  };

  useEffect(() => {
    loadTickets();
    loadAgents();
  }, []);

  // ✅ Delete ticket (Admin only)
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this ticket?")) return;
    try {
      await ticketService.remove(id);
      toast.success("Ticket deleted successfully!");
      loadTickets();
    } catch (err) {
      toast.error("Failed to delete ticket");
    }
  };

  // ✅ Assign ticket (Admin only)
  const handleAssign = async (ticketId, agentId) => {
    if (!agentId) {
      toast.error("Please select an agent first");
      return;
    }
    try {
      await ticketService.assign(ticketId, { agentId: parseInt(agentId) });
      toast.success("Ticket assigned successfully!");
      loadTickets();
    } catch (err) {
      console.error(err);
      toast.error("Assignment failed");
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="p-8">
        {/* Header Section */}
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-semibold text-gray-800">
            Ticket Management
          </h2>

          {/* ✅ Create Ticket Button — visible for all roles */}
          <Link
            to="/tickets/new"
            className="bg-blue-600 text-white px-5 py-2 rounded-lg shadow hover:bg-blue-700 transition"
          >
            + Create Ticket
          </Link>
        </div>

        {/* Ticket List Section */}
        {tickets.length === 0 ? (
          <p className="text-gray-600 text-center mt-10">No tickets found.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tickets.map((t) => (
              <div
                key={t.ticketId}
                className="card bg-white p-5 shadow-md hover:shadow-lg transition rounded-lg"
              >
                {/* Ticket Info */}
                <div>
                  <h4 className="text-lg font-bold text-gray-800 mb-2">
                    {t.title}
                  </h4>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-3">
                    {t.description}
                  </p>
                  <p className="text-sm text-gray-500 mb-1">
                    <b>Priority:</b> {t.priority}
                  </p>
                  <p className="text-sm text-gray-500 mb-1">
                    <b>Status:</b> {t.status}
                  </p>
                  <p className="text-sm text-gray-500">
                    <b>Assigned To:</b> {t.assignedTo || "Unassigned"}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex justify-between items-center mt-4 gap-2">
                  <button
                    onClick={() => navigate(`/tickets/${t.ticketId}`)}
                    className="text-blue-600 hover:underline text-sm"
                  >
                    View
                  </button>

                  {(user.role === "Agent" || user.role === "Admin") && (
                    <button
                      onClick={() =>
                        navigate(`/tickets/${t.ticketId}?edit=true`)
                      }
                      className="text-green-600 hover:underline text-sm"
                    >
                      Edit
                    </button>
                  )}

                  {user.role === "Admin" && (
                    <button
                      onClick={() => handleDelete(t.ticketId)}
                      className="text-red-600 hover:underline text-sm"
                    >
                      Delete
                    </button>
                  )}
                </div>

                {/* Admin Assignment Dropdown */}
                {user.role === "Admin" && (
                  <div className="flex items-center justify-between mt-3">
                    <select
                      onChange={(e) =>
                        handleAssign(t.ticketId, e.target.value)
                      }
                      defaultValue=""
                      className="border rounded p-2 text-sm flex-1"
                    >
                      <option value="">Select Agent</option>
                      {agents.map((a) => (
                        <option key={a.userId} value={a.userId}>
                          {a.name}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
