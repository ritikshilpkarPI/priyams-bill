const PurchaseOrder = require("../db-models/purchase-order-model");

const addOrder = async (req, res) => {
    try {
        const { details , bills,orders} = req.body.new_order.purchaseList;
         const purchaseOrder = {
            purchasedItems:[...orders],
            purchaseDetails:[...details],
            billPhotos:[...bills],
            isDraft:req.body.new_order.isDraft
        }
        const order = await PurchaseOrder.create(purchaseOrder)
        res.status(201).send({ message: order ,success:true})
    } catch (error) {
        res.status(400).send({message:error.message,success:false})
    }
}
const getOrders = async (req, res) => {
    try {
        const orders = await PurchaseOrder.find({})
        res.status(201).send({ message: orders })
    } catch (error) {
        res.status(400).send({message:error.message})
    }
}
const getDetailsById = async(req,res) => {
    const id = req.params.id;
    try{
        const data = await PurchaseOrder.findById(id);
        res.status(201).send({data});
    }catch(err){
        res.status(400).send({message:err})
    }
}
const updateDetailsById = async(req,res) =>{
    try {
        const { details , bills,orders} = req.body.new_order.purchaseList;
        const {id} = req.body.new_order;
         const purchaseOrder = {
            purchasedItems:[...orders],
            purchaseDetails:[...details],
            billPhotos:[...bills],
            isDraft:req.body.new_order.isDraft
        }
        const order = await PurchaseOrder.findByIdAndUpdate(id,purchaseOrder)
        res.status(201).send({ message: order ,success:true})
    } catch (error) {
        res.status(400).send({message:error.message,success:false})
    }
    
}
module.exports = {
    addOrder,
    getOrders,
    getDetailsById,
    updateDetailsById
}