import { useEffect, useState } from "react";
import axiosInstance from "../api/axiosInstance";

export default function History() {
  const [consumptions, setConsumptions] = useState([]);
  const [page, setPage] = useState(1);

  const ITEMS_PER_PAGE = 10;

  useEffect(() => {
    axiosInstance.get("/consumptions").then((res) => {
      const list =
        res.data.consumptions ||
        res.data.data ||
        res.data.items ||
        res.data || [];

      setConsumptions(list);
    });
  }, []);

  const totalPages = Math.ceil(consumptions.length / ITEMS_PER_PAGE);
  const paginated = consumptions.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  const buttonStyle = {
    padding: "10px 15px",
    background: "#5A4FCF",
    border: "none",
    color: "white",
    fontWeight: 600,
    borderRadius: "8px",
    cursor: "pointer",
    margin: "10px 10px 20px 0",
    transition: "0.2s",
    outline: "none",
  };

  const disabledStyle = {
    ...buttonStyle,
    background: "#ccc",
    cursor: "not-allowed",
  };

  return (
    <div style={{ maxWidth: "900px", margin: "0 auto", padding: "30px" }}>
      <h2 style={{ color: "#5A4FCF", marginBottom: "20px" }}>
        Historique des consommations
      </h2>

      {consumptions.length === 0 && <p>Aucune consommation trouvée.</p>}

      {consumptions.length > 0 && (
        <div style={{ marginBottom: "20px" }}>
          <button
            style={page === 1 ? {
              ...buttonStyle,
              background: "#ccc",
              cursor: "not-allowed",
              outline: "2px solid black",
            } : {
              ...buttonStyle,
              background: "#5A4FCF",
              outline: "2px solid black",
            }}
            disabled={page === 1}
            onMouseEnter={(e) => {
              if (page !== 1) e.target.style.background = "#4A3DB0";
            }}
            onMouseLeave={(e) => {
              if (page !== 1) e.target.style.background = "#5A4FCF";
            }}
            onClick={() => setPage(page - 1)}
          >
            ⬅ Précédent
          </button>

          <button
            style={page === totalPages ? {
              ...buttonStyle,
              background: "#ccc",
              cursor: "not-allowed",
              outline: "2px solid black",
            } : {
              ...buttonStyle,
              background: "#5A4FCF",
              outline: "2px solid black",
            }}
            disabled={page === totalPages}
            onMouseEnter={(e) => {
              if (page !== totalPages) e.target.style.background = "#4A3DB0";
            }}
            onMouseLeave={(e) => {
              if (page !== totalPages) e.target.style.background = "#5A4FCF";
            }}
            onClick={() => setPage(page + 1)}
          >
            Suivant ➜
          </button>
        </div>
      )}

      {paginated.map((item) => (
        <div
          key={item._id}
          style={{
            borderBottom: "1px solid #ddd",
            padding: "15px 0",
            marginTop: "10px",
          }}
        >
          <h3 style={{ marginBottom: "6px" }}>
            {item.productName || "Produit inconnu"}
          </h3>

          {item.brand && <p>Marque : {item.brand}</p>}
          <p>Quantité : {item.quantity} g/ml</p>
          <p>Sucre : {item.nutrients?.sugars ?? "?"} g</p>
          <p>Caféine : {item.nutrients?.caffeine ?? "?"} mg</p>
          <p>Calories : {item.nutrients?.calories ?? "?"}</p>

          <p>
            Ajouté par :{" "}
            {item.contributor
              ? `${item.contributor.firstname} ${item.contributor.name}`
              : "Inconnu"}
          </p>

          <p>Date : {new Date(item.createdAt).toLocaleString()}</p>
        </div>
      ))}

      {consumptions.length > 0 && (
        <div style={{ marginTop: "20px" }}>
          <button
            style={page === 1 ? {
              ...buttonStyle,
              background: "#ccc",
              cursor: "not-allowed",
              outline: "2px solid black",
            } : {
              ...buttonStyle,
              background: "#5A4FCF",
              outline: "2px solid black",
            }}
            disabled={page === 1}
            onMouseEnter={(e) => {
              if (page !== 1) e.target.style.background = "#4A3DB0";
            }}
            onMouseLeave={(e) => {
              if (page !== 1) e.target.style.background = "#5A4FCF";
            }}
            onClick={() => setPage(page - 1)}
          >
            ⬅ Précédent
          </button>

          <button
            style={page === totalPages ? {
              ...buttonStyle,
              background: "#ccc",
              cursor: "not-allowed",
              outline: "2px solid black",
            } : {
              ...buttonStyle,
              background: "#5A4FCF",
              outline: "2px solid black",
            }}
            disabled={page === totalPages}
            onMouseEnter={(e) => {
              if (page !== totalPages) e.target.style.background = "#4A3DB0";
            }}
            onMouseLeave={(e) => {
              if (page !== totalPages) e.target.style.background = "#5A4FCF";
            }}
            onClick={() => setPage(page + 1)}
          >
            Suivant ➜
          </button>
        </div>
      )}
    </div>
  );
}
