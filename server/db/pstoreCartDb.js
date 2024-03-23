const mongoose = require('mongoose');

const pstoreCartDbConnection = () => {
  try {
    const pstoreCartDb = mongoose.createConnection(process.env.PSTORE_CART_DB_URI, {
      useNewUrlParser: true,
    });
    console.log('Connected to PStore Cart database');
    return { pstoreCartDb };
  } catch (error) {
    console.error('Error connecting to PStore Cart database:', error);
    throw error;
  }
};

module.exports = { pstoreCartDbConnection };
