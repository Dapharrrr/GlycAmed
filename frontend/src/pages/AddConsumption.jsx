import { useState } from "react";
import axiosInstance from "../api/axiosInstance";

function getUserIdFromToken() {
  const token = localStorage.getItem("token");
  if (!token) return null;

  try {
    return JSON.parse(atob(token.split(".")[1])).userId;
  } catch {
    return null;
  }
}

export default function AddConsumption() {
  const [query, setQuery] = useState("");
  const [barcode, setBarcode] = useState("");
  const [results, setResults] = useState([]);
  const [page, setPage] = useState(1);

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantity, setQuantity] = useState(100);
  const [calculated, setCalculated] = useState(null);

  async function searchByName() {
    if (!query.trim()) return;

    const res = await axiosInstance.get(
      `/consumptions/products/search?query=${query}`
    );

    const list = res.data.data || [];

    setResults(list);
    setPage(1);
  }

  async function searchByBarcode() {
    if (!barcode.trim()) return;

    const res = await axiosInstance.get(
      `/consumptions/products/barcode/${barcode}`
    );

    const product = res.data.data;

    if (product) {
      setSelectedProduct(product);
      setQuery(product.name);
      setResults([]);
    }
  }

  const ITEMS_PER_PAGE = 10;
  const totalPages = Math.ceil(results.length / ITEMS_PER_PAGE);
  const paginated = results.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  function selectProduct(p) {
    setSelectedProduct(p);
    setBarcode(p.barcode || "");
    setResults([]);
  }

  async function calculateNutrients() {
    if (!selectedProduct) return alert("Sélectionne un produit.");

    const n = selectedProduct.nutrients;
    if (!n) return alert("Données nutritionnelles manquantes.");

    const body = {
      product: {
        nutrients: {
          sugars: Number(n.sugars),
          caffeine: Number(n.caffeine) * 1000, 
          calories: Number(n.calories),
        },
      },
      quantity: Number(quantity),
    };

    try {
      const res = await axiosInstance.post(
        "/consumptions/products/calculate-nutrients",
        body
      );

      setCalculated(res.data.data.calculatedNutrients);
    } catch (err) {
      alert("Erreur lors du calcul.");
      console.error(err);
    }
  }

  async function saveConsumption() {
    const userId = getUserIdFromToken();
    if (!userId) return alert("Vous devez être connecté.");

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

  const card = {
    background: "#ffffff",
    borderRadius: "14px",
    padding: "25px",
    boxShadow: "0 4px 14px rgba(0,0,0,0.08)",
    border: "1px solid #e7e7e7",
    marginBottom: "25px",
  };

  const input = {
    padding: "12px 14px",
    width: "100%",
    borderRadius: "8px",
    border: "1px solid #d1d1d1",
    background: "white",
    marginBottom: "8px",
    fontSize: "15px",
  };

    const button = {
    padding: "10px 15px",
    background: "#5A4FCF",
    color: "white",
    fontWeight: 600,
    borderRadius: "8px",
    cursor: "pointer",
    width: "100%",
    marginTop: "10px",
    transition: "0.2s",
    outline: "none", 
  };
    const buttonHover = {
    background: "#4A3DB0", 
  };


  return (
    <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "40px" }}>
      <div style={card}>
        <h2 style={{ color: "#5A4FCF" }}>Rechercher un produit</h2>

        <div style={{ display: "flex", gap: "20px", marginTop: "20px" }}>
          <div style={{ flex: 1 }}>
            <label style={{ display: "block", marginBottom: "10px" }}>Par nom</label>
            <input
              style={input}
              placeholder="Ex : Monster, Coca..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <button
              style={button}
              onMouseEnter={(e) => (e.target.style.background = buttonHover.background)}
              onMouseLeave={(e) => (e.target.style.background = button.background)}
              onClick={searchByName}
            >
              Rechercher par nom
            </button>
          </div>

          {/* Recherche par code-barres */}
          <div style={{ flex: 1 }}>
            <label style={{ display: "block", marginBottom: "10px" }}>Par code-barres</label>
            <input
              style={input}
              placeholder="Ex : 5449000000996"
              value={barcode}
              onChange={(e) => setBarcode(e.target.value)}
            />
            <button
              style={button}
              onMouseEnter={(e) => (e.target.style.background = buttonHover.background)}
              onMouseLeave={(e) => (e.target.style.background = button.background)}
              onClick={searchByBarcode}
            >
              Rechercher par code-barres
            </button>
          </div>
        </div>
      </div>

      {results.length > 0 && (
        <div style={card}>
          <h2 style={{ color: "#5A4FCF" }}>Résultats ({results.length})</h2>

          <div style={{ margin: "10px 0 20px 0", display: "flex", gap: "15px" }}>
            <button
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
              style={{
                ...button,
                width: "150px",
                background: page === 1 ? "#ccc" : "#5A4FCF",
              }}
              onMouseEnter={(e) => {
                if (page !== 1) e.target.style.background = "#4A3DB0";
              }}
              onMouseLeave={(e) => {
                if (page !== 1) e.target.style.background = "#5A4FCF";
              }}
            >
              ⬅ Précédent
            </button>


            <button
              disabled={page === totalPages}
              onClick={() => setPage(page + 1)}
              style={{
                ...button,
                width: "150px",
                background: page === totalPages ? "#ccc" : "#5A4FCF",
              }}
              onMouseEnter={(e) => {
                if (page !== totalPages) e.target.style.background = "#4A3DB0";
              }}
              onMouseLeave={(e) => {
                if (page !== totalPages) e.target.style.background = "#5A4FCF";
              }}
            >
              Suivant ➜
            </button>
          </div>

          {paginated.map((p) => (
            <div
              key={p.barcode}
              onClick={() => selectProduct(p)}
              style={{
                padding: "14px 10px",
                borderBottom: "1px solid #e2e2e2",
                cursor: "pointer",
              }}
            >
              <strong>{p.name}</strong>
              <br />
              <small style={{ color: "#777" }}>Code-barres : {p.barcode}</small>
            </div>
          ))}
        </div>
      )}
      {selectedProduct && (
        <div style={card}>
         <h2 style={{ color: "#5A4FCF", marginBottom: "10px" }}>
          {selectedProduct.name}
        </h2>

        <label style={{ marginBottom: "10px", display: "block" }}>
          Quantité (g/ml)
        </label>

        <input
          style={input}
          type="number"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
        />

        <button style={button} onClick={calculateNutrients}>
          Calculer les nutriments
        </button>
          {calculated && (
            <div
              style={{
                marginTop: "20px",
                background: "#f7f7f7",
                padding: "18px",
                borderRadius: "10px",
              }}
            >
              <p><strong>Sucre :</strong> {calculated.sugars} g</p>
              <p><strong>Caféine :</strong> {calculated.caffeine} mg</p>
              <p><strong>Calories :</strong> {calculated.calories}</p>

              <button
                style={{ ...button, background: "#1cc88a" }}
                onMouseEnter={(e) => (e.target.style.background = "#17a673")}
                onMouseLeave={(e) => (e.target.style.background = "#1cc88a")}
                onClick={saveConsumption}
              >
                Enregistrer
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
