const orderRoutes = require("express").Router();

const {
    addOrder,
    getOrders,
    getDetailsById,
    updateDetailsById,
    draftOrder,
    saveOrder,
    updateSavedOrders,
    deleteOrderItemById,
    updateOrderByIndex,
    getOrdersByQuery
} = require("../controllers/purchase-order-controller");

// itemRoutes.post("/newbill", userSignupValidator, runValidation, userSignup);
orderRoutes.get("/orders", getOrders);
orderRoutes.post("/addNewOrder", addOrder);
orderRoutes.get('/orderDetails/:id',getDetailsById)
orderRoutes.post('/updateDetails',updateDetailsById)
orderRoutes.post('/draftOrder',draftOrder);
orderRoutes.post('/saveOrder',saveOrder)
orderRoutes.post('/updateSavedOrder/:id',updateSavedOrders)
orderRoutes.post('/deleteItem/:id',deleteOrderItemById);
orderRoutes.post('/updateOrderByIndex/:id',updateOrderByIndex)
orderRoutes.post('/getOrdersByQuery',getOrdersByQuery);
module.exports = orderRoutes;
