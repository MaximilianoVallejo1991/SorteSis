import React, { useState } from "react";
import Form from "../components/Form";
import Results from "../components/Results";
import "../styles/RafflePage.css";

function RafflePage() {
  const [names, setNames] = useState([]);
  const [prizes, setPrizes] = useState(0);
  const [winners, setWinners] = useState([]);

  const handleRaffle = () => {
    if (names.length < prizes) {
      alert("No hay suficientes participantes para los premios.");
      return;
    }

    const shuffled = [...names].sort(() => 0.5 - Math.random());
    setWinners(shuffled.slice(0, prizes));
  };

  return (
    <div className="raffle-page">
      <h1>Sorteo</h1>
      <Form 
        setNames={setNames} 
        setPrizes={setPrizes} 
        handleRaffle={handleRaffle} 
      />
      <Results winners={winners} />
    </div>
  );
}

export default RafflePage;
