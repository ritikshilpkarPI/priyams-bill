const { ExpiredItem } = require('../db-models/expired-item');

const addExpiredItems = async (req, res, next) => {

    const {
        itemId,
        expireDate,
        isExpired,
        isDamage,
        itemCount
    } = req.body;

    try {
        const newExpiredItems = await new ExpiredItem({
            itemId,
            expireDate,
            isExpired,
            isDamage,
            itemCount
        }).save();
        res.status(200).json({ status: true, message: 'expired product added', newExpiredItems });
    } catch (error) {
        console.log({ error });

        res.status(500).json({ status: false, message: error.message });
    }
};

module.exports = addExpiredItems;