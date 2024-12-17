import React, { useState } from 'react'

import './MediaPreview.scss';
import Close from '../Close';

interface MediaPreviewProps {
  mediaArray: (string | File)[];
  setMediaArray: React.Dispatch<React.SetStateAction<(string | File)[]>>;
}

function quitMedia(setArrayFunction: React.Dispatch<React.SetStateAction<(string | File)[]>>, itemIndex: number) {
  setArrayFunction(prev => prev.filter((_, index) => index !== itemIndex)); // Elimina el índice especificado
}

export default function MediaPreview({mediaArray, setMediaArray} : MediaPreviewProps) {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault(); // Permite el evento de drop
  };

  const handleDrop = (index: number) => {
    if (draggedIndex === null || draggedIndex === index) return;

    setMediaArray(prev => {
      const newArray = [...prev];
      const [draggedItem] = newArray.splice(draggedIndex, 1); // Quitar el elemento arrastrado
      newArray.splice(index, 0, draggedItem); // Insertar en la nueva posición
      return newArray;
    });

    setDraggedIndex(null); // Reinicia el índice arrastrado
  };

  return (
    <div className="mediapreview">
      <div className="mediapreview__info">
        <label>{mediaArray.length} selected {mediaArray.length > 1 ? 'files' : 'file'}</label>
      </div>
      <div className="mediapreview__content">
        {mediaArray.map((media: string | File, index: number) => {
          // SI es un objeto File, crear URL temporal
          const isFile = media instanceof File;
          const url = isFile ? URL.createObjectURL(media) : media;

          // Verificar si es imagen o video 
          const isVideo = isFile
           ? media.type.startsWith('video/')
           : /\.(mp4|webm|ogg)$/i.test(media);

          return (
            <div
              key={index}
              className="mediapreview__item"
              draggable // Hace que el elemento sea arrastrable
              onDragStart={() => handleDragStart(index)}
              onDragOver={handleDragOver}
              onDrop={() => handleDrop(index)}
            >
              <Close handleClick={() => quitMedia(setMediaArray, index)} />
              {isVideo ? (
                <video src={url} controls className="mediapreview__video" />
              ) : (
                <img src={url} alt={`media-${index}`} className="mediapreview__image" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  )
}
