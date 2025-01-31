import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../firebaseConfig";
import { collection, getDocs } from "firebase/firestore";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Card from "../components/Card";
import "../styles/SelectionPage.css"; // Estilos para esta página


const SelectionPage = () => {
  const [cards, setCards] = useState([]); // Tarjetas del carousel 1
  const [selectedCards, setSelectedCards] = useState([]); // Tarjeta seleccionada
  const navigate = useNavigate();
  const [foodCards, setFoodCards] = useState([]);

  const sliderSettings = {
    dots: true, // Muestra indicadores
    infinite: false, // Cicla a través de los elementos
    speed: 500,
    slidesToShow: 6, // Cantidad de tarjetas visibles
    slidesToScroll: 1,
    swipe: true, // Habilita el swipe
    responsive: [
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

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

  useEffect(() => {
    const fetchFoodCards = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "food_cards"));
        const foodCardsData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setFoodCards(foodCardsData);
      } catch (error) {
        console.error("Error al obtener tarjetas de comida:", error);
      }
    };
  
    fetchFoodCards();
  }, []);

  // Maneja el clic en una tarjeta del carrusel 1
  const handleCardClick = (card) => {
    // Agrega la tarjeta al listado seleccionado y elimina del carrusel
    setSelectedCards((prevSelectedCards) => {
      const existingCard = prevSelectedCards.find((item) => item.id === card.id);
      if (existingCard) {
        // Si la tarjeta ya está en la lista, incrementa el contador de "chances"
        return prevSelectedCards;
      } else {
        // Si la tarjeta no está en la lista, agrégala con un contador de "chances" inicializado en 1
        return [...prevSelectedCards, { ...card, chances: 1 }];
      }
    });

    // Elimina la tarjeta del carrusel
    setCards((prevCards) => prevCards.filter((item) => item.id !== card.id));
  };


  // Incrementa el contador de "chances"
  const increaseChances = (cardId) => {
    setSelectedCards((prevSelectedCards) =>
      prevSelectedCards.map((card) =>
        card.id === cardId ? { ...card, chances: card.chances + 1 } : card
      )
    );
  };

  // Decrementa el contador de "chances"
  const decreaseChances = (cardId) => {
    setSelectedCards((prevSelectedCards) => {
      return prevSelectedCards.reduce((acc, card) => {
        if (card.id === cardId) {
          if (card.chances > 1) {
            // Si tiene más de 1 chance, solo se reduce en 1
            acc.push({ ...card, chances: card.chances - 1 });
          } else {
            // Si llega a 0, lo eliminamos de selectedCards y lo volvemos a agregar al carrusel
            setCards((prevCards) => [...prevCards, card]);
          }
        } else {
          acc.push(card);
        }
        return acc;
      }, []);
    });
  };
  

  return (
    <div className="parent">
      {/* Carousel 1 */}
      <div className="div1">

        <Slider {...sliderSettings}>
          {cards.map((card) => (
            <div key={card.id} className="carousel-item"
              onClick={() => handleCardClick(card)}
            >
              <img src={card.imageUrl} alt={card.name} />
              <p>{card.name}</p>
            </div>
          ))}
        </Slider>

        <button className="navigate-button" onClick={() => navigate("/upload")}>
          Agregar
        </button>
      </div>

      <div className="div2">
        <h2>Comidas</h2>
        <Slider {...sliderSettings}>
          {foodCards.map((card) => (
            <div key={card.id} className="carousel-item">
              <img src={card.imageUrl} alt={card.name} />
              <p>{card.name}</p>
            </div>
          ))}
        </Slider>
        <button className="navigate-button" onClick={() => navigate("/foodUpload")}>
          Agregar Comida
        </button>
      </div>


      {/* Detalles de la tarjeta seleccionada */}
    <div className="div3">
      <div className="header">
        <h3>Participantes</h3>
        <h3>Chances</h3>
      </div>
      {selectedCards.length > 0 ? (
        <ul>
          {selectedCards.map((card) => (
            <li className="item" key={card.id}>
              <span className="participant-name"><strong>{card.name}:</strong></span>
              <div className="chances-container">
                <span className="chances-number">{card.chances}</span>
                <div className="chances-buttons">
                  <button className="chances-button" onClick={() => increaseChances(card.id)}>+</button>
                  <button className="chances-button" onClick={() => decreaseChances(card.id)}>-</button>
                </div>
              </div>
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
