const itemRoutes = require("express").Router();

const {
  getItemsFeed,
  addItems,
  editItemById,
  softDeleteItem,
  addBulkItems,
  saveInventory,
  filterExpiryDates
} = require("../controllers/item-controller");

// itemRoutes.post("/newbill", userSignupValidator, runValidation, userSignup);
itemRoutes.get("/items", getItemsFeed);
itemRoutes.post("/addNewItem", addItems);
itemRoutes.put("/editItemById", editItemById);
itemRoutes.post("/softDeleteItem", softDeleteItem);
itemRoutes.post("/addbulkitems", addBulkItems);
itemRoutes.post("/saveInventory",saveInventory)
itemRoutes.post("/filterExpiryDates",filterExpiryDates)

module.exports = itemRoutes;
