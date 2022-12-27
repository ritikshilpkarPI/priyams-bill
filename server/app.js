const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
require("dotenv").config();
const mongoose = require("mongoose");
const serverless = require("serverless-http");
const routers = require("./routes");
const { data } = require("./data/data");
const fileUpload = require('express-fileupload')
require('./nodeCron')
const app = express();

app.use(express.json({ limit: '500mb' }));
app.use(cookieParser());
app.use(
  cors({
    credentials: true,
  })
);

app.use(express.urlencoded({ limit: "500mb", extended: true }));
app.use(fileUpload({
  useTempFiles: true,
  tempFileDir: '/tmp/'
}))
let dbConnector = "";
let arrayToInsert = [];
async function addCsvDataToMongoAsJson(dbConnector) {
  // return csvtojson()
  //   .fromFile(fileName)
  //   .then((source) => {
  // Fetching the all data from each row
  const source = data;
  for (let i = 0; i < source.length; i++) {
    if (source[i]["itemName"]) {
      let oneRow = {
        itemBarcode: source[i]["itemBarcode"],
        itemName: source[i]["itemName"],
        itemMRPperUnit: source[i]["itemMRPperUnit"],
        itemCostPricePerUnit: source[i]["itemCostPricePerUnit"],
        itemSellingPricePerUnit: source[i]["itemSellingPricePerUnit"],
        itemStockQuantity: source[i]["itemStockQuantity"],
        minimumStockQuantity: source[i]["minimumStockQuantity"],
      };
      arrayToInsert.push(oneRow);
    }
  }
  //inserting into the table “employees”
  let collectionName = "items";
  let collection = dbConnector.collection(collectionName);
  collection.insertMany(arrayToInsert, (err, result) => {
    if (err) console.error(err);
    if (result) {
      console.log("Import CSV into database successfully.");
    }
  });
  // });
  return;
}
app.use("/.netlify/functions/app", routers);
app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
});
const mongoUriEnvMap = {
  staging: process.env.STAGING_DB,
  production: process.env.PROD_DB,
  dev: process.env.DEV_DB,
};

const MONGODB_URI =
  mongoUriEnvMap[process.env.ENV_NAME] || mongoUriEnvMap[process.env.NODE_ENV];

async function connectDB() {
  const client = await mongoose.connect(`${MONGODB_URI}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  // dbConnector = client.connections[0].db;
  // await addCsvDataToMongoAsJson(dbConnector);
}
connectDB();

module.exports.handler = serverless(app);
