import { useEffect, useState } from "react";
import { commentService } from "../../services/commentService";
import Loader from "../../components/Loader";
import useAuth from "../../hooks/useAuth";
import { toast } from "react-toastify";

export default function CommentSection({ ticketId, hideNavbar = false }) {
  const { user } = useAuth();
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!ticketId) return;
    commentService
      .getByTicket(ticketId)
      .then((res) => setComments(res.data.data || res.data))
      .catch(() => toast.error("Failed to load comments"))
      .finally(() => setLoading(false));
  }, [ticketId]);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;
    try {
      await commentService.create({ ticketId, text: message });
      setMessage("");
      toast.success("Comment added!");
      const res = await commentService.getByTicket(ticketId);
      setComments(res.data.data || res.data);
    } catch {
      toast.error("Failed to add comment");
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="bg-white rounded-lg shadow p-6 mt-6">
      <h4 className="text-lg font-semibold mb-4">Comments</h4>

      {comments.length === 0 && <p className="text-gray-500">No comments yet.</p>}

      {comments.map((c) => (
        <div key={c.commentId} className="border-b py-3">
          <p className="text-sm text-gray-800">{c.text}</p>
          <span className="text-xs text-gray-500">
            — {c.userName} ({new Date(c.createdAt).toLocaleString()})
          </span>
        </div>
      ))}

      <form onSubmit={handleAdd} className="mt-4 flex gap-3">
        <input
          type="text"
          placeholder="Add a comment..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="flex-1 border rounded px-3 py-2"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Post
        </button>
      </form>
    </div>
  );
}