import { useEffect, useState } from "react";
import axiosInstance from "../api/axiosInstance";

export default function Leaderboard() {
  const [leaders, setLeaders] = useState([]);

  useEffect(() => {
    axiosInstance
      .get("/consumptions")
      .then((res) => {
        const list = res.data.consumptions || [];

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

        const leaderArray = Object.values(map).sort(
          (a, b) => b.contributions - a.contributions
        );

        setLeaders(leaderArray);
      })
      .catch(() => setLeaders([]));
  }, []);

  const card = {
    background: "white",
    borderRadius: "14px",
    padding: "20px",
    boxShadow: "0 6px 16px rgba(90, 79, 207, 0.10)",
    border: "1px solid #e7e7e7",
    textAlign: "center",
    width: "180px",
    height: "130px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
  };

  const first = leaders[0] || null;
  const second = leaders[1] || null;
  const third = leaders[2] || null;

  const rest = leaders.slice(3);

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "30px" }}>
      <h2 style={{ color: "#5A4FCF", marginBottom: 30 }}>
        Classement des contributeurs
      </h2>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "40px",
          alignItems: "flex-end",
          marginBottom: "40px",
        }}
      >
        <div style={{ ...card, marginBottom: "40px" }}>
          {second ? (
            <>
              <h3 style={{ color: "#5A4FCF" }}>🥈 {second.firstname}</h3>
              <p>{second.name}</p>
              <p>Contrib. : {second.contributions}</p>
            </>
          ) : (
            <p style={{ color: "#999" }}>🥈 Vide</p>
          )}
        </div>

        <div style={card}>
          {first ? (
            <>
              <h3 style={{ color: "#5A4FCF" }}>🥇 {first.firstname}</h3>
              <p>{first.name}</p>
              <p>Contrib. : {first.contributions}</p>
            </>
          ) : (
            <p style={{ color: "#999" }}>🥇 Vide</p>
          )}
        </div>

        <div style={{ ...card, marginBottom: "20px" }}>
          {third ? (
            <>
              <h3 style={{ color: "#5A4FCF" }}>🥉 {third.firstname}</h3>
              <p>{third.name}</p>
              <p>Contrib. : {third.contributions}</p>
            </>
          ) : (
            <p style={{ color: "#999" }}>🥉 Vide</p>
          )}
        </div>
      </div>

      {rest.map((u, i) => (
        <div
          key={u._id}
          style={{
            ...card,
            width: "100%",
            textAlign: "left",
            marginBottom: "16px",
          }}
        >
          <strong style={{ fontSize: "16px" }}>
            {i + 4}. {u.firstname} {u.name}
          </strong>
          <p style={{ marginTop: 5, color: "#444" }}>
            Contributions : {u.contributions}
          </p>
        </div>
      ))}
    </div>
  );
}
