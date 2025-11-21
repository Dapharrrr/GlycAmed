import { useEffect, useState } from "react";
import axiosInstance from "../api/axiosInstance";
import { useNavigate } from "react-router-dom";
import "../styles/home.css";

export default function Home() {
  const navigate = useNavigate();
  const [summary, setSummary] = useState(null);
  const [last, setLast] = useState([]);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    try {
      const res = await axiosInstance.get("/consumptions/summary");

      const summaryData = res.data.data;

      setSummary({
        totalSug: summaryData.totalSugars,
        totalCaf: summaryData.totalCaffeine,
      });

      const listRes = await axiosInstance.get("/consumptions");
      const list =
        listRes.data.consumptions ||
        listRes.data.data ||
        listRes.data.items ||
        listRes.data ||
        [];

      list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

      setLast(list.slice(0, 3));
    } catch (err) {
      console.error(err);
    }
  }

  if (!summary)
    return <p style={{ textAlign: "center", marginTop: 40 }}>Chargement…</p>;

  const pct = (v, max) => Math.min(Math.round((v / max) * 100), 100);

  const getBarClass = (value, max) => {
    const percentage = (value / max) * 100;
    if (percentage >= 100) return "danger";
    if (percentage >= 70) return "warning";
    return "normal";
  };

  return (
    <div className="home-page">
      <div className="left-column">
        <div className="card">
          <h2>Résumé du jour</h2>

          <h3 className="icon-label">🧊 Sucre</h3>
          <p>{summary.totalSug}g / 50g</p>
          <div className="progress-container">
            <div
              className={`progress-bar ${getBarClass(summary.totalSug, 50)}`}
              style={{ width: pct(summary.totalSug, 50) + "%" }}
            ></div>
          </div>

          <h3 className="icon-label">
            ☕ Caféine
          </h3>
          <p>{summary.totalCaf}mg / 400mg</p>
          <div className="progress-container">
            <div
              className={`progress-bar ${getBarClass(summary.totalCaf, 400)}`}
              style={{ width: pct(summary.totalCaf, 400) + "%" }}
            ></div>
          </div>
        </div>

        <div className="card">
          <h2>Dernières consommations</h2>

          {last.length === 0 && <p>Aucune consommation enregistrée.</p>}

          {last.map((c) => (
            <div key={c._id} className="history-item">
              <strong>{c.productName}</strong>
              <p>
                Sucre: {c.nutrients.sugars}g — Caféine: {c.nutrients.caffeine}mg
              </p>
              <small>{new Date(c.createdAt).toLocaleString()}</small>
            </div>
          ))}

          <button className="history-btn" onClick={() => navigate("/history")}>
            Voir l’historique complet
          </button>
        </div>
      </div>

      <div>
        <div className="side-card" onClick={() => navigate("/add")}>
          <h3>Ajouter une consommation</h3>
        </div>

        <div className="side-card" onClick={() => navigate("/statistics")}>
          <h3>Statistiques</h3>
        </div>

        <div className="side-card" onClick={() => navigate("/profile")}>
          <h3>Mon profil</h3>
        </div>

        <div className="side-card" onClick={() => navigate("/leaderboard")}>
          <h3>Leaderboard</h3>
        </div>
      </div>
    </div>
  );
}
