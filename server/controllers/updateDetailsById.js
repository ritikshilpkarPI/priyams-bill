const PurchaseOrder = require('../db-models/purchase-order-model');
const cloudinary = require('cloudinary');

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});


const updateDetailsById = async (req, res) => {
  try {
    const {
      details,
      bills,
      orders,
      billAmount,
      remark,
      totalPaidAmount,
      payment,
      procurementSource,
      dealerName,
      phoneNumber,
      minimumQuantity,
    } = req.body.new_order.purchaseObj;
    const isDraft = req.body.new_order.isDraft;
    const id = req.body.new_order.id;
    //ALREADY UPLOADED IMAGES
    const uploadedImages = req.body.uploadedImages;
    const delImages = req.body.deleteBills;

    //DELETING IMAGES FROM CLOUDINARY
    await deleteImages(delImages);

    let billPhotos = [];
    billPhotos = await uploadImages(bills);
    billPhotos = [...billPhotos, ...uploadedImages];

    const purchaseOrder = {
      purchasedItems: [...orders],
      purchaseDetails: [...details],
      isDraft,
      billPhotos,
      billAmount,
      remark,
      totalPaidAmount,
      payment,
      procurementSource,
      dealerName,
      phoneNumber,
      minimumQuantity,
      isRejected: false,
    };
    let order = await PurchaseOrder.findByIdAndUpdate(id, purchaseOrder);

    res.status(201).send({ message: order, success: true });
  } catch (error) {
    console.log({ error });
    res.status(400).send({ error, success: false });
  }
};

const uploadImages = (images) => {
  return new Promise((resolve, reject) => {
    var billPhotos = [];
    if (images.length == 0) {
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
const deleteImages = (images) => {
  return new Promise((resolve, reject) => {
    if (images.length == 0) {
      resolve();
    }
    images.forEach(async (image, index) => {
      try {
        await cloudinary.uploader.destroy(image.public_id);
        if (index == images.length - 1) {
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
  updateDetailsById,
};
