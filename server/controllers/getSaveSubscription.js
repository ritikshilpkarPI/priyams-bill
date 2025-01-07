 const Subscription = require("../db-models/subscription-model");

const getSaveSubscription = async (req, res) => {
  try {

    const { endpoint, keys } = req.body;

    if (!endpoint || !keys || !keys.p256dh || !keys.auth) {
      return res.status(400).json({ error: 'Invalid subscription object' });
    }

    const existingSubscription = await Subscription.findOne({ endpoint });

    if (existingSubscription) {
      return res.status(200).json({ message: 'Subscription already exists' });
    }

    const newSubscription = new Subscription({
      endpoint,
      keys,
    });

    await newSubscription.save();
    

    res.status(201).json({ message: 'Subscription saved successfully' });
  } catch (error) {
   next(error)
  }
};

module.exports = getSaveSubscription;
