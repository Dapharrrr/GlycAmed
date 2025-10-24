import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import "../styles/navbar.css";

const Navbar = () => {
  const { token, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <h2>GlycAmed</h2>
      {token && (
        <ul>
          <li><Link to="/dashboard">Dashboard</Link></li>
          <li><Link to="/add">Ajouter</Link></li>
          <li><Link to="/history">Historique</Link></li>
          <li><Link to="/statistics">Statistiques</Link></li>
          <li><Link to="/leaderboard">Classement</Link></li>
          <li onClick={handleLogout}>Déconnexion</li>
        </ul>
      )}
    </nav>
  );
};

export default Navbar;
