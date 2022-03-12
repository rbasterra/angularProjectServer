const express = require('express');

const testRouter = express.Router();

testRouter.get('/', (req, res, next) => console.log('it is authenticated'));

module.exports = testRouter;