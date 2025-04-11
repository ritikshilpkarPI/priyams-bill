const PurchaseOrder = require('../db-models/purchase-order-model');
const { getItemSKU } = require('../util/getItemSKU');
const { isShelfExpired } = require('../util/isShelfExpired');
const { MESSAGES } = require ('../constants/messages');
const { createBrandAndCompany } = require('../util/createBrandAndCompany');

const saveOrder = async (req, res ) => {
  try {
    const { new_order = {} } = req.body;

    if (!new_order.brand || !new_order.companyName)
      return res.status(400).json({ error: MESSAGES.MISSING_REQUIRED_FIELDS });

    const { success, brand, company  } = await createBrandAndCompany(
      new_order.companyName,
      new_order.brand
    );
    
    if (!success) {
      return res
        .status(404)
        .json({
          message: MESSAGES.SOMETHING_WENT_WRONG_WHILE_CREATING_BRAND_COMPANY,
          success: false,
        });
    }

    if(
         !new_order.inputName 
      || !new_order.barcode 
      || !new_order.mrp 
      || !new_order.unit 
      || !new_order.itemQuantity
    ) return res.status(400).json({ error: "SKU fields cannot be empty" })

    const itemSKU = getItemSKU({
      itemQuantity: new_order.itemQuantity,
      unit: new_order.unit,
      itemName: new_order.inputName,
      barcode: new_order.barcode,
      mrp: new_order.mrp
    });
    if(new_order.expiryDates) {
      new_order.expiryDates.forEach(expiryDates => {
        expiryDates.isShelfExpired = isShelfExpired(expiryDates.mfgDate, expiryDates.date);
      })
    }
    const newItemCost = new_order.costPrice * new_order.stockQuantity;
    const purchaseOrder = await PurchaseOrder.create({
      purchasedItems: [{
        ...new_order,
        sku: itemSKU,
        brandId: brand._id,
        companyId: company._id,
      }],
      purchaseDetails: {
        totalItemsCost: newItemCost, 
      },
    });
    res.status(201).send({
      message: 'order added successfully',
      success: true,
      order: purchaseOrder,
    });
  } catch (error) {
    res.status(500).send({message: 'failed to creating order', error: error});
  }
};

module.exports = saveOrder;