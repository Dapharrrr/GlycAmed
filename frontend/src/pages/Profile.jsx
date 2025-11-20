import { useEffect, useState } from "react";
import axiosInstance from "../api/axiosInstance";
import { useAuth } from "../context/AuthContext";

export default function Profile() {
  const { user, login } = useAuth();
  const [form, setForm] = useState(user);

  useEffect(() => {
    axiosInstance.get("/auth/profile").then((res) => {
      setForm(res.data);
    });
  }, []);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSave() {
    const res = await axiosInstance.put("/auth/profile", form);
    login(res.data, localStorage.getItem("token"));
    alert("Profil mis à jour !");
  }

  if (!form) return <p style={{ color: "white" }}>Chargement...</p>;

  const container = {
    maxWidth: "600px",
    margin: "50px auto",
    padding: "30px",
    background: "#1c1c1c",
    borderRadius: "20px",
    boxShadow: "0 0 20px rgba(0,0,0,0.4)",
    color: "white",
  };

  const input = {
    width: "100%",
    padding: "12px 15px",
    marginBottom: "18px",
    borderRadius: "10px",
    border: "1px solid #3a3a3a",
    background: "#111",
    color: "white",
    fontSize: "15px",
  };

  const label = {
    fontWeight: "600",
    marginBottom: "6px",
    display: "block",
  };

  const button = {
    width: "100%",
    padding: "12px",
    background: "#36B9CC",
    border: "none",
    borderRadius: "10px",
    color: "white",
    fontWeight: "600",
    cursor: "pointer",
    transition: "0.2s",
    fontSize: "16px",
  };

  return (
    <div style={container}>
      <h2 style={{ textAlign: "center", marginBottom: "25px", fontSize: "28px" }}>
        Mon profil
      </h2>

      <div style={{ marginBottom: "20px" }}>
        <label style={label}>Prénom</label>
        <input
          name="firstname"
          value={form.firstname}
          onChange={handleChange}
          style={input}
        />
      </div>

      <div style={{ marginBottom: "20px" }}>
        <label style={label}>Nom</label>
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          style={input}
        />
      </div>

      <div style={{ marginBottom: "20px" }}>
        <label style={label}>Email</label>
        <input
          name="email"
          value={form.email}
          onChange={handleChange}
          style={input}
        />
      </div>

      <button style={button} onClick={handleSave}>
        Enregistrer
      </button>
    </div>
  );
}
