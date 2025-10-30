// src/pages/Tickets/TicketList.jsx
import { useEffect, useState } from "react";
import { ticketService } from "../../services/ticketService";
import { Link } from "react-router-dom";
import Loader from "../../components/Loader";

export default function TicketList() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    ticketService.getAll()
      .then(res => setTickets(res.data.data || res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="p-6">
      <h3 className="text-xl font-semibold mb-4">Tickets</h3>
      {loading ? <Loader /> : (
        <div className="grid gap-4">
          <Link to="/tickets/new" className="self-start text-blue-600">+ Create Ticket</Link>
          {tickets.length === 0 && <p>No tickets found.</p>}
          {tickets.map(t => (
            <div key={t.ticketId} className="p-4 bg-white rounded shadow">
              <div className="flex justify-between">
                <div>
                  <h4 className="font-bold">{t.title}</h4>
                  <p className="text-sm text-gray-600">{t.description}</p>
                  <p className="mt-2 text-xs">Priority: <b>{t.priority}</b> | Status: <b>{t.status}</b></p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <Link to={`/tickets/${t.ticketId}`} className="text-sm text-blue-600">View</Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
