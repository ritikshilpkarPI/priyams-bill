const { ExpiredItem } = require('../db-models/expired-item');

const getExpiredItems = async (req, res, next) => {
    console.log("qwertyhgfcdserfg");
    try {

        const expiredItems = await ExpiredItem.find({});
        res.status(200).send({ message: 'Got all expired products', expiredItems });
    } catch (error) {
        console.error('Error fetching expired products:', error);
        res.status(500).send({ message: 'Failed to get expired products', error });

    }
};

module.exports = getExpiredItems;
