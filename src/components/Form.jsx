import React, { useState } from "react";
import "../styles/Form.css";

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
    setNames(participantList);
    setPrizes(currentPrizes);
    handleRaffle();
  };

  return (
    <div className="form-container">
      <h2>Agregar Participantes</h2>
      <div className="form-group">
        <input 
          type="text" 
          value={currentName} 
          onChange={(e) => setCurrentName(e.target.value)} 
          placeholder="Nombre del participante" 
        />
        <button onClick={addName}>Agregar</button>
      </div>
      <div className="form-group">
        <label>Cantidad de Premios:</label>
        <input 
          type="number" 
          value={currentPrizes} 
          onChange={(e) => setCurrentPrizes(Number(e.target.value))} 
          min="1" 
        />
      </div>
      <button className="start-button" onClick={startRaffle}>
        Realizar Sorteo
      </button>
    </div>
  );
}

export default Form;
