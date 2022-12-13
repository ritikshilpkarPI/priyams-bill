const orderRoutes = require("express").Router();

const {
    addOrder,
    getOrders,
    getDetailsById
} = require("../controllers/purchase-order-controller");

// itemRoutes.post("/newbill", userSignupValidator, runValidation, userSignup);
orderRoutes.get("/orders", getOrders);
orderRoutes.post("/addNewOrder", addOrder);
orderRoutes.get('/orderDetails/:id',getDetailsById)

module.exports = orderRoutes;
