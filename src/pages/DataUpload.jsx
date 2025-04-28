import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../firebaseConfig";
import { collection, getDocs } from "firebase/firestore";
import { uploadCard } from "../utils/firebaseUtils";
import Card from "../components/Card";
import "../styles/CardsPage.css";
import "../styles/DataUpload.css";
import { deleteCard } from "../utils/firebaseUtils"; // Asegúrate de importar la función correcta

function DataUpload() {
  const [name, setName] = useState("");
  const [phrase, setPhrase] = useState("");
  const [image, setImage] = useState(null);
  const [cards, setCards] = useState([]);
  const navigate = useNavigate();


  const handleDelete = async (id, imageUrl) => {
    const backendURL = import.meta.env.VITE_BACKEND_URL;

    const confirmDelete = window.confirm(
      "¿Seguro que quieres eliminar esta tarjeta?"
    );
    if (!confirmDelete) return;

    try {
      await deleteCard(id, imageUrl, "cards");
      setCards(cards.filter((card) => card.id !== id)); // Actualizar el estado
      alert("Tarjeta eliminada correctamente.");
    } catch (error) {
      console.error("Error al eliminar tarjeta:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const newCard = await uploadCard({ name, phrase, imageFile: image });

      // Agregar la nueva tarjeta al estado
      setCards((prevCards) => [...prevCards, newCard]);

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
        <h1 className="title">Cargar Participante</h1>
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
          <button onClick={() => navigate("/selection")}>Regresar</button>
        </form>
      </div>

      <div className="col2">
        <h1>Participantes</h1>

        <div className="container1">
          {cards.map((card) => (
            <Card
              id={card.id} // Pasamos la ID del documento
              name={card.name}
              phrase={card.phrase}
              image={card.imageUrl}
              onDelete={() => handleDelete(card.id, card.imageUrl)}
            />
          ))}
        </div>


      </div>
    </div>
  );
}

export default DataUpload;
