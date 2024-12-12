const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
require('dotenv').config();
const mongoose = require('mongoose');
const routers = require('./routes');
const fileUpload = require('express-fileupload');
const handleErrors = require('./middleware/handleError');
const dbAppConnection = require('./db/conn');
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
app.use('', routers);
app.use('/api/server', (req, res) => {
  res.status(200).json({ success: true })
})

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

connectDB();
// connect PStore Database
dbAppConnection();

app.use(handleErrors);

module.exports = { app };
