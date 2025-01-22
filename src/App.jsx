import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import DataUpload from "./pages/DataUpload";
import CardsPage from "./pages/CardsPage";
import RafflePage from "./pages/RafflePage";
import SelectionPage from "./pages/SelectionPage";


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} /> 
        <Route path="/upload" element={<DataUpload />} /> 
        <Route path="/cardsPage" element={<CardsPage />} /> 
        <Route path="/rafflePage" element={<RafflePage />} /> 
        <Route path="/selection" element={<SelectionPage />} />
      </Routes>
    </Router>
  );
}

export default App;
