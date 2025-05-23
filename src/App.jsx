import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import DataUpload from "./pages/DataUpload";
import CardsPage from "./pages/CardsPage";
import RafflePage from "./pages/RafflePage";
import SelectionPage from "./pages/SelectionPage";
import FoodUpload from "./pages/FoodUpload";
import EditCard from "./pages/EditCard";
import History from "./pages/History";


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} /> 
        <Route path="/upload" element={<DataUpload />} /> 
        <Route path="/edit/:collection/:id" element={<EditCard />} />
        <Route path="/cardsPage" element={<CardsPage />} /> 
        <Route path="/rafflePage" element={<RafflePage />} /> 
        <Route path="/selection" element={<SelectionPage />} />
        <Route path="/foodUpload" element={<FoodUpload />} />
        <Route path="/history" element={<History />} /> 
      </Routes>
    </Router>
  );
}

export default App;
