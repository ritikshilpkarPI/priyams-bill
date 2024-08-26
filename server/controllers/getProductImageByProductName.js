const axios = require("axios")

const GOOGLE_API_KEY = 'AIzaSyAqNPHG7s_Mr6ewtFxtJ5oEf2ezuyKuCo0';
const CSE_ID = 'e551b4c3bff404a8c';

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