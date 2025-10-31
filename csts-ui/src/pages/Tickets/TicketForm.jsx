import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Loader from "../../components/Loader";
import { ticketService } from "../../services/ticketService";
import { toast } from "react-toastify";
import { useAuth } from "../../context/AuthContext";

export default function TicketForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [form, setForm] = useState({ title: "", description: "", priority: "Medium" });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    ticketService.getById(id)
      .then(res => {
        const data = res.data.data || res.data;
        setForm({
          title: data.title,
          description: data.description,
          priority: data.priority,
        });
      })
      .catch(err => {
        console.error(err);
        toast.error("Failed to load ticket");
      })
      .finally(() => setLoading(false));
  }, [id]);

  const handleChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (id) {
        // Update — Admin/Agent can update any fields; Customer may only close (controller enforces)
        await ticketService.update(id, form);
        toast.success("Ticket updated");
      } else {
        // Create — include createdBy id
        const payload = { ...form, createdBy: user.userId };
        await ticketService.create(payload);
        toast.success("Ticket created");
      }
      navigate("/tickets");
    } catch (err) {
      console.error(err);
      toast.error("Save failed");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex justify-center py-12">
        <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
          <h3 className="text-2xl font-semibold mb-6 text-center">{id ? "Edit Ticket" : "Create Ticket"}</h3>
          <form onSubmit={handleSubmit}>
            <label className="block mb-1">Title</label>
            <input name="title" required value={form.title} onChange={handleChange} className="w-full p-2 mb-3 border rounded" />
            <label className="block mb-1">Description</label>
            <textarea name="description" required value={form.description} onChange={handleChange} className="w-full p-2 mb-3 border rounded" />
            <label className="block mb-1">Priority</label>
            <select name="priority" value={form.priority} onChange={handleChange} className="w-full p-2 mb-4 border rounded">
              <option>Low</option>
              <option>Medium</option>
              <option>High</option>
            </select>
            <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded">
              {id ? "Update Ticket" : "Create Ticket"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
