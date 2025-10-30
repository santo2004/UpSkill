import Navbar from "../../components/Navbar";

export default function CommentSection() {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <Navbar />
      <div className="flex flex-col items-center justify-center py-20">
        <h2 className="text-3xl font-semibold mb-4 text-gray-800">Comments</h2>
        <p className="text-gray-600 max-w-xl text-center">
          This section will allow users to view and add comments on tickets.  
          (Coming soon — placeholder content.)
        </p>
      </div>
    </div>
  );
}
