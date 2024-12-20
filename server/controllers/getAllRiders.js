const { Rider } = require('../db-models/rider-model'); 

const getAllRiders = async (req, res, next) => {
  try {
    const { body = {} } = req; 
    const { filter = {}, page, limit, sortBy, sortOrder = 'asc' } = body;

    const projection = { password: 0 };
    const queryOptions = {}, meta = {};
    
    if (page && limit) {
        const skip = (page - 1) * limit;
        queryOptions.skip = skip;
        queryOptions.limit = limit;
        const total = await Rider.countDocuments(filter);
        meta.total = total;
        meta.page = page;
        meta.limit = limit;
        meta.totalPages = Math.ceil(total / limit);
    }
    
    if (sortBy) {
      const sortCriteria = { [sortBy]: sortOrder === 'asc' ? 1 : -1 };
      queryOptions.sort = sortCriteria;
    }

    const riders = await Rider.find(filter, projection, queryOptions);

    res.status(200).send({ meta, data: riders });
  } catch (error) {
    next(error);
  }
};

module.exports = getAllRiders;
