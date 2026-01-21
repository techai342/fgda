import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="flex flex-wrap gap-3 p-4 justify-center border-b border-cyan-400 bg-black/80 backdrop-blur-md">
      {/* Only Management System Buttons */}
      <Link 
        to="/admin" 
        className="px-5 py-3 bg-gradient-to-r from-orange-500 to-red-600 rounded-xl font-bold hover:shadow-[0_0_20px_orange] transition-all flex items-center gap-2 text-sm uppercase tracking-wider"
      >
        <span className="text-lg">🔐</span>
        <span>Admin Panel</span>
      </Link>
      
      <Link 
        to="/web-dashboard" 
        className="px-5 py-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl font-bold hover:shadow-[0_0_20px_blue] transition-all flex items-center gap-2 text-sm uppercase tracking-wider"
      >
        <span className="text-lg">⚙️</span>
        <span>Web Dashboard</span>
      </Link>
      
      <Link 
        to="/squad-manager" 
        className="px-5 py-3 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl font-bold hover:shadow-[0_0_20px_green] transition-all flex items-center gap-2 text-sm uppercase tracking-wider"
      >
        <span className="text-lg">👥</span>
        <span>Squad Manager</span>
      </Link>
    </nav>
  );
}
