const PurchaseOrder = require("../db-models/purchase-order-model");
const cloudinary = require("cloudinary");

cloudinary.config({
  cloud_name: "ddyxdmsbt",
  api_key: "746828226867264",
  api_secret: "MTDkW6-kwXmA6m7ZpL7XXhADvk8",
});

const addOrder = async (req, res) => {
  try {
    const {
      details,
      bills,
      orders,
      billAmount,
      remark,
      totalPaidAmount,
      payment,
      procurementSource,
      dealerName,
      phoneNumber,
      minimumQuantity,
    } = req.body.new_order.purchaseObj;
    const isDraft = req.body.new_order.isDraft;

    let billPhotos = await uploadImages(bills);
    const purchaseOrder = {
      purchasedItems: [...orders],
      purchaseDetails: [...details],
      billPhotos,
      isDraft,
      billAmount,
      remark,
      totalPaidAmount,
      payment,
      procurementSource,
      dealerName,
      phoneNumber,
      minimumQuantity
    };
    const order = await PurchaseOrder.create(purchaseOrder);
    res.status(201).send({ message: order, success: true });
  } catch (error) {
    res.status(400).send({ message: error.message, success: false });
  }
};
const getOrders = async (req, res) => {
  try {
    const orders = await PurchaseOrder.find({});
    res.status(201).send({ message: "got the orders", orders });
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
};
const getDetailsById = async (req, res) => {
  const id = req.params.id;
  try {
    const data = await PurchaseOrder.findById(id);
    res.status(201).send({ data });
  } catch (err) {
    res.status(400).send({ message: err });
  }
};
const updateDetailsById = async (req, res) => {
  try {
    const {
      details,
      bills,
      orders,
      billAmount,
      remark,
      totalPaidAmount,
      payment,
      procurementSource,
      dealerName,
      phoneNumber,
      minimumQuantity,
    } = req.body.new_order.purchaseObj;
    const isDraft = req.body.new_order.isDraft;
    const id = req.body.new_order.id;

    //ALREADY UPLOADED IMAGES
    const uploadedImages = req.body.uploadedImages;
    const delImages = req.body.deleteBills;

    //DELETING IMAGES FROM CLOUDINARY
    await deleteImages(delImages);

    let billPhotos = [];
    billPhotos = await uploadImages(bills);
    billPhotos = [...billPhotos, ...uploadedImages];

    const purchaseOrder = {
      purchasedItems: [...orders],
      purchaseDetails: [...details],
      isDraft,
      billPhotos,
      billAmount,
      remark,
      totalPaidAmount,
      payment,
      procurementSource,
      dealerName,
      phoneNumber,
      minimumQuantity,
      isRejected:false,
    };
    let order = await PurchaseOrder.findByIdAndUpdate(id, purchaseOrder);

    res.status(201).send({ message: order, success: true });
  } catch (error) {
    res.status(400).send({ message: error.message, success: false });
  }
};
const draftOrder = async (req,res)=>{
  
  try{
    const {id} = req.body;
    const order = await PurchaseOrder.findByIdAndUpdate(id,{
      isDraft:true,
      isRejected:false
    },{new : true});
    res.status(200).send({message:"order drafted successfully",success:true,order});
  }catch(err){
    res.status(400).send({message:err.message,success:false})
  }
}
const uploadImages = (images) => {
  return new Promise((resolve, reject) => {
    var billPhotos = [];
    if (images.length == 0) {
      resolve([]);
    }
    images.forEach(async (image, index) => {
      try {
        const { public_id, secure_url } = await cloudinary.v2.uploader.upload(
          image,
          {
            folder: "pstores",
          }
        );
        billPhotos.push({ public_id, secure_url });
        if (billPhotos.length === index + 1) {
          resolve(billPhotos);
        }
      } catch (err) {
        reject(err);
      }
    });
  });
};
const deleteImages = (images) => {
  return new Promise((resolve, reject) => {
    if (images.length == 0) {
      resolve();
    }
    images.forEach(async (image, index) => {
      try {
        await cloudinary.uploader.destroy(image.public_id);
        if (index == images.length - 1) {
          resolve();
        }
      } catch (err) {
        reject(err);
      }
    });
  });
};
module.exports = {
  addOrder,
  getOrders,
  getDetailsById,
  updateDetailsById,
  draftOrder
};
