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

export const uploadFoodCard = async ({ name, imageFile }) => {
  try {
    // Subir la imagen a Cloudinary
    const formData = new FormData();
    formData.append("file", imageFile);
    formData.append("upload_preset", "ml_default");
    formData.append("folder", "food_cards");

    const response = await axios.post(
      "https://api.cloudinary.com/v1_1/dc3kybsmr/image/upload",
      formData
    );

    const imageUrl = response.data.secure_url;

    // Guardar datos en Firestore en la colección "food_cards"
    const docRef = await addDoc(collection(db, "food_cards"), {
      name,
      imageUrl,
    });

    return { id: docRef.id, name, imageUrl };
  } catch (error) {
    console.error("Error al subir tarjeta de comida:", error);
    throw error;
  }
};
