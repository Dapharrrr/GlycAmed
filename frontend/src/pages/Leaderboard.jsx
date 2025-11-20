import { useEffect, useState } from "react";
import axiosInstance from "../api/axiosInstance";

export default function Leaderboard() {
  const [leaders, setLeaders] = useState([]);

  useEffect(() => {
    axiosInstance
      .get("/consumptions")
      .then((res) => {
        console.log("CONSUMPTIONS:", res.data);

        const list = res.data.consumptions || [];

        // --- GROUP BY CONTRIBUTOR ---
        const map = {};

        list.forEach((c) => {
          if (!c.contributor) return;

          const id = c.contributor._id;

          if (!map[id]) {
            map[id] = {
              _id: id,
              firstname: c.contributor.firstname,
              name: c.contributor.name,
              contributions: 0,
            };
          }

          map[id].contributions += 1;
        });

        // Convertir en tableau et trier
        const leaderArray = Object.values(map).sort(
          (a, b) => b.contributions - a.contributions
        );

        setLeaders(leaderArray);
      })
      .catch((err) => {
        console.error(err);
        setLeaders([]);
      });
  }, []);

  return (
    <div style={{ maxWidth: 600, margin: "0 auto", color: "white" }}>
      <h2 style={{ marginBottom: 20 }}>Classement des contributeurs</h2>

      {leaders.length === 0 && <p>Aucun contributeur pour le moment.</p>}

      {leaders.map((u, i) => (
        <div
          key={u._id}
          style={{
            padding: 12,
            borderBottom: "1px solid #333",
            background: i === 0 ? "#2b2b2b" : "transparent",
            borderRadius: 10,
            marginBottom: 10,
          }}
        >
          <strong>
            {i + 1}. {u.firstname} {u.name}
          </strong>
          <p style={{ color: "#aaa" }}>Contributions : {u.contributions}</p>
        </div>
      ))}
    </div>
  );
}
