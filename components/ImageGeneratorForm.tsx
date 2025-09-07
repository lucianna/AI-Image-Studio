
import React, { useRef, useState, useEffect, useCallback } from 'react';
import { AspectRatio } from '../types';
import { UploadIcon, SpinnerIcon } from './icons';

interface ImageGeneratorFormProps {
  onGenerate: (prompt: string, image: File | null, aspectRatio: AspectRatio) => void;
  isLoading: boolean;
}

const aspectRatios: AspectRatio[] = ['1:1', '16:9', '9:16'];

export const ImageGeneratorForm: React.FC<ImageGeneratorFormProps> = ({ onGenerate, isLoading }) => {
  const [prompt, setPrompt] = useState<string>('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>('1:1');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isImageEditingMode = !!imageFile;

  useEffect(() => {
    if (imageFile) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(imageFile);
    } else {
      setImagePreview(null);
    }
  }, [imageFile]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setImageFile(event.target.files[0]);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };
  
  const handleRemoveImage = useCallback(() => {
    setImageFile(null);
    setImagePreview(null);
    if(fileInputRef.current) {
        fileInputRef.current.value = "";
    }
  }, []);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!prompt.trim() || isLoading) return;
    onGenerate(prompt, imageFile, aspectRatio);
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="prompt" className="block text-sm font-medium text-gray-300 mb-2">
          Your Prompt
        </label>
        <textarea
          id="prompt"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="e.g., A majestic lion wearing a crown, cinematic lighting"
          rows={3}
          className="w-full bg-gray-800 border border-gray-600 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-white p-3 transition"
          required
        />
      </div>

      <div className="flex flex-col sm:flex-row gap-6">
        <div className="flex-1">
          <span className="block text-sm font-medium text-gray-300 mb-2">
            Reference Image (Optional)
          </span>
          {imagePreview ? (
            <div className="relative group">
              <img src={imagePreview} alt="Preview" className="w-full h-40 object-cover rounded-lg"/>
              <button
                type="button"
                onClick={handleRemoveImage}
                className="absolute top-2 right-2 bg-black bg-opacity-50 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity"
                aria-label="Remove image"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          ) : (
            <>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                className="hidden"
              />
              <button
                type="button"
                onClick={handleUploadClick}
                className="w-full h-40 flex flex-col items-center justify-center border-2 border-dashed border-gray-600 rounded-lg hover:border-indigo-500 transition text-gray-400"
              >
                <UploadIcon className="w-8 h-8 mb-2" />
                <span>Click to upload</span>
              </button>
            </>
          )}
        </div>
        <div className="flex-1">
          <div className="h-full flex flex-col">
            <span className={`block text-sm font-medium text-gray-300 mb-2 ${isImageEditingMode ? 'text-gray-500' : ''}`}>
              Aspect Ratio {isImageEditingMode && "(Disabled)"}
            </span>
             {isImageEditingMode && <p className="text-xs text-gray-500 mb-2 -mt-1">Aspect ratio is determined by the uploaded image in this mode.</p>}
            <div className="grid grid-cols-3 gap-2 flex-grow">
              {aspectRatios.map((ratio) => (
                <button
                  key={ratio}
                  type="button"
                  onClick={() => setAspectRatio(ratio)}
                  disabled={isImageEditingMode}
                  className={`flex items-center justify-center p-2 border rounded-lg transition ${
                    aspectRatio === ratio && !isImageEditingMode
                      ? 'bg-indigo-600 border-indigo-500 text-white'
                      : 'bg-gray-800 border-gray-600 text-gray-300'
                  } ${isImageEditingMode ? 'cursor-not-allowed opacity-50' : 'hover:border-indigo-500'}`}
                >
                  {ratio}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div>
        <button
          type="submit"
          disabled={isLoading || !prompt.trim()}
          className="w-full flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-900 disabled:cursor-not-allowed disabled:opacity-70 transition"
        >
          {isLoading ? (
            <>
              <SpinnerIcon className="w-5 h-5 mr-3" />
              Generating...
            </>
          ) : (
            'Generate 2 Variations'
          )}
        </button>
      </div>
    </form>
  );
};
