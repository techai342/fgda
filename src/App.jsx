import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import About from "./pages/About";
import Gallery from "./pages/Gallery";
import Social from "./pages/Social";
import Admin from "./pages/Admin";
import WebDashboard from "./pages/WebDashboard"; // نئی لائن

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/social" element={<Social />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/web-dashboard" element={<WebDashboard />} /> {/* نئی route */}
      </Routes>
    </BrowserRouter>
  );
}
