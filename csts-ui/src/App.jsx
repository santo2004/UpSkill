// src/App.jsx
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import AppToast from "./components/ToastContainer";
import ProtectedRoute from "./components/ProtectedRoute";

// Auth Pages
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";

// Core Pages
import Dashboard from "./pages/Dashboard/Dashboard";
import UserManagement from "./pages/Users/UserManagement";
import TicketList from "./pages/Tickets/TicketList";
import TicketForm from "./pages/Tickets/TicketForm";
import TicketDetails from "./pages/Tickets/TicketDetails";

// Error Pages
import NotFound from "./pages/Errors/NotFound";
import Forbidden from "./pages/Errors/Forbidden";

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppToast />
        <div className="min-h-screen bg-gray-100">
          <Routes>
            {/* Default Route */}
            <Route path="/" element={<Navigate to="/login" />} />

            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Dashboard */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute roles={["Admin", "Agent", "Customer"]}>
                  <Dashboard />
                </ProtectedRoute>
              }
            />

            {/* Ticket Management */}
            <Route
              path="/tickets"
              element={
                <ProtectedRoute roles={["Admin", "Agent", "Customer"]}>
                  <TicketList />
                </ProtectedRoute>
              }
            />
            <Route
              path="/tickets/new"
              element={
                <ProtectedRoute roles={["Customer", "Admin"]}>
                  <TicketForm />
                </ProtectedRoute>
              }
            />
            <Route
              path="/tickets/:id"
              element={
                <ProtectedRoute roles={["Admin", "Agent", "Customer"]}>
                  <TicketDetails />
                </ProtectedRoute>
              }
            />

            {/* User Management */}
            <Route
              path="/users"
              element={
                <ProtectedRoute roles={["Admin"]}>
                  <UserManagement />
                </ProtectedRoute>
              }
            />

            {/* Errors */}
            <Route path="/forbidden" element={<Forbidden />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;