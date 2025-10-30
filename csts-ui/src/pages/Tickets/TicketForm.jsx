import { useState } from "react";
import { createTicket } from "../../services/ticketService";
import Navbar from "../../components/Navbar";

export default function TicketForm() {
  const [form, setForm] = useState({ title: "", description: "" });
  const [msg, setMsg] = useState("");

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createTicket(form);
      setMsg("Ticket created successfully!");
    } catch {
      setMsg("Failed to create ticket");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="pt-20 px-8 flex justify-center">
        <form
          onSubmit={handleSubmit}
          className="bg-white shadow-lg rounded-lg p-6 w-full sm:w-1/2"
        >
          <h2 className="text-2xl font-semibold mb-4 text-blue-700 text-center">
            Create New Ticket
          </h2>
          <input
            name="title"
            placeholder="Title"
            value={form.title}
            onChange={handleChange}
            className="w-full mb-3 p-2 border rounded"
          />
          <textarea
            name="description"
            placeholder="Description"
            value={form.description}
            onChange={handleChange}
            className="w-full mb-3 p-2 border rounded"
          />
          <button className="bg-blue-600 text-white px-4 py-2 rounded w-full hover:bg-blue-700">
            Submit
          </button>
          {msg && <p className="text-center mt-3 text-sm">{msg}</p>}
        </form>
      </div>
    </div>
  );
}
