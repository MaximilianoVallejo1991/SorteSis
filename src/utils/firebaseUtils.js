import axios from "axios";
import { db } from "../firebaseConfig";
import { doc, getDoc, updateDoc, deleteDoc, collection, addDoc } from "firebase/firestore";


export const uploadCard = async ({ name, phrase, imageFile }) => {
  try {

    const backendURL = import.meta.env.VITE_BACKEND_URL;

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

    const backendURL = import.meta.env.VITE_BACKEND_URL;
    

    const segments = imageUrl.split("/");
    const imageName = segments.pop().split(".")[0]; // Extrae el ID de la imagen
    const cloudinaryPublicId = `${collectionName}/${imageName}`;

    // 🔹 Llamar al backend para eliminar la imagen
    const cloudinaryResponse = await axios.delete(`${backendURL}/delete-image`, {
      data: { public_id: cloudinaryPublicId },
    });

    if (!cloudinaryResponse.data.success) {
      console.warn("No se pudo eliminar la imagen de Cloudinary.");
    }

    // 🔹 Eliminar el documento en Firestore
    await deleteDoc(doc(db, collectionName, id));

    console.log(`Tarjeta con ID ${id} eliminada exitosamente.`);
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
          api_key: "884664781914291",
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

