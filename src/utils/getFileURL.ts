export const getFileURL = async (file: File): Promise<string | Error> => {
  return new Promise((resolve, reject) => {
    if (!file) {
      return reject(new Error('No file provided'));
    }

    const reader = new FileReader();

    reader.onloadend = (event: ProgressEvent<FileReader>) => {
      if (event.target) {
        resolve(event.target.result as string);
      } else {
        reject(new Error('Failed to read file'));
      }
    };

    reader.onerror = (error) => {
      reject(error);
    };

    reader.readAsDataURL(file);
  });
};
