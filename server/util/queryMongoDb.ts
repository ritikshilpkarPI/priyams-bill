import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const {
  ENV_NAME = '',
  NODE_ENV = '',
  STAGING_DB = '',
  PROD_DB = '',
  DEV_DB = '',
} = process.env;

const mongoUriEnvMap: { [key: string]: string } = {
  staging: STAGING_DB,
  production: PROD_DB,
  dev: DEV_DB,
};

const MONGODB_URI = mongoUriEnvMap[ENV_NAME] || mongoUriEnvMap[NODE_ENV] || '';

export const queryMongoDB = async (callBack: ()=>Promise<void>) => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');
    await callBack()
  } catch (error) {
    console.error('Error in ',callBack.name,' :', error);
  } finally {
    mongoose.disconnect();
    console.log('Connection closed');
    process.exit();
  }
};