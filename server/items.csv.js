const json2csv = require('json2csv').parse;
const { Item } = require("./db-models/item-model");
require("dotenv").config();
const mongoose = require("mongoose");
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
}
connectDB();
exports.handler = async () => {
    const dateTime = new Date().toISOString().slice(-24).replace(/\D/g, '').slice(0, 14); 
    let csv;
    const items = await Item.find({}).lean();
    const fields = ['_id','itemName'];
    csv = json2csv(items, {fields});
    return {
        statusCode: 200,
        headers: {'Content-type' : 'text/csv'},
        body: csv,
    }
}