const { Item } = require("../db-models/bill-model");

const getItemsFeed = async (req, res) => {
  try {
    const items = await Item.find();
    const itemCount = await Item.countDocuments();
    res.status(200).json({ message: { items, itemCount } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

const addItems = async (req, res) => {
  console.log({ req });
};
module.exports = {
  getItemsFeed,
  addItems,
};
