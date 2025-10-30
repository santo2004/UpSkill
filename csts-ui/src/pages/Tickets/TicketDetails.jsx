import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Loader from "../../components/Loader";
import { ticketService } from "../../services/ticketService";
import { toast } from "react-toastify";

export default function TicketDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    ticketService
      .getById(id)
      .then((res) => setTicket(res.data.data || res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  const handleDelete = async () => {
    const confirm = window.confirm("Are you sure you want to delete this ticket?");
    if (!confirm) return;
    try {
      await ticketService.remove(ticket.ticketId);
      toast.success("Ticket deleted successfully!");
      navigate("/tickets");
    } catch (err) {
      toast.error("Failed to delete ticket");
      console.error(err);
    }
  };

  if (loading) return <Loader />;
  if (!ticket) return <div className="p-6 text-center text-gray-600">Ticket not found.</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <Navbar />
      <div className="flex justify-center py-12">
        <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
          <h3 className="text-2xl font-semibold mb-4 text-gray-800">{ticket.title}</h3>
          <p className="text-gray-700 mb-3">{ticket.description}</p>
          <p className="text-sm text-gray-500 mb-1">
            Priority: <b>{ticket.priority}</b>
          </p>
          <p className="text-sm text-gray-500">
            Status: <b>{ticket.status}</b>
          </p>

          <div className="flex justify-between mt-6">
            <button
              onClick={() => navigate(`/tickets/${ticket.ticketId}?edit=true`)}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              Edit
            </button>
            <button
              onClick={handleDelete}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
