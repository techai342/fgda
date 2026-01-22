import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showLoginForm, setShowLoginForm] = useState(false);
  const navigate = useNavigate();

  // Delay login form appearance
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowLoginForm(true);
    }, 800);
    
    return () => clearTimeout(timer);
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    // Simulate API call
    setTimeout(() => {
      if (username === "saqib" && password === "saqibadmin") {
        // Store login status in localStorage
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("username", username);
        
        // Redirect to home page
        navigate("/");
      } else {
        setError("Invalid username or password!");
      }
      setIsLoading(false);
    }, 1000);
  };

  // Handle Enter key press
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleLogin(e);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center p-4">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -inset-[10px] opacity-30">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
          <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse delay-2000"></div>
        </div>
      </div>

      {/* Login Card */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-md"
      >
        <AnimatePresence>
          {showLoginForm && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="glass p-8 md:p-10 rounded-3xl border border-white/20 shadow-2xl">
                {/* Header */}
                <div className="text-center mb-8">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-2xl mb-4">
                    <span className="text-3xl">🔐</span>
                  </div>
                  <h1 className="text-3xl font-black text-white mb-2">
                    ADMIN PORTAL
                  </h1>
                  <p className="text-gray-400 text-sm">
                    Enter credentials to access management systems
                  </p>
                </div>

                {/* Login Form */}
                <form onSubmit={handleLogin}>
                  <div className="space-y-6">
                    {/* Username Field */}
                    <div>
                      <label className="block text-sm font-bold text-gray-300 mb-2">
                        Username
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <span className="text-gray-500">👤</span>
                        </div>
                        <input
                          type="text"
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                          onKeyPress={handleKeyPress}
                          className="w-full pl-10 pr-4 py-3 bg-black/50 border border-white/10 rounded-xl text-white focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/30 transition-all"
                          placeholder="Enter username"
                          required
                          autoFocus
                        />
                      </div>
                    </div>

                    {/* Password Field */}
                    <div>
                      <label className="block text-sm font-bold text-gray-300 mb-2">
                        Password
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <span className="text-gray-500">🔒</span>
                        </div>
                        <input
                          type="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          onKeyPress={handleKeyPress}
                          className="w-full pl-10 pr-4 py-3 bg-black/50 border border-white/10 rounded-xl text-white focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/30 transition-all"
                          placeholder="Enter password"
                          required
                        />
                      </div>
                    </div>

                    {/* Error Message */}
                    {error && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-red-500/10 border border-red-500/30 text-red-500 px-4 py-3 rounded-xl text-sm"
                      >
                        ⚠️ {error}
                      </motion.div>
                    )}

                    {/* Login Button */}
                    <button
                      type="submit"
                      disabled={isLoading}
                      className={`w-full py-3.5 px-4 rounded-xl font-bold text-white transition-all ${
                        isLoading
                          ? "bg-gray-600 cursor-not-allowed"
                          : "bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 hover:shadow-[0_0_30px_#06b6d4]"
                      }`}
                    >
                      {isLoading ? (
                        <span className="flex items-center justify-center">
                          <svg className="animate-spin h-5 w-5 mr-2 text-white" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Authenticating...
                        </span>
                      ) : (
                        "Sign In"
                      )}
                    </button>
                  </div>
                </form>

                {/* Footer */}
                <div className="mt-8 pt-6 border-t border-white/10">
                  <p className="text-center text-gray-500 text-sm">
                    Tournament Management System • Secure Access Required
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-gray-500 text-sm">
            Tournament Management System • Secure Access Required
          </p>
        </div>
      </motion.div>

      {/* Inline CSS */}
      <style jsx>{`
        .glass {
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(15px);
          -webkit-backdrop-filter: blur(15px);
        }
      `}</style>
    </div>
  );
};

export default Login;
