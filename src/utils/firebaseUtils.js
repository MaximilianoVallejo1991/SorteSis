import axios from "axios";
import { db } from "../firebaseConfig";
import { collection, addDoc } from "firebase/firestore";


export const uploadCard = async ({ name, phrase, imageFile }) => {
  try {
    // Crear el FormData para subir la imagen
    const formData = new FormData();
    formData.append("file", imageFile); // El archivo de imagen
    formData.append("upload_preset", "ml_default"); // Tu upload preset de Cloudinary
    formData.append("folder", "cards"); // Carpeta en Cloudinary (opcional)

    // Subir la imagen a Cloudinary
    const response = await axios.post(
      "https://api.cloudinary.com/v1_1/dc3kybsmr/image/upload",
      formData
    );

    const imageUrl = response.data.secure_url; // URL pública de la imagen subida

    // Guardar datos en Firestore
    const docRef = await addDoc(collection(db, "cards"), {
      name,
      phrase,
      imageUrl,
    });

    return { id: docRef.id, name, phrase, imageUrl };
  } catch (error) {
    console.error("Error al subir tarjeta:", error);
    throw error;
  }
};