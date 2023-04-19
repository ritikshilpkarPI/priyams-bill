const { uploadImages } = require('../util/image');
const { Item } = require('../db-models/item-model');

const editItemById = async (req, res, next) => {
  try {
    const { id, itemToBeUpdated } = req.body;
    const imagesToUpload = itemToBeUpdated.images.filter(image => !image.public_id).map(image => image.secure_url)
    const images = itemToBeUpdated.images.filter(image => image.public_id)
    let uploadedImages = await uploadImages(imagesToUpload);
    itemToBeUpdated.images = [...uploadedImages, ...images]
    const changedItem = await Item.findByIdAndUpdate(id, itemToBeUpdated, {
      new: true,
    });
    res.status(200).json({ message: changedItem });
  } catch (error) {
    next(error)
  }
};

module.exports = editItemById;