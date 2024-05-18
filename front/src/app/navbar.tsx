import "~/styles/globals.css";

export default function Navbar() {
  return (
    <nav className="bg-gray-600 p-4">
      <div className="container mx-auto">
        <a href="/" className="text-white font-bold text-xl">HawkHacks2024</a>
        <div className="flex space-x-4">
          <a href="/" className="text-white">Home</a>
          <a href="/login" className="text-white">Login</a>
        </div>
      </div>
    </nav>
  );
}
