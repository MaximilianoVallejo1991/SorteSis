import React from "react";
import "../styles/Card.css"; // Importa el estilo desde la carpeta styles

function Card({ name, phrase, image }) {
  return (
    <div className="card">
      <img src={image} alt={name} />
      <h3>{name}</h3>
      <p>{phrase}</p>
    </div>
  );
}

export default Card;
