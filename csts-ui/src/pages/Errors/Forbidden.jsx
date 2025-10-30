export default function Forbidden() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-6xl font-bold text-red-600">403</h1>
      <p className="text-gray-600 mt-2">Access Denied</p>
      <a href="/dashboard" className="mt-4 text-blue-600 hover:underline">
        Back to Dashboard
      </a>
    </div>
  );
}
