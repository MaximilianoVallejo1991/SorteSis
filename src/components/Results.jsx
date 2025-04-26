import React from "react";
import "../styles/Results.css";

function Results({ winners }) {
  return (
    <div className="results-container">
      <h2>Ganadores</h2>
      {winners.length === 0 ? (
        <p>No se ha realizado el sorteo.</p>
      ) : (
        <ul>
          {winners.map((winner, index) => (
            <li className="list" key={index}>
              {index + 1}. {winner}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Results;
