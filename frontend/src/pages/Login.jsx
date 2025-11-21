import { useState } from "react";
import axiosInstance from "../api/axiosInstance";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleLogin(e) {
    e.preventDefault();
    setError("");

    try {
      const res = await axiosInstance.post("/auth/login", { email, password });

      login(res.data.user, res.data.token);

      navigate("/dashboard");
    } catch (err) {
      setError("Email ou mot de passe incorrect.");
    }
  }

  const card = {
    maxWidth: "400px",
    margin: "60px auto",
    padding: "30px",
    background: "white",
    borderRadius: "14px",
    border: "1px solid #e7e7e7",
    boxShadow: "0 6px 16px rgba(90, 79, 207, 0.10)",
  };

  const input = {
    width: "100%",
    padding: "12px 15px",
    borderRadius: "10px",
    border: "1px solid #d1d1d1",
    background: "white",
    fontSize: "15px",
  };

  const button = {
    width: "100%",
    padding: "12px",
    background: "#5A4FCF",
    color: "white",
    border: "none",
    borderRadius: "10px",
    fontWeight: "600",
    cursor: "pointer",
    outline: "2px solid black",
    transition: "0.2s",
    fontSize: "16px",
  };

  return (
    <div style={card}>
      <h2 style={{ color: "#5A4FCF", textAlign: "center", marginBottom: "25px" }}>
        Connexion
      </h2>

      <form
        onSubmit={handleLogin}
        style={{ display: "flex", flexDirection: "column", gap: "15px" }}
      >
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={input}
        />

        <input
          type="password"
          placeholder="Mot de passe"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={input}
        />

        {error && (
          <p style={{ color: "red", marginTop: "-5px" }}>{error}</p>
        )}

        <button
          style={button}
          onMouseEnter={(e) => (e.target.style.background = "#4A3DB0")}
          onMouseLeave={(e) => (e.target.style.background = "#5A4FCF")}
        >
          Se connecter
        </button>
      </form>
    </div>
  );
}
