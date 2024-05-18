export default function Navbar() {
  return (
    <nav className="p-4">
      <div className="container mx-auto">
        <a href="/" className="font-bold text-xl">HawkHacks2024</a>
        <div className="flex space-x-4">
          <a href="/" className="">Home</a>
          <a href="//25870074.propelauthtest.com" className="">Login</a>
          <a href="/annotate" className="">Annotate</a>
        </div>
      </div>
    </nav>
  );
}
