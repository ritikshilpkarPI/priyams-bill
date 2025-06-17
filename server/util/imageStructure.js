const { Image } = require('../db-models/image-model');
const { POItemImageTypes } = require('./constant');

const formatImages = (images) => {
  if (!images || !Array.isArray(images)) {
    return {};
  }

  const formattedImages = {};

  images.forEach(image => {
    if (!image || !image.type) return;

    const { type, public_id, secure_url } = image;

    const key = `${type}`;
    if (!formattedImages[key]) {
      formattedImages[key] = [];
    }
    formattedImages[key].push({ public_id, secure_url });
  });

  return formattedImages;
};

module.exports = {
  formatImages
}; 