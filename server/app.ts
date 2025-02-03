import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
require('dotenv').config();
import mongoose from 'mongoose';
import routers from './routes';
import fileUpload from 'express-fileupload';
import handleErrors from './middleware/handleError';
import dbAppConnection from './db/conn';
import { APP_ENVIRONMENT } from "./util/constants/appEnvironment";
import { SERVER_ENVIRONMENT } from './util/serverEnvironment';


// require('./util/nodeCron');
const PORT = SERVER_ENVIRONMENT.SERVER_PORT;
const isProductionEnv = SERVER_ENVIRONMENT.NODE_ENV === APP_ENVIRONMENT.PRODUCTION;
const app = express();
app.use(
  cors({
    origin: true,
    credentials: true,
  })
);
app.use(express.json({ limit: '500mb' }));
app.use(cookieParser());

app.use(express.urlencoded({ limit: '500mb', extended: true }));
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: '/tmp/',
  })
);

const urlPrefix = isProductionEnv ? "/.netlify/functions/server" : "";

app.use(urlPrefix, routers);

app.get('/.netlify/functions/app/server', (req, res) => {
  res.status(200).json({ success: true })
})

const mongoUriEnvMap: any = {
  staging: process.env.STAGING_DB,
  production: process.env.PROD_DB,
  dev: process.env.DEV_DB,
};

const MONGODB_URI =
  mongoUriEnvMap[process.env.ENV_NAME || ""] || mongoUriEnvMap[process.env.NODE_ENV || ""];

async function connectDB() {
  await mongoose.connect(`${MONGODB_URI}`);
}

connectDB();
// connect PStore Database
dbAppConnection();

app.use(handleErrors);
app.listen(PORT, () => {
  console.log(`Server running on PORT: ${PORT}`)
})

export { app };

