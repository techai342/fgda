import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Admin from "./pages/Admin";
import WebDashboard from "./pages/WebDashboard";
import SquadManager from "./pages/SquadManager";

export default function App() {
  return (
    <BrowserRouter>
      {/* Navbar will be shown only when user is logged in */}
      <Navbar />
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        
        {/* Protected Routes */}
        <Route path="/" element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        } />
        
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
        
        {/* Redirect all unknown routes to login */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
