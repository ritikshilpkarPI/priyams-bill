const { uploadImages, deleteImages } = require('../util/image');
const { Item } = require('../db-models/item-model');

const editItemById = async (req, res, next) => {
  try {
    const { id, itemToBeUpdated } = req.body;
    let { images = [], deletedImages: imagesToDelete = [] } = itemToBeUpdated;

    if (images.length) {
      const imagesToUpload = images
        .filter((image) => !image.public_id)
        .map((image) => image.secure_url);
      const filterUploadedImages = images.filter((image) => image.public_id);
      const uploadedImages = await uploadImages(imagesToUpload);
      images = [...uploadedImages, ...filterUploadedImages];
    }

    if (imagesToDelete.length) {
      await deleteImages(imagesToDelete);
    }

    itemToBeUpdated.images = images;
    const { deletedImages, ...itemsToUpadate } = itemToBeUpdated;
    const changedItem = await Item.findByIdAndUpdate(id, itemsToUpadate, {
      new: true,
    });
    res.status(200).json({ message: changedItem });
  } catch (error) {
    next(error);
  }
};

module.exports = editItemById;
