
import React from 'react';
import { GeneratedImage } from '../types';
import { DownloadIcon } from './icons';

interface ImageGalleryProps {
  images: GeneratedImage[];
  onImageClick: (image: GeneratedImage) => void;
}

const downloadImage = (base64Data: string, fileName: string) => {
  const link = document.createElement('a');
  // Use PNG for consistency as it's a lossless format suitable for generated art.
  link.href = `data:image/png;base64,${base64Data}`;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const ImageGallery: React.FC<ImageGalleryProps> = ({ images, onImageClick }) => {
  if (images.length === 0) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 mt-8">
      {images.map((image, index) => (
        <div key={index} className="relative group aspect-square rounded-lg overflow-hidden bg-gray-800">
          <img
            src={image.url}
            alt={`Generated variation ${index + 1}`}
            className="w-full h-full object-contain cursor-pointer transition-transform duration-300 group-hover:scale-105"
            onClick={() => onImageClick(image)}
          />
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300 flex items-center justify-center">
            <button
              onClick={() => downloadImage(image.data, `generated-image-${index + 1}.png`)}
              className="absolute bottom-3 right-3 bg-gray-900 bg-opacity-70 text-white p-2 rounded-full transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 hover:bg-opacity-90"
              aria-label="Download image"
            >
              <DownloadIcon className="w-5 h-5" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};
