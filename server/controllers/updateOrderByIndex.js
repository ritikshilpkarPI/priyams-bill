const { getItemSKU } = require('../util/getItemSKU');
const PurchaseOrder = require('../db-models/purchase-order-model');
const { MESSAGES } = require ('../constants/messages');
const { BrandModel } = require ('../db-models/brand-model');
const { CompanyModel } = require ('../db-models/company-model');

const updateOrderByIndex = async (req, res,next) => {
    try {
      const purchase_id = req.params.id;
      const { index, new_order } = req.body;

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

      new_order.sku = getItemSKU(
        {
          itemQuantity: new_order.itemQuantity,
          unit: new_order.unit,
          itemName: new_order.inputName,
          barcode: new_order.barcode,
          mrp: new_order.mrp
       });
      const purchaseOrder = await PurchaseOrder.findById(purchase_id);
      
      if ( index >= 0 && index < purchaseOrder.purchasedItems.length) {
        purchaseOrder.purchasedItems[index] = new_order;
    } else {
      purchaseOrder.purchasedItems = [new_order, ...purchaseOrder.purchasedItems]
    }
      const totalItemsCost = purchaseOrder.purchasedItems.reduce((total, item) => {
          return total + (item.costPrice * item.stockQuantity);
      }, 0);

      purchaseOrder.purchaseDetails.totalItemsCost = totalItemsCost;

      await purchaseOrder.save();
      
      res.status(200).send({
        message: 'order updated successfully',
        success: true,
        order: purchaseOrder,
      });
    } catch (error) {
      next(error)
    }
  };

  module.exports = updateOrderByIndex;