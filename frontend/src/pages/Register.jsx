import { useState } from "react";
import axiosInstance from "../api/axiosInstance";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [form, setForm] = useState({
    firstname: "",
    lastname: "",
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

  return (
    <div style={{ maxWidth: "400px", margin: "auto" }}>
      <h2>Créer un compte</h2>

      <form onSubmit={handleRegister} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        
        <input name="firstname" placeholder="Prénom" onChange={handleChange} required />
        <input name="name" placeholder="Nom" onChange={handleChange} required />
        <input name="email" type="email" placeholder="Email" onChange={handleChange} required />
        <input name="password" type="password" placeholder="Mot de passe" onChange={handleChange} required />

        {error && <p style={{ color: "red" }}>{error}</p>}

        <button style={{ padding: "10px", fontWeight: "600" }}>
          S'inscrire
        </button>
      </form>
    </div>
  );
}
