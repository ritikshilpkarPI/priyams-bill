const itemRoutes = require("express").Router();
// const multer = require("multer");
// const upload = multer({ dest: "uploads/" });

const {
  getItemsFeed,
  addItems,
  editItemById,
  softDeleteItem,
  addBulkItems
} = require("../controllers/item-controller");

// const upload = require('../middleware/upload');

// itemRoutes.post("/newbill", userSignupValidator, runValidation, userSignup);
itemRoutes.get("/items", getItemsFeed);
itemRoutes.post("/addNewItem", addItems);
itemRoutes.put("/editItemById", editItemById);
itemRoutes.post("/softDeleteItem", softDeleteItem);
// itemRoutes.post("/addbulkitems", upload.single('file'), addBulkItems);
itemRoutes.post("/addbulkitems", addBulkItems);

module.exports = itemRoutes;
