const { getItemSKU } = require('../util/getItemSKU');
const PurchaseOrder = require('../db-models/purchase-order-model');
const { MESSAGES } = require ('../constants/messages');
const { createBrandAndCompany } = require('../util/createBrandAndCompany');
const { uploadImages } = require('../util/image');
const { clodinaryFoldersPath } = require('../util/constant');

const updateOrderByIndex = async (req, res,next) => {
    try {
      const purchase_id = req.params.id;
      const { index, new_order } = req.body;

      if (!new_order.brand || !new_order.companyName)
        return res.status(400).json({ error: MESSAGES.MISSING_REQUIRED_FIELDS });

      const { success, brand, company } = await createBrandAndCompany(
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

      if (new_order.expiryDates && new_order.expiryDates.length > 0) {
        for (let i = 0; i < new_order.expiryDates.length; i++) {
          const expiryDate = new_order.expiryDates[i];
          if (expiryDate.images && expiryDate.images.length > 0) {
            try {
              const existingImages = expiryDate.images.filter(img => img.public_id);
              const newImages = expiryDate.images.filter(img => !img.public_id);
              
              if (newImages.length > 0) {
                const uploadedImages = await uploadImages(
                  newImages.map(img => img.data || img), 
                  clodinaryFoldersPath.itemsImages
                );
                new_order.expiryDates[i].images = [...existingImages, ...uploadedImages];
              } else {
                new_order.expiryDates[i].images = existingImages;
              }
            } catch (error) {
              console.error(`Error uploading expiry date images for index ${i}:`, error);
              new_order.expiryDates[i].images = expiryDate.images.filter(img => img.public_id);
            }
          }
        }
      }

      new_order.sku = getItemSKU(
        {
          itemQuantity: new_order.itemQuantity,
          unit: new_order.unit,
          itemName: new_order.inputName,
          barcode: new_order.barcode,
          mrp: new_order.mrp
       });
      new_order.brandId = brand._id
      new_order.companyId = company._id

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