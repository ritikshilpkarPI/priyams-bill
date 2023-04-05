const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
require('dotenv').config();
const mongoose = require('mongoose');
const serverless = require('serverless-http');
const routers = require('./routes');
const fileUpload = require('express-fileupload');
const handleErrors = require('./middleware/handleError');
const { orderSchema, Order } = require('./db-models/orderSchema');
require('./nodeCron');
const app = express();


app.use(express.json({ limit: '500mb' }));
app.use(cookieParser());
app.use(
  cors({
    credentials: true,
  })
);

app.use(express.urlencoded({ limit: '500mb', extended: true }));
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: '/tmp/',
  })
);
app.use('/.netlify/functions/app', routers);


const mongoUriEnvMap = {
  staging: process.env.STAGING_DB,
  production: process.env.PROD_DB,
  dev: process.env.DEV_DB,
};

const MONGODB_URI =
  mongoUriEnvMap[process.env.ENV_NAME] || mongoUriEnvMap[process.env.NODE_ENV];

async function connectDB() {
  await mongoose.connect(`${MONGODB_URI}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
}
const dbConnection2 = () => {
  try {
    const conn = mongoose.createConnection(process.env.APP_MONGODB_URI, { useNewUrlParser: true });
    console.log("App Database Connected Successfully!");
    conn.model("Orders", orderSchema);
    const pipeline =  [
        { $match : {"operationType" : "update" } }
     ]
    const changeStream = Order.watch(pipeline, { fullDocument: "updateLookup" });
    changeStream.on("change", (data) => {
      const dummyData = data.fullDocument;
      // Create Order in Bill Database
      conn.models.Orders.create(dummyData);      
    });
  } catch (error) {
    console.error({ error });
  }
};

dbConnection2();
connectDB();

app.use(handleErrors)


module.exports.handler = serverless(app);
