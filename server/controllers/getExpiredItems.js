const { ExpiredItem } = require('../db-models/expired-item');

const getExpiredItems = async (req, res, next) => {
    try {
        const expiredItems = await ExpiredItem.find({});
        res.status(200).send({ message: 'Got all expired items', expiredItems });
    } catch (error) {
        console.error('Error failed to get expired items:', error);
        res.status(400).send({ message: 'Failed to get expired items', error });
    }
};

module.exports = getExpiredItems;
