const { razorpay } = require('../config/razorpayConfig');

const createRzpQRByAmount = async (req, res, next) => {
  try {
    const { amountInRs, id } = req.body;
    const amountInPaise = amountInRs * 100;

    const qrData = await razorpay.qrCode.create({
      type: 'upi_qr',
      name: 'Priyam Stores',
      usage: 'single_use',
      fixed_amount: true,
      payment_amount: amountInPaise,
      notes: {
        createdAt: new Date().toISOString(),
        documentId: id,
      },
      description: `Payment for Bill`,
    });
    res.status(201).json({ qrData });
  } catch (err) {
    console.log({ err });
    next(err);
  }
};

module.exports = createRzpQRByAmount;
