// src/pages/Tickets/TicketForm.jsx
import { useState, useEffect } from "react";
import { ticketService } from "../../services/ticketService";
import { useNavigate, useParams } from "react-router-dom";
import Loader from "../../components/Loader";

export default function TicketForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({ title: "", description: "", priority: "Medium", assignedTo: null });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (id) {
      setLoading(true);
      ticketService.getById(id)
        .then(res => {
          const data = res.data.data || res.data;
          setForm({ title: data.title, description: data.description, priority: data.priority, assignedTo: data.assignedTo });
        })
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [id]);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    try {
      if (id) await ticketService.update(id, form);
      else await ticketService.create(form);
      navigate("/tickets");
    } catch (err) {
      console.error(err);
      alert("Failed");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="p-6">
      <h3 className="text-xl mb-4">{id ? "Edit Ticket" : "Create Ticket"}</h3>
      <form onSubmit={handleSubmit} className="max-w-xl">
        <label className="block mb-2">Title</label>
        <input required name="title" value={form.title} onChange={handleChange} className="w-full p-2 mb-3 border rounded" />

        <label className="block mb-2">Description</label>
        <textarea required name="description" value={form.description} onChange={handleChange} className="w-full p-2 mb-3 border rounded" />

        <label className="block mb-2">Priority</label>
        <select name="priority" value={form.priority} onChange={handleChange} className="w-full p-2 mb-3 border rounded">
          <option>Low</option>
          <option>Medium</option>
          <option>High</option>
        </select>

        <button type="submit" className="bg-blue-600 text-white py-2 px-4 rounded">{id ? "Update" : "Create"}</button>
      </form>
    </div>
  );
}
