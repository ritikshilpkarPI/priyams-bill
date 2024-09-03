const { clodinaryFoldersPath } = require('../util/constant');
const { uploadImages } = require('../util/image');
const PurchaseOrder = require('../db-models/purchase-order-model');

const payPurchaseOrderBill = async (req, res,next) => {
  try {
    const { id, isPaid, payBillImages, paidAmount } = req.body;
     if(!id || !isPaid || !payBillImages || !paidAmount || !Array.isArray(payBillImages)) {
        throw new Error('Invalid request parameters');
     }
    let imagesData;
    if (Array.isArray(payBillImages)) {
      imagesData = await uploadImages(
        payBillImages,
        clodinaryFoldersPath.paySlip
      );
    }
    
    let order = await PurchaseOrder.findByIdAndUpdate(id, {
      isPaid,
      payBillImage: imagesData,
      totalPaidAmount: paidAmount.toString(),
      paidTime:Date.now(),
    },{new:true});

    res.status(200).send({ message: order, success: true });
  } catch (error) {
    next(error);
  }
};

module.exports = payPurchaseOrderBill;