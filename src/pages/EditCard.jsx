import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { db } from "../firebaseConfig";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { updateCard } from "../utils/firebaseUtils";

function EditCard() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [phrase, setPhrase] = useState("");
  const [image, setImage] = useState(null);
  const [oldImageUrl, setOldImageUrl] = useState("");

  useEffect(() => {
    const fetchCard = async () => {
      try {
        const docRef = doc(db, "cards", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          setName(data.name || "");
          setPhrase(data.phrase || "");
          setOldImageUrl(data.imageUrl || "");
        } else {
          console.error("La tarjeta no existe");
        }
      } catch (error) {
        console.error("Error al obtener la tarjeta:", error);
      }
    };

    fetchCard();
  }, [id]);

  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      await updateCard({
        id,
        name: name || undefined, // Solo actualiza si se ha cambiado
        phrase: phrase || undefined,
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
    <div>
      <h1>Editar Tarjeta</h1>
      <form onSubmit={handleUpdate}>
        <input
          type="text"
          placeholder="Nuevo Nombre (opcional)"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <textarea
          placeholder="Nueva Frase (opcional)"
          value={phrase}
          onChange={(e) => setPhrase(e.target.value)}
        />
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImage(e.target.files[0])}
        />
        <button type="submit">Guardar Cambios</button>
        <button type="button" onClick={() => navigate("/")}>Cancelar</button>
      </form>
    </div>
  );
}

export default EditCard;
