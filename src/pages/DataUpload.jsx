import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../firebaseConfig";
import { collection, getDocs } from "firebase/firestore";
import { uploadCard } from "../utils/firebaseUtils";
import Card from "../components/Card";
import "../styles/CardsPage.css";
import "../styles/DataUpload.css";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";


function DataUpload() {
  const [name, setName] = useState("");
  const [phrase, setPhrase] = useState("");
  const [image, setImage] = useState(null);
  const [cards, setCards] = useState([]);
  const navigate = useNavigate();


  const sliderSettings = {
    dots: true, // Muestra indicadores
    infinite: true, // Cicla a través de los elementos
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


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const newCard = await uploadCard({ name, phrase, imageFile: image });
      console.log("Tarjeta creada:", newCard);
      setName("");
      setPhrase("");
      setImage(null);
      alert("Tarjeta creada exitosamente");
    } catch (error) {
      console.error("Error al crear tarjeta:", error);
    }
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

  return (

    <div className="parent1">

      <div className="col1">
        <h1 className="title">Cargar Tarjeta</h1>
        <form onSubmit={handleSubmit} className="data-upload">
          <input
            type="text"
            placeholder="Nombre"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <textarea
            placeholder="Frase"
            value={phrase}
            onChange={(e) => setPhrase(e.target.value)}
            required
          />
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files[0])}
            required
          />
          <button type="submit">Guardar</button>
        </form>
      </div>

      <div className="col2">
      <h2>Participantes</h2>




        <Slider {...sliderSettings}>
        {cards.map((card) => (
            <Card key={card.id} className="carousel-item" name={card.name} phrase={card.phrase} image={card.imageUrl} />
          ))}
        </Slider>

        <button className="navigate-button" onClick={() => navigate("/upload")}>
          Agregar
        </button>
      </div>

    </div>


  );
}

export default DataUpload;