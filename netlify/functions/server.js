const serverless = require("serverless-http");

const app = require("../../build/server/app.js").app;

module.exports.handler = serverless(app);
