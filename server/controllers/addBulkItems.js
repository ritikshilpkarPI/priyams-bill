const { NotFound } = require('../util/errors');
const { Item } = require('../db-models/item-model');

const addBulkItems = async (request, response, next) => {
  try {
    const csvData = request.body;
    const slabPricingStart = csvData[0].findIndex((item) => item === 'tp1');
    const mrpprice = csvData[0].findIndex((item) => item === 'itemMRPperUnit');
    const itemname = csvData[0].findIndex((item) => item === 'itemName');
    const itembarcode = csvData[0].findIndex((item) => item === 'itemBarcode');

    if (slabPricingStart === -1)
      throw new NotFound('Uploaded sheet does not has tp1 column in its header')
    
    await Promise.all(
      csvData.map(async (item, index) => {
        if (index !== 0) {
          const slabPricesArray = [];
          if (item[slabPricingStart]) {
            let j = 0;
            for (let i = slabPricingStart; i < item.length; i += 2) {
              if (item[i]) {
                slabPricesArray.push([
                  Number(j),
                  Number(item[i]),
                  Number(item[i + 1]),
                ]);
                j++;
              } else {
                break;
              }
            }
          }
          await Item.findOneAndUpdate(
            {
              itemName: item[itemname],
              itemBarcode: item[itembarcode],
              itemMRPperUnit: item[mrpprice],
            },
            { slabPricing: slabPricesArray }
          );
        }
      })
    );
    response.status(200).json({ status: true, message: 'items added' });
  } catch (error) {
    next(error)
  }
};

module.exports = addBulkItems;
