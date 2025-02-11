const { Item } = require('../db-models/item-model');

const getItemsFeed = async (req, res,next) => {
    try {
      const { minStockOnly = false, isDeleted = false, skip , limit } = JSON.parse(
        req.query.filters
      );      
     // Build query conditions based on filters
     const query = {
      permanentlyOutOfStock: false, // Only fetch items that are not permanently out of stock
    };

    // Conditionally add filters based on the request parameters
    if (!isDeleted) {
      query.isDeleted = false; // Exclude deleted items if isDeleted is false
    }

    if (minStockOnly) {
      query.$expr = {
        $gte: ["$minimumStockQuantity", "$itemStockQuantity"] // Compare stock quantities within MongoDB
      };
    }

    const totalCount = await Item.countDocuments(query);
      
          // Query to get the paginated items (only apply skip and limit if they are defined)
    let itemsQuery = Item.find(query).sort({ itemName: 1 });

    // Conditionally apply pagination (skip and limit) if provided
    if (typeof skip !== 'undefined' && typeof limit !== 'undefined') {
      itemsQuery = itemsQuery.skip(Number(skip)).limit(Number(limit));
    }

    // Execute the query
    const items = await itemsQuery;

      // items = items.filter((item) => item.permanentlyOutOfStock === false);
      // if (isDeleted === false) {
      //   items = items.filter((item) => !item.isDeleted);
      // }
      // if (minStockOnly) {
      //   items = items.filter(
      //     (item) =>
      //       Number(item.minimumStockQuantity) >= Number(item.itemStockQuantity)
      //   );
      // }
      // const itemCount = items.length;
      res.status(200).json({ message: { items, itemCount:totalCount } });
    } catch (error) {
      next(error)
    }
  };

  module.exports = getItemsFeed;