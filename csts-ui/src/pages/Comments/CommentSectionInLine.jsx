import { useEffect, useState } from "react";
import { commentService } from "../../services/commentService";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-toastify";

export default function CommentSectionInline({ ticketId }) {
  const { user } = useAuth();
  const [comments, setComments] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      const res = await commentService.getByTicket(ticketId);
      const data = res.data.data || res.data || [];
      setComments(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!ticketId) return;
    load();
    // eslint-disable-next-line
  }, [ticketId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;
    try {
      await commentService.add({
        ticketId,
        userId: user.userId,
        message: message.trim()
      });
      setMessage("");
      toast.success("Comment added");
      load();
    } catch (err) {
      console.error(err);
      toast.error("Failed to add comment");
    }
  };

  if (loading) return <div className="p-4">Loading comments…</div>;

  return (
    <div className="bg-white p-4 rounded shadow">
      <h4 className="font-semibold mb-3">Comments</h4>

      {comments.length === 0 ? <p className="text-gray-500 mb-3">No comments yet. Be the first to comment.</p>
        : <div className="space-y-3 mb-3">
          {comments.map(c => (
            <div key={c.commentId} className="border rounded p-2">
              <div className="text-sm text-gray-700">{c.message}</div>
              <div className="text-xs text-gray-500 mt-1">By {c.userName} • {new Date(c.createdDate || c.createdAt || Date.now()).toLocaleString()}</div>
            </div>
          ))}
        </div>
      }

      <form onSubmit={handleSubmit} className="mt-2">
        <textarea value={message} onChange={e => setMessage(e.target.value)} className="w-full p-2 border rounded mb-2" placeholder="Write a comment..." />
        <div className="flex justify-end">
          <button className="bg-blue-600 text-white px-4 py-1 rounded">Add Comment</button>
        </div>
      </form>
    </div>
  );
}
