import React, { useState } from "react";
import { uploadFoodCard } from "../utils/firebaseUtils";
import { useNavigate } from "react-router-dom";

function FoodUpload() {
  const [name, setName] = useState("");
  const [image, setImage] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await uploadFoodCard({ name, imageFile: image });
      setName("");
      setImage(null);
      alert("Tarjeta de comida creada exitosamente");
    } catch (error) {
      console.error("Error al crear tarjeta de comida:", error);
    }
  };

  return (
    <div className="container">
      <h1>Cargar Tarjeta de Comida</h1>
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
      </form>
    </div>
  );
}

export default FoodUpload;
