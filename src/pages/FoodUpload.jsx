import React, { useEffect, useState } from "react";
import { uploadFoodCard } from "../utils/firebaseUtils";
import { useNavigate } from "react-router-dom";
import "../styles/DataUpload.css";
import { db } from "../firebaseConfig";
import { collection, getDocs } from "firebase/firestore";
import Card from "../components/Card";



function FoodUpload() {
  const [name, setName] = useState("");
  const [image, setImage] = useState(null);
  const [foodCards, setFoodCards] = useState([]);
  const navigate = useNavigate();

  const handleDelete = async (id, foodImageUrl) => {
    const backendURL = import.meta.env.VITE_BACKEND_URL;

    const confirmDelete = windonw.confirm(
      "¿Seguro que quieres eliminar esta tarjeta?"
    );
    if (!confirmDelete) return;

    try {
      await deleteCard(id, foodImageUrl, "food_cards");
      setFoodCards(foodCards.filter((foodCard) => foodCard.id !== id));
      alert("Tarjeta de comida eliminada correctamente.");
    } catch (error) {
      console.error("Error al eliminar tarjeta de comida: ", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const newFoodCard = await uploadFoodCard({
        name,
        imageFile: image,
      });
      await uploadFoodCard({ name, imageFile: image });

      setFoodCards((prevFoodCards) => [...prevFoodCards, newFoodCard]);
      console.log("Tarjeta de comida creada: ", newFoodCard);

      setName("");
      setImage(null);
      alert("Tarjeta de comida creada exitosamente");
    } catch (error) {
      console.error("Error al crear tarjeta de comida:", error);
    }
  };

  useEffect(() => {
    const fetchFoodCards = async () => {
      try {
        console.log("Fetching food cards...");
        const querySnapshot = await getDocs(collection(db, "food_cards"));
        console.log("Query snapshot: ", querySnapshot);
        const foodCardsData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setFoodCards(foodCardsData);
      } catch (error) {
        console.error("error al obtener las tarjetas de comida: ", error);

      }
  };

  fetchFoodCards();
}, []);

  return (
    <div className="parent1">
      <div className="col1">
        <h1 className="title">Cargar Tarjeta de Comida</h1>
        <form onSubmit={handleSubmit} className="data-upload">
          <input
            type="text"
            placeholder="Nombre de la comida"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files[0])}
            required
          />
          <button type="submit">Guardar</button>
          <button type="button" onClick={() => navigate("/selection")}> regresar</button>
        </form>
      </div>

      <div className="col2">
        <h1> Comidas </h1>

        <div className="container1">
          {foodCards.map((foodCard) => (
            <Card
              id={foodCard.id}
              name={foodCard.name}
              image={foodCard.imageUrl}
              onDelete={() =>
                handleDelete(foodCard.id, foodCard.imageUrl)
              }
              collection="food_cards"
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default FoodUpload;
