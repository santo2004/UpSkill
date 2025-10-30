import { useEffect, useState } from "react";
import { getCommentsByTicket } from "../../services/commentService";
import Navbar from "../../components/Navbar";

export default function CommentSection() {
  const [comments, setComments] = useState([]);

  useEffect(() => {
    const load = async () => {
      const res = await getCommentsByTicket(1);
      setComments(res.data || []);
    };
    load();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="pt-20 px-8">
        <h2 className="text-2xl font-semibold mb-4">Comments</h2>
        <div className="bg-white p-4 rounded shadow">
          {comments.length > 0 ? (
            comments.map((c, i) => (
              <div key={i} className="border-b py-2">
                <p className="font-semibold">{c.author}</p>
                <p className="text-sm text-gray-600">{c.text}</p>
              </div>
            ))
          ) : (
            <p>No comments available.</p>
          )}
        </div>
      </div>
    </div>
  );
}
