// src/components/Loader.jsx
export default function Loader({ size = 40 }) {
  return (
    <div className="flex items-center justify-center">
      <div
        style={{ width: size, height: size }}
        className="border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"
      />
    </div>
  );
}
