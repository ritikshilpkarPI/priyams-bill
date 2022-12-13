const orderRoutes = require("express").Router();

const {
    addOrder,
    getOrders
} = require("../controllers/purchase-order-controller");    

// itemRoutes.post("/newbill", userSignupValidator, runValidation, userSignup);
orderRoutes.get("/orders", getOrders);
orderRoutes.post("/addNewOrder", addOrder);

module.exports = orderRoutes;
