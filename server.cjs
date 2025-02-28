require("dotenv").config();


const express = require("express");
const cors = require("cors");
const cloudinary = require("cloudinary").v2;
const bodyParser = require("body-parser");

const app = express();
app.use(cors());
app.use(bodyParser.json());

// aqui establezco la configuracion de cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// aqui la ruta para eliminar las imagenes

app.delete("/delete-image", async (req, res) => {
    try {
        const { public_id } = req.body;

        if (!public_id) {
                return res.status(400).json({ success: false, message: "public id requerido" });
        }

        const result = await cloudinary.uploader.destroy(public_id);

        if (result.result !== "ok") {
                return res.status(500).json({ success: false, message: "Error al eliminar la imagen"});
        }

        res.json({success: true, message: "la imagen fue eliminada correctamente"});
    } catch (error) {
        console.error("Error al eliminar la imagen:", error);
        res.status(500).json({ success: false, message: "error en el servidor"});
    }
    
});

//INICAR SERVIDOR

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Servidor corriendo en http://localhost:${PORT}`));

