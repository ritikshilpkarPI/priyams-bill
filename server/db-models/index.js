const { ReturnBill } = require('../db-models/return-bill-model');
const { Bill } = require('../db-models/bill-model');
const { Item } = require('../db-models/item-model');
const { ReturnItem } = require('../db-models/return-item-model')

module.exports = {
    ReturnBill,
    Bill,
    Item,
    ReturnItem
}