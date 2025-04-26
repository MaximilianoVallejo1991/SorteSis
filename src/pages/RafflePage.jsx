import React, { useState } from "react";
import Form from "../components/Form";
import Results from "../components/Results";
import "../styles/RafflePage.css";
import RaffleModal from "../components/RaffleModal";

function RafflePage() {
  const [names, setNames] = useState([]);
  const [prizes, setPrizes] = useState(0);
  const [winners, setWinners] = useState([]);

  const [showModal, setShowModal] = useState(false);
  const [isRaffling, setIsRaffling] = useState(false);

  const handleRaffle = (generatedWinners) => {
    setShowModal(true);
    setIsRaffling(true);

    setTimeout(() => {
      setWinners(generatedWinners);
      setIsRaffling(false);
    }, 3000);
  };

  return (
    <div className="raffle-page">
      <h1 className="raffle-title">SORTEO MANUAL</h1>
      <Form
        setNames={setNames}
        setPrizes={setPrizes}
        handleRaffle={handleRaffle}
      />

      <RaffleModal
        showModal={showModal}
        isRaffling={isRaffling}
        winners={winners}
        onClose={() => setShowModal(false)}
      />

      <Results winners={winners} />
    </div>
  );
}

export default RafflePage;
