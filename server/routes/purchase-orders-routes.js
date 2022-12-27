const orderRoutes = require("express").Router();

const {
    addOrder,
    getOrders,
    getDetailsById,
    updateDetailsById,
    draftOrder
} = require("../controllers/purchase-order-controller");

// itemRoutes.post("/newbill", userSignupValidator, runValidation, userSignup);
orderRoutes.get("/orders", getOrders);
orderRoutes.post("/addNewOrder", addOrder);
orderRoutes.get('/orderDetails/:id',getDetailsById)
orderRoutes.post('/updateDetails',updateDetailsById)
orderRoutes.post('/draftOrder',draftOrder);

module.exports = orderRoutes;
