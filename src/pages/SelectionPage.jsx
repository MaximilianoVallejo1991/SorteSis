import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../firebaseConfig";
import { collection, getDocs, addDoc, Timestamp } from "firebase/firestore";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "../styles/SelectionPage.css"; // Estilos para esta página
import { FaPlusCircle, FaMinusCircle } from "react-icons/fa";
import BackButton from "../components/BackButton";
import RaffleModal from "../components/RaffleModal";

const SelectionPage = () => {
  const [cards, setCards] = useState([]);
  const [foodCards, setFoodCards] = useState([]);
  const [selectedCards, setSelectedCards] = useState([]);
  const [selectedFoodCards, setSelectedFoodCards] = useState([]);
  const [winners, setWinners] = useState([]); // Estado para mostrar ganadores
  const [showModal, setShowModal] = useState(false);
  const [isRaffling, setIsRaffling] = useState(false);
  const [showCardsCarousel, setShowCardsCarousel] = useState(true);
  const [showFoodCarousel, setShowFoodCarousel] = useState(true);
  const cardsSliderRef = useRef(null);
  const foodSliderRef = useRef(null);

  const navigate = useNavigate();

  const fetchFoodCards = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "food_cards"));
      const sortedFoodCards = querySnapshot.docs
        .map((doc) => ({ id: doc.id, ...doc.data() }))
        .sort((a, b) =>
          a.name.localeCompare(b.name, undefined, { numeric: true })
        );
      setFoodCards(sortedFoodCards);
    } catch (error) {
      console.error("Error al obtener tarjetas de comida:", error);
    }
  };

  const fetchCards = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "cards"));
      const sortedCards = querySnapshot.docs
        .map((doc) => ({ id: doc.id, ...doc.data() }))
        .sort((a, b) =>
          a.name.localeCompare(b.name, undefined, { numeric: true })
        );
      setCards(sortedCards);
    } catch (error) {
      console.error("Error al obtener tarjetas:", error);
    }
  };

  const sliderSettingsCards = {
    dots: false,
    infinite: cards.length > 5,
    slidesToShow: 5,
    slidesToScroll: 1,
    swipe: true,
    autoplay: true,
    autoplaySpeed: 3000,
    responsive: [
      { breakpoint: 768, settings: { slidesToShow: 1 } },
      { breakpoint: 480, settings: { slidesToShow: 1 } },
    ],
  };

  const sliderSettingsFood = {
    dots: false,
    infinite: foodCards.length > 5, // O el número de slides deseado
    slidesToShow: 5,
    slidesToScroll: 1,
    swipe: true,
    autoplay: true,
    autoplaySpeed: 3000,
    responsive: [
      { breakpoint: 768, settings: { slidesToShow: 1 } },
      { breakpoint: 480, settings: { slidesToShow: 1 } },
    ],
  };

  useEffect(() => {
    fetchCards();
  }, []);

  useEffect(() => {
    fetchFoodCards();
  }, []);

  const handleCardClick = (card) => {
    setSelectedCards((prev) =>
      prev.some((c) => c.id === card.id)
        ? prev
        : [...prev, { ...card, chances: 1 }]
    );
    setCards((prev) => prev.filter((c) => c.id !== card.id));
  };

  const handleFoodCardClick = (foodCard) => {
    setSelectedFoodCards((prev) =>
      prev.some((f) => f.id === foodCard.id)
        ? prev
        : [...prev, { ...foodCard, chances: 1 }]
    );
    setFoodCards((prev) => prev.filter((f) => f.id !== foodCard.id));
  };

  const increaseChances = (cardId) => {
    setSelectedCards((prev) =>
      prev.map((card) =>
        card.id === cardId ? { ...card, chances: card.chances + 1 } : card
      )
    );
  };

  const decreaseChances = (cardId) => {
    setSelectedCards((prev) =>
      prev.reduce((acc, card) => {
        if (card.id === cardId) {
          if (card.chances > 1)
            acc.push({ ...card, chances: card.chances - 1 });
          else setCards((prevCards) => [...prevCards, card]);
        } else acc.push(card);
        return acc;
      }, [])
    );
  };

  const increaseFood = (foodCardId) => {
    setSelectedFoodCards((prev) =>
      prev.map((foodCard) =>
        foodCard.id === foodCardId
          ? { ...foodCard, chances: foodCard.chances + 1 }
          : foodCard
      )
    );
  };

  const decreaseFood = (foodCardId) => {
    setSelectedFoodCards((prev) =>
      prev.reduce((acc, foodCard) => {
        if (foodCard.id === foodCardId) {
          if (foodCard.chances > 1)
            acc.push({ ...foodCard, chances: foodCard.chances - 1 });
          else setFoodCards((prevFoodCards) => [...prevFoodCards, foodCard]);
        } else acc.push(foodCard);
        return acc;
      }, [])
    );
  };

  const handleRaffle = () => {
    if (selectedCards.length === 0 || selectedFoodCards.length === 0) {
      alert("Debes seleccionar al menos un participante y un premio.");
      return;
    }

    setShowModal(true);
    setIsRaffling(true);

    setTimeout(async () => {
      let loosers = selectedCards.flatMap((card) =>
        Array(card.chances).fill(card.name)
      );
      let prizePool = selectedFoodCards.flatMap((foodCard) =>
        Array(foodCard.chances).fill(foodCard.name)
      );
      let assignedWinners = [];

      while (prizePool.length > 0) {
        if (loosers.length === 0) {
          loosers = selectedCards.flatMap((card) =>
            Array(card.chances).fill(card.name)
          );
        }

        let randomIndex = Math.floor(Math.random() * loosers.length);
        let winner = loosers[randomIndex];
        let prize = prizePool.shift();

        if (!assignedWinners[winner]) {
          assignedWinners[winner] = {};
        }
        assignedWinners[winner][prize] =
          (assignedWinners[winner][prize] || 0) + 1;

        loosers.splice(randomIndex, 1);
      }

      const finalWinners = Object.entries(assignedWinners).map(
        ([name, prizes]) => ({
          name,
          prizes,
        })
      );

      setWinners(finalWinners);
      setIsRaffling(false);

      try {
        await addDoc(collection(db, "history"), {
          timestamp: Timestamp.now(),
          participantes: selectedCards.map(({ id, name, chances }) => ({
            id,
            name,
            chances,
          })),
          premios: selectedFoodCards.map(({ id, name, chances }) => ({
            id,
            name,
            chances,
          })),
          ganadores: finalWinners,
        });
      } catch (error) {
        console.error("Error al guardar el historial del sorteo:", error);
      }
    }, 3000); // 3 segundos de animación
  };

  const resetSelection = () => {
    setSelectedCards([]);
    setSelectedFoodCards([]);
    setWinners([]);
    setCards([]);
    setFoodCards([]);

    // Volver a cargar las tarjetas desde Firestore

    fetchCards();
    fetchFoodCards();
  };

  const clearWinners = () => {
    setWinners([]); // Limpiar solo la lista de ganadores
  };

  const handleWheelScroll = (e, sliderRef) => {
    if (sliderRef && sliderRef.slickNext) {
      if (e.deltaY > 0) {
        sliderRef.slickNext();
      } else {
        sliderRef.slickPrev();
      }
    }
  };

  return (
    <div className="parent">
      <BackButton to="/ " />
      <button className="history-button" onClick={() => navigate("/History")}>
        Historial 
      </button>
      <div className={`div1 ${!showCardsCarousel ? "collapsed" : ""}`}>
        {showCardsCarousel && (
          <div
            className="collapsible expanded"
            onWheel={(e) => handleWheelScroll(e, cardsSliderRef.current)}
          >
            <Slider ref={cardsSliderRef} {...sliderSettingsCards}>
              {cards.map((card) => (
                <div
                  key={card.id}
                  className="carousel-item"
                  onClick={() => handleCardClick(card)}
                >
                  <img src={card.imageUrl} alt={card.name} />
                  <p>{card.name}</p>
                  <div className="speech-bubble">{card.phrase}</div>
                </div>
              ))}
            </Slider>
          </div>
        )}

        <div className="buttons-container">
          <button
            className="dropdown-button"
            onClick={() => setShowCardsCarousel((prev) => !prev)}
          >
            {showCardsCarousel ? "Ocultar" : "Mostrar"}
          </button>

          <button
            className="navigate-button"
            onClick={() => navigate("/upload")}
          >
            Modificar
          </button>
        </div>
      </div>

      <div
        className={`div2 ${!showFoodCarousel ? "collapsed" : ""} ${
          !showCardsCarousel ? "elevated" : ""
        }`}
      >
        {showFoodCarousel && (
          <div
            className="collapsible expanded"
            onWheel={(e) => handleWheelScroll(e, foodSliderRef.current)}
          >
            <Slider ref={foodSliderRef} {...sliderSettingsFood}>
              {foodCards.map((foodCard) => (
                <div
                  key={foodCard.id}
                  className="carousel-item"
                  onClick={() => handleFoodCardClick(foodCard)}
                >
                  <img src={foodCard.imageUrl} alt={foodCard.name} />
                  <p>{foodCard.name}</p>
                </div>
              ))}
            </Slider>
          </div>
        )}

        <div>
          <button
            className="dropdown-button"
            onClick={() => setShowFoodCarousel((prev) => !prev)}
          >
            {showFoodCarousel ? "Ocultar" : "Mostrar"}
          </button>

          <button
            className="navigate-button"
            onClick={() => navigate("/foodUpload")}
          >
            Modificar
          </button>
        </div>
      </div>

      <div
        className={`div3 ${
          !showCardsCarousel && !showFoodCarousel
            ? "elevatedB"
            : !showCardsCarousel || !showFoodCarousel
            ? "elevated"
            : ""
        }`}
      >
        <div className="header">
          <h3>Participantes</h3>
          <h3>Chances</h3>
        </div>
        {selectedCards.length > 0 ? (
          <ul>
            {selectedCards.map((card) => (
              <li className="item" key={card.id}>
                <span>
                  <strong>{card.name}:</strong>
                </span>
                <div className="chances-container">
                  <span>{card.chances}</span>
                  <div className="chance-buttons-container">
                    <button
                      className="chances-button"
                      onClick={() => increaseChances(card.id)}
                    >
                      <FaPlusCircle size={20} color="#2a9d8f" />
                    </button>

                    <button
                      className="chances-button"
                      onClick={() => decreaseChances(card.id)}
                    >
                      <FaMinusCircle size={20} color="#e63946" />
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p>Haz clic en una tarjeta para agregarla.</p>
        )}
      </div>

      <div
        className={`div4 ${
          !showCardsCarousel && !showFoodCarousel
            ? "elevatedB"
            : !showCardsCarousel || !showFoodCarousel
            ? "elevated"
            : ""
        }`}
      >
        <div className="header">
          <h3>Premios</h3>
          <h3>Cantidad</h3>
        </div>
        {selectedFoodCards.length > 0 ? (
          <ul>
            {selectedFoodCards.map((foodCard) => (
              <li className="item" key={foodCard.id}>
                <span>
                  <strong>{foodCard.name}:</strong>
                </span>
                <div className="chances-container">
                  <span>{foodCard.chances}</span>
                  <div className="chance-buttons-container">
                    <button
                      className="chances-button"
                      onClick={() => increaseFood(foodCard.id)}
                    >
                      <FaPlusCircle size={20} color="#2a9d8f" />
                    </button>

                    <button
                      className="chances-button"
                      onClick={() => decreaseFood(foodCard.id)}
                    >
                      <FaMinusCircle size={20} color="#e63946" />
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p>Haz clic en una tarjeta para agregarla.</p>
        )}
      </div>

      <div
        className={`div5 ${
          !showCardsCarousel && !showFoodCarousel
            ? "elevatedB"
            : !showCardsCarousel || !showFoodCarousel
            ? "elevated"
            : ""
        }`}
        onClick={() => setShowModal(true)}
        style={{ cursor: "pointer" }}
      >
        <h3>GANADORES</h3>
        {winners.length > 0 ? (
          <ul>
            {winners.map((winner, index) => (
              <li key={index}>
                <strong>{winner.name}:</strong>
                {Object.entries(winner.prizes).map(([prize, quantity], i) => (
                  <span key={prize}>
                    {i > 0 && "; "} {prize} x {quantity}
                  </span>
                ))}
              </li>
            ))}
          </ul>
        ) : (
          <p>No se ha realizado el sorteo.</p>
        )}
      </div>

      <div
        className={`div6 ${
          !showCardsCarousel && !showFoodCarousel
            ? "elevatedB"
            : !showCardsCarousel || !showFoodCarousel
            ? "elevated"
            : ""
        }`}
      >
        <div className="container-button">
          <button className="extra-button" onClick={handleRaffle}>
            Realizar Sorteo
          </button>

          <button className="extra-button" onClick={clearWinners}>
            Limpiar Sorteo
          </button>

          <button className="extra-button" onClick={resetSelection}>
            Reiniciar
          </button>
        </div>
      </div>

      <RaffleModal
        showModal={showModal}
        isRaffling={isRaffling}
        winners={winners}
        onClose={() => setShowModal(false)}
      />
    </div>
  );
};

export default SelectionPage;
