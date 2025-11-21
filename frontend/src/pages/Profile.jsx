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

  if (!form) return <p>Chargement...</p>;

  const card = {
    maxWidth: "600px",
    margin: "50px auto",
    padding: "30px",
    background: "white",
    borderRadius: "14px",
    border: "1px solid #e7e7e7",
    boxShadow: "0 6px 16px rgba(90, 79, 207, 0.10)",
  };

  const label = {
    fontWeight: "600",
    marginBottom: "6px",
    display: "block",
    color: "#333",
  };

  const input = {
    width: "100%",
    padding: "12px 15px",
    marginBottom: "18px",
    borderRadius: "10px",
    border: "1px solid #d1d1d1",
    background: "white",
    color: "#333",
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
    transition: "0.2s",
    outline: "2px solid black", 
    fontSize: "16px",
  };


  return (
    <div style={card}>
      <h2
        style={{
          textAlign: "center",
          marginBottom: "25px",
          fontSize: "28px",
          color: "#5A4FCF",
        }}
      >
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

      <button
        style={button}
        onMouseEnter={(e) => (e.target.style.background = "#4A3DB0")}
        onMouseLeave={(e) => (e.target.style.background = "#5A4FCF")}
        onClick={handleSave}
      >
        Enregistrer
      </button>
    </div>
  );
}
