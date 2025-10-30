export default function ServerError() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-6xl font-bold text-red-700">500</h1>
      <p className="text-gray-600 mt-2">Internal Server Error</p>
      <a href="/dashboard" className="mt-4 text-blue-600 hover:underline">
        Retry
      </a>
    </div>
  );
}
