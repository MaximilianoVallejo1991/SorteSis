import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../firebaseConfig";
import { collection, getDocs } from "firebase/firestore";
import Card from "../components/Card";
import "../styles/SelectionPage.css"; // Estilos para esta página

const SelectionPage = () => {
  const [cards, setCards] = useState([]); // Tarjetas del carousel 1
  const [selectedCards, setSelectedCards] = useState([]); // Tarjeta seleccionada
  const navigate = useNavigate();

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
    setSelectedCards((prevSelectedCards) => {
      const existingCard = prevSelectedCards.find((item) => item.id === card.id);
      if (existingCard) {
        // Si la tarjeta ya está en la lista, incrementa el contador de "chances"
        return prevSelectedCards.map((item) =>
          item.id === card.id ? { ...item, chances: item.chances + 1 } : item
        );
      } else {
        // Si la tarjeta no está en la lista, agrégala con un contador de "chances" inicializado en 1
        return [...prevSelectedCards, { ...card, chances: 1 }];
      }
    });
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
        <button className="navigate-button" onClick={() => navigate("/upload")}>
          Agregar
        </button>
      </div>

      {/* Carousel 2 */}
      <div className="div2">
        <h2>Carousel 2 - Otros Datos</h2>
        <div className="carousel">
          {/* Aquí agregarás datos de otras tablas en Firestore */}
          <p>Datos en construcción...</p>
        </div>
        <button className="navigate-button" onClick={() => navigate("/upload")}>
          Agregar
        </button>
      </div>

      {/* Detalles de la tarjeta seleccionada */}
      <div className="div3">
        <h2>Listado de Tarjetas Seleccionadas</h2>
        {selectedCards.length > 0 ? (
          <ul>
            {selectedCards.map((card) => (
              <li key={card.id}>
                <strong>{card.name}:</strong> {card.phrase} - <em>Chances: {card.chances}</em>
              </li>
            ))}
          </ul>
        ) : (
          <p>Haz clic en una tarjeta para agregarla al listado.</p>
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
