export const convertImageToBase64 = (imagePath: string, key: string): void => {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', imagePath, true);
    xhr.responseType = 'blob';
  
    xhr.onload = function () {
      if (xhr.status === 200) { 
        const reader = new FileReader();
        reader.readAsDataURL(xhr.response);
        reader.onloadend = function () {
          if (typeof reader.result === 'string') {
            localStorage.setItem(key, reader.result);
          } else {
            console.error('Error: Failed to convert image to Base64.');
          }
        };
      } else {
        console.error(`Failed to load image: ${imagePath}, Status: ${xhr.status}`);
      }
    };
  
    xhr.onerror = function () {
      console.error(`Error fetching image: ${imagePath}`);
    };
  
    xhr.send();
  };
  