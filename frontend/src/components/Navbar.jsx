import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav
      style={{
        background: "#4E73DF",
        padding: "12px 20px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        color: "white",
        marginBottom: "20px",
      }}
    >
      <Link
        to="/"
        style={{
          color: "white",
          textDecoration: "none",
          fontSize: "20px",
          fontWeight: "600",
        }}
      >
        GlycAmed
      </Link>

      <div style={{ display: "flex", gap: "20px", alignItems: "center" }}>
        {user && (
          <>
            <Link to="/dashboard" style={{ color: "white" }}>
              Dashboard
            </Link>
            <Link to="/add" style={{ color: "white" }}>
              Add
            </Link>
            <Link to="/history" style={{ color: "white" }}>
              History
            </Link>
            <Link to="/statistics" style={{ color: "white" }}>
              Stats
            </Link>
            <Link to="/leaderboard" style={{ color: "white" }}>
              Leaderboard
            </Link>

            {/* 🔥 NOUVEAU : Profil */}
            <Link to="/profile" style={{ color: "white" }}>
              Profile
            </Link>
          </>
        )}

        {!user && (
          <>
            <Link to="/login" style={{ color: "white" }}>
              Login
            </Link>
            <Link to="/register" style={{ color: "white" }}>
              Register
            </Link>
          </>
        )}

        {user && (
          <button
            onClick={logout}
            style={{
              background: "white",
              color: "#4E73DF",
              borderRadius: "6px",
              padding: "5px 12px",
              border: "none",
              cursor: "pointer",
              fontWeight: "600",
            }}
          >
            Logout
          </button>
        )}
      </div>
    </nav>
  );
}
