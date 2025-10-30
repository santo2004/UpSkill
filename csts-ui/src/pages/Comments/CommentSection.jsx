// src/pages/Comments/CommentSection.jsx
import { useEffect, useState } from "react";
import { commentService } from "../../services/commentService";
import useAuth from "../../hooks/useAuth";

export default function CommentSection({ ticketId }) {
  const [comments, setComments] = useState([]);
  const [text, setText] = useState("");
  const { user } = useAuth();

  useEffect(() => {
    commentService.getByTicket(ticketId)
      .then(res => setComments(res.data.data || res.data))
      .catch(console.error);
  }, [ticketId]);

  const submit = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    const payload = { ticketId, userId: user?.userId, message: text };
    try {
      await commentService.add(payload);
      setText("");
      const res = await commentService.getByTicket(ticketId);
      setComments(res.data.data || res.data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <h4 className="font-bold mb-2">Comments</h4>
      <div className="space-y-2 mb-4">
        {comments.map(c => (
          <div key={c.commentId} className="p-2 bg-gray-50 rounded">
            <div className="text-sm text-gray-700">{c.message}</div>
            <div className="text-xs text-gray-400">{c.createdDate}</div>
          </div>
        ))}
        {!comments.length && <p className="text-sm text-gray-500">No comments yet.</p>}
      </div>

      <form onSubmit={submit} className="flex gap-2">
        <input value={text} onChange={(e) => setText(e.target.value)} className="flex-1 p-2 border rounded" />
        <button className="bg-blue-600 text-white px-3 py-1 rounded">Send</button>
      </form>
    </div>
  );
}
