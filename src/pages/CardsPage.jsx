import React, { useEffect, useState } from "react";
import { db } from "../firebaseConfig";
import { collection, getDocs } from "firebase/firestore";
import Card from "../components/Card";
import "../styles/CardsPage.css";

function CardsPage() {
  const [cards, setCards] = useState([]);

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

  return (
    <div className="cards-page">
      <h1 className="cards-title">Tarjetas</h1>
      <div className="cards-container">
        {cards.map((card) => (
          <Card key={card.id} name={card.name} phrase={card.phrase} image={card.imageUrl} />
        ))}
      </div>
    </div>
  );
}

export default CardsPage;