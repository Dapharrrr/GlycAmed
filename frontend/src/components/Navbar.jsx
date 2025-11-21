import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../styles/navbar.css";

export default function Navbar() {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const location = useLocation();

  const toggleMenu = () => setOpen(!open);
  const closeMenu = () => setOpen(false);

  return (
    <nav className="navbar">

      {/* LOGO */}
      <div className="nav-logo">
        <Link to="/" onClick={closeMenu}>
          GlycAmed
        </Link>
      </div>

      {/* BURGER */}
      <div className={`nav-toggle ${open ? "open" : ""}`} onClick={toggleMenu}>
        <span></span>
        <span></span>
        <span></span>
      </div>

      {/* LINKS */}
      <div className={`nav-links ${open ? "active" : ""}`}>
        {user && (
          <>
            <Link
              to="/dashboard"
              className={location.pathname === "/dashboard" ? "active" : ""}
              onClick={closeMenu}
            >
              Dashboard
            </Link>

            <Link
              to="/add"
              className={location.pathname === "/add" ? "active" : ""}
              onClick={closeMenu}
            >
              Ajouter
            </Link>

            <Link
              to="/history"
              className={location.pathname === "/history" ? "active" : ""}
              onClick={closeMenu}
            >
              Historique
            </Link>

            <Link
              to="/statistics"
              className={location.pathname === "/statistics" ? "active" : ""}
              onClick={closeMenu}
            >
              Statistiques
            </Link>

            <Link
              to="/leaderboard"
              className={location.pathname === "/leaderboard" ? "active" : ""}
              onClick={closeMenu}
            >
              Leaderboard
            </Link>

            <Link
              to="/profile"
              className={location.pathname === "/profile" ? "active" : ""}
              onClick={closeMenu}
            >
              Profil
            </Link>

            <button className="logout-btn" onClick={() => { logout(); closeMenu(); }}>
              Logout
            </button>
          </>
        )}

        {!user && (
          <>
            <Link
              to="/login"
              className={location.pathname === "/login" ? "active" : ""}
              onClick={closeMenu}
            >
              Login
            </Link>
            <Link
              to="/register"
              className={location.pathname === "/register" ? "active" : ""}
              onClick={closeMenu}
            >
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
