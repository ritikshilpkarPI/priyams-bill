/** RUN SCRIPT: npm run generateBarcodeForItems */
const mongoose = require('mongoose');
require('dotenv').config();
const { ItemSchema } = require('../db-models/item-model');

const {
    ENV_NAME,
    NODE_ENV,
    STAGING_DB,
    PROD_DB,
    DEV_DB,
  } = process.env;

const mongoUriEnvMap = {
    staging: STAGING_DB,
    production: PROD_DB,
    dev: DEV_DB,
};

const MONGODB_URI = mongoUriEnvMap[ENV_NAME] || mongoUriEnvMap[NODE_ENV];

const getChunks = (items, chunkSize) => {
    const itemsChunks = []
    let i = 0;
    let remainder =  items.length % chunkSize;
    while((i + 1) * chunkSize < items.length){
        itemsChunks[i] = items.slice(i * chunkSize, (i + 1) * chunkSize);
        i += 1;
    }
    if(remainder){
        itemsChunks[i] = items.slice(-remainder);
    };
    return itemsChunks;
}

const generateUniqueBarcode = (barcodeMap, barcodeLength) => {
    let generatedBarcode;
    do{
        generatedBarcode = Date.now().toString().slice(-barcodeLength);
        while(generatedBarcode.startsWith('0')){
           generatedBarcode = generatedBarcode.replace('0', Date.now().toString().slice(-1));
        }
    }while(barcodeMap[generatedBarcode])
    barcodeMap[generatedBarcode] = true;
    return Number(generatedBarcode);
}

const main = async() => {
    const startingTime = Date.now();
    const billDB = mongoose.createConnection(MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
    billDB.model('Item', ItemSchema);
    const allItems = await billDB.models.Item.find({}, { itemBarcode: 1 });
    const barcodeLength = 10;

    const itemsWithNoBarcode =  [];

    const barcodeMap = allItems.reduce( (currentBarcodeMap, currentValue) => {
        if(currentValue.itemBarcode){
            return { ...currentBarcodeMap, [currentValue.itemBarcode]: true  }
        }else {
            itemsWithNoBarcode.push(currentValue);
            return { ...currentBarcodeMap }
        }
    }, {})

    console.log(`Total-Items: [${allItems.length}]`)
    console.log(`Total-Items-Without-Barcode: [${itemsWithNoBarcode.length}]`)

    itemsWithNoBarcode.forEach(item => {
        item.itemBarcode = generateUniqueBarcode(barcodeMap, barcodeLength);
    })

    const chunkSize = 10;
    const itemsChunks = getChunks(itemsWithNoBarcode, chunkSize);

    let successChunks = 0;

    for(let i = 0; i <itemsChunks.length; i++){
       try{
          await Promise.allSettled(itemsChunks[i].map(item => item.save()));
          successChunks += 1; 
          console.log(`[Chunk: ${i + 1}] : Saved`);
       }catch (error) {
          console.log(`[Chunk: ${i + 1}] : Failed`);
       }
    }
    
    console.log(`Total Chunks : [${ itemsChunks.length }]`);
    console.log(`Chunks Saved : [${ successChunks }]`);
    console.log(`Time Taken In Seconds: [${(Date.now() - startingTime) / 1000}]`)

    process.exit(1)
}

main()
