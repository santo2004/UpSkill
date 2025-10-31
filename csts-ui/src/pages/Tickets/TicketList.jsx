import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Loader from "../../components/Loader";
import { ticketService } from "../../services/ticketService";
import { toast } from "react-toastify";

export default function TicketList() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const loadAll = async () => {
    setLoading(true);
    try {
      const res = await ticketService.getAll();
      setTickets(res.data.data || res.data);
    } catch (err) {
      // If 403 (customer) -> fetch user's tickets
      if (err?.response?.status === 403 || err?.response?.status === 401) {
        try {
          const user = JSON.parse(localStorage.getItem("user") || "{}");
          if (user?.UserId || user?.userId || user?.userId === 0) {
            const id = user.UserId || user.userId || user.userId;
            const res2 = await ticketService.getByUser(id);
            setTickets(res2.data.data || res2.data);
          } else {
            // if user object doesn't have id, try email lookup or show empty
            setTickets([]);
          }
        } catch (inner) {
          console.error(inner);
          setTickets([]);
        }
      } else {
        console.error(err);
        toast.error("Failed to load tickets");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAll();
  }, []);

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this ticket?");
    if (!confirmDelete) return;
    try {
      await ticketService.remove(id);
      toast.success("Ticket deleted successfully!");
      loadAll();
    } catch (err) {
      toast.error("Failed to delete ticket");
      console.error(err);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="p-8 max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-semibold text-gray-800">Ticket Management</h2>
          <Link
            to="/tickets/new"
            className="bg-blue-600 text-white px-5 py-2 rounded-lg shadow hover:bg-blue-700 transition"
          >
            + Create Ticket
          </Link>
        </div>

        {tickets.length === 0 ? (
          <p className="text-gray-600 text-center mt-10">No tickets found.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tickets.map((t) => (
              <div key={t.ticketId} className="card bg-white p-5 shadow-md hover:shadow-lg transition rounded-lg">
                <div>
                  <h4 className="text-lg font-bold text-gray-800 mb-2">{t.title}</h4>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-3">{t.description}</p>
                  <p className="text-sm text-gray-500 mb-1"><b>Priority:</b> {t.priority}</p>
                  <p className="text-sm text-gray-500"><b>Status:</b> {t.status}</p>
                </div>

                <div className="flex justify-between mt-4">
                  <button
                    onClick={() => navigate(`/tickets/${t.ticketId}`)}
                    className="text-blue-600 hover:underline text-sm"
                  >
                    View
                  </button>
                  <button
                    onClick={() => navigate(`/tickets/${t.ticketId}?edit=true`)}
                    className="text-green-600 hover:underline text-sm"
                  >
                    Update
                  </button>
                  <button
                    onClick={() => handleDelete(t.ticketId)}
                    className="text-red-600 hover:underline text-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}