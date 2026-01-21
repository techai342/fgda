import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="flex flex-wrap gap-3 p-4 justify-center border-b border-cyan-400">
      <Link to="/" className="hover:text-cyan-400 transition px-3 py-1">Home</Link>
      <Link to="/about" className="hover:text-cyan-400 transition px-3 py-1">About</Link>
      <Link to="/gallery" className="hover:text-cyan-400 transition px-3 py-1">Gallery</Link>
      <Link to="/social" className="hover:text-cyan-400 transition px-3 py-1">Social</Link>
      <Link 
        to="/admin" 
        className="px-4 py-2 bg-gradient-to-r from-orange-500 to-red-600 rounded-lg font-bold hover:shadow-[0_0_15px_orange] transition flex items-center gap-2"
      >
        <span>🔐</span>
        Admin
      </Link>
      <Link 
        to="/web-dashboard" 
        className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg font-bold hover:shadow-[0_0_15px_blue] transition flex items-center gap-2"
      >
        <span>⚙️</span>
        Web Dashboard
      </Link>
      <Link 
        to="/squad-manager" 
        className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg font-bold hover:shadow-[0_0_15px_green] transition flex items-center gap-2"
      >
        <span>👥</span>
        Squad Manager
      </Link>
    </nav>
  );
}
