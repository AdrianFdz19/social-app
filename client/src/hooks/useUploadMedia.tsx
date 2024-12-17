import { useState } from 'react';

export const useUploadMedia = (apiUrl: string) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const uploadMedia = async (file: File) => {
    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append('media', file);

    try {
      const response = await fetch(`${apiUrl}/media/upload`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Error al subir el archivo');
      }

      const data = await response.json();
      return data.url; // URL de Cloudinary
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { uploadMedia, loading, error };
};
