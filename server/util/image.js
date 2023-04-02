
const uploadImages = (images,cloudinary) => {
    return new Promise((resolve, reject) => {
      var billPhotos = [];
      if (images.length === 0) {
        resolve([]);
      }
      images.forEach(async (image, index) => {
        try {
          const { public_id, secure_url } = await cloudinary.v2.uploader.upload(
            image,
            {
              folder: 'pstores',
            }
          );
          billPhotos.push({ public_id, secure_url });
          if (billPhotos.length === index + 1) {
            resolve(billPhotos);
          }
        } catch (err) {
          console.log({ err });
          reject(err);
        }
      });
    });
  };
  const deleteImages = (images,cloudinary) => {
    return new Promise((resolve, reject) => {
      if (images.length === 0) {
        resolve();
      }
      images.forEach(async (image, index) => {
        try {
          await cloudinary.uploader.destroy(image.public_id);
          if (index === images.length - 1) {
            resolve();
          }
        } catch (err) {
          console.log({ err });
          reject(err);
        }
      });
    });
  };
  
module.exports = {
    uploadImages,
    deleteImages
}