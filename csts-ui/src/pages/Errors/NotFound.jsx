export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-6xl font-bold text-blue-700">404</h1>
      <p className="text-gray-600 mt-2">Page Not Found</p>
      <a href="/dashboard" className="mt-4 text-blue-600 hover:underline">
        Go Back Home
      </a>
    </div>
  );
}
