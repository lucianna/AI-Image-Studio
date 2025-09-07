
import React from 'react';
import { GeneratedImage } from '../types';
import { CloseIcon } from './icons';

interface ImageModalProps {
  image: GeneratedImage | null;
  onClose: () => void;
}

export const ImageModal: React.FC<ImageModalProps> = ({ image, onClose }) => {
  if (!image) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-80 z-50 flex items-center justify-center p-4 animate-fade-in"
      onClick={onClose}
    >
      <div 
        className="relative max-w-4xl max-h-[90vh] bg-gray-900 rounded-lg shadow-2xl p-2"
        onClick={(e) => e.stopPropagation()} // Prevent closing modal when clicking on the image container
      >
        <img 
          src={image.url} 
          alt="Enlarged view" 
          className="max-w-full max-h-[calc(90vh-1rem)] object-contain rounded"
        />
        <button
          onClick={onClose}
          className="absolute -top-4 -right-4 bg-gray-800 text-white rounded-full p-2 hover:bg-gray-700 transition"
          aria-label="Close modal"
        >
          <CloseIcon className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
};
