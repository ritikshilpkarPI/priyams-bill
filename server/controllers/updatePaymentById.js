const PurchaseOrder = require('../db-models/purchase-order-model');
const { clodinaryFoldersPathKey } = require('../util/constant');
const { uploadToCloudinary } = require('../util/image');
const { parseStringToJson } = require('../util/parseStringToJson');

const uploadPaymentImages = async (images) => {
  return await Promise.all(
    images.map(async (image) => {
      const imagesUrl = await uploadToCloudinary(
        image.data,
        image.name,
        clodinaryFoldersPathKey.bill
      );
      return {
        public_id: imagesUrl.public_id,
        secure_url: imagesUrl.secure_url,
      };
    })
  );
};

const updatePaymentById = async (req, res, next) => {
  try {
    const purchase_id = req.params.id;
    const parsedData = parseStringToJson(req.body.data);
    const { type, data } = parsedData;
    const purchaseOrder = await PurchaseOrder.findById(purchase_id);

    if (!purchaseOrder) {
      return res
        .status(404)
        .json({ message: 'Purchase order not found', success: false });
    }

    let updatedPurchaseDetails = purchaseOrder.purchaseDetails || {};

    if (type.toLowerCase() === 'credit') {
      const { creditAmount, payDate, creditLimitInDays } = data;
      updatedPurchaseDetails.credits = [
        ...purchaseOrder.purchaseDetails.credits,
        {
          creditAmount,
          payDate,
          creditLimitInDays,
          createdAt: new Date(),
        },
      ];
    } else if (type.toLowerCase() === 'payment') {
      const { paidBy, paidAmount, paymentDate } = data;
      if (
        ['upi', 'cheque', 'neft'].includes(paidBy.toLowerCase()) &&
        !  req.files
      ) {
        return res
          .status(400)
          .json({ message: 'Bill image is required', success: false });
      }
      let paymentImgURL
      if(req.files){
        const { paymentImges } = req.files;
        paymentImgURL = paymentImges ? await uploadPaymentImages(paymentImges) : [];
      }
      

      updatedPurchaseDetails.payments = [
        ...purchaseOrder.purchaseDetails.payments,
        {
          paidBy,
          paymentImgURL,
          paidAmount: parseFloat(paidAmount).toFixed(2),
          paymentDate: paymentDate || new Date(),
          createdAt: new Date(),
        },
      ];
    }

    const totalPaidAmount = updatedPurchaseDetails.payments
      .reduce((total, payment) => total + Number(payment.paidAmount), 0)
      .toFixed(2);

    const { totalPayableAmount, totalBillAmount, paymentType } = data;

    const updatedOrder = await PurchaseOrder.findByIdAndUpdate(
      purchase_id,
      {
        'purchaseDetails.credits': updatedPurchaseDetails.credits,
        'purchaseDetails.payments': updatedPurchaseDetails.payments,
        'purchaseDetails.totalPayableAmount': totalPayableAmount,
        'purchaseDetails.totalBillAmount': totalBillAmount,
        'purchaseDetails.paymentType': paymentType,
        totalPaidAmount,
      },
      { new: true }
    );
    res.status(200).send({
      message: 'order updated successfully',
      success: true,
      order: updatedOrder,
      updatedOrder,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

module.exports = updatePaymentById;
