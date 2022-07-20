const itemRoutes = require("express").Router();

const { getItemsFeed, addItems } = require("../controllers/item-controller");

// itemRoutes.post("/newbill", userSignupValidator, runValidation, userSignup);
itemRoutes.get("/items", getItemsFeed);
itemRoutes.post("/itemlist", addItems);

module.exports = itemRoutes;
