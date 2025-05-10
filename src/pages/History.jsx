import { useState, useEffect } from "react";
import { db } from "../firebaseConfig";
import { collection, getDocs } from "firebase/firestore";
import "../styles/History.css";
import BackButton from "../components/BackButton";

function History() {
  const [history, setHistory] = useState([]);

  const [expandedId, setExpandedId] = useState(null);

  const fetchHistory = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "historial"));
      const historyData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      historyData.sort((a, b) => {
        const tA = a.timestamp?.seconds || 0;
        const tB = b.timestamp?.seconds || 0;
        return tB - tA;
      });

      setHistory(historyData);
    } catch (error) {
      console.error("Error al obtener el historial", error);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const toggleDetail = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="history-page">
      <BackButton to="/selection" />
      <h1 className="history-title">Historial</h1>

      <div className="history-container">
        {history.map((item, index) => {
          const isExpanded = expandedId === item.id;
          const fecha = item.timestamp?.toDate
            ? item.timestamp.toDate().toLocaleString()
            : "Sin fecha";

          return (
            <div key={item.id} className="history-item">
              <div
                {...(isExpanded ? "detail" : "")}
                className={`history-item-header ${
                  isExpanded ? "detail" : ""
                }`}
                onClick={() => toggleDetail(item.id)}
              >
                <h3>Sorteo #{history.length - index} -</h3>
                <h3> fecha </h3>
                <h3>: {fecha} hs</h3>
              </div>

              {isExpanded && (
                <div className="history-details">
                  <h4>Participantes:</h4>
                  <ul>
                    {item.participantes.map((p, i) => (
                      <li key={i}>
                        {p.name} (chances: {p.chances})
                      </li>
                    ))}
                  </ul>

                  <h4>Premios:</h4>
                  <ul>
                    {item.premios?.map((pr, i) => (
                      <li key={i}>
                        {pr.name} (chances: {pr.chances})
                      </li>
                    ))}
                  </ul>

                  <h4>Ganadores:</h4>
                  <ul>
                    {item.ganadores?.map((g, i) => (
                      <li key={i}>
                        {g.name}:{" "}
                        {g.prizes
                          ? Object.entries(g.prizes)
                              .map(
                                ([premio, cantidad]) => `${premio} x${cantidad}`
                              )
                              .join(", ")
                          : "Sin premios"}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default History;
