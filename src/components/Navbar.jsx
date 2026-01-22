
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [showInstallButton, setShowInstallButton] = useState(false);
  const [isAppInstalled, setIsAppInstalled] = useState(false);
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

  // PWA Install Logic
  useEffect(() => {
    // Check if app is already installed
    const checkIfInstalled = () => {
      const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
      
      if (isStandalone) {
        setIsAppInstalled(true);
        setShowInstallButton(false);
      }

      // For iOS, we need to check differently
      if (isIOS && window.navigator.standalone) {
        setIsAppInstalled(true);
        setShowInstallButton(false);
      }
    };

    // Listen for beforeinstallprompt event
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      // Store the event for later use
      window.deferredPrompt = e;
      
      // Show install button after 5 seconds if not installed
      setTimeout(() => {
        if (!isAppInstalled) {
          setShowInstallButton(true);
        }
      }, 5000);
    };

    // Listen for app installed event
    const handleAppInstalled = () => {
      setIsAppInstalled(true);
      setShowInstallButton(false);
      console.log('🎉 PWA installed successfully!');
    };

    // Check initial install status
    checkIfInstalled();

    // Add event listeners
    if ('BeforeInstallPromptEvent' in window) {
      window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    }
    
    window.addEventListener('appinstalled', handleAppInstalled);

    // Cleanup
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, [isAppInstalled]);

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("username");
    setIsLoggedIn(false);
    navigate("/login");
  };

  // PWA Install Function
  const handleInstallPWA = () => {
    if (window.deferredPrompt) {
      window.deferredPrompt.prompt();
      
      window.deferredPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === 'accepted') {
          console.log('✅ User accepted PWA install');
          setIsAppInstalled(true);
          setShowInstallButton(false);
          
          // Show success message
          showInstallSuccess();
        } else {
          console.log('❌ User dismissed PWA install');
        }
        window.deferredPrompt = null;
      });
    } else {
      // For browsers that don't support beforeinstallprompt (iOS Safari)
      showIOSInstructions();
    }
  };

  const showInstallSuccess = () => {
    const el = document.createElement('div');
    el.className = 'fixed top-4 right-4 bg-green-500 text-white px-4 py-3 rounded-xl shadow-lg z-[1000] flex items-center';
    el.innerHTML = `
      <span class="mr-2">✅</span>
      <span>App installed successfully!</span>
    `;
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 3000);
  };

  const showIOSInstructions = () => {
    const el = document.createElement('div');
    el.className = 'fixed inset-0 bg-black/80 z-[9999] flex items-center justify-center p-4';
    el.innerHTML = `
      <div class="bg-gray-900 rounded-2xl p-6 max-w-md w-full border border-cyan-500/30">
        <h3 class="text-xl font-bold text-white mb-4">📱 Install on iOS</h3>
        <ol class="text-gray-300 space-y-3 text-sm">
          <li class="flex items-start">
            <span class="bg-cyan-500 text-white rounded-full w-6 h-6 flex items-center justify-center mr-3 flex-shrink-0">1</span>
            Tap the <strong>Share</strong> button (📤) in Safari
          </li>
          <li class="flex items-start">
            <span class="bg-cyan-500 text-white rounded-full w-6 h-6 flex items-center justify-center mr-3 flex-shrink-0">2</span>
            Scroll down and tap <strong>"Add to Home Screen"</strong>
          </li>
          <li class="flex items-start">
            <span class="bg-cyan-500 text-white rounded-full w-6 h-6 flex items-center justify-center mr-3 flex-shrink-0">3</span>
            Tap <strong>"Add"</strong> in top right corner
          </li>
        </ol>
        <button class="mt-6 w-full bg-cyan-600 hover:bg-cyan-700 text-white py-3 rounded-xl font-bold transition">
          Got it!
        </button>
      </div>
    `;
    
    document.body.appendChild(el);
    
    // Close when clicking button
    el.querySelector('button').addEventListener('click', () => {
      el.remove();
    });
    
    // Close when clicking outside
    el.addEventListener('click', (e) => {
      if (e.target === el) {
        el.remove();
      }
    });
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

            {/* Right Side - User Info & Buttons */}
            <div className="flex items-center space-x-3">
              {/* PWA Install Button (Desktop) */}
              {showInstallButton && !isAppInstalled && (
                <button
                  onClick={handleInstallPWA}
                  className="hidden md:flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:shadow-[0_0_15px_green] rounded-xl font-semibold transition-all animate-pulse"
                >
                  <span>⬇️</span>
                  <span>Install App</span>
                </button>
              )}
              
              {/* User Info */}
              <div className="hidden sm:flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-white/5">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-cyan-300">
                  {username}
                  {isAppInstalled && <span className="ml-1 text-xs">📱</span>}
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
                    {isAppInstalled && <span className="ml-1 text-xs">📱</span>}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-red-600 to-orange-600 text-sm font-semibold"
                >
                  Logout
                </button>
              </div>

              {/* PWA Install Button (Mobile) */}
              {showInstallButton && !isAppInstalled && (
                <button
                  onClick={handleInstallPWA}
                  className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl font-semibold mb-3"
                >
                  <span>⬇️</span>
                  <span>Install App</span>
                </button>
              )}

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
                    href="https://tech-ai1.vercel.app/" 
                    label="Tech AI" 
                  />
                  <ExternalLink 
                    href="https://saqib.zone.id/" 
                    label="Saqib Zone" 
                  />
                  <ExternalLink 
                    href="https://eman.zone.id/" 
                    label="Eman Zone" 
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

      {/* Floating Install Button for Desktop (after 10 seconds) */}
      {showInstallButton && !isAppInstalled && (
        <div className="fixed bottom-6 right-6 z-40 animate-bounce">
          <button
            onClick={handleInstallPWA}
            className="flex items-center space-x-2 px-5 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-bold shadow-lg shadow-green-500/30 hover:shadow-[0_0_20px_green] transition-all"
          >
            <span className="text-xl">⬇️</span>
            <div className="text-left">
              <div className="text-sm">Install App</div>
              <div className="text-xs opacity-80">For quick access</div>
            </div>
          </button>
        </div>
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
