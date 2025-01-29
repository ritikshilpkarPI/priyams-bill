import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
require('dotenv').config();
import mongoose from 'mongoose';
import serverless from 'serverless-http';
import routers from './routes';
import fileUpload from 'express-fileupload';
import handleErrors from './middleware/handleError';
import dbAppConnection from './db/conn';
// require('./util/nodeCron');
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
app.get('/.netlify/functions/app/server', (req, res) => {
  res.status(200).json({ success: true })
})

const mongoUriEnvMap = {
  staging: process.env.STAGING_DB,
  production: process.env.PROD_DB,
  dev: process.env.DEV_DB,
};

const MONGODB_URI =
  mongoUriEnvMap[process.env.ENV_NAME || ""] || mongoUriEnvMap[process.env.NODE_ENV];

async function connectDB() {
  await mongoose.connect(`${MONGODB_URI}`);
}

connectDB();
// connect PStore Database
dbAppConnection();

app.use(handleErrors);

module.exports.handler = serverless(app);

