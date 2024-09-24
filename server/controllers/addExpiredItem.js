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
        const updatedExpiredItem = await ExpiredItem.findOneAndUpdate(
            { itemId },
            {
                itemId,
                expireDate,
                isExpired,
                isDamaged,
                totalItems
            },
            {
                new: true, 
                upsert: true,
                setDefaultsOnInsert: true 
            }
        );
        res.status(200).json({
            status: true,
            message: updatedExpiredItem.wasNew ? 'Expired item created successfully' : 'Expired item updated successfully',
            data: updatedExpiredItem
        });
    } catch (error) {
        console.error({ error });
        res.status(400).json({ status: false, message: 'Server error, unable to add/update expired item', error: error.message });
    }
};

module.exports = addExpiredItem;