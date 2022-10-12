const reportRoutes = require("express").Router();

const { getDateRangeReport } = require("../controllers/report-controller");

reportRoutes.post("/getDateRangeReport/:filterName", getDateRangeReport);

module.exports = reportRoutes;
