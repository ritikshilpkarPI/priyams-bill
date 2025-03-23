const fs = require("fs");
const csv = require("csv-parser");
const mongoose = require("mongoose");

// Replace with your actual MongoDB URI
// const MONGODB_URI = "mongodb+srv://priyamsorg:M6kEk6SNJY9ORRPa@cluster0.5grd1.mongodb.net/bill-prod-v2";

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const itemSchema = new mongoose.Schema({
  itemBarcode: String,
  itemName: String,
  itemPerUnitQuantity: Number,
  quantityUnitName: String,
  itemMRPperUnit: Number,
  itemCostPricePerUnit: Number,
  itemSellingPricePerUnit: Number,
  itemBrandName: String,
  itemCategory: String,
  subCategory: String,
  itemStockQuantity: { type: Number, default: 0 },
  companyName: { type: String, default: "" },
  flavourOrFeature: { type: String, default: "" },
  isDeleted: { type: Boolean, default: false },
  sku: String,
  itemDiscountPerUnit: Number,
  saleTime: { type: String, default: "yearly" },
  permanentlyOutOfStock: { type: Boolean, default: false },
  isDeleted: { type: Boolean, default: false },
}, { timestamps: true });

const Item = mongoose.model("Item", itemSchema);

const results = [];

fs.createReadStream(`${__dirname}/new-items-data.csv`) // Replace with your CSV filename
  .pipe(csv())
  .on("data", (row) => {
    try {
      const itemMRPperUnit = parseFloat(row["MRP"]);
      const itemSellingPricePerUnit = parseFloat(row["SP"]);

      const newItem = {
        itemBarcode: row["Bar Code"],
        itemName: row["Full Name Listed on Product"],
        itemPerUnitQuantity: parseInt(row["Quantity"]),
        quantityUnitName: row["Units"],
        itemMRPperUnit,
        itemCostPricePerUnit: parseFloat(row["CP"]),
        itemSellingPricePerUnit,
        itemBrandName: row["BRAND"],
        itemCategory: row["Category"],
        subCategory: row["Subcategory"],
        itemStockQuantity: 0,
        companyName: "",
        flavourOrFeature: "",
        isDeleted: false,
        sku: `${row["Bar Code"]} - ${row["Full Name Listed on Product"]} - ${row["Quantity"]} ${row["Units"]} - MRP ${row["MRP"]}`,
        itemDiscountPerUnit: itemMRPperUnit - itemSellingPricePerUnit,
        saleTime: "yearly",
        permanentlyOutOfStock: false,
        isDeleted: false,
      };

      results.push(newItem);
    } catch (err) {
      console.error("Error processing row:", row, err.message);
    }
  })
  .on("end", async () => {
    console.log({results})
    try {
      const inserted = await Item.insertMany(results);
      console.log(`✅ Successfully inserted ${inserted.length} items`);
      mongoose.connection.close();
    } catch (err) {
      console.error("❌ Insertion error:", err.message);
    }
  });
