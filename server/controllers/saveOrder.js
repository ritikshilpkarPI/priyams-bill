const PurchaseOrder = require('../db-models/purchase-order-model');
const { getItemSKU } = require('../util/getItemSKU');
const { isShelfExpired } = require('../util/isShelfExpired');
const Joi = require("joi");

const schema = Joi.object({
  inputName: Joi.string().trim().required().messages({
    "string.empty": "Input Name cannot be empty",
    "any.required": "Input Name is required"
  }),
  barcode: Joi.string().trim().required().messages({
    "string.empty": "Barcode cannot be empty",
    "any.required": "Barcode is required"
  }),
  itemQuantity: Joi.number().positive().required().messages({
    "number.base": "Item Quantity must be a number",
    "number.positive": "Item Quantity must be greater than zero",
    "any.required": "Item Quantity is required"
  }),
  unit: Joi.string().trim().required().messages({
    "string.empty": "Unit cannot be empty",
    "any.required": "Unit is required"
  }),
  mrp: Joi.number().positive().required().messages({
    "number.base": "MRP must be a number",
    "number.positive": "MRP must be greater than zero",
    "any.required": "MRP is required"
  })
});

const saveOrder = async (req, res ) => {
  try {
    const { new_order = {} } = req.body;
    
    const { error } = schema.validate(new_order);

    if(error) return res.status(400).json({ error });

    const itemSKU = getItemSKU(new_order);
    if(new_order.expiryDates) {
      new_order.expiryDates.forEach(expiryDates => {
        expiryDates.isShelfExpired = isShelfExpired(expiryDates.mfgDate, expiryDates.date);
      })
    }
    new_order.sku = getItemSKU(new_order);
    const purchaseOrder = await PurchaseOrder.create({
      purchasedItems: [{
        ...new_order,
        sku: itemSKU
      }],
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