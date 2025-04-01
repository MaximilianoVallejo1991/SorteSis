import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../firebaseConfig";
import { collection, getDocs } from "firebase/firestore";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "../styles/SelectionPage.css"; // Estilos para esta página

const SelectionPage = () => {
  const [cards, setCards] = useState([]);
  const [foodCards, setFoodCards] = useState([]);
  const [selectedCards, setSelectedCards] = useState([]);
  const [selectedFoodCards, setSelectedFoodCards] = useState([]);
  const [winners, setWinners] = useState([]); // Estado para mostrar ganadores
  const navigate = useNavigate();

  const sliderSettings = {
    dots: true,
    infinite: false,
    slidesToShow: 6,
    slidesToScroll: 1,
    swipe: true,
    responsive: [
      { breakpoint: 768, settings: { slidesToShow: 2 } },
      { breakpoint: 480, settings: { slidesToShow: 1 } },
    ],
  };

  useEffect(() => {
    const fetchCards = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "cards"));
        setCards(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } catch (error) {
        console.error("Error al obtener tarjetas:", error);
      }
    };
    fetchCards();
  }, []);

  useEffect(() => {
    const fetchFoodCards = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "food_cards"));
        setFoodCards(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } catch (error) {
        console.error("Error al obtener tarjetas de comida:", error);
      }
    };
    fetchFoodCards();
  }, []);

  const handleCardClick = (card) => {
    setSelectedCards(prev => prev.some(c => c.id === card.id) ? prev : [...prev, { ...card, chances: 1 }]);
    setCards(prev => prev.filter(c => c.id !== card.id));
  };

  const handleFoodCardClick = (foodCard) => {
    setSelectedFoodCards(prev => prev.some(f => f.id === foodCard.id) ? prev : [...prev, { ...foodCard, chances: 1 }]);
    setFoodCards(prev => prev.filter(f => f.id !== foodCard.id));
  };

  const increaseChances = (cardId) => {
    setSelectedCards(prev => prev.map(card => card.id === cardId ? { ...card, chances: card.chances + 1 } : card));
  };

  const decreaseChances = (cardId) => {
    setSelectedCards(prev => prev.reduce((acc, card) => {
      if (card.id === cardId) {
        if (card.chances > 1) acc.push({ ...card, chances: card.chances - 1 });
        else setCards(prevCards => [...prevCards, card]);
      } else acc.push(card);
      return acc;
    }, []));
  };

  const increaseFood = (foodCardId) => {
    setSelectedFoodCards(prev => prev.map(foodCard => foodCard.id === foodCardId ? { ...foodCard, chances: foodCard.chances + 1 } : foodCard));
  };

  const decreaseFood = (foodCardId) => {
    setSelectedFoodCards(prev => prev.reduce((acc, foodCard) => {
      if (foodCard.id === foodCardId) {
        if (foodCard.chances > 1) acc.push({ ...foodCard, chances: foodCard.chances - 1 });
        else setFoodCards(prevFoodCards => [...prevFoodCards, foodCard]);
      } else acc.push(foodCard);
      return acc;
    }, []));
  };

  const handleRaffle = () => {
    if (selectedCards.length === 0 || selectedFoodCards.length === 0) {
      alert("Debes seleccionar al menos un participante y un premio.");
      return;
    }

    let loosers = selectedCards.flatMap(card => Array(card.chances).fill(card.name));
    let prizePool = selectedFoodCards.flatMap(foodCard => Array(foodCard.chances).fill(foodCard.name));
    let assignedWinners = [];
    let assignedPrizes = {};

    while (prizePool.length > 0) {
      if (loosers.length === 0) {
        loosers = selectedCards.flatMap(card => Array(card.chances).fill(card.name));
      }

      let randomIndex = Math.floor(Math.random() * loosers.length);
      let winner = loosers[randomIndex];
      let prize = prizePool.shift();
      
      if (!assignedPrizes[winner]) {
        assignedPrizes[winner] = [];
      }
      assignedPrizes[winner].push(prize);
      
      loosers = loosers.filter(name => name !== winner);
    }

    assignedWinners = Object.entries(assignedPrizes).map(([name, prizes]) => ({ name, prizes }));
    setWinners(assignedWinners);
  };


  
  const resetSelection = () => {
    setSelectedCards([]);
    setSelectedFoodCards([]);
    setWinners([]);
    setCards([]); 
    setFoodCards([]);
  
    // Volver a cargar las tarjetas desde Firestore
    const fetchCards = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "cards"));
        setCards(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } catch (error) {
        console.error("Error al obtener tarjetas:", error);
      }
    };
  
    const fetchFoodCards = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "food_cards"));
        setFoodCards(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } catch (error) {
        console.error("Error al obtener tarjetas de comida:", error);
      }
    };
  
    fetchCards();
    fetchFoodCards();
  };

  const clearWinners = () => {
    setWinners([]); // Limpiar solo la lista de ganadores
  };
  
  

  return (
    <div className="parent">
      <div className="div1">

        <Slider {...sliderSettings}>
          {cards.map(card => (
            <div key={card.id} className="carousel-item" onClick={() => handleCardClick(card)}>
              <img src={card.imageUrl} alt={card.name} />
              <p>{card.name}</p>
            </div>
          ))}
        </Slider>
        <button className="navigate-button" onClick={() => navigate("/upload")}>Agregar</button>
      </div>

      <div className="div2">

        <Slider {...sliderSettings}>
          {foodCards.map(foodCard => (
            <div key={foodCard.id} className="carousel-item" onClick={() => handleFoodCardClick(foodCard)}>
              <img src={foodCard.imageUrl} alt={foodCard.name} />
              <p>{foodCard.name}</p>
            </div>
          ))}
        </Slider>
        <button className="navigate-button" onClick={() => navigate("/foodUpload")}>Agregar Comida</button>
      </div>

      <div className="div3">
        <div className="header">
          <h3>Participantes</h3>
          <h3>Chances</h3>
        </div>
        {selectedCards.length > 0 ? (
          <ul>
            {selectedCards.map(card => (
              <li className="item" key={card.id}>
                <span><strong>{card.name}:</strong></span>
                <div className="chances-container">
                  <span>{card.chances}</span>
                  <div>
                    <button onClick={() => increaseChances(card.id)}>+</button>
                    <button onClick={() => decreaseChances(card.id)}>-</button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        ) : <p>Haz clic en una tarjeta para agregarla.</p>}
      </div>

      <div className="div4">
        <div className="header">
          <h3>Premios</h3>
          <h3>Cantidad</h3>
        </div>
        {selectedFoodCards.length > 0 ? (
          <ul>
            {selectedFoodCards.map(foodCard => (
              <li className="item" key={foodCard.id}>
                <span><strong>{foodCard.name}:</strong></span>
                <div className="chances-container">
                  <span>{foodCard.chances}</span>
                  <div>
                    <button onClick={() => increaseFood(foodCard.id)}>+</button>
                    <button onClick={() => decreaseFood(foodCard.id)}>-</button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        ) : <p>Haz clic en una tarjeta para agregarla.</p>}
      </div>
      <div className="div5">
        <h3>Ganadores</h3>
        {winners.length > 0 ? (
          <ul>
            {winners.map((winner, index) => (
              <li key={index}>
                <strong>{winner.name}:</strong> {winner.prizes.join(", ")}
              </li>
            ))}
          </ul>
        ) : <p>No se ha realizado el sorteo.</p>}
      </div>

      <div className="div6">
        <button className="raffle-button" onClick={handleRaffle}>Realizar Sorteo</button>

        <button className="reset-button" onClick={resetSelection}>Reiniciar</button>

        <button className="clear-winners-button" onClick={clearWinners}>Limpiar Sorteo</button>


      </div>
    </div>
  );
};

export default SelectionPage;
