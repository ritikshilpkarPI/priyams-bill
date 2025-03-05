const cloudinary = require('cloudinary');
const { clodinaryFoldersPath, clodinaryFoldersPathKey } = require('./constant');
const path = require('path');
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
const uploadToCloudinary = (fileBuffer, fileName, folderName ="pstores/other") => {
  
  return new Promise((resolve, reject) => {
    const stream = cloudinary.v2.uploader.upload_stream(
      {
        resource_type: 'auto', 
        publicId: path.parse(fileName).name, 
        folder: folderName, 
        overwrite: true, 
      },
      (error, result) => {
        if (error) {
          console.error('Cloudinary upload error:', error);
          reject(error);
        } else {
          
          resolve(result); 
        }
      }
    );

    stream.end(fileBuffer); 
  });
}; 

const uploadMultipleImages = async (images) => {
  return await Promise.all(
    images.map(async (image) => {
      const  { public_id, secure_url } = await uploadToCloudinary(
        image.data,
        image.name,
        clodinaryFoldersPathKey.bill
      );
      return { public_id, secure_url };
    })
  );
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
  uploadMultipleImages,
  uploadToCloudinary
};
