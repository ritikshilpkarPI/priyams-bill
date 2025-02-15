/** RUN SCRIPT: npm run generateBarcodeForItems */
const mongoose = require('mongoose');
const { ItemSchema } = require('../db-models/item-model');

const main = async() => {
    try {
        const billDB = mongoose.createConnection("mongodb+srv://priyamsorg:M6kEk6SNJY9ORRPa@cluster0.5grd1.mongodb.net/pstores-prod", {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
    billDB.model('Item', ItemSchema);
    await billDB.models.Item.updateMany({}, [
        { $set: { itemBarcode: { $toString: "$itemBarcode" } } }
      ])
      process.exit(1)
    } catch (err) {
        console.log(err);
        process.exit(0);
    }
}

main()


