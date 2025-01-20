import React, { useState } from "react";
import { uploadCard } from "../utils/firebaseUtils";
import { useNavigate } from "react-router-dom";
import "../styles/DataUpload.css"; // Importa el estilo desde styles

function DataUpload() {
  const [name, setName] = useState("");
  const [phrase, setPhrase] = useState("");
  const [image, setImage] = useState(null);

  const navigate = useNavigate();

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

  
  return (
    <div>
      <h1>Cargar Tarjeta</h1>
      <form onSubmit={handleSubmit}>
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
  );
}

export default DataUpload;