import pool from "../config/databaseConfig.js";

export const uploadMedia = async (req, res) => {
    console.log('recibiendo');
    try {
      const fileUrl = req.file.path; // URL del archivo en Cloudinary
      res.status(200).json({ url: fileUrl });
    } catch (error) {
      res.status(500).json({ message: 'Error al subir el archivo', error });
    }
};
