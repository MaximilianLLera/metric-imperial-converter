'use strict';

const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const apiRoutes = require('./routes/api.js');

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// Rutas principales
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html');
});

// Rutas API
app.use('/api', apiRoutes);

// Escucha del servidor (Render necesita process.env.PORT)
const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port);
});
