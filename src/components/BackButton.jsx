import { useNavigate } from "react-router-dom";
import "../styles/BackButton.css";

const BackButton = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate("/");
  };

  return (
    <button className="back-button" onClick={handleBack}>
      ⬅ Volver
    </button>
  );
};

export default BackButton;
