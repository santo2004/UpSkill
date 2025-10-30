// src/pages/Tickets/TicketDetails.jsx
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ticketService } from "../../services/ticketService";
import CommentSection from "../Comments/CommentSection";
import Loader from "../../components/Loader";

export default function TicketDetails() {
  const { id } = useParams();
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    ticketService.getById(id)
      .then(res => setTicket(res.data.data || res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <Loader />;

  if (!ticket) return <div className="p-6">Ticket not found.</div>;

  return (
    <div className="p-6">
      <h3 className="text-xl font-semibold">{ticket.title}</h3>
      <p className="text-gray-700 mb-2">{ticket.description}</p>
      <p className="text-sm">Priority: <b>{ticket.priority}</b> | Status: <b>{ticket.status}</b></p>

      <div className="mt-6">
        <CommentSection ticketId={ticket.ticketId} />
      </div>
    </div>
  );
}
