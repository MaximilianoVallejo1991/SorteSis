import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Card.css"; // Importa el estilo desde la carpeta styles

function Card({ name, phrase, image, onDelete, id }) {
  const navigate = useNavigate();
  return (
    <div className="enlisted-card">
      <img src={image} alt={name} />
      <h3>{name}</h3>
      <p>{phrase}</p>

      <button className="crude-button" onClick={() => navigate(`/edit/${id}`)}>✏️ Editar</button>

      <button className="crude-button" onClick={onDelete} style={{ backgroundColor: "red", color: "white" }}>🗑️ Eliminar</button>
    </div>
  );
}

export default Card;
