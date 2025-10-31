import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import { commentService } from "../../services/commentService";
import { toast } from "react-toastify";
import Loader from "../../components/Loader";
import useAuth from "../../hooks/useAuth";

export default function CommentSection() {
  const { ticketId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [comments, setComments] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  const loadComments = async () => {
    try {
      const res = await commentService.getByTicket(ticketId);
      setComments(res.data.data || res.data);
    } catch (err) {
      toast.error("Failed to fetch comments");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!message.trim()) return toast.warn("Enter a comment");
    try {
      await commentService.add({
        message,
        ticketId: parseInt(ticketId),
        userId: user.userId,
      });
      setMessage("");
      toast.success("Comment added!");
      loadComments();
    } catch (err) {
      toast.error("Failed to add comment");
      console.error(err);
    }
  };

  useEffect(() => {
    loadComments();
  }, [ticketId]);

  if (loading) return <Loader />;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <Navbar />
      <div className="max-w-3xl mx-auto bg-white shadow-md rounded-lg p-6 mt-10">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold text-gray-800">Comments</h2>
          <button
            onClick={() => navigate(`/tickets/${ticketId}`)}
            className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
          >
            ← Back to Ticket
          </button>
        </div>

        {comments.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No comments yet.</p>
        ) : (
          <div className="space-y-4 mb-6">
            {comments.map((c) => (
              <div key={c.commentId} className="border-b pb-3">
                <div className="flex justify-between items-center">
                  <p className="font-semibold text-gray-800">{c.userName}</p>
                </div>
                <p className="text-gray-700 mt-1">{c.message}</p>
              </div>
            ))}
          </div>
        )}

        <form onSubmit={handleAdd} className="flex items-center gap-2">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type a comment..."
            className="flex-1 p-2 border rounded focus:outline-blue-500"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
}
