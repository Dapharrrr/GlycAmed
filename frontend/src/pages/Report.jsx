import { useEffect, useState } from "react";
import axiosInstance from "../api/axiosInstance";

export default function Report() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    axiosInstance.get("/consumptions/summary").then((res) => {
      setStats(res.data);
    });
  }, []);

  if (!stats) return <p>Chargement...</p>;

  const sugarScore = Math.max(0, 100 - (stats.totalSugar * 2));
  const caffeineScore = Math.max(0, 100 - (stats.totalCaffeine / 4));

  const healthScore = Math.round((sugarScore + caffeineScore) / 2);

  return (
    <div>
      <h2>Rapport de santé</h2>

      <p>Score de santé : <strong>{healthScore}/100</strong></p>

      <p>Sucre total : {stats.totalSugar}g</p>
      <p>Caféine totale : {stats.totalCaffeine}mg</p>
      <p>Calories totales : {stats.totalCalories}</p>
    </div>
  );
}
