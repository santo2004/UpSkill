import Navbar from "../../components/Navbar";

export default function Dashboard() {
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <Navbar />
      <div className="pt-10 flex justify-center">
        <div className="bg-white shadow-lg rounded-lg p-8 w-3/4 text-center">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">
            Welcome, {user?.email?.split("@")[0] || "User"} 👋
          </h2>
          <p className="text-gray-600">
            You are logged in as <b>{user?.role || "Customer"}</b>.
          </p>
        </div>
      </div>
    </div>
  );
}
