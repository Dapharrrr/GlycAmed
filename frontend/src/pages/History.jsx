import { useEffect, useState } from "react";
import axiosInstance from "../api/axiosInstance";

export default function History() {
  const [consumptions, setConsumptions] = useState([]);

  useEffect(() => {
    axiosInstance.get("/consumptions").then((res) => {
      console.log("API RESPONSE:", res.data);

      const list =
        res.data.consumptions ||
        res.data.data ||
        res.data.items ||
        res.data || [];

      setConsumptions(list);
    });
  }, []);

  return (
    <div>
      <h2>Historique des consommations</h2>

      {consumptions.length === 0 && <p>Aucune consommation trouvée.</p>}

      {consumptions.map((item) => (
        <div
          key={item._id}
          style={{
            borderBottom: "1px solid #ddd",
            padding: "15px 0",
            marginTop: "10px",
          }}
        >
          <h3>{item.productName || "Produit inconnu"}</h3>
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
    </div>
  );
}
