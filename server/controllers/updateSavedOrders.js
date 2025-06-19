const PurchaseOrder = require('../db-models/purchase-order-model');
const { Image } = require('../db-models/image-model');
const { isShelfExpired } = require('../util/isShelfExpired');
const { getItemSKU } = require('../util/getItemSKU');
const { MESSAGES } = require('../constants/messages');
const { createBrandAndCompany } = require('../util/createBrandAndCompany');
const { uploadMultipleImages } = require('../util/image');
const { clodinaryFoldersPathKey, POItemImageTypes } = require('../util/constant');

const updateSavedOrders = async (req, res, next) => {
  try {
    const id = req.params.id;
    const { new_order } = req.body;
    
    if (!new_order.brand || !new_order.companyName)
      return res.status(400).json({ error: MESSAGES.MISSING_REQUIRED_FIELDS });

    const { success, brand, company} = await createBrandAndCompany(
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

    let imageIds = [];
    if (imagesToUpload.length) {
      const formattedImages = imagesToUpload.map(img => ({ data: img.data, name: img.name }));
      const uploadedUrls = await uploadMultipleImages(formattedImages, clodinaryFoldersPathKey.itemsImages.toString());
      
      const images = uploadedUrls.map((url, index) => ({
        public_id: url.public_id,
        secure_url: url.secure_url,
        type: imagesToUpload[index].type,
        expiryIndex: imagesToUpload[index].expiryIndex
      }));

      const savedImages = await Promise.all(images.map(image => new Image(image).save()));
      imageIds = savedImages.map(img => img._id);
    }

    // Handle globalImages
    const globalImagesToUpload = (new_order.globalImages || []).map((image, index) =>
      typeof image === 'string'
        ? { data: image, name: `global_${index}_${Date.now()}.jpg` }
        : null
    ).filter(Boolean);

    let globalImages = [];
    if (globalImagesToUpload.length) {
      const uploadedGlobalUrls = await uploadMultipleImages(globalImagesToUpload, clodinaryFoldersPathKey.itemsImages.toString());
      globalImages = uploadedGlobalUrls.map(url => ({
        public_id: url.public_id,
        secure_url: url.secure_url
      }));
    }

    const updatedExpiryDates = (new_order.expiryDates || []).map(expiryDate => ({
      date: expiryDate.date,
      value: expiryDate.value,
      mfgDate: expiryDate.mfgDate,
      isShelfExpired: isShelfExpired(expiryDate.mfgDate, expiryDate.date),
      images: {
        expiryImages: expiryDate.images?.expiryImages || []
      }
    }));

    if(!Boolean(new_order?.item_id)) {
      new_order.newItem = true;
    }

    const purchaseOrder = await PurchaseOrder.findById(id);
    const newItemCost = new_order.costPrice * new_order.stockQuantity;

    const newPurchasedItem = {
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

    POItemImageTypes.forEach(type => delete newPurchasedItem[type]);

    const updatedOrder = await purchaseOrder.updateOne({
      purchasedItems: [...purchaseOrder.purchasedItems, newPurchasedItem],
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