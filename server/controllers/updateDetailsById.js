const { clodinaryFoldersPath } = require('../util/constant');
const PurchaseOrder = require('../db-models/purchase-order-model');
const { uploadImages, deleteImages } = require('../util/image');
const { isShelfExpired } = require('../util/isShelfExpired');
const { getItemSKU } = require('../util/getItemSKU');

const updateDetailsById = async (req, res, next) => {
  try {
    const { purchaseObj, isDraft, id } = req.body.new_order || {};

    if (!id) {
      return res.status(400).json({ message: 'ID is required', success: false });
    }
    if (!purchaseObj) {
      return res.status(400).json({ message: 'Purchase object is required', success: false });
    }

    const existingOrder = await PurchaseOrder.findById(id);
    if (!existingOrder) {
      return res.status(404).json({ message: 'Purchase order not found', success: false });
    }

    const updateFields = { isRejected: false };

    const simpleFields = [
      { reqKey: 'details', dbKey: 'purchaseDetails' },
      { reqKey: 'billAmount', dbKey: 'billAmount' },
      { reqKey: 'remark', dbKey: 'remark' },
      { reqKey: 'totalPaidAmount', dbKey: 'totalPaidAmount' },
      { reqKey: 'payment', dbKey: 'payment' },
      { reqKey: 'procurementSource', dbKey: 'procurementSource' },
      { reqKey: 'dealerName', dbKey: 'dealerName' },
      { reqKey: 'phoneNumber', dbKey: 'phoneNumber' },
      { reqKey: 'minimumQuantity', dbKey: 'minimumQuantity' },
    ];

    simpleFields.forEach(({ reqKey, dbKey }) => {
      if (purchaseObj[reqKey] !== undefined) {
        updateFields[dbKey] = purchaseObj[reqKey];
      }
    });

    if (isDraft !== undefined) {
      updateFields.isDraft = isDraft;
    }

    const bills = purchaseObj.bills;
    const uploadedImages = req.body.uploadedImages || [];
    const delImages = req.body.deleteBills || [];

    if (
      (Array.isArray(bills) && bills.length > 0) ||
      uploadedImages.length > 0 ||
      (Array.isArray(delImages) && delImages.length > 0)
    ) {
      if (delImages.length > 0) {
        await deleteImages(delImages);
      }

      let billPhotos = [];
      if (Array.isArray(bills) && bills.length > 0) {
        const uploadedBillPhotos = await uploadImages(bills, clodinaryFoldersPath.bill);
        billPhotos = uploadedBillPhotos;
      }
      if (uploadedImages.length > 0) {
        billPhotos = [...billPhotos, ...uploadedImages];
      }
      updateFields.billPhotos = billPhotos;
    }

    const orders = purchaseObj.orders;
    if (Array.isArray(orders) && orders.length > 0) {
      updateFields.purchasedItems = orders.map(order => {
        let expiryDates = order.expiryDates;
        if (Array.isArray(expiryDates) && expiryDates.length > 0) {
          expiryDates = expiryDates.map(expiry => ({
            ...expiry,
            isShelfExpired: isShelfExpired(expiry.mfgDate, expiry.date),
          }));
        }
        return {
          ...order,
          expiryDates,
          sku: getItemSKU({
            itemQuantity: order.itemQuantity,
            unit: order.unit,
            itemName: order.inputName,
            barcode: order.barcode,
            mrp: order.mrp,
          }),
        };
      });
    }
    
    if (purchaseObj?.dateOnBill) {
      updateFields.dateOnBill = purchaseObj.dateOnBill;
    }
    const updatedOrder = await PurchaseOrder.findByIdAndUpdate(
      id,
      { $set: updateFields },
      { new: true }
    );

    res.status(200).json({ message: updatedOrder, success: true });
  } catch (error) {
    next(error);
  }
};

module.exports = updateDetailsById;