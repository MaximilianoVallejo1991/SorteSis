import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import "../styles/PaswordModal.css";

const PasswordModal = ({ onConfirm, onClose }) => {
  const [input, setInput] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = () => {
    const storedPassword = import.meta.env.VITE_ADMIN_PASSWORD;
    if (input === storedPassword) {
      setError("");
      onConfirm();
    } else {
      setError("Clave incorrecta");
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Ingrese la clave</h2>
        <div className="password-input-container">
          <input
            type={!showPassword ? "text" : "password"}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Clave..."
          />
          <button
            type="button"
            className="toggle-visibility"
            onClick={() => setShowPassword(!showPassword)}
            aria-label="Mostrar/ocultar clave"
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>

        {error && <p className="error">{error}</p>}
        <div className="modal-buttons">
          <button className="acept" onClick={handleSubmit}>
            Aceptar
          </button>
          <button className="cancel" onClick={onClose}>
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};

export default PasswordModal;
