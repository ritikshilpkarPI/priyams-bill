const serverless = require("serverless-http");

const app = require("../../dist/server/app.js").app;

module.exports.handler = serverless(app,{
    framework: 'express'
});