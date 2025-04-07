const PurchaseOrder = require('../db-models/purchase-order-model');
const { isShelfExpired } = require('../util/isShelfExpired');
const { getItemSKU } = require('../util/getItemSKU');
const { MESSAGES } = require ('../constants/messages');
const { BrandModel } = require ('../db-models/brand-model');
const { CompanyModel } = require ('../db-models/company-model');

const updateSavedOrders = async (req, res, next) => {
  try {
    const id = req.params.id;
    const { new_order } = req.body;
    
    if (!new_order.brand || !new_order.companyName)
      return res.status(400).json({ error: MESSAGES.MISSING_REQUIRED_FIELDS });

    let company = await CompanyModel.findOne({
      companyName: new_order.companyName,
    });

    if (!company) {
      company = await CompanyModel.create({
        companyName: new_order.companyName,
      });
    }

    let brand = await BrandModel.findOne({ brandName: new_order.brand });

    if (!brand) {
      brand = await BrandModel.create({
        brandName: new_order.brand,
        companyId: company._id,
      });
    }

    const itemSKU = getItemSKU({
      itemQuantity: new_order.itemQuantity,
      unit: new_order.unit,
      itemName: new_order.inputName,
      barcode: new_order.barcode,
      mrp: new_order.mrp
    });;
    let updatedExpiryDates = new_order.expiryDates;
    if(new_order.expiryDates) {
      updatedExpiryDates = new_order.expiryDates.map(expiryDates => ({
        ...expiryDates,
        isShelfExpired: isShelfExpired(expiryDates.mfgDate, expiryDates.date)
      }))
    }
    const purchaseOrder = await PurchaseOrder.findById(id);
    const newItemCost = new_order.costPrice * new_order.stockQuantity;
    const updatedOrder = await purchaseOrder.updateOne({
      purchasedItems: [...purchaseOrder.purchasedItems, {
        ...new_order,
        expiryDates: updatedExpiryDates,
        sku: itemSKU
      }],
      purchaseDetails:{
        ...purchaseOrder.purchaseDetails,
        totalItemsCost: (purchaseOrder.purchaseDetails?.totalItemsCost || 0) + newItemCost,
      
      }
    });
    res.status(200).send({
      message: 'order added successfully',
      success: true,
      order: updatedOrder,
    });
  } catch (error) {
    next(error)
  }
};

module.exports = updateSavedOrders;