const { getItemSKU } = require('../util/getItemSKU');
const PurchaseOrder = require('../db-models/purchase-order-model');
const { Image } = require('../db-models/image-model');
const { MESSAGES } = require ('../constants/messages');
const { createBrandAndCompany } = require('../util/createBrandAndCompany');
const { uploadMultipleImages } = require('../util/image');
const { clodinaryFoldersPathKey, POItemImageTypes } = require('../util/constant');
const { isShelfExpired } = require('../util/isShelfExpired');

const updateOrderByIndex = async (req, res,next) => {
    try {
      const purchase_id = req.params.id;
      const { index, new_order } = req.body;

      if (!new_order.brand || !new_order.companyName) {
        return res.status(400).json({ error: MESSAGES.MISSING_REQUIRED_FIELDS });
      }

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

      const purchaseOrder = await PurchaseOrder.findById(purchase_id);
      if (!purchaseOrder) {
        return res.status(404).json({ message: 'Purchase order not found' });
      }

      let existingImageIds = [];
      if (index >= 0 && index < purchaseOrder.purchasedItems.length) {
        existingImageIds = purchaseOrder.purchasedItems[index].images || [];
      }

      const imagesToUpload = [];
      const imageTypes = [];


      const regularImages = POItemImageTypes.flatMap(type => 
        (new_order[type] || []).map((image, index) => 
          typeof image === 'string' ? { data: image, name: `${type}_${index}_${Date.now()}.jpg`, type } : null
        ).filter(Boolean)
      );

      const expiryImages = (new_order.expiryDates || []).flatMap((expiryDate, expiryIndex) => 
        (expiryDate.images?.expiryImages || []).map((image, index) => 
          typeof image === 'string' ? { 
            data: image, 
            name: `expiry_${expiryIndex}_${index}_${Date.now()}.jpg`, 
            type: 'expiryImages',
            expiryIndex 
          } : null
        ).filter(Boolean)
      );

      imagesToUpload.push(...regularImages, ...expiryImages);
      imageTypes.push(...new Set(regularImages.map(img => img.type)));

      let newImageIds = [];
      if (imagesToUpload.length) {
        try {
          const formattedImages = imagesToUpload.map(img => ({ data: img.data, name: img.name }));
          const uploadedUrls = await uploadMultipleImages(formattedImages, clodinaryFoldersPathKey.itemsImages.toString());
          
          const images = uploadedUrls.map((url, index) => ({
            public_id: url.public_id,
            secure_url: url.secure_url,
            type: imagesToUpload[index].type,
            expiryIndex: imagesToUpload[index].expiryIndex
          }));

          const savedImages = await Promise.all(images.map(image => new Image(image).save()));
          newImageIds = savedImages.map(img => img._id);
        } catch (error) {
          return res.status(500).json({ 
            message: 'Error uploading images', 
            error: error.message 
          });
        }
      }

      // Handle globalImages
      const globalImagesToUpload = (new_order.globalImages || []).filter(img => typeof img === 'string').map((image, index) =>
        ({ data: image, name: `global_${index}_${Date.now()}.jpg` })
      );

      let globalImages = [];
      if (globalImagesToUpload.length) {
        const uploadedGlobalUrls = await uploadMultipleImages(globalImagesToUpload, clodinaryFoldersPathKey.itemsImages.toString());
        globalImages = uploadedGlobalUrls.map(url => ({
          public_id: url.public_id,
          secure_url: url.secure_url
        }));
      } else if (Array.isArray(new_order.globalImages)) {
        // If already uploaded (edit case), keep the existing objects
        globalImages = new_order.globalImages.filter(img => typeof img === 'object' && img.public_id && img.secure_url);
      }

      const imageIds = [...existingImageIds, ...newImageIds];

      const updatedExpiryDates = (new_order.expiryDates || []).map(expiryDate => ({
        date: expiryDate.date,
        value: expiryDate.value,
        mfgDate: expiryDate.mfgDate,
        isShelfExpired: isShelfExpired(expiryDate.mfgDate, expiryDate.date),
        images: {
          expiryImages: expiryDate.images?.expiryImages || []
        }
      }));

      const updatedPurchasedItem = {
        ...new_order,
        images: imageIds,
        expiryDates: updatedExpiryDates,
        sku: getItemSKU({
          itemQuantity: new_order.itemQuantity,
          unit: new_order.unit,
          itemName: new_order.inputName,
          barcode: new_order.barcode,
          mrp: new_order.mrp
        }),
        brandId: brand._id,
        companyId: company._id,
        globalImages,
      };

      POItemImageTypes.forEach(type => delete updatedPurchasedItem[type]);
      
      if (index >= 0 && index < purchaseOrder.purchasedItems.length) {
        purchaseOrder.purchasedItems[index] = updatedPurchasedItem;
      } else {
        purchaseOrder.purchasedItems = [updatedPurchasedItem, ...purchaseOrder.purchasedItems];
      }

      const totalItemsCost = purchaseOrder.purchasedItems.reduce((total, item) => {
        return total + (item.costPrice * item.stockQuantity);
      }, 0);

      purchaseOrder.purchaseDetails.totalItemsCost = totalItemsCost;

      await purchaseOrder.save();
      
      res.status(200).send({
        message: 'Order updated successfully',
        success: true,
        order: purchaseOrder,
      });
    } catch (error) {
      next(error);
    }
  };

  module.exports = updateOrderByIndex;