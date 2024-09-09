const axios = require("axios")

const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;
const CSE_ID = process.env.CSE_ID;

const getProductImageByProductName = async (req, res,next) => {
  try {
    
    const {query,count=10} = req.body;
    
    const response = await axios.get(
      `https://www.googleapis.com/customsearch/v1`,
      {
          params: {
              key: GOOGLE_API_KEY,
              cx: CSE_ID,
              q: query,
              searchType: 'image',
              num: count, 
          },
      }
  );

  res.json(response.data.items);
    
  } catch (error) {
    console.error({error});
    next(error)
  }
};

module.exports = getProductImageByProductName