import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { db } from "../firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import { updateCard } from "../utils/firebaseUtils";
import "../styles/EditCard.css";

function EditCard() {
  const { collection, id } = useParams(); // Obtener ID desde la URL
  const navigate = useNavigate();

  // Estados para los datos de la tarjeta
  const [name, setName] = useState("");
  const [phrase, setPhrase] = useState("");
  const [image, setImage] = useState(null);
  const [oldImageUrl, setOldImageUrl] = useState(""); // URL de la imagen actual

  // Cargar datos de la tarjeta desde Firestore
  useEffect(() => {
    const fetchCard = async () => {
      try {
        const docRef = doc(db, collection, id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          setName(data.name || "");
          setOldImageUrl(data.imageUrl || ""); // Guardamos la imagen actual

          if (collection === "cards") {
            setPhrase(data.phrase || "");
          }
        } else {
          console.error("La tarjeta no existe");
        }
      } catch (error) {
        console.error("Error al obtener la tarjeta:", error);
      }
    };

    fetchCard();
  }, [id]);

  // Manejar la actualización de la tarjeta
  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      await updateCard({
        id,
        name: name || undefined,
        phrase: collection === "cards" ? phrase || undefined : undefined,
        imageFile: image || undefined,
        oldImageUrl,
        collectionName: "cards",
      });

      alert("Tarjeta actualizada correctamente");
      navigate("/");
    } catch (error) {
      console.error("Error al actualizar la tarjeta:", error);
    }
  };

  return (
    <div className="container">
      <div className="edited-card">
        <img src={oldImageUrl} alt="Imagen actual" className="image" />
        <form onSubmit={handleUpdate} className="form">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="input"
            placeholder="Nuevo nombre (opcional)"
          />
          {collection === "cards" && (
            <textarea
              value={phrase}
              onChange={(e) => setPhrase(e.target.value)}
              className="textarea"
              placeholder="Nueva frase (opcional)"
            ></textarea>
          )}


          <label className="file-input-label">
            Subir nueva imagen
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImage(e.target.files[0])}
              className="file-input"
            />
          </label>
          <div className="button-container">
            <button type="submit" className="button-save">
              Guardar Cambios
            </button>
            <button
              type="button"
              onClick={() => navigate("/")}
              className="button-cancel"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditCard;
