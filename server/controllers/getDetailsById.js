const PurchaseOrder = require('../db-models/purchase-order-model');
const { formatImages } = require('../util/imageStructure');

const getDetailsById = async (req, res, next) => {
  const id = req.params.id;
  try {
    const data = await PurchaseOrder.findById(id)
      .populate('purchasedItems.brandId', 'brandName')
      .populate('purchasedItems.companyId', 'companyName')
      .populate('purchasedItems.images')
      .lean();

    data.purchasedItems = data.purchasedItems.map(item => ({
      ...item,
      images: formatImages(item.images)
    }));

    res.status(200).send({ data });
  } catch (error) {
    next(error);
  }
};

module.exports = getDetailsById;