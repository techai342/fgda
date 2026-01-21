import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const username = localStorage.getItem("username") || "Admin";

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("username");
    navigate("/login");
  };

  return (
    <nav className="flex flex-wrap gap-3 p-4 justify-between items-center border-b border-cyan-400 bg-black/80 backdrop-blur-md">
      {/* Left Side - User Info */}
      <div className="flex items-center gap-3">
        <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
        <span className="text-sm font-bold text-cyan-400">Welcome, {username}</span>
      </div>

      {/* Middle - Navigation Buttons */}
      <div className="flex flex-wrap gap-3 justify-center">
        <Link 
          to="/" 
          className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg font-bold hover:shadow-[0_0_15px_cyan] transition-all flex items-center gap-2 text-sm"
        >
          <span>🏠</span>
          Home
        </Link>
        
        <Link 
          to="/admin" 
          className="px-4 py-2 bg-gradient-to-r from-orange-500 to-red-600 rounded-lg font-bold hover:shadow-[0_0_15px_orange] transition-all flex items-center gap-2 text-sm"
        >
          <span>🔐</span>
          Admin Panel
        </Link>
        
        <Link 
          to="/web-dashboard" 
          className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg font-bold hover:shadow-[0_0_15px_blue] transition-all flex items-center gap-2 text-sm"
        >
          <span>⚙️</span>
          Web Dashboard
        </Link>
        
        <Link 
          to="/squad-manager" 
          className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg font-bold hover:shadow-[0_0_15px_green] transition-all flex items-center gap-2 text-sm"
        >
          <span>👥</span>
          Squad Manager
        </Link>
      </div>

      {/* Right Side - Logout Button */}
      <button
        onClick={handleLogout}
        className="px-4 py-2 bg-gradient-to-r from-red-600 to-orange-600 rounded-lg font-bold hover:shadow-[0_0_15px_red] transition-all flex items-center gap-2 text-sm"
      >
        <span>🚪</span>
        Logout
      </button>
    </nav>
  );
}
