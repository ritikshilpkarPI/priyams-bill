import { CloudImage } from 'src/types';

export const convertFilesToBase64 = async (files: File[]): Promise<CloudImage[]> => {
  try {
    const imagePromises = files.map(file => {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          resolve(reader.result);
        };
        reader.readAsDataURL(file);
      });
    });

    return await Promise.all(imagePromises) as CloudImage[];
  } catch (error) {
    console.error('Error converting files to base64:', error);
    throw error;
  }
}; 