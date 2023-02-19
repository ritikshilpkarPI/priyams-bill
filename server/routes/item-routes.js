const itemRoutes = require("express").Router();

const {
  getItemsFeed,
  addItems,
  editItemById,
  softDeleteItem,
  addBulkItems,
  saveInventory,
  permanentlyOutOfStock,
  filterExpiryDates,
  getItemsCategoryList,
} = require("../controllers/item-controller");

// itemRoutes.post("/newbill", userSignupValidator, runValidation, userSignup);
itemRoutes.get("/items", getItemsFeed);
itemRoutes.post("/addNewItem", addItems);
itemRoutes.put("/editItemById", editItemById);
itemRoutes.post("/softDeleteItem", softDeleteItem);
itemRoutes.post("/addbulkitems", addBulkItems);
itemRoutes.delete("/permanentlyOutOfStock/:id", permanentlyOutOfStock);
itemRoutes.post("/saveInventory", saveInventory);
itemRoutes.post("/filterExpiryDates", filterExpiryDates);
itemRoutes.get("/getItemsCategoryList", getItemsCategoryList);

module.exports = itemRoutes;
