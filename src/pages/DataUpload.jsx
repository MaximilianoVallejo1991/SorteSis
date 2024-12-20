import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function DataUpload() {
  const [name, setName] = useState("");
  const [phrase, setPhrase] = useState("");
  const [image, setImage] = useState(null);

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    // Guardar los datos en el localStorage
    const storedCards = JSON.parse(localStorage.getItem("cards")) || [];
    const newCard = { name, phrase, image: URL.createObjectURL(image) };
    localStorage.setItem("cards", JSON.stringify([...storedCards, newCard]));

    // Limpiar el formulario y redirigir
    setName("");
    setPhrase("");
    setImage(null);
    navigate("/cards");
  };

  return (
    <div>
      <h1>Cargar Foto, Nombre y Frase</h1>
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
