import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Home() {
  const { user } = useAuth();

  const features = [
    {
      title: "Dashboard",
      desc: "Un aperçu clair de votre consommation du jour.",
      link: "/dashboard",
      color: "#F6C23E",
    },
    {
      title: "Ajouter une consommation",
      desc: "Ajoutez rapidement une boisson ou un aliment consommé.",
      link: "/add",
      color: "#4E73DF",
    },
    {
      title: "Historique",
      desc: "Consultez toutes vos consommations précédentes.",
      link: "/history",
      color: "#1CC88A",
    },
    {
      title: "Statistiques",
      desc: "Visualisez votre sucre, caféine et calories.",
      link: "/statistics",
      color: "#36B9CC",
    },
    {
      title: "Leaderboard",
      desc: "Comparez vos scores avec d’autres utilisateurs.",
      link: "/leaderboard",
      color: "#E74A3B",
    },
    {
      title: "Profil",
      desc: "Modifiez vos informations personnelles.",
      link: "/profile",
      color: "#858796",
    },
  ];

  return (
    <div style={{ textAlign: "center", marginTop: "30px" }}>
      
      {/* Header */}
      <h1 style={{ fontSize: "32px", fontWeight: "600" }}>
        Bienvenue sur <span style={{ color: "#4E73DF" }}>GlycAmed</span>
      </h1>

      <p style={{ fontSize: "18px", marginTop: "10px", color: "#555" }}>
        L’outil de suivi simple et rapide pour une vie plus saine.
      </p>

      {/* CTA si pas connecté */}
      {!user && (
        <div style={{ marginTop: "25px" }}>
          <Link
            to="/login"
            style={{
              padding: "12px 25px",
              background: "#4E73DF",
              color: "white",
              borderRadius: "10px",
              textDecoration: "none",
              fontWeight: "600",
              marginRight: "15px",
            }}
          >
            Connexion
          </Link>

          <Link
            to="/register"
            style={{
              padding: "12px 25px",
              background: "#1CC88A",
              color: "white",
              borderRadius: "10px",
              textDecoration: "none",
              fontWeight: "600",
            }}
          >
            Inscription
          </Link>
        </div>
      )}

      {/* Greeting si connecté */}
      {user && (
        <p style={{ marginTop: "20px", fontSize: "18px", fontWeight: "500" }}>
          Bonjour, <span style={{ color: "#4E73DF" }}>{user.firstname}</span> 👋  
          <br />
          Voici vos fonctionnalités :
        </p>
      )}

      {/* Grid Fonctionnalités */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
          gap: "20px",
          marginTop: "40px",
          padding: "0 20px",
        }}
      >
        {features.map((f) => (
          <Link
            key={f.title}
            to={user ? f.link : "/login"}
            style={{
              background: "#1E1E1E",
              borderRadius: "16px",
              padding: "22px",
              textDecoration: "none",
              textAlign: "left",
              boxShadow: "0 0 20px rgba(0,0,0,0.3)",
              border: "1px solid rgba(255,255,255,0.05)",
              transition: "all 0.25s ease",
              color: "white",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-4px)";
              e.currentTarget.style.boxShadow = "0 0 25px rgba(0,0,0,0.45)";
              e.currentTarget.style.border = "1px solid rgba(255,255,255,0.15)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0px)";
              e.currentTarget.style.boxShadow = "0 0 20px rgba(0,0,0,0.3)";
              e.currentTarget.style.border = "1px solid rgba(255,255,255,0.05)";
            }}
          >
            <div
              style={{
                width: "48px",
                height: "48px",
                borderRadius: "10px",
                background: f.color,
                marginBottom: "15px",
              }}
            ></div>

            <h3 style={{ margin: "0 0 8px 0", color: "#F1F1F1" }}>{f.title}</h3>
            <p style={{ margin: "0", color: "#BBBBBB" }}>{f.desc}</p>
          </Link>
        ))}
      </div>

      {/* Footer */}
      <p style={{ marginTop: "40px", fontSize: "14px", color: "#999" }}>
        GlycAmed © 2025 – Suivi nutritionnel simplifié.
      </p>
    </div>
  );
}
