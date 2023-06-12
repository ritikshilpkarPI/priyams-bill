const cloudinary = require('cloudinary').v2;
const mongoose = require('mongoose');
const fs = require('fs');
require('dotenv').config();

const { ItemSchema } = require('../db-models/item-model');

const {
  CLOUD_NAME,
  CLOUD_API_KEY,
  CLOUD_API_SECRET,
  ENV_NAME,
  NODE_ENV,
  STAGING_DB,
  PROD_DB,
  APP_MONGODB_URI,
  DEV_DB,
} = process.env;

cloudinary.config({
  cloud_name: CLOUD_NAME,
  api_key: CLOUD_API_KEY,
  api_secret: CLOUD_API_SECRET,
});
const mongoUriEnvMap = {
  staging: STAGING_DB,
  production: PROD_DB,
  dev: DEV_DB,
};

const MONGODB_URI = mongoUriEnvMap[ENV_NAME] || mongoUriEnvMap[NODE_ENV];

async function uploadImageToCloudinary(imagePath) {
  try {
    const result = await cloudinary.uploader.upload(imagePath, {
      folder: 'pstores',
    });
    console.log(`CLOUD SUCCESS : ${imagePath} is uploaded to cloudinary`);
    return result;
  } catch (error) {
    console.log(
      `CLOUD ERROR : ${imagePath} is could not upload to cloudinary, ${error}`
    );
  }
}

async function main() {
  const imageDirectory = process.argv[2];

  if (!imageDirectory) {
    console.log(
      'please enter directory path, cannot execute script without directory path'
    );
    return;
  }

  const billDB = mongoose.createConnection(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  const appDB = mongoose.createConnection(APP_MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  billDB.model('Item', ItemSchema);
  appDB.model('Product', ItemSchema);
  const copyDirectory = `${imageDirectory}/../COPY-Change-Product-Image-Names`;
  if (!fs.existsSync(copyDirectory)) {
    fs.mkdirSync(copyDirectory, { recursive: true });
  }
  try {
    const imageNamesList = fs.readdirSync(imageDirectory);
    const status = {
      totalImagesUploaded: 0,
      totalImagesFailedToUpload: 0,
      imagesUploadedOnApp: 0,
      imagesUploadedOnBill: 0,
      totalImages: imageNamesList.length,
    };
    for (let i = 0; i < imageNamesList.length; i++) {
      const imageNameWithExtension = imageNamesList[i];
      const imageName = imageNameWithExtension.split('.')[0].toUpperCase();
      const billItem = await billDB.models.Item.findOne({
        itemName: imageName,
      });
      const appProduct = await appDB.models.Product.findOne({
        itemName: imageName,
      });
      if (billItem || appProduct) {
        const cloudData = await uploadImageToCloudinary(
          `${imageDirectory}/${imageNameWithExtension}`
        );
        const { public_id, secure_url } = cloudData;

        if (billItem) {
          billItem.images = [...billItem.images, { public_id, secure_url }];
          await billItem.save();
          status.imagesUploadedOnBill += 1;
          console.log(`BILL SUCCESS: ${imageName} is updatd in DB`);
        }
        if (appProduct) {
          appProduct.images = [...appProduct.images, { public_id, secure_url }];
          await appProduct.save();
          status.imagesUploadedOnApp += 1;
          console.log(`APP SUCCESS : ${imageName} is updatd in app`);
        }
        status.totalImagesUploaded += 1;
      } else {
        console.log(`${imageName} - Cannot find in both bill and app`);
        fs.copyFileSync(
          `${imageDirectory}/${imageNameWithExtension}`,
          `${copyDirectory}/${imageNameWithExtension}`
        );
        status.totalImagesFailedToUpload += 1;
        console.log(`copy created for ${imageNameWithExtension}`);
      }
      console.log(`STATUS: ${JSON.stringify(status)}, currentImage:${i + 1}`);
    }
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await billDB.close();
    await appDB.close();
    console.log('mongodb connection closed');
    console.log('script completed');
  }
}

main();

//TO RUN THIS SCRIPT USE BELOW CMD
// npm run imagesToCloudinary directoryPath
// e.g. npm run imagesToCloudinary '/downloads/images'
