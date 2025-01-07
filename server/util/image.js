const cloudinary = require('cloudinary');
const { clodinaryFoldersPath } = require('./constant');
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});
const uploadImages = (images, type = clodinaryFoldersPath.other) => {
  return new Promise((resolve, reject) => {
    const billPhotos = [];
    if (images.length === 0) {
      resolve([]);
    }
    const folderPath = clodinaryFoldersPath[type]
      ? clodinaryFoldersPath[type]
      : clodinaryFoldersPath.other;
    images.map(async (image, index) => {
      try {
        const { public_id, secure_url } = await cloudinary.v2.uploader.upload(
          image,
          {
            folder: folderPath,
          }
        );
        billPhotos.push({ public_id, secure_url });
        if (billPhotos.length === index + 1) {
          resolve(billPhotos);
        }
      } catch (err) {
        reject(err);
      }
    });
  });
};

const deleteImages = (images) => {
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
        reject(err);
      }
    });
  });
};

module.exports = {
  uploadImages,
  deleteImages,
};
