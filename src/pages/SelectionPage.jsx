import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../firebaseConfig";
import { collection, getDocs } from "firebase/firestore";
import Card from "../components/Card";
import "../styles/SelectionPage.css"; // Estilos para esta página

const SelectionPage = () => {
  const [cards, setCards] = useState([]); // Tarjetas del carousel 1
  const [selectedCard, setSelectedCard] = useState(null); // Tarjeta seleccionada

  useEffect(() => {
    const fetchCards = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "cards"));
        const cardsData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setCards(cardsData);
      } catch (error) {
        console.error("Error al obtener tarjetas:", error);
      }
    };

    fetchCards();
  }, []);

  // Maneja el clic en una tarjeta del carousel 1
  const handleCardClick = (card) => {
    setSelectedCard(card);
  };

  return (
    <div className="parent">
      {/* Carousel 1 */}
      <div className="div1">
        <h2>Carousel 1 - Tarjetas</h2>
        <div className="carousel">
          {cards.map((card) => (
            <div
              key={card.id}
              className="carousel-item"
              onClick={() => handleCardClick(card)}
            >
              <img src={card.imageUrl} alt={card.name} />
              <p>{card.name}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Carousel 2 */}
      <div className="div2">
        <h2>Carousel 2 - Otros Datos</h2>
        <div className="carousel">
          {/* Aquí agregarás datos de otras tablas en Firestore */}
          <p>Datos en construcción...</p>
        </div>
      </div>

      {/* Detalles de la tarjeta seleccionada */}
      <div className="div3">
        <h2>Detalle de la Tarjeta</h2>
        {selectedCard ? (
          <>
            <h3>{selectedCard.name}</h3>
            <p>{selectedCard.phrase}</p>
          </>
        ) : (
          <p>Haz clic en una tarjeta para ver sus detalles.</p>
        )}
      </div>

      {/* Espacios adicionales */}
      <div className="div4">Div 4</div>
      <div className="div5">Div 5</div>
      <div className="div6">Div 6</div>
    </div>
  );
};

export default SelectionPage;
