const { findBillBySlug } = require('../util/findBillBySlug');
const { Bill, ReturnBill } = require('../db-models');

const getBillForReturnExchange = async (req, res, next) => {
  try {
    const slug = req.params.id;
    let bill = await findBillBySlug(slug);

    if (!bill) {
      const returnBill = await ReturnBill.findOne({slug});
      if (!returnBill) {
        res.status(400).json({ message: 'Bill not found' });
        return;
      }
      bill = await findBillById(returnBill.billId);
    }

    const returnedItems = [];
    const addedItems = bill.items;

    if (bill.returnBills && bill.returnBills.length && bill.returnBills.length > 0) {
      const returnBills = [];
      bill.returnBills.forEach(({ _id, itemsReturned, items }) => {
        returnBills.push(_id);
        addedItems.push(...items);
        returnedItems.push(...itemsReturned);
      });
      bill.returnBills = returnBills;
    }

    const returnedItemsMap = getMergedItemMap(returnedItems, 'return');

    const addedItemsMap = getMergedItemMap(addedItems, 'added');

    const { items, availableCredits } = calculateFinalItems(
      Object.values(addedItemsMap), returnedItemsMap
    );


    bill.returnItems = Object.values(returnedItemsMap);
    bill.items = items;
    bill.availableCredits = availableCredits;

    res.status(200).json({ message: bill });
  } catch (error) {
    next(error);
  }
};

const findBillById = async (id) => {
  const bill = await Bill.findById(id)
    .populate({
      path: 'items',
      populate: {
        path: 'itemDetail',
        model: 'Item',
      },
    })
    .populate({
      path: 'returnBills',
      model: 'ReturnBill',
      populate: [
        {
          path: 'items',
          populate: {
            path: 'itemDetail',
            model: 'Item',
          },
        },
        {
          path: 'itemsReturned',
          populate: {
            path: 'itemDetail',
            model: 'Item',
          },
        },
      ],
    }).lean();
  return bill;
};

const getMergedItemMap = (itemList = [], scope = '') => {
  const itemMap = {};
  try {
    itemList.forEach((item) => {
      const _id = item.itemDetail._id.toString();
      if (itemMap[_id]) {
        const { itemQuantityInBill, itemDetail } = item;
        const quantity = itemMap[_id].itemQuantityInBill + itemQuantityInBill;
        if (quantity > 0) {
          itemMap[_id] = {
            ...itemMap[_id],
            itemQuantityInBill: quantity,
            itemMRPtotal: itemDetail.itemMRPperUnit,
            itemSellingPriceTotal: itemDetail.itemSellingPricePerUnit * quantity,
          };
        }
      } else {
        itemMap[_id] = item;
      }
    });
  } catch (error) {
    return itemMap;
  }
  return itemMap;
};

const calculateFinalItems = (itemList = [], returnedItemsMap = {}) => {
  const items = [];
  let availableCredits = 0;
  itemList.forEach((item) => {
    const returnedItem = returnedItemsMap[item.itemDetail._id.toString()];
    if (returnedItem) {
      const { itemQuantityInBill, itemDetail } = item;
      const quantity = itemQuantityInBill - returnedItem.itemQuantityInBill;
      if (quantity > 0) {
        const itemSellingPriceTotal =
          itemDetail.itemSellingPricePerUnit * quantity;
        availableCredits += itemSellingPriceTotal;
        items.push({
          ...returnedItem,
          itemQuantityInBill: quantity,
          itemMRPtotal: itemDetail.itemMRPperUnit,
          itemSellingPriceTotal,
        });
      }
    } else {
      availableCredits += item.itemSellingPriceTotal;
      return items.push(item);
    }
  });
  return { items, availableCredits };
};


module.exports = {
  getBillForReturnExchange,
  findBillById,
  getMergedItemMap,
  calculateFinalItems
};
