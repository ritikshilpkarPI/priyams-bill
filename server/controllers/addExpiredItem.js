const { ExpiredItem } = require('../db-models/expired-item');

const addExpiredItem = async (req, res, next) => {

    const {
        itemId,
        expireDate,
        isExpired,
        isDamaged,
        totalItems
    } = req.body;

    try {
        const newExpiredItems = await new ExpiredItem({
            itemId,
            expireDate,
            isExpired,
            isDamaged,
            totalItems
        }).save();
        res.status(200).json({ status: true, message: 'expired items added', newExpiredItems });
    } catch (error) {
        console.log({ error });
        res.status(400).json({ message: error.message });
    }
};

module.exports = addExpiredItem;