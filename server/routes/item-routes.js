const itemRoutes = require("express").Router();

const {
  getItemsFeed,
  addItems,
  editItemById,
  softDeleteItem,
  addBulkItems,
} = require("../controllers/item-controller");

// itemRoutes.post("/newbill", userSignupValidator, runValidation, userSignup);
itemRoutes.get("/items", getItemsFeed);
itemRoutes.post("/addNewItem", addItems);
itemRoutes.put("/editItemById", editItemById);
itemRoutes.post("/softDeleteItem", softDeleteItem);
itemRoutes.post("/addbulkitems", addBulkItems);

module.exports = itemRoutes;
