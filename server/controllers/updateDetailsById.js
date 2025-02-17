const { clodinaryFoldersPath } = require('../util/constant');
const PurchaseOrder = require('../db-models/purchase-order-model');
const { uploadImages, deleteImages } = require('../util/image');
const { isShelfExpired } = require('../util/isShelfExpired');
const { getItemSKU } = require('../util/getItemSKU');

const updateDetailsById = async (req, res,next) => {
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
    billPhotos = await uploadImages(bills,clodinaryFoldersPath.bill);
    billPhotos = [...billPhotos, ...uploadedImages];

    let updatedOrders = orders;
    if(orders && orders.length){
      updatedOrders = orders.map(((order) => {
        let expiryDates = order.expiryDates;
        if(order.expiryDates) {
          expiryDates = order.expiryDates.map(expiryDates => ({
            ...expiryDates,
            isShelfExpired: isShelfExpired(expiryDates.mfgDate, expiryDates.date)
          }))
        }
        return {
          ...order,
          expiryDates,
          sku: getItemSKU({
            itemQuantity: order.itemQuantity,
            unit: order.unit,
            itemName: order.inputName,
            barcode: order.barcode,
            mrp: order.mrp
          })
        }
      }))
    }

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
    next(error)
  }
};


module.exports = updateDetailsById;