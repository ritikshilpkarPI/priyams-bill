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
      folder: 'pstores-product-images',
    });
    console.log(`CLOUD SUCCESS : ${imagePath} is uploaded to cloudinary`);
    return result;
  } catch (error) {
    console.log(
      `CLOUD ERROR : ${imagePath} could not be uploaded to cloudinary, ${error}`
    );
    throw error;
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
  const copyBillDirectory = `${imageDirectory}/../COPY-BILL FAILED IMAGES`;
  const copyAppDirectory = `${imageDirectory}/../COPY-APP FAILED IMAGES`;

  !fs.existsSync(copyDirectory) &&
    fs.mkdirSync(copyDirectory, { recursive: true });
  !fs.existsSync(copyBillDirectory) &&
    fs.mkdirSync(copyBillDirectory, { recursive: true });
  !fs.existsSync(copyAppDirectory) &&
    fs.mkdirSync(copyAppDirectory, { recursive: true });

  try {
    const imageNamesList = fs.readdirSync(imageDirectory).slice(0, 100);
    const status = {
      totalImagesUploaded: 0,
      totalImagesFailedToUpload: 0,
      imagesUploadedOnApp: 0,
      imagesUploadedOnBill: 0,
      totalImages: imageNamesList.length,
      failedImages: [],
    };

    const promises = imageNamesList.map(
      async (imageNameWithExtension, index) => {
        const imageName = imageNameWithExtension
          .slice(0, imageNameWithExtension.lastIndexOf('.'))
          .toUpperCase();

        const sourcePath = `${imageDirectory}/${imageNameWithExtension}`;
        const billItem = await billDB.models.Item.findOne({
          itemName: imageName,
        });
        const appProduct = await appDB.models.Product.findOne({
          itemName: imageName,
        });
        if (billItem || appProduct) {
          try {
            const cloudData = await uploadImageToCloudinary(sourcePath);
            const { public_id, secure_url } = cloudData;

            if (billItem) {
              billItem.images.push({ public_id, secure_url });
              await billItem.save();
              status.imagesUploadedOnBill += 1;
              console.log(`BILL SUCCESS: ${imageName} is updated in DB`);
            } else {
              fs.copyFileSync(
                sourcePath,
                `${copyBillDirectory}/${imageNameWithExtension}`
              );
              console.log('BILL FAIL: COPY CREATED');
            }
            if (appProduct) {
              appProduct.images.push({ public_id, secure_url });
              await appProduct.save();
              status.imagesUploadedOnApp += 1;
              console.log(`APP SUCCESS : ${imageName} is updated in app`);
            } else {
              fs.copyFileSync(
                sourcePath,
                `${copyAppDirectory}/${imageNameWithExtension}`
              );
              console.log('APP FAIL: COPY CREATED');
            }
            status.totalImagesUploaded += 1;
          } catch (error) {
            console.error(
              `Error processing image ${imageNameWithExtension}:`,
              error
            );
            fs.copyFileSync(
              sourcePath,
              `${copyDirectory}/${imageNameWithExtension}`
            );
            status.totalImagesFailedToUpload += 1;
            status.failedImages.push(imageNameWithExtension);
            console.log(
              `CLOUDINARY FAIL : Copy created for ${imageNameWithExtension}`
            );
          }
        } else {
          console.log(
            `APP & BILL FAIL : ${imageName} - Cannot find in both bill and app`
          );
          fs.copyFileSync(
            sourcePath,
            `${copyDirectory}/${imageNameWithExtension}`
          );
          status.totalImagesFailedToUpload += 1;
          status.failedImages.push(imageNameWithExtension);
          console.log(`Copy created for ${imageNameWithExtension}`);
        }
        console.log(
          `STATUS: ${JSON.stringify({
            ...status,
            failedImages: null,
          })}, currentImage:${index + 1}`
        );
      }
    );

    await Promise.all(promises);

    if (status.failedImages.length > 0) {
      console.log(
        `Failed to upload ${status.failedImages.length} images:`,
        status.failedImages
      );
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

// TO RUN THIS SCRIPT USE THE FOLLOWING COMMAND:
// npm run imagesToCloudinary directoryPath
// e.g., npm run imagesToCloudinary '/downloads/images'
