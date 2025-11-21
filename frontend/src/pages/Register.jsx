import { useState } from "react";
import axiosInstance from "../api/axiosInstance";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [form, setForm] = useState({
    firstname: "",
    name: "",
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const navigate = useNavigate();

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleRegister(e) {
    e.preventDefault();
    setError("");

    try {
      await axiosInstance.post("/auth/register", form);
      navigate("/login");
    } catch (err) {
      setError("Erreur lors de l'inscription.");
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
        Créer un compte
      </h2>

      <form
        onSubmit={handleRegister}
        style={{ display: "flex", flexDirection: "column", gap: "15px" }}
      >
        <input
          name="firstname"
          placeholder="Prénom"
          onChange={handleChange}
          required
          style={input}
        />

        <input
          name="name"
          placeholder="Nom"
          onChange={handleChange}
          required
          style={input}
        />

        <input
          name="email"
          type="email"
          placeholder="Email"
          onChange={handleChange}
          required
          style={input}
        />

        <input
          name="password"
          type="password"
          placeholder="Mot de passe"
          onChange={handleChange}
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
          S'inscrire
        </button>
      </form>
    </div>
  );
}
