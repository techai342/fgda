import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();
  const username = localStorage.getItem("username") || "Admin";

  // Check if user is logged in
  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    if (!isLoggedIn) {
      navigate("/login");
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("username");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -inset-[10px] opacity-30">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
          <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse delay-2000"></div>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 max-w-7xl mx-auto px-4 py-8"
      >
        {/* Header with User Info */}
        <motion.div
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-8 p-6 glass rounded-3xl border border-white/10"
        >
          <div className="text-center sm:text-left">
            <h1 className="text-3xl md:text-4xl font-black mb-2 bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500">
              WELCOME, {username.toUpperCase()}!
            </h1>
            <p className="text-gray-400 text-sm md:text-base">
              Tournament Management Control Panel
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="px-5 py-2.5 bg-gradient-to-r from-red-600 to-orange-600 rounded-xl font-bold hover:shadow-[0_0_20px_red] transition-all flex items-center gap-2 text-sm"
          >
            <span>🚪</span>
            Logout
          </button>
        </motion.div>

        {/* Main Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {/* Admin Panel Card */}
          <motion.div
            initial={{ x: -30, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="glass p-6 rounded-3xl border border-orange-500/30 hover:border-orange-500 transition-all group hover:scale-[1.02]"
          >
            <div className="text-4xl mb-4 text-center">🔐</div>
            <h2 className="text-xl font-bold text-white mb-3 text-center">Admin Panel</h2>
            <p className="text-gray-400 mb-5 text-sm text-center">
              Manage payments, verify transactions, and assign tournament slots
            </p>
            <Link
              to="/admin"
              className="block w-full bg-gradient-to-r from-orange-600 to-red-600 text-white py-3 px-6 rounded-xl font-bold text-center hover:shadow-[0_0_25px_orange] transition-all text-sm"
            >
              Access Admin
            </Link>
          </motion.div>

          {/* Web Dashboard Card */}
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="glass p-6 rounded-3xl border border-blue-500/30 hover:border-blue-500 transition-all group hover:scale-[1.02]"
          >
            <div className="text-4xl mb-4 text-center">⚙️</div>
            <h2 className="text-xl font-bold text-white mb-3 text-center">Web Dashboard</h2>
            <p className="text-gray-400 mb-5 text-sm text-center">
              Control website settings, tournament details, and registration status
            </p>
            <Link
              to="/web-dashboard"
              className="block w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-xl font-bold text-center hover:shadow-[0_0_25px_blue] transition-all text-sm"
            >
              Access Dashboard
            </Link>
          </motion.div>

          {/* Squad Manager Card */}
          <motion.div
            initial={{ x: 30, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="glass p-6 rounded-3xl border border-green-500/30 hover:border-green-500 transition-all group hover:scale-[1.02]"
          >
            <div className="text-4xl mb-4 text-center">👥</div>
            <h2 className="text-xl font-bold text-white mb-3 text-center">Squad Manager</h2>
            <p className="text-gray-400 mb-5 text-sm text-center">
              Manage team registrations, passwords, and squad data
            </p>
            <Link
              to="/squad-manager"
              className="block w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 px-6 rounded-xl font-bold text-center hover:shadow-[0_0_25px_green] transition-all text-sm"
            >
              Access Squad Manager
            </Link>
          </motion.div>
        </div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="glass p-6 rounded-3xl border border-white/10 mb-8"
        >
          <h2 className="text-xl font-bold text-white mb-5 text-center">System Status</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-black/50 rounded-2xl border border-green-500/20">
              <div className="text-2xl font-bold text-green-400 mb-1">Online</div>
              <div className="text-gray-400 text-xs md:text-sm">All Systems</div>
            </div>
            <div className="text-center p-4 bg-black/50 rounded-2xl border border-blue-500/20">
              <div className="text-2xl font-bold text-blue-400 mb-1">3</div>
              <div className="text-gray-400 text-xs md:text-sm">Active Panels</div>
            </div>
            <div className="text-center p-4 bg-black/50 rounded-2xl border border-cyan-500/20 col-span-2 md:col-span-1">
              <div className="text-2xl font-bold text-cyan-400 mb-1">Secure</div>
              <div className="text-gray-400 text-xs md:text-sm">Protected Access</div>
            </div>
          </div>
        </motion.div>

        {/* Quick Links */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center glass p-5 rounded-3xl border border-white/10"
        >
          <p className="text-gray-300 mb-4 text-base font-bold">External Links</p>
          <div className="flex flex-wrap justify-center gap-3">
                 <ExternalQuickLink 
              href="https://tech-ai1.vercel.app/" 
              icon="🤖"
              label="Tech AI" 
            />
            <ExternalQuickLink 
              href="https://saqib.zone.id/" 
              icon="🌐"
              label="Saqib Zone" 
            />
            <ExternalQuickLink 
              href="https://eman.zone.id/" 
              icon="⚡"
              label="Eman Zone" 
            />
          </div>
        </motion.div>
      </div>

      {/* Footer */}
      <footer className="relative z-10 text-center py-6 border-t border-white/10 mt-6">
        <p className="text-gray-500 text-xs md:text-sm">
          Logged in as: <span className="text-cyan-400 font-bold">{username}</span> • Tournament Management System • v2.0
        </p>
      </footer>

      {/* Inline CSS */}
      <style jsx>{`
        .glass {
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
        }
      `}</style>
    </div>
  );
}

// External Quick Link Component
const ExternalQuickLink = ({ href, icon, label }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className="flex items-center gap-2 px-4 py-2.5 bg-white/10 hover:bg-white/20 rounded-xl text-sm transition-all min-w-[120px] justify-center"
  >
    <span>{icon}</span>
    <span>{label}</span>
  </a>
);
