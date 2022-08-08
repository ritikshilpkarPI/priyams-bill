const itemRoutes = require("express").Router();

const {
  getItemsFeed,
  addItems,
  editItemById,
} = require("../controllers/item-controller");

// itemRoutes.post("/newbill", userSignupValidator, runValidation, userSignup);
itemRoutes.get("/items", getItemsFeed);
itemRoutes.post("/addNewItem", addItems);
itemRoutes.put("/editItemById", editItemById);

module.exports = itemRoutes;
