import { useEffect, useState } from "react";
import { ticketService } from "../../services/ticketService";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Loader from "../../components/Loader";
import useAuth from "../../hooks/useAuth";

export default function TicketList() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    async function loadTickets() {
      try {
        const res = await ticketService.getAll();
        const data = res.data.data || res.data;
        setTickets(data);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load tickets");
      } finally {
        setLoading(false);
      }
    }
    loadTickets();
  }, []);

  if (loading) return <Loader />;

  if (tickets.length === 0)
    return (
      <div className="text-center mt-20">
        <p className="text-gray-600">No tickets found.</p>
      </div>
    );

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h2 className="text-2xl font-semibold mb-4">Tickets</h2>
      <div className="grid gap-4">
        {tickets.map((t) => (
          <div
            key={t.ticketId}
            className="bg-white p-4 rounded shadow cursor-pointer hover:shadow-lg transition"
            onClick={() => navigate(`/tickets/${t.ticketId}`)}
          >
            <p><b>{t.title}</b></p>
            <p>Status: {t.status}</p>
            <p>Priority: {t.priority}</p>
            {user.role !== "Customer" && t.assignedTo && (
              <p>Assigned To: {t.assignedToName || t.assignedTo}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
