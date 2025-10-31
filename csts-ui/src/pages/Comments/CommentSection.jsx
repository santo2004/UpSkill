import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import Loader from "../../components/Loader";
import useAuth from "../../hooks/useAuth";
import { commentService } from "../../services/commentService";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";

export default function CommentSection({ ticketId: propTicketId }) {
  const { user } = useAuth();
  const params = useParams();
  const ticketId = propTicketId || params.id;
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const load = async () => {
    setLoading(true);
    try {
      const res = await commentService.getByTicket(ticketId);
      setComments(res.data.data || res.data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load comments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (ticketId) load();
    else setLoading(false);
  }, [ticketId]);

  const addComment = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;
    try {
      const payload = { ticketId: Number(ticketId), userId: user.UserId || user.userId, message: message.trim() };
      await commentService.add(payload);
      setMessage("");
      load();
      toast.success("Comment added");
    } catch (err) {
      console.error(err);
      toast.error("Failed to add comment");
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <Navbar />
      <div className="max-w-3xl mx-auto mt-10 bg-white p-6 rounded shadow">
        <h2 className="text-xl font-semibold mb-4">Comments</h2>
        {!ticketId ? (
          <p className="text-sm text-gray-600">Open a ticket to view comments here.</p>
        ) : (
          <>
            <div className="space-y-3 mb-4">
              {comments.map((c) => (
                <div key={c.commentId} className="p-3 bg-gray-50 rounded">
                  <div className="text-sm font-semibold">{c.userName}</div>
                  <div className="text-sm text-gray-700">{c.message}</div>
                </div>
              ))}
            </div>

            <form onSubmit={addComment}>
              <textarea
                rows="3"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Write a comment..."
                className="w-full p-2 border rounded mb-3"
              />
              <div className="flex justify-end">
                <button className="bg-blue-600 text-white px-4 py-2 rounded">Add Comment</button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}