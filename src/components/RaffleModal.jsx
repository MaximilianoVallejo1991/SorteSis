import React from "react";
import "../styles/RaffleModal.css";

const RaffleModal = ({ showModal, isRaffling, winners, onClose }) => {
  if (!showModal) return null;


  const isArrayOfStrings =
    Array.isArray(winners) && typeof winners[0] === "string";
  
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {isRaffling ? (
          <div className="raffle-animation">
            <p>Sorteando...</p>
            <div className="spinner"></div>
          </div>
        ) : isArrayOfStrings ? (
          <>
           <h2>🎉 Resultados del Sorteo 🎉</h2>
           <ol>
              {winners.map((winner, index) => (
                <li key={index}>
                  <strong>{winner}</strong>
                </li>
              ))}
            </ol>
            <button className="extra-button" onClick={onClose}>
              Cerrar
            </button>
          </>
        ) : (
          <>
            <h2>🎉 Resultados del Sorteo 🎉</h2>
            <ul>
              {Array.isArray(winners) && winners.map((winner, index) => (
                <li key={index}>
                  <strong>{winner.name}:</strong>
                  {Object.entries(winner.prizes).map(([prize, quantity], i) => (
                    <span key={prize}>
                      {i > 0 && ", "}
                      {prize} x {quantity}
                    </span>
                  ))}
                </li>
              ))}
            </ul>
            <button className="extra-button" onClick={onClose}>
              Cerrar
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default RaffleModal;
