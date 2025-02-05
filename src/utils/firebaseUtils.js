import axios from "axios";
import { db } from "../firebaseConfig";
import { collection, addDoc } from "firebase/firestore";

import { doc, deleteDoc } from "firebase/firestore";

import { doc, updateDoc } from "firebase/firestore";


// Función para extraer el ID público de la imagen en Cloudinary desde la URL
const getPublicIdFromUrl = (imageUrl) => {
  const parts = imageUrl.split("/");
  const filename = parts[parts.length - 1]; // Obtiene el último segmento (nombre del archivo)
  return filename.split(".")[0]; // Elimina la extensión del archivo
};


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



export const deleteCard = async (id, imageUrl, collectionName) => {
  try {
    // 1. Obtener el ID de la imagen en Cloudinary
    const publicId = getPublicIdFromUrl(imageUrl);

    // 2. Eliminar la imagen de Cloudinary
    await axios.post(
      `https://api.cloudinary.com/v1_1/dc3kybsmr/delete_by_token`,
      {
        public_id: `cards/${publicId}`,
        api_key: "TU_API_KEY", // Asegúrate de usar tu API Key
      }
    );

    // 3. Eliminar el documento en Firestore
    await deleteDoc(doc(db, collectionName, id));

    console.log("Tarjeta eliminada correctamente.");
  } catch (error) {
    console.error("Error al eliminar la tarjeta:", error);
    throw error;
  }
};



export const updateCard = async ({ id, name, phrase, imageFile, oldImageUrl, collectionName }) => {
  try {
    let imageUrl = oldImageUrl;

    // Si hay una nueva imagen, subimos a Cloudinary
    if (imageFile) {
      const formData = new FormData();
      formData.append("file", imageFile);
      formData.append("upload_preset", "ml_default");
      formData.append("folder", collectionName); // Usa la carpeta correspondiente

      const response = await axios.post(
        "https://api.cloudinary.com/v1_1/dc3kybsmr/image/upload",
        formData
      );

      imageUrl = response.data.secure_url;

      // Eliminar la imagen anterior en Cloudinary
      const publicId = getPublicIdFromUrl(oldImageUrl);
      await axios.post(
        `https://api.cloudinary.com/v1_1/dc3kybsmr/delete_by_token`,
        {
          public_id: `${collectionName}/${publicId}`,
          api_key: "TU_API_KEY",
        }
      );
    }

    // Actualizar Firestore
    const docRef = doc(db, collectionName, id);
    await updateDoc(docRef, { name, phrase, imageUrl });

    console.log("Tarjeta actualizada correctamente.");
  } catch (error) {
    console.error("Error al actualizar la tarjeta:", error);
    throw error;
  }
};

