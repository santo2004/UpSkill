import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Loader from "../../components/Loader";
import { ticketService } from "../../services/ticketService";
import useAuth from "../../hooks/useAuth";
import { toast } from "react-toastify";

export default function TicketList() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { user } = useAuth();

  const load = () => {
    setLoading(true);
    const fetcher =
      user?.role === "Customer"
        ? ticketService.getByUser(user.userId)
        : ticketService.getAll();

    fetcher
      .then((res) => setTickets(res.data.data || res.data || []))
      .catch(() => toast.error("Failed to load tickets"))
      .finally(() => setLoading(false));
  };

  useEffect(() => load(), [user]);

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this ticket?");
    if (!confirmDelete) return;
    try {
      await ticketService.remove(id);
      toast.success("Ticket deleted successfully!");
      load();
    } catch {
      toast.error("Failed to delete ticket");
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="p-8 max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-800">Ticket Management</h2>
          {user?.role === "Customer" && (
            <Link
              to="/tickets/new"
              className="bg-blue-600 text-white px-5 py-2 rounded-lg shadow hover:bg-blue-700 transition"
            >
              + Create Ticket
            </Link>
          )}
        </div>

        {tickets.length === 0 ? (
          <p className="text-gray-600 text-center mt-10">No tickets found.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tickets.map((t) => (
              <div
                key={t.ticketId}
                className="bg-white p-5 rounded-lg shadow hover:shadow-lg transition"
              >
                <h4 className="text-lg font-bold text-gray-800 mb-2">{t.title}</h4>
                <p className="text-sm text-gray-600 mb-3 line-clamp-3">{t.description}</p>
                <p className="text-sm text-gray-500 mb-1">
                  <b>Priority:</b> {t.priority}
                </p>
                <p className="text-sm text-gray-500 mb-1">
                  <b>Status:</b> {t.status}
                </p>
                {t.assignedTo && (
                  <p className="text-sm text-gray-500">
                    <b>Assigned To:</b> {t.assignedTo}
                  </p>
                )}

                <div className="flex justify-between mt-4">
                  <button
                    onClick={() => navigate(`/tickets/${t.ticketId}`)}
                    className="text-blue-600 hover:underline text-sm"
                  >
                    View
                  </button>

                  {(user.role === "Admin" || user.role === "Agent") && (
                    <button
                      onClick={() => navigate(`/tickets/${t.ticketId}?edit=true`)}
                      className="text-green-600 hover:underline text-sm"
                    >
                      Update
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
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}