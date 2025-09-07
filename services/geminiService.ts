
import { GoogleGenAI, Modality } from "@google/genai";
import { AspectRatio } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const fileToGenerativePart = (file: File) => {
  return new Promise<{ inlineData: { data: string; mimeType: string } }>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result !== 'string') {
        return reject(new Error('Failed to read file as base64 string'));
      }
      const base64Data = reader.result.split(',')[1];
      resolve({
        inlineData: {
          data: base64Data,
          mimeType: file.type,
        },
      });
    };
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });
};

/**
 * Generates images from a text prompt using the 'imagen-4.0-generate-001' model.
 */
export const generateImageWithPrompt = async (prompt: string, aspectRatio: AspectRatio): Promise<string[]> => {
  const response = await ai.models.generateImages({
    model: 'imagen-4.0-generate-001',
    prompt,
    config: {
      numberOfImages: 2,
      outputMimeType: 'image/png',
      aspectRatio,
    },
  });

  return response.generatedImages.map(img => img.image.imageBytes);
};

/**
 * Edits an image based on a text prompt using the 'gemini-2.5-flash-image-preview' model.
 * It makes two parallel API calls to get two variations.
 */
export const editImageWithPrompt = async (prompt: string, imageFile: File): Promise<string[]> => {
  const imagePart = await fileToGenerativePart(imageFile);

  const contents = {
    parts: [
      imagePart,
      { text: prompt },
    ],
  };

  const callApi = () => ai.models.generateContent({
    model: 'gemini-2.5-flash-image-preview',
    contents,
    config: {
      responseModalities: [Modality.IMAGE, Modality.TEXT],
    },
  });

  // Make two API calls in parallel to get two variations
  const [response1, response2] = await Promise.all([callApi(), callApi()]);

  const results: string[] = [];
  for (const response of [response1, response2]) {
      if (response.candidates && response.candidates.length > 0) {
        const imagePart = response.candidates[0].content.parts.find(p => p.inlineData);
        if (imagePart && imagePart.inlineData) {
            results.push(imagePart.inlineData.data);
        }
      }
  }

  if (results.length < 2) {
      throw new Error("Failed to generate two image variations. Please try again.");
  }
  
  return results;
};
