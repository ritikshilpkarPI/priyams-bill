const { ReturnBill } = require('../db-models/return-bill-model');
const { Bill } = require('../db-models/bill-model');
const { Item } = require('../db-models/item-model');
const { ReturnItem } = require('../db-models/return-item-model')
const { BrandModel } = require('../db-models/brand-model');
const { CompanyModel } = require('../db-models/company-model');

module.exports = {
    ReturnBill,
    Bill,
    Item,
    ReturnItem,
    BrandModel,
    CompanyModel,
}