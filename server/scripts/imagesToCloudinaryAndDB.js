const cloudinary = require('cloudinary').v2;
const mongoose = require('mongoose');
const fs = require('fs');
require('dotenv').config();

const { Item } = require('../db-models/item-model');

const {
  CLOUD_NAME,
  CLOUD_API_KEY,
  CLOUD_API_SECRET,
  ENV_NAME,
  NODE_ENV,
  STAGING_DB,
  PROD_DB,
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

  mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  const db = mongoose.connection;

  const copyDirectory = `${imageDirectory}/../COPY-Change-Product-Image-Names`;
  if (!fs.existsSync(copyDirectory)) {
    fs.mkdirSync(copyDirectory, { recursive: true });
  }
  try {
    let totalImagesUploaded = 0;
    let totalImagesFailedToUpload = 0;

    const imageNamesList = fs.readdirSync(imageDirectory);
    for (let i = 0; i < imageNamesList.length; i++) {
      const imageNameWithExtension = imageNamesList[i];
      const cloudData = await uploadImageToCloudinary(
        `${imageDirectory}/${imageNameWithExtension}`
      );
      const { public_id, secure_url } = cloudData;
      const imageName = imageNameWithExtension.split('.')[0].toUpperCase();
      const item = await Item.findOneAndUpdate(
        { itemName: imageName },
        {
          $push: {
            images: {
              public_id,
              secure_url,
            },
          },
        }
      );
      if (!item) {
        console.log(`Cannot find any item in DB for ${imageName}`);
        fs.copyFileSync(
          `${imageDirectory}/${imageNameWithExtension}`,
          `${copyDirectory}/${imageNameWithExtension}`
        );
        totalImagesFailedToUpload += 1;
        console.log(`copy created for ${imageNameWithExtension}`);
      } else {
        console.log(
          `DB SUCCESS: ${imageName} image is successfully updated in DB`
        );
        totalImagesUploaded += 1;
      }
      console.log(
        `STATUS: totalImages:${imageNamesList.length} currentImageNo:${
          i + 1
        } imagesUploaded:${totalImagesUploaded}, imagesFailed:${totalImagesFailedToUpload}`
      );
    }
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await db.close();
    console.log('mongodb connection closed');
    console.log('script completed');
  }
}

main();

//TO RUN THIS SCRIPT USE BELOW CMD
// npm run imagesToCloudinary directoryPath
// e.g. npm run imagesToCloudinary '/downloads/images'
