const { getItemSKU } = require('../util/getItemSKU');
const PurchaseOrder = require('../db-models/purchase-order-model');
const { MESSAGES } = require ('../constants/messages');
const { createBrandAndCompany } = require('../util/createBrandAndCompany');
const { uploadImages } = require('../util/image');
const { clodinaryFoldersPath, POItemImageTypes } = require('../util/constant');

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

      const uploadedImages = {};
      
      for (const type of POItemImageTypes) {
        if (new_order[type]?.length > 0) {
          const validImages = new_order[type].filter(img => 
            typeof img === 'object' && (img.public_id || img.data)
          );
          if (validImages.length > 0) {
            uploadedImages[type] = validImages;
          }
        }
      }
      
      if (new_order.expiryDates?.length > 0) {
        new_order.expiryDates.forEach((expiryDate, idx) => {
          if (expiryDate.images?.length > 0) {
            const validImages = expiryDate.images.filter(img => 
              typeof img === 'object' && (img.public_id || img.data)
            );
            if (validImages.length > 0) {
              uploadedImages[`expiryDate_${idx}`] = validImages;
            }
          }
        });
      }

      for (const [type, images] of Object.entries(uploadedImages)) {
        if (images && images.length > 0) {
          try {
            const existingImages = images.filter(img => img.public_id);
            const newImages = images.filter(img => !img.public_id && img.data);
            
            if (newImages.length > 0) {
              const uploadedUrls = await uploadImages(
                newImages.map(img => img.data),
                clodinaryFoldersPath.itemsImages
              );
              uploadedImages[type] = [...existingImages, ...uploadedUrls];
            } else {
              uploadedImages[type] = existingImages;
            }
          } catch (error) {
            console.error(`Error uploading ${type} images:`, error);
            uploadedImages[type] = images.filter(img => img.public_id);
          }
        } else {
          uploadedImages[type] = [];
        }
      }

      if (new_order.expiryDates?.length > 0) {
        new_order.expiryDates = new_order.expiryDates.map((expiryDate, idx) => ({
          ...expiryDate,
          images: uploadedImages[`expiryDate_${idx}`] || []
        }));
      }

      for (const type of POItemImageTypes) {
        if (new_order[type]) {
          new_order[type] = uploadedImages[type] || [];
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