'use strict';

const express = require('express');
const app = express();
const apiRoutes = require('./routes/api.js');
require('dotenv').config();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api', apiRoutes);

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html');
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});