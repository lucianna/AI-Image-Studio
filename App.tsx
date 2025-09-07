
import React, { useState, useCallback } from 'react';
import { ImageGeneratorForm } from './components/ImageGeneratorForm';
import { ImageGallery } from './components/ImageGallery';
import { ImageModal } from './components/ImageModal';
import { generateImageWithPrompt, editImageWithPrompt } from './services/geminiService';
import { AspectRatio, GeneratedImage } from './types';
import { SpinnerIcon } from './components/icons';

const App: React.FC = () => {
  const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<GeneratedImage | null>(null);

  const handleGenerate = useCallback(async (prompt: string, imageFile: File | null, aspectRatio: AspectRatio) => {
    setIsLoading(true);
    setError(null);
    setGeneratedImages([]);

    try {
      let base64Results: string[];
      if (imageFile) {
        // Use the editing model when an image is provided
        base64Results = await editImageWithPrompt(prompt, imageFile);
      } else {
        // Use the generation model for text-only prompts
        base64Results = await generateImageWithPrompt(prompt, aspectRatio);
      }

      const images = base64Results.map(data => ({
        url: `data:image/png;base64,${data}`,
        data: data,
      }));
      setGeneratedImages(images);

    } catch (err: any) {
      console.error(err);
      setError(err.message || 'An unexpected error occurred. Please check the console and try again.');
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  const handleImageClick = useCallback((image: GeneratedImage) => {
      setSelectedImage(image);
  }, []);
  
  const handleCloseModal = useCallback(() => {
      setSelectedImage(null);
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 font-sans">
      <main className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <header className="text-center mb-10">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-red-500">
            AI Image Studio
          </h1>
          <p className="mt-4 text-lg text-gray-400">
            Craft stunning visuals from your imagination. Powered by Gemini.
          </p>
        </header>

        <div className="bg-gray-800/50 p-6 sm:p-8 rounded-2xl shadow-lg border border-gray-700">
          <ImageGeneratorForm onGenerate={handleGenerate} isLoading={isLoading} />
        </div>

        <div className="mt-10">
          {isLoading && (
            <div className="flex flex-col items-center justify-center text-center p-10 bg-gray-800/50 rounded-lg border border-gray-700">
              <SpinnerIcon className="w-12 h-12 text-indigo-400 mb-4" />
              <p className="text-lg font-medium">Generating your masterpiece...</p>
              <p className="text-sm text-gray-400">This may take a moment.</p>
            </div>
          )}
          {error && (
            <div className="bg-red-900/50 border border-red-700 text-red-300 px-4 py-3 rounded-lg" role="alert">
              <strong className="font-bold">Error: </strong>
              <span className="block sm:inline">{error}</span>
            </div>
          )}
          {!isLoading && !error && (
            <ImageGallery images={generatedImages} onImageClick={handleImageClick} />
          )}
        </div>
      </main>
      <ImageModal image={selectedImage} onClose={handleCloseModal} />
       <footer className="text-center py-6 text-gray-500 text-sm">
        <p>Built with React, Tailwind CSS, and the Google Gemini API.</p>
      </footer>
    </div>
  );
};

export default App;
