// src/pages/Comments/CommentSection.jsx
import { useEffect, useState } from "react";
import { commentService } from "../../services/commentService";
import Loader from "../../components/Loader";
import Navbar from "../../components/Navbar";
import useAuth from "../../hooks/useAuth";
import { toast } from "react-toastify";

export default function CommentSection({ ticketId }) {
  const { user } = useAuth();
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(!!ticketId);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!ticketId) return;
    setLoading(true);
    commentService
      .getByTicket(ticketId)
      .then((res) => setComments(res.data.data || res.data || []))
      .catch((err) => {
        console.error(err);
        toast.error("Failed to load comments");
      })
      .finally(() => setLoading(false));
  }, [ticketId]);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;
    try {
      const payload = { ticketId: Number(ticketId), userId: user?.userId || user?.UserId, message };
      await commentService.add(payload);
      setMessage("");
      // reload
      const res = await commentService.getByTicket(ticketId);
      setComments(res.data.data || res.data || []);
      toast.success("Comment added");
    } catch (err) {
      console.error(err);
      toast.error("Failed to add comment");
    }
  };

  if (ticketId && loading) return <Loader />;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <Navbar />
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-semibold mb-4">Comments</h2>

        {!ticketId ? (
          <p className="text-gray-600">Open a ticket to view its comments here.</p>
        ) : (
          <>
            {comments.length === 0 ? (
              <p className="text-gray-600">No comments yet. Be the first to comment.</p>
            ) : (
              <div className="space-y-3 mb-4">
                {comments.map((c) => (
                  <div key={c.commentId} className="p-3 border rounded">
                    <div className="text-sm font-medium">{c.userName}</div>
                    <div className="text-sm text-gray-700">{c.message}</div>
                  </div>
                ))}
              </div>
            )}

            <form onSubmit={handleAdd} className="mt-4">
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Write a comment..."
                className="w-full p-2 border rounded mb-2"
              />
              <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
                Add Comment
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}