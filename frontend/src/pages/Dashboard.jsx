import { useEffect, useState } from "react";
import axiosInstance from "../api/axiosInstance";

export default function Dashboard() {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axiosInstance
      .get("/consumptions/summary")
      .then((res) => {
        setSummary(res.data.data);
      })
      .catch((err) => {
        console.error("Dashboard error:", err);
        setSummary(null);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading || !summary) {
    return (
      <div
        style={{
          textAlign: "center",
          marginTop: "60px",
          color: "#ccc",
          fontSize: "18px",
        }}
      >
        Chargement du dashboard…
      </div>
    );
  }

  const LIMIT_SUGAR = 50; 
  const LIMIT_CAFFEINE = 400;

  function percentage(value, max) {
    if (!value || value <= 0) return 0;
    return Math.min(Math.round((value / max) * 100), 100);
  }

  function barColor(p) {
    if (p < 50) return "#1CC88A";
    if (p < 80) return "#F6C23E"; 
    return "#E74A3B";
  }

  const sugarPct = percentage(summary.totalSugars, LIMIT_SUGAR);
  const caffeinePct = percentage(summary.totalCaffeine, LIMIT_CAFFEINE);

  return (
    <div
        style={{
          maxWidth: "650px",
          margin: "40px auto",
          padding: "40px",
          background: "white",           
          borderRadius: "20px",
          border: "1px solid #E5E7EB",      
          boxShadow: "0 6px 16px rgba(90, 79, 207, 0.10)",
          color: "#1A1A1A",          
          fontFamily: "Inter, sans-serif",
        }}
      >
      <h2 style={{ textAlign: "center", marginBottom: "30px", color:"#4B3CC4" }}>Dashboard</h2>

      <div style={{ marginBottom: "40px" }}>
        <h3 style={{ color: "#484848ff" }}>🧊 Sucre</h3>
        <p style={{ margin: "5px 0 12px", color: "#727272ff" }}>
          {summary.totalSugars}g / {LIMIT_SUGAR}g
        </p>

        <div
          style={{
            background: "#2C2F33",
            height: "14px",
            borderRadius: "8px",
            overflow: "hidden",
            marginBottom: "6px",
          }}
        >
          <div
            style={{
              width: `${sugarPct}%`,
              height: "100%",
              background: barColor(sugarPct),
              transition: "width 0.4s ease",
            }}
          ></div>
        </div>

        <small style={{ color: "#aaa" }}>
          {sugarPct}% de votre limite quotidienne
        </small>
      </div>

      <div style={{ marginBottom: "40px" }}>
        <h3 style={{ color: "#484848ff" }}>☕ Caféine</h3>
        <p style={{ margin: "5px 0 12px", color: "#727272ff" }}>
          {summary.totalCaffeine}mg / {LIMIT_CAFFEINE}mg
        </p>

        <div
          style={{
            background: "#2C2F33",
            height: "14px",
            borderRadius: "8px",
            overflow: "hidden",
            marginBottom: "6px",
          }}
        >
          <div
            style={{
              width: `${caffeinePct}%`,
              height: "100%",
              background: barColor(caffeinePct),
              transition: "width 0.4s ease",
            }}
          ></div>
        </div>

        <small style={{ color: "#aaa" }}>
          {caffeinePct}% de votre limite quotidienne
        </small>
      </div>

      <div style={{ marginBottom: "25px" }}>
        <h3 style={{ marginBottom: "5px", color:"#484848ff" }}>Calories</h3>
        <p style={{ color: "#727272ff", fontSize: "18px" }}>
          {summary.totalCalories} kcal
        </p>
      </div>

      <div style={{ marginBottom: "10px" }}>
        <h3 style={{ marginBottom: "5px", color:"#484848ff" }}>Nombre de consommations ajoutées aujourd'hui :</h3>
        <p style={{ color: "#727272ff", fontSize: "18px" }}>
          {summary.totalConsumptions} entrées
        </p>
      </div>
    </div>
  );
}
