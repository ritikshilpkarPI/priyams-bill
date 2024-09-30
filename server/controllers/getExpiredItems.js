const { ExpiredItem } = require('../db-models/expired-item');

const getExpiredItems = async (req, res) => {
    try {
        const expiredItems = await ExpiredItem.find({}).populate('itemId', '_id itemName itemBarcode').lean();
        const groupedItems = expiredItems.reduce((acc, item) => {
            const itemId = item.itemId._id.toString();

            if (!acc[itemId]) {
                acc[itemId] = { ...item, totalItems: item.totalItems };
            } else {
                acc[itemId].totalItems += item.totalItems;
            }


            return acc;
        }, {});

        const groupedExpiredItems = Object.values(groupedItems);

        res.status(200).send({ message: 'Got all expired items', expiredItems: groupedExpiredItems });
    } catch (error) {
        console.error('Error failed to get expired items:', error);
        res.status(400).send({ message: 'Failed to get expired items', error });
    }
};

module.exports = getExpiredItems;

