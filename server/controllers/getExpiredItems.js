const { ExpiredItem } = require('../db-models/expired-item');

const getExpiredItems = async (req, res) => {
    try {
        const skip = parseInt(req.query.skip) || 0;
        const limit = parseInt(req.query.limit) || 50;

        const totalCount = await ExpiredItem.aggregate([
            {
                $group: {
                    _id: "$itemId", 
                }
            },
            {
                $count: "uniqueItems" 
            }
        ]);

        const totalItems = totalCount.length > 0 ? totalCount[0].uniqueItems : 0;
        console.log(`Total unique expired items: ${totalItems}`);
        
        const expiredItems = await ExpiredItem.find({})
            .populate('itemId', '_id itemName itemBarcode')
            .sort({ $natural: -1 })
            .skip(skip)
            .limit(limit)
            .lean();

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
        
        res.status(200).send({
            message: 'Got all expired items',
            totalItems,
            expiredItems: groupedExpiredItems
        });
    } catch (error) {
        console.error('Error failed to get expired items:', error);
        res.status(400).send({
            message: 'Failed to get expired items',
            error
        });
    }
};

module.exports = getExpiredItems;
