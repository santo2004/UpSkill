import { useEffect, useState } from "react";
import { getAllTickets } from "../../services/ticketService";
import Navbar from "../../components/Navbar";
import Loader from "../../components/Loader";
import { Link } from "react-router-dom";

export default function TicketList() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTickets = async () => {
      try {
        const res = await getAllTickets();
        setTickets(res.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadTickets();
  }, []);

  if (loading) return <Loader text="Loading tickets..." />;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="pt-20 px-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-800">Tickets</h2>
          <Link
            to="/tickets/new"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            + New Ticket
          </Link>
        </div>
        <div className="bg-white shadow rounded-lg p-4">
          {tickets.length > 0 ? (
            tickets.map((t) => (
              <div key={t.ticketId} className="border-b py-3">
                <p className="font-semibold text-gray-700">{t.title}</p>
                <p className="text-sm text-gray-500">{t.status}</p>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No tickets available.</p>
          )}
        </div>
      </div>
    </div>
  );
}
