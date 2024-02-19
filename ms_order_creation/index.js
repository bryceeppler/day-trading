'use strict';

const startApp = require('./app');
const express = require('express');
const { todayDateTime } = require('./lib/date');

const app = express();
app.use((req, res, next) => {
  console.log(`${todayDateTime} - ${req.method} ${req.url}`);
  next();
});
app.use(express.json());
app.use(express.urlencoded());

startApp(app);
