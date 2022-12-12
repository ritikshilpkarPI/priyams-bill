const PurchaseOrder = require("../db-models/purchase-order-model");

const addOrder = async (req, res) => {
    try {
        const { details , bills,orders } = req.body.new_order
        const purchaseOrder = {
            purchasedItems:[...orders],
            purchaseDetails:[...details],
            billPhotos:[...bills]
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
        res.status(400).send(error.message)
    }
}

module.exports = {
    addOrder,
    getOrders
}