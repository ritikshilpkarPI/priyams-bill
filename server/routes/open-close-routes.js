const openCloseRoutes = require('express').Router();

const {
  addOpenCloseProcedure,
  editOpenCloseProcedure,
  getAllProcedure,
  getDayWiseProcedures,
} = require('../controllers/open-close-controller');

openCloseRoutes.get('/getAllProcedure', getAllProcedure);
openCloseRoutes.post('/newProcedure/open', addOpenCloseProcedure);
openCloseRoutes.post('/newProcedure/close', addOpenCloseProcedure);
openCloseRoutes.put('/editProcedure/open', editOpenCloseProcedure);
openCloseRoutes.put('/editProcedure/close', editOpenCloseProcedure);
openCloseRoutes.get('/getDayWiseProcedure', getDayWiseProcedures);

module.exports = openCloseRoutes;
