import { useEffect, useState } from "react";
import axiosInstance from "../api/axiosInstance";

export default function Statistics() {
  const [list, setList] = useState([]);
  const [view, setView] = useState("day");

  useEffect(() => {
    axiosInstance
      .get("/consumptions")
      .then((res) => {
        setList(res.data.consumptions || []);
      })
      .catch((err) => {
        console.error("API ERROR:", err.response?.data || err);
      });
  }, []);

  if (!list.length) return <p>Chargement...</p>;

  // Format date FR
  const formatDate = (d) => new Date(d).toLocaleDateString("fr-FR");

  const groupByDay = list.reduce((acc, item) => {
    const day = formatDate(item.date || item.createdAt);
    if (!acc[day]) acc[day] = { sugar: 0, caffeine: 0, calories: 0 };
    acc[day].sugar += item.nutrients.sugars;
    acc[day].caffeine += item.nutrients.caffeine;
    acc[day].calories += item.nutrients.calories;
    return acc;
  }, {});

  const groupByWeek = list.reduce((acc, item) => {
    const d = new Date(item.date || item.createdAt);
    const week =
      d.getFullYear() + "-W" + Math.ceil((d.getDate() + 6 - d.getDay()) / 7);
    if (!acc[week]) acc[week] = { sugar: 0, caffeine: 0, calories: 0 };
    acc[week].sugar += item.nutrients.sugars;
    acc[week].caffeine += item.nutrients.caffeine;
    acc[week].calories += item.nutrients.calories;
    return acc;
  }, {});

  const groupByMonth = list.reduce((acc, item) => {
    const d = new Date(item.date || item.createdAt);
    const month =
      d.getFullYear() +
      "-" +
      String(d.getMonth() + 1).padStart(2, "0");
    if (!acc[month]) acc[month] = { sugar: 0, caffeine: 0, calories: 0 };
    acc[month].sugar += item.nutrients.sugars;
    acc[month].caffeine += item.nutrients.caffeine;
    acc[month].calories += item.nutrients.calories;
    return acc;
  }, {});

  const total = list.reduce(
    (acc, i) => {
      acc.sugar += i.nutrients.sugars;
      acc.caffeine += i.nutrients.caffeine;
      acc.calories += i.nutrients.calories;
      return acc;
    },
    { sugar: 0, caffeine: 0, calories: 0 }
  );

  let displayed = {};
  if (view === "day") displayed = groupByDay;
  if (view === "week") displayed = groupByWeek;
  if (view === "month") displayed = groupByMonth;

  return (
    <div>
      <h2 style={{ color: "#fff" }}>Statistiques</h2>

      <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
        <button onClick={() => setView("day")}>Jour</button>
        <button onClick={() => setView("week")}>Semaine</button>
        <button onClick={() => setView("month")}>Mois</button>
        <button onClick={() => setView("total")}>Total</button>
      </div>

      {view === "total" && (
        <div>
          <h3>Total global</h3>
          <p>Sucre : {total.sugar} g</p>
          <p>Caféine : {total.caffeine} mg</p>
          <p>Calories : {total.calories}</p>
        </div>
      )}

      {view !== "total" && (
        <div>
          {Object.entries(displayed).map(([period, data]) => (
            <div
              key={period}
              style={{
                background: "#1E1E1E",
                padding: "15px",
                borderRadius: "12px",
                marginBottom: "10px",
                border: "1px solid rgba(255,255,255,0.1)",
              }}
            >
              <h4 style={{ color: "#4E73DF" }}>{period}</h4>
              <p>Sucre : {data.sugar} g</p>
              <p>Caféine : {data.caffeine} mg</p>
              <p>Calories : {data.calories}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
