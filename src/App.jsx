import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import DataUpload from "./pages/DataUpload";
import CardsPage from "./pages/CardsPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} /> {/* Página principal */}
        <Route path="/upload" element={<DataUpload />} /> {/* Cargar datos */}
        <Route path="/cardsPage" element={<CardsPage />} /> {/* Mostrar tarjetas */}
      </Routes>
    </Router>
  );
}

export default App;
