// src/pages/Dashboard/Dashboard.jsx
import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import Loader from "../../components/Loader";
import { ticketService } from "../../services/ticketService";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";

const COLORS = ["#2563eb", "#facc15", "#22c55e", "#ef4444", "#6366f1"];

export default function Dashboard() {
  const [stats, setStats] = useState({
    total: 0,
    open: 0,
    inProgress: 0,
    resolved: 0,
    closed: 0,
  });
  const [agentWorkload, setAgentWorkload] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await ticketService.getAll();
        const tickets = res.data.data || res.data;

        const grouped = {
          total: tickets.length,
          open: tickets.filter((t) => t.status === "New" || t.status === "Assigned").length,
          inProgress: tickets.filter((t) => t.status === "In Progress").length,
          resolved: tickets.filter((t) => t.status === "Resolved").length,
          closed: tickets.filter((t) => t.status === "Closed").length,
        };

        const workload = Object.values(
          tickets.reduce((acc, t) => {
            const agent = t.assignedTo || "Unassigned";
            if (!acc[agent]) acc[agent] = { agent, tickets: 0 };
            acc[agent].tickets++;
            return acc;
          }, {})
        );

        setStats(grouped);
        setAgentWorkload(workload);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) return <Loader />;

  const statusData = [
    { name: "Open", value: stats.open },
    { name: "In Progress", value: stats.inProgress },
    { name: "Resolved", value: stats.resolved },
    { name: "Closed", value: stats.closed },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="p-8 max-w-6xl mx-auto">
        <h1 className="text-3xl font-semibold mb-8 text-gray-800">Admin Dashboard</h1>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <SummaryCard label="Total Tickets" value={stats.total} color="bg-blue-600" />
          <SummaryCard label="Open" value={stats.open} color="bg-yellow-500" />
          <SummaryCard label="In Progress" value={stats.inProgress} color="bg-indigo-500" />
          <SummaryCard label="Resolved" value={stats.resolved} color="bg-green-500" />
          <SummaryCard label="Closed" value={stats.closed} color="bg-gray-700" />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Agent Workload */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-4">Agent Workload</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={agentWorkload}>
                <XAxis dataKey="agent" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="tickets" fill="#2563eb" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Status Distribution */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-4">Ticket Status Distribution</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={statusData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Legend />
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

function SummaryCard({ label, value, color }) {
  return (
    <div className={`rounded-lg shadow text-white p-6 ${color}`}>
      <h3 className="text-lg">{label}</h3>
      <p className="text-3xl font-bold mt-2">{value}</p>
    </div>
  );
}