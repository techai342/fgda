import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const navigate = useNavigate();

  // Check login status
  useEffect(() => {
    const loggedIn = localStorage.getItem("isLoggedIn");
    const user = localStorage.getItem("username");
    
    if (loggedIn === "true" && user) {
      setIsLoggedIn(true);
      setUsername(user);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("username");
    setIsLoggedIn(false);
    navigate("/login");
  };

  // If not logged in, don't show navbar
  if (!isLoggedIn) {
    return null;
  }

  return (
    <>
      {/* Main Navbar */}
      <nav className="sticky top-0 z-50 border-b border-cyan-400/30 bg-black/90 backdrop-blur-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo/Left Side */}
            <div className="flex items-center">
              <Link to="/" className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
                  <span className="text-white font-bold text-sm">MG</span>
                </div>
                <span className="hidden md:inline text-white font-bold text-lg">
                  Management
                </span>
              </Link>
            </div>

            {/* Desktop Navigation - Center */}
            <div className="hidden md:flex items-center justify-center space-x-2">
              <NavButton to="/" icon="🏠" label="Dashboard" />
              <NavButton to="/admin" icon="🔐" label="Admin Panel" />
              <NavButton to="/web-dashboard" icon="⚙️" label="Web Dashboard" />
              <NavButton to="/squad-manager" icon="👥" label="Squad Manager" />
            </div>

            {/* Right Side - User Info & Logout */}
            <div className="flex items-center space-x-3">
              {/* User Info */}
              <div className="hidden sm:flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-white/5">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-cyan-300">
                  {username}
                </span>
              </div>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
              >
                {isMobileMenuOpen ? (
                  <span className="text-white text-xl">✕</span>
                ) : (
                  <span className="text-white text-xl">☰</span>
                )}
              </button>

              {/* Desktop Logout Button */}
              <button
                onClick={handleLogout}
                className="hidden md:flex items-center space-x-2 px-4 py-2 rounded-lg bg-gradient-to-r from-red-600 to-orange-600 hover:shadow-[0_0_15px_red] transition-all"
              >
                <span>🚪</span>
                <span className="font-semibold">Logout</span>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:hidden bg-black/95 border-t border-white/10 backdrop-blur-xl"
          >
            <div className="px-4 py-3 space-y-1">
              {/* User Info Mobile */}
              <div className="flex items-center justify-between px-3 py-3 rounded-lg bg-white/5 mb-2">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium text-cyan-300">
                    {username}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-red-600 to-orange-600 text-sm font-semibold"
                >
                  Logout
                </button>
              </div>

              {/* Mobile Menu Links */}
              <MobileNavLink 
                to="/" 
                icon="🏠" 
                label="Dashboard" 
                onClick={() => setIsMobileMenuOpen(false)}
              />
              <MobileNavLink 
                to="/admin" 
                icon="🔐" 
                label="Admin Panel" 
                onClick={() => setIsMobileMenuOpen(false)}
              />
              <MobileNavLink 
                to="/web-dashboard" 
                icon="⚙️" 
                label="Web Dashboard" 
                onClick={() => setIsMobileMenuOpen(false)}
              />
              <MobileNavLink 
                to="/squad-manager" 
                icon="👥" 
                label="Squad Manager" 
                onClick={() => setIsMobileMenuOpen(false)}
              />

              {/* Quick Links Section */}
              <div className="pt-3 border-t border-white/10 mt-3">
                <p className="text-xs text-gray-500 px-3 mb-2 uppercase tracking-wider">
                  Quick Links
                </p>
                <div className="grid grid-cols-2 gap-2">
                  <ExternalLink 
                    href="https://admindta.vercel.app/" 
                    label="Squad V2" 
                  />
                  <ExternalLink 
                    href="https://adminpaymentdasboard.vercel.app/" 
                    label="Payment" 
                  />
                  <ExternalLink 
                    href="https://webmanger.vercel.app/" 
                    label="Web Mgr" 
                  />
                  <ExternalLink 
                    href="https://webmanger2-v1ed.vercel.app/" 
                    label="Web Mgr 2" 
                  />
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </nav>

      {/* Mobile Menu Background Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </>
  );
}

// Desktop Navigation Button Component
const NavButton = ({ to, icon, label }) => (
  <Link
    to={to}
    className="group relative px-4 py-2 rounded-lg transition-all duration-200 hover:bg-white/5"
  >
    <div className="flex items-center space-x-2">
      <span className="text-lg">{icon}</span>
      <span className="font-medium text-white">{label}</span>
    </div>
    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-cyan-500 to-blue-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-200"></div>
  </Link>
);

// Mobile Navigation Link Component
const MobileNavLink = ({ to, icon, label, onClick }) => (
  <Link
    to={to}
    onClick={onClick}
    className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-white/5 transition-colors"
  >
    <span className="text-xl">{icon}</span>
    <span className="font-medium text-white">{label}</span>
  </Link>
);

// External Link Component for Mobile
const ExternalLink = ({ href, label }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className="flex items-center justify-center px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-sm transition-colors"
  >
    {label}
  </a>
);

// Framer Motion import
import { motion } from "framer-motion";
