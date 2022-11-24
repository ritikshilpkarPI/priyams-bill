const PurchaseOrder = require("../db-models/purchase-order-model");

const addOrder = async (req, res) => {
    const { new_order } = req.body
    try {
        const order = await PurchaseOrder.create(new_order)
        res.status(201).send({ message: order })
    } catch (error) {
        res.status(400).send(error.message)
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