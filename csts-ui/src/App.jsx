// src/App.jsx
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import Dashboard from "./pages/Dashboard/Dashboard";
import UserManagement from "./pages/Users/UserManagement";
import TicketList from "./pages/Tickets/TicketList";
import TicketForm from "./pages/Tickets/TicketForm";
import TicketDetails from "./pages/Tickets/TicketDetails";
import CommentSection from "./pages/Comments/CommentSection";
import NotFound from "./pages/Errors/NotFound";
import Forbidden from "./pages/Errors/Forbidden";
import ProtectedRoute from "./components/ProtectedRoute";
import AppToast from "./components/ToastContainer";

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppToast />
        <div className="min-h-screen bg-gray-100">
          <Routes>
            <Route path="/" element={<Navigate to="/login" />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/tickets" element={<ProtectedRoute><TicketList /></ProtectedRoute>} />
            <Route path="/tickets/new" element={<ProtectedRoute><TicketForm /></ProtectedRoute>} />
            <Route path="/tickets/:id" element={<ProtectedRoute><TicketDetails /></ProtectedRoute>} />

            <Route path="/users" element={<ProtectedRoute roles={["Admin"]}><UserManagement /></ProtectedRoute>} />

            <Route path="/comments" element={<ProtectedRoute roles={["Admin","Agent","Customer"]}><CommentSection /></ProtectedRoute>} />

            <Route path="/forbidden" element={<Forbidden />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;