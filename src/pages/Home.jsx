import React from "react";
import { useNavigate } from "react-router-dom";
import "./../styles/Home.css"; // Asegúrate de tener este archivo para estilos.

const Home = () => {
  const navigate = useNavigate();

  // Funciones para manejar los botones
  const handleOpenDraw = () => {
    navigate("/cardsPage");
  };

  const handleSystemDraw = () => {
    navigate("/upload");
  };

  const handleAddParticipants = () => {
    navigate("/upload");
  };

  return (
    <div className="home-container">
      <h1>¡Bienvenido a SorteSis!</h1>
      <p>Elige una de las siguientes opciones para comenzar:</p>

      <div className="button-group">
        <button className="home-button" onClick={handleOpenDraw}>
          Iniciar sorteo abierto
        </button>
        <button className="home-button" onClick={handleSystemDraw}>
          Iniciar sorteo de Sistemas
        </button>
        <button className="home-button" onClick={handleAddParticipants}>
          Agregar nuevos participantes
        </button>
      </div>
    </div>
  );
};

export default Home;
