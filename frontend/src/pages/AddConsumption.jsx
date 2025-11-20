import { useState } from "react";
import axiosInstance from "../api/axiosInstance";

// -----------------------------------------------------
// Fonction qui extrait userId depuis le JWT en localStorage
// -----------------------------------------------------
function getUserIdFromToken() {
  const token = localStorage.getItem("token");
  if (!token) return null;

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.userId;
  } catch (err) {
    return null;
  }
}

export default function AddConsumption() {
  const [query, setQuery] = useState("");
  const [barcode, setBarcode] = useState("");
  const [results, setResults] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantity, setQuantity] = useState(100);
  const [calculated, setCalculated] = useState(null);

  // --------------------------
  // SEARCH BY NAME
  // --------------------------
  async function searchByName() {
    const res = await axiosInstance.get(
      `/consumptions/products/search?query=${query}`
    );
    setResults(res.data.data || []);
  }

  // --------------------------
  // SEARCH BY BARCODE
  // --------------------------
  async function searchByBarcode() {
    const res = await axiosInstance.get(
      `/consumptions/products/barcode/${barcode}`
    );

    const product = res.data.data;
    if (product) {
      setSelectedProduct(product);
      setQuery(product.name || "");
      setResults([]);
    }
  }

  // --------------------------
  // SELECT PRODUCT
  // --------------------------
  function selectProduct(p) {
    setSelectedProduct(p);
    setQuery(p.name);
    setBarcode(p.barcode || "");
    setResults([]);
  }

  // --------------------------
  // CALCULATE NUTRIENTS (FIX FINAL)
  // --------------------------
  async function calculateNutrients() {
  if (!selectedProduct) {
    alert("Aucun produit sélectionné.");
    return;
  }

  // Les nutriments normalisés par ton backend
  const nutrients = selectedProduct.nutrients;

  if (!nutrients) {
    alert("Ce produit ne contient pas les données nutritionnelles nécessaires.");
    return;
  }

  // 🔥 FORMAT EXACTEMENT COMME L’ATTEND LE BACKEND
  const body = {
    product: {
      nutrients: {
        sugars: Number(nutrients.sugars),
        caffeine: Number(nutrients.caffeine),
        calories: Number(nutrients.calories)
      }
    },
    quantity: Number(quantity)
  };


  try {
    const res = await axiosInstance.post(
      "/consumptions/products/calculate-nutrients",
      body
    );

    setCalculated(res.data.data.calculatedNutrients);
  } catch (err) {
    console.error("API ERROR:", err.response?.data || err);
    alert("Erreur lors du calcul !");
  }
}


  // --------------------------
  // SAVE CONSUMPTION
  // --------------------------
  async function saveConsumption() {
    const userId = getUserIdFromToken();
    if (!userId) {
      alert("Vous devez être connecté.");
      return;
    }

    await axiosInstance.post("/consumptions", {
      userId,
      productName: selectedProduct.name,
      brand: selectedProduct.brand,
      barcode: selectedProduct.barcode,
      quantity: Number(quantity),
      nutrients: calculated,
    });

    alert("Consommation enregistrée !");
    setSelectedProduct(null);
    setCalculated(null);
    setQuery("");
    setBarcode("");
    setQuantity(100);
  }

  // --------------------------
  // Styles
  // --------------------------
  const inputStyle = {
    padding: "12px 15px",
    width: "100%",
    borderRadius: "10px",
    border: "1px solid #3a3a3a",
    background: "#1e1e1e",
    color: "white",
    marginBottom: "12px",
    fontSize: "16px",
  };

  const buttonStyle = {
    padding: "10px 20px",
    background: "#36B9CC",
    border: "none",
    borderRadius: "10px",
    color: "white",
    fontWeight: "600",
    cursor: "pointer",
    transition: "0.2s",
    marginBottom: "10px",
  };

  const container = {
    maxWidth: "600px",
    margin: "0 auto",
    marginTop: "40px",
    background: "#1b1b1b",
    padding: "30px 40px",
    borderRadius: "20px",
    boxShadow: "0 0 25px rgba(0,0,0,0.35)",
    color: "white",
  };

  const mb2 = { marginBottom: "12px" };

  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <div style={container}>
        <h2 style={{ textAlign: "center", marginBottom: "20px" }}>
          Ajouter une consommation
        </h2>

        {/* Recherche par nom */}
        <h3 style={mb2}>Rechercher par nom</h3>
        <input
          type="text"
          placeholder="Ex: Coca-Cola, Café, Pomme…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={inputStyle}
        />
        <button onClick={searchByName} style={buttonStyle}>
          Rechercher
        </button>

        {/* Résultats */}
        {results.length > 0 && (
          <div style={{ marginTop: "20px" }}>
            <h3>Résultats</h3>

            <div
              style={{
                background: "#111",
                borderRadius: "12px",
                padding: "10px",
                marginTop: "10px",
              }}
            >
              {results.map((p) => (
                <div
                  key={p.barcode}
                  onClick={() => selectProduct(p)}
                  style={{
                    cursor: "pointer",
                    padding: "12px",
                    borderBottom: "1px solid #2a2a2a",
                    transition: "0.2s",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.background = "#2a2a2a")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.background = "transparent")
                  }
                >
                  <strong>{p.name}</strong>
                  <br />
                  <small>Code-barres : {p.barcode}</small>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recherche code-barres */}
        <h3 style={{ ...mb2, marginTop: "25px" }}>
          Scanner ou entrer un code-barres
        </h3>

        <input
          type="text"
          placeholder="Ex: 5449000000996"
          value={barcode}
          onChange={(e) => setBarcode(e.target.value)}
          style={inputStyle}
        />

        <button onClick={searchByBarcode} style={buttonStyle}>
          Chercher
        </button>

        {/* Produit sélectionné */}
        {selectedProduct && (
          <div style={{ marginTop: "30px" }}>
            <h3>{selectedProduct.name}</h3>

            <p style={{ marginTop: "10px" }}>Quantité consommée (g/ml)</p>

            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              style={inputStyle}
            />

            <button
              onClick={calculateNutrients}
              style={{ ...buttonStyle, marginTop: "10px" }}
            >
              Calculer les nutriments
            </button>

            {calculated && (
              <div
                style={{
                  marginTop: "25px",
                  background: "#111",
                  padding: "20px",
                  borderRadius: "15px",
                }}
              >
                <p>
                  <strong>Sucre :</strong> {calculated.sugars} g
                </p>
                <p>
                  <strong>Caféine :</strong> {calculated.caffeine} mg
                </p>
                <p>
                  <strong>Calories :</strong> {calculated.calories}
                </p>

                <button
                  onClick={saveConsumption}
                  style={{
                    ...buttonStyle,
                    marginTop: "15px",
                    background: "#1CC88A",
                  }}
                >
                  Enregistrer
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
