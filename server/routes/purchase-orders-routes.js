const orderRoutes = require("express").Router();

const {
    addOrder,
    getOrders,
    getDetailsById,
    updateDetailsById
} = require("../controllers/purchase-order-controller");

// itemRoutes.post("/newbill", userSignupValidator, runValidation, userSignup);
orderRoutes.get("/orders", getOrders);
orderRoutes.post("/addNewOrder", addOrder);
orderRoutes.get('/orderDetails/:id',getDetailsById)
orderRoutes.post('/updateDetails',updateDetailsById)
module.exports = orderRoutes;
