import { useEffect, useState } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Loader from "../../components/Loader";
import { ticketService } from "../../services/ticketService";
import { toast } from "react-toastify";
import useAuth from "../../hooks/useAuth";
import CommentSection from "../Comments/CommentSection"; // ✅ added

export default function TicketDetails() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ status: "", description: "" });
  const editMode = searchParams.get("edit") === "true";

  // ✅ Fetch ticket details
  useEffect(() => {
    setLoading(true);
    ticketService
      .getById(id)
      .then((res) => {
        const data = res.data.data || res.data;
        setTicket(data);
        setForm({ status: data?.status || "", description: data?.description || "" });
      })
      .catch((err) => {
        console.error(err);
        toast.error("Failed to load ticket");
      })
      .finally(() => setLoading(false));
  }, [id]);

  // ✅ Handle ticket update
  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await ticketService.update(id, {
        status: form.status,
        description: form.description,
      });
      toast.success("Ticket updated successfully!");
      navigate("/tickets");
    } catch (err) {
      console.error(err);
      toast.error("Failed to update ticket");
    }
  };

  if (loading) return <Loader />;
  if (!ticket) return <p className="text-center mt-20">Ticket not found.</p>;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <Navbar />
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow p-6">
        <h3 className="text-2xl font-semibold mb-4 text-gray-800">
          Ticket Details
        </h3>

        {/* ✅ View Mode */}
        {!editMode ? (
          <>
            <p className="mb-2">
              <b>Title:</b> {ticket.title}
            </p>
            <p className="mb-2">
              <b>Description:</b> {ticket.description}
            </p>
            <p className="mb-2">
              <b>Status:</b> {ticket.status}
            </p>
            <p className="mb-2">
              <b>Priority:</b> {ticket.priority}
            </p>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => navigate(`/tickets/${ticket.ticketId}?edit=true`)}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                Edit
              </button>

              <button
                onClick={() => navigate("/tickets")}
                className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
              >
                ← Back to Tickets
              </button>
            </div>
          </>
        ) : (
          // ✅ Edit Mode
          <form onSubmit={handleUpdate}>
            <label className="block mb-2 text-gray-700 font-medium">Status</label>
            <select
              name="status"
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
              className="w-full border p-2 rounded mb-4"
            >
              <option>New</option>
              <option>Assigned</option>
              <option>In Progress</option>
              <option>Resolved</option>
              <option>Closed</option>
            </select>

            <label className="block mb-2 text-gray-700 font-medium">
              Description
            </label>
            <textarea
              name="description"
              rows="4"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
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

        {/* ✅ Comment Section */}
        <div className="mt-6">
          <CommentSection ticketId={ticket.ticketId} />
        </div>
      </div>
    </div>
  );
}
