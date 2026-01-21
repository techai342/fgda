import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="flex gap-6 p-4 justify-center border-b border-cyan-400">
      <Link to="/">Home</Link>
      <Link to="/about">About</Link>
      <Link to="/gallery">Gallery</Link>
      <Link to="/social">Social</Link>
      <Link to="/admin" className="text-pink-400 font-bold">Admin Manager</Link>
    </nav>
  );
}
