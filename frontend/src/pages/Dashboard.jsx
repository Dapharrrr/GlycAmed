import { useEffect, useState } from "react";
import axiosInstance from "../api/axiosInstance";

export default function Dashboard() {
  const [summary, setSummary] = useState(null);

  useEffect(() => {
    axiosInstance
      .get("/consumptions/summary")
      .then((res) => setSummary(res.data))
      .catch(() => setSummary(null));
  }, []);

  if (!summary) return <p>Chargement...</p>;

  // Limite max journalière
  const MAX_SUGAR = 50; // g
  const MAX_CAFFEINE = 400; // mg

  const pct = (value, max) => {
    const p = (value / max) * 100;
    return Math.min(Math.round(p), 100);
  };

  // Couleur dynamique en fonction du % 
  const barColor = (p) => {
    if (p < 50) return "#1CC88A"; // vert
    if (p < 80) return "#F6C23E"; // jaune
    return "#E74A3B"; // rouge
  };

  const sugarPct = pct(summary.totalSugar, MAX_SUGAR);
  const caffeinePct = pct(summary.totalCaffeine, MAX_CAFFEINE);

  return (
    <div style={{ maxWidth: 600, margin: "0 auto", color: "#fff" }}>
      <h2 style={{ marginBottom: 30 }}>Dashboard</h2>

      {/* ---- SUCRE ---- */}
      <div style={{ marginBottom: 35 }}>
        <h3 style={{ marginBottom: 5 }}>Sucre</h3>
        <p style={{ margin: "4px 0 10px 0", color: "#ccc" }}>
          {summary.totalSugar}g / {MAX_SUGAR}g
        </p>

        <div
          style={{
            background: "#2C2F33",
            height: 14,
            borderRadius: 2,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              height: "100%",
              width: sugarPct + "%",
              background: barColor(sugarPct),
              borderRadius: 2,
              transition: "width 0.4s ease",
            }}
          ></div>
        </div>

        <p style={{ marginTop: 6, color: "#aaa", fontSize: 13 }}>
          {sugarPct}% de votre limite quotidienne
        </p>
      </div>

      {/* ---- CAFÉINE ---- */}
      <div>
        <h3 style={{ marginBottom: 5 }}>Caféine</h3>
        <p style={{ margin: "4px 0 10px 0", color: "#ccc" }}>
          {summary.totalCaffeine}mg / {MAX_CAFFEINE}mg
        </p>

        <div
          style={{
            background: "#2C2F33",
            height: 14,
            borderRadius: 2,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              height: "100%",
              width: caffeinePct + "%",
              background: barColor(caffeinePct),
              borderRadius: 2,
              transition: "width 0.4s ease",
            }}
          ></div>
        </div>

        <p style={{ marginTop: 6, color: "#aaa", fontSize: 13 }}>
          {caffeinePct}% de votre limite quotidienne
        </p>
      </div>
    </div>
  );
}
