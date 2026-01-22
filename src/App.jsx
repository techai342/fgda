import { useState, useEffect } from "react";
import { HashRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";
import WelcomeAnimation from "./components/WelcomeAnimation";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Admin from "./pages/Admin";
import WebDashboard from "./pages/WebDashboard";
import SquadManager from "./pages/SquadManager";

export default function App() {
  const [showWelcome, setShowWelcome] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  // Check if user is already logged in
  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    const hasSeenWelcome = localStorage.getItem("hasSeenWelcome");

    // Skip welcome if already seen today
    if (hasSeenWelcome === new Date().toDateString()) {
      setShowWelcome(false);
    }

    // Set loading false after initial check
    setTimeout(() => setIsLoading(false), 500);
  }, []);

  const handleWelcomeComplete = () => {
    localStorage.setItem("hasSeenWelcome", new Date().toDateString());
    setShowWelcome(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white">Initializing...</div>
      </div>
    );
  }

  return (
    <Router>
      {/* Show Welcome Animation First */}
      {showWelcome && <WelcomeAnimation onComplete={handleWelcomeComplete} />}
      
      {/* Main App */}
      {!showWelcome && (
        <>
          <Navbar />
          <Routes>
            <Route path="/" element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            } />
            
            <Route path="/login" element={<Login />} />
            
            <Route path="/admin" element={
              <ProtectedRoute>
                <Admin />
              </ProtectedRoute>
            } />
            
            <Route path="/web-dashboard" element={
              <ProtectedRoute>
                <WebDashboard />
              </ProtectedRoute>
            } />
            
            <Route path="/squad-manager" element={
              <ProtectedRoute>
                <SquadManager />
              </ProtectedRoute>
            } />
            
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </>
      )}
    </Router>
  );
}
