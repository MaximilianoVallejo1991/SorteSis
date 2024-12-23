import React, { useEffect, useState } from "react";

function CardsPage() {
  const [cards, setCards] = useState([]);

  useEffect(() => {
    // Cargar las tarjetas desde el localStorage
    const storedCards = JSON.parse(localStorage.getItem("cards")) || [];
    setCards(storedCards);
  }, []);

  return (
    <div>
      <h1>Tarjetas</h1>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem" }}>
        {cards.map((card, index) => (
          <div
            key={index}
            style={{
              border: "1px solid #ccc",
              borderRadius: "8px",
              padding: "1rem",
              width: "200px",
            }}
          >
            <img
              src={card.image}
              alt={card.name}
              style={{ width: "100%", borderRadius: "8px" }}
            />
            <h3>{card.name}</h3>
            <p>{card.phrase}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CardsPage;
