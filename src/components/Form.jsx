import React, { useState } from "react";
import "../styles/Form.css";
import { FaPlus } from "react-icons/fa";
import { GrAchievement, GrUserAdd } from "react-icons/gr";

function Form({ setNames, setPrizes, handleRaffle }) {
  const [currentName, setCurrentName] = useState("");
  const [currentPrizes, setCurrentPrizes] = useState(0);
  const [participantList, setParticipantList] = useState([]);

  const addName = () => {
    if (currentName.trim() === "") return;
    setParticipantList((prev) => [...prev, currentName]);
    setCurrentName("");
  };

  const startRaffle = () => {
    if (participantList.length < currentPrizes) {
      alert("No hay suficientes participantes para los premios.");
      return;
    }
  
    const shuffled = [...participantList].sort(() => 0.5 - Math.random());
    const selectedWinners = shuffled.slice(0, currentPrizes);
  
    setNames(participantList);
    setPrizes(currentPrizes);
    handleRaffle(selectedWinners);
  };
  
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      addName();
    }
  };

  return (
    <div className="info-container">
      <div className="form-container">
        <div className="form-group">
          <label> Participantes: </label>

          <div className="input-group">
            <GrUserAdd className="icons" />
            <input
              type="text"
              value={currentName}
              onChange={(e) => setCurrentName(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Nombre del participante"
            />
            <FaPlus className="icons" onClick={addName} />
          </div>
        </div>

        <div className="form-group">
          <label>Cantidad de Premios:</label>

          <div className="input-group">
            <GrAchievement className="icons" />
            <input
              type="number"
              value={currentPrizes}
              onChange={(e) => setCurrentPrizes(Number(e.target.value))}
              min="1"
            />
          </div>
        </div>

        <button className="start-button" onClick={startRaffle}>
          Realizar Sorteo
        </button>
      </div>

      <div className="participant-list">
        <h2>Lista de Participantes</h2>
        <ul className="grid-container">
          {participantList.map((name, index) => (
            <li key={index}>{name}</li>
          ))}
        </ul>
        {participantList.length === 0 && <p>No hay participantes.</p>}
      </div>
    </div>
  );
}

export default Form;
