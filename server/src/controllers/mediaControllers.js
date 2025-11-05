import pool from "../config/databaseConfig.js";

export const uploadMedia = async (req, res) => {
  console.log('Recibiendo archivo...');
  console.log('req.file:', req.file);
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No se recibió ningún archivo' });
    }
    const fileUrl = req.file.path;
    res.status(200).json({ url: fileUrl });
  } catch (error) {
    console.error('Error en uploadMedia:', error);
    res.status(500).json({ message: 'Error al subir el archivo', error });
  }
};
