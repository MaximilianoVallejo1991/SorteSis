// BackButton.jsx
import { useNavigate } from "react-router-dom";
import "../styles/BackButton.css";

const BackButton = ({ to }) => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(to);
  };

  return (
    <button className="back-button" onClick={handleBack}>
      ⬅ Volver
    </button>
  );
};

export default BackButton;
