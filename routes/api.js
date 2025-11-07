'use strict';

const express = require('express');
const router = express.Router();
const handler = require('../controllers/convertHandler.js');

router.get('/convert', (req, res) => {
  const input = req.query.input;
  const numResult = handler.parseNumber(input);
  const unitResult = handler.parseUnit(input);

  if (numResult.error && unitResult.error) {
    return res.send('invalid number and unit');
  } else if (numResult.error) {
    return res.send('invalid number');
  } else if (unitResult.error) {
    return res.send('invalid unit');
  }

  const initNum = numResult.value;
  const initUnit = unitResult.value;
  const returnNum = handler.convert(initNum, initUnit);
  const returnUnit = handler.getReturnUnit(initUnit);
  const string = handler.getString(initNum, initUnit, returnNum, returnUnit);

  res.json({
    initNum,
    initUnit,
    returnNum,
    returnUnit,
    string
  });
});

module.exports = router;